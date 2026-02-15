from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import pipeline
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
app = FastAPI(title="Professional AI Analyzer", version="16.7")

models = {}

@app.on_event("startup")
async def load_models():
    logging.info("Loading models...")

    # Multi-label toxicity detection 
    models["toxicity"] = pipeline(
        "text-classification",
        model="unitary/unbiased-toxic-roberta",
        truncation=True,
        return_all_scores=True
    )

    # Emotion detection
    models["emotion"] = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        truncation=True
    )

    # Sentiment detection
    models["sentiment"] = pipeline(
        "text-classification",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )

    logging.info("All models loaded successfully")

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)

class FullAnalysisResponse(BaseModel):
    professionalism_score: int
    toxicity_score: float  # %
    toxicity_tags: List[str]
    emotion_raw: List[Dict[str, Any]]
    sentiment_raw: List[Dict[str, Any]]
    issues: List[str]
    advice: str

def analyze_toxicity(text: str) -> (float, List[str], List[Dict[str, Any]]):
    """
    Returns toxicity score (max), detected tags, full raw output
    """
    raw_results = models["toxicity"](text)
    # keep only significant labels
    tags = [r["label"] for r in raw_results if r["score"] > 0.05]
    score = max(r["score"] for r in raw_results)
    return score, tags, raw_results

def map_toxic_tags(tags: List[str]) -> List[str]:
    """
    Map model labels to human-readable categories
    """
    mapped = []
    for tag in tags:
        tag_lower = tag.lower()
        if tag_lower in ["female", "woman", "men", "male"]:
            mapped.append("gender")
        elif tag_lower in ["identity_attack"]:
            mapped.append("identity")
        elif tag_lower in ["insult"]:
            mapped.append("insult")
        elif tag_lower in ["sexual_explicit"]:
            mapped.append("sexual content")
        elif tag_lower in ["toxicity", "obscene"]:
            mapped.append("toxicity")
        else:
            mapped.append(tag_lower)
    return list(set(mapped))

def calculate_professionalism(toxicity_score: float, sentiment_label: str, tags: List[str]) -> int:
    """
    0-100 professionalism score based on toxicity, sentiment, and labels
    """
    score = 100
    score -= int(toxicity_score * 60)
    if sentiment_label.lower() == "negative":
        score -= 20
    if any(tag in ["identity", "insult", "gender"] for tag in tags):
        score -= 25
    return max(0, score)

def generate_issues(tags: List[str], sentiment_label: str) -> List[str]:
    issues = []
    for tag in tags:
        issues.append(f"Toxicity detected: {tag}")
    if sentiment_label.lower() == "negative":
        issues.append("Negative tone detected")
    return issues

def generate_advice(pro_score: int, issues: List[str]) -> str:
    if pro_score >= 80:
        return "Text is professional and safe to share."
    elif pro_score >= 50:
        return "Text is somewhat professional, consider revising."
    else:
        return f"Text is highly unprofessional or offensive. Detected issues: {', '.join(issues)}. Please revise before sharing."

@app.post("/analyze_full", response_model=FullAnalysisResponse)
async def analyze_text_full(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        # Toxicity
        tox_score, tox_tags, tox_raw = analyze_toxicity(text)
        tox_tags_mapped = map_toxic_tags(tox_tags)
        tox_score_percent = round(tox_score * 100, 1)

        # Emotion
        emo_raw = models["emotion"](text, return_all_scores=True)

        # Sentiment
        sent_raw = models["sentiment"](text, return_all_scores=True)
        sentiment_label = max(sent_raw, key=lambda x: x["score"])["label"]

        # Professionalism
        professionalism_score = calculate_professionalism(tox_score, sentiment_label, tox_tags_mapped)

        # Issues
        issues = generate_issues(tox_tags_mapped, sentiment_label)

        # Advice
        advice = generate_advice(professionalism_score, issues)

        return FullAnalysisResponse(
            professionalism_score=professionalism_score,
            toxicity_score=tox_score_percent,
            toxicity_tags=tox_tags_mapped,
            emotion_raw=emo_raw,
            sentiment_raw=sent_raw,
            issues=issues,
            advice=advice
        )

    except Exception as e:
        logging.error(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze", response_model=FullAnalysisResponse)
async def analyze_text_alias(request: TextRequest):
    return await analyze_text_full(request)

@app.get("/")
async def root():
    return {"service": "Professional AI Analyzer", "version": "16.7", "status": "running"}
