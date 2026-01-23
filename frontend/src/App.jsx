import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setReply("");

    try {
      const res = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      // 👈 بک‌اند answer برمی‌گرداند
      setReply(data.answer || "No response received.");
    } catch (err) {
      setError("❌ Cannot connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-card">
        <h1 className="app-title">oneauto</h1>
        <p className="app-subtitle">
          Your AI shopping assistant
        </p>

        <input
          className="app-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you planning to buy?"
          onKeyDown={(e) => {
            if (e.key === "Enter") askAI();
          }}
        />

        <button
          className="app-button"
          onClick={askAI}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {error && (
          <p className="app-error">{error}</p>
        )}

        {reply && (
          <div className="app-reply">
            {reply}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
