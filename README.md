# Hear Ur Bias

**Hear Ur Bias** is a web app that helps you spot bias and unprofessional language in your own words. Speak or type text, then get instant feedback on toxicity, sentiment, emotion, and a professionalism score—plus optional AI-powered rephrasing to sound clearer and more professional.

![Alt text](<img width="1319" height="845" alt="app" src="https://github.com/user-attachments/assets/a182e174-e815-4e19-8304-1f48f7b646fc" />)

## How to run

### 1. Python API (analysis models)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn transformers torch pydantic
uvicorn main:app --reload --port 8000
```

The analysis API will be at `http://localhost:8000`.

### 2. Node 

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd fronted_ui
npm install
# Optional: .env with VITE_* Firebase and API URL if needed
npm run dev
```

## Tech stack

- **Backend:** FastAPI, Hugging Face `transformers` (e.g. `unitary/unbiased-toxic-roberta`, emotion and sentiment models), Express, OpenAI SDK (OpenRouter).
- **Frontend:** React 19, Vite, React Router, Firebase Auth.

