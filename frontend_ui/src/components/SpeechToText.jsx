import { useState, useRef } from "react";
import AIRephraseDirect from "./AIRephraseDirect";
import DOMPurify from 'dompurify';
import "../styles/speechtotext.css";

const SpeechToText = () => {
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const [rephraseTrigger, setRephraseTrigger] = useState(0);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setText((prev) => prev + finalTranscript);
      }

      setInterimText(interimTranscript);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setError("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
  };

  const clearText = () => {
    setText("");
    setInterimText("");
    setAnalysisResult(null);
    setError("");
  };

  const analyzeText = async () => {
    if (!text) return;

    // Sanitize input before sending
    const cleanText = DOMPurify.sanitize(text);

    setIsChecking(true);
    setAnalysisResult(null);
    setError("");

    try {
      // Use environment variable for API URL in production
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setRephraseTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze text.");
    } finally {
      setIsChecking(false);
    }
  };

  const getBadgeClass = (label) => {
    switch (label.toLowerCase()) {
      case "toxicity":
      case "insult":
        return "badge-bad";
      case "gender":
      case "identity":
      case "sexual content":
        return "badge-warning";
      default:
        return "badge-good";
    }
  };

  return (
    <div className="container">
      <div className="controls">
        <button
          className="primary-btn"
          onClick={startListening}
          disabled={isListening}
        >
          {isListening ? "Recording..." : "Start Recording"}
        </button>

        <button
          className="secondary-btn"
          onClick={stopListening}
          disabled={!isListening}
        >
          Stop
        </button>

        <button
          className="btn-primary"
          onClick={clearText}
          disabled={!text && !analysisResult}
        >
          Clear
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="transcript">
        <textarea
          value={text + interimText}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here or use voice input..."
        />
      </div>

      <button
        className="btn-primary"
        onClick={analyzeText}
        disabled={!text || isChecking}
      >
        {isChecking ? "Analyzing..." : "Analyze Text"}
      </button>

      {analysisResult && (
        <div className="analysis-result">
          <div className="score-item">
            <span>Professionalism Score:</span>
            <span className="score-number">
              {analysisResult.professionalism_score}%
            </span>
            <span className="score-helper">
              {analysisResult.professionalism_score >= 80
                ? "Professional"
                : analysisResult.professionalism_score >= 50
                ? "Needs improvement"
                : "Unprofessional"}
            </span>
          </div>

          <div className="score-item">
            <span>Toxicity Score:</span>
            <span className="score-number">
              {analysisResult.toxicity_score}%
            </span>
            <span className="score-helper">
              {analysisResult.toxicity_score <= 10
                ? "Safe"
                : analysisResult.toxicity_score <= 40
                ? "Caution"
                : "Highly toxic"}
            </span>
          </div>

          <div className="score-item">
            <span>Toxicity Tags:</span>
            <div className="toxicity-tags">
              {analysisResult.toxicity_tags.map((tag, idx) => (
                <span key={idx} className={`badge ${getBadgeClass(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="score-item">
            <span>Emotion:</span>
            <span>
              {analysisResult.emotion_raw[0].label} (
              {(analysisResult.emotion_raw[0].score * 100).toFixed(1)}%)
            </span>
          </div>

          <div className="score-item">
            <span>Sentiment:</span>
            <span>
              {analysisResult.sentiment_raw[0].label} (
              {(analysisResult.sentiment_raw[0].score * 100).toFixed(1)}%)
            </span>
          </div>

          <div className="score-item">
            <span>Issues:</span>
            {analysisResult.issues.length > 0 ? (
              <ul>
                {analysisResult.issues.map((issue, idx) => (
                  <li key={idx} className="badge badge-bad">
                    {issue.replace(/([A-Z])/g, " $1").trim()}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="badge badge-good">
                No significant issues detected!
              </span>
            )}
          </div>

          <div className="rephrase">
            <AIRephraseDirect text={text} trigger={rephraseTrigger} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;