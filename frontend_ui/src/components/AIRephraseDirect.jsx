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
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/rephrase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRephrased(data.rephrased);
      } catch (err) {
        console.error(err);
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
