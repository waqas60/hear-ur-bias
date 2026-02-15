import { useState, useEffect } from "react";

export default function AIRephraseDirect({ text, trigger }) {
  const [rephrased, setRephrased] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trigger) return;

    const rephraseText = async () => {
      if (!text || text.trim().length < 5) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:5000/rephrase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await response.json();
        setRephrased(data.rephrased);
      } catch {
        setError("Failed to rephrase text.");
      } finally {
        setLoading(false);
      }
    };

    rephraseText();
  }, [trigger]);

  return (
    <div className="ai-rephrase">
      {loading && <p className="loading">Rephrasing...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && rephrased && (
        <>
          <strong>Rephrased:</strong>
          <p>{rephrased}</p>
        </>
      )}
    </div>
  );
}
