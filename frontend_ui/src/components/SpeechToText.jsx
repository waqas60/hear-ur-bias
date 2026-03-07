import { useState, useRef, useEffect } from "react";
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
  const [rephraseTrigger, setRephraseTrigger] = useState(0);

  const recognitionRef = useRef(null);
  const listeningRef = useRef(false); // prevents stale state bug

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported. Use Chrome.");
      return;
    }

    // Prevent multiple instances
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
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
      // Ignore silence errors
      if (event.error === "no-speech") return;
      if (event.error === "aborted") return;

      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
      listeningRef.current = false;
    };

    recognition.onend = () => {
      // Auto restart only if still listening
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          // prevent crash if already started
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      listeningRef.current = true;
      setIsListening(true);
      setError("");
    } catch (err) {
      setError("Microphone start failed.");
    }
  };

  const stopListening = () => {
    listeningRef.current = false;

    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // prevent restart
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

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

    setIsChecking(true);
    setAnalysisResult(null);
    setError("");

    try {
      // Use environment variable for API URL in production
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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

      <button className="btn-primary" onClick={analyzeText} disabled={!text || isChecking}>
        {isChecking ? "Analyzing..." : "Analyze Text"}
      </button>

      {analysisResult && (
        <div className="analysis-result">
          <div className="score-item">
            <span>Professionalism Score:</span>
            <span className="score-number">
              {analysisResult.professionalism_score}%
            </span>
          </div>

          <div className="score-item">
            <span>Toxicity Score:</span>
            <span className="score-number">
              {analysisResult.toxicity_score}%
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
              <span className="badge badge-good">No significant issues detected!</span>
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