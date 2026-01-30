import { useState, useRef } from "react";

const SpeechToText = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [biasResult, setBiasResult] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const recognitionRef = useRef(null);

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
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const checkBias = async () => {
    if (!text) return;
    setIsChecking(true);
    setBiasResult("");

    try {
      const response = await fetch("http://localhost:5000/check-bias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to check bias");
      }
      const data = await response.json();
      if (data.bias_found && data.matches.length > 0) {
        setBiasResult(data.matches);
      } else {
        setBiasResult([{ sentence: "No bias detected", label: "none" }]);
      }
    } catch (err) {
      console.error(err);
      setBiasResult("Error checking bias. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };
  const clearText = () => {
    setText("");
    setBiasResult("");
  };

  return (
    <div className="container">
      <h1>Record your voice</h1>

      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={startListening}
          disabled={isListening}
        >
          Start recording
        </button>

        <button
          className="btn btn-secondary"
          onClick={stopListening}
          disabled={!isListening}
        >
          Stop
        </button>
      </div>

      <div className="transcript">
        {text ? (
          text
        ) : (
          <span className="placeholder">
            Your spoken words will appear here…
          </span>
        )}
        <button
          className="btn btn-secondary btn-clear"
          onClick={clearText}
          disabled={!text && !biasResult}
        >
          Clear
        </button>
      </div>

      <button
        className="btn btn-primary check-bias"
        onClick={checkBias}
        disabled={!text || isChecking}
      >
        {isChecking ? "Checking..." : "Check Bias"}
      </button>

      <div className="bias-result">
        <h3>Bias Analysis</h3>
        {biasResult && biasResult.length > 0 && (
          <ul className="bias-list">
            {biasResult.map((item, index) => (
              <li key={index} className="bias-card">
                <p className="bias-sentence">{item.sentence}</p>
                <span className="bias-badge">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SpeechToText;
