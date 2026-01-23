import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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
      const res = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setReply(data.reply);
    } catch {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f7fb",
      fontFamily: "system-ui"
    }}>
      <div style={{
        width: 420,
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
      }}>
        <h2>oneauto</h2>
        <p>Your AI shopping assistant</p>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to buy?"
          style={{ width: "100%", padding: 12, marginTop: 12 }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 12,
            background: "#5b5bf7",
            color: "#fff",
            border: "none",
            borderRadius: 8
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {reply && (
          <pre style={{
            whiteSpace: "pre-wrap",
            marginTop: 16,
            background: "#f1f5ff",
            padding: 12,
            borderRadius: 8
          }}>
            {reply}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;

