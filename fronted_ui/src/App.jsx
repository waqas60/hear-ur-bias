import { useState, useRef } from "react";

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

    // Create a new recognition instance
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

      // Only restart if the instance is stopped
      if (event.error === "no-speech") {
        recognition.stop(); // stop current instance first
        setTimeout(() => startListening(), 500); // restart after short delay
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
    <div style={{ padding: "40px" }}>
      <h1>Hear Your Voice</h1>

      <button onClick={startListening} disabled={listening}>
        {listening ? "🎙 Listening..." : "🎤 Start Listening"}
      </button>
      <button onClick={stopListening} disabled={!listening} style={{ marginLeft: "10px" }}>
        ⏹ Stop Listening
      </button>

      <p>
        <b>Transcript:</b> {text}
      </p>
    </div>
  );
}

export default App;
