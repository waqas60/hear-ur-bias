import { useState, useRef } from "react";
import "./index.css";

function App() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setText(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        recognition.stop();
        setTimeout(() => startListening(), 500);
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div className="container">
      <h1> Hear Your Voice</h1>

      <div className="buttons">
        <button
          onClick={startListening}
          disabled={listening}
          className={`btn ${listening ? "btn-listening" : "btn-start"}`}
        >
          {listening ? "🎙 Listening..." : "Start Listening"}
        </button>
        <button
          onClick={stopListening}
          disabled={!listening}
          className="btn btn-stop"
        >
          Stop Listening
        </button>
      </div>

      <div className="transcript">
        {text || <span className="placeholder">Your speech will appear here...</span>}

        hi there
      </div>
    </div>
  );
}

export default App;
