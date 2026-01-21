import { useState } from "react";

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
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      // 👇 اصلاح اصلی اینجاست
      setReply(data.answer || "No response from AI");
    } catch (err) {
      setError("Cannot connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f7fb",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 4 }}>oneauto</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Your AI shopping assistant
        </p>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you planning to buy?"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#5b5bf7",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 12 }}>{error}</p>
        )}

        {reply && (
          <div
            style={{
              marginTop: 16,
              background: "#f1f5ff",
              padding: 12,
              borderRadius: 10,
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {/* لینک‌ها را قابل کلیک می‌کنیم */}
            {reply.split("\n").map((line, i) => {
              if (line.startsWith("http")) {
                return (
                  <a
                    key={i}
                    href={line}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#5b5bf7", fontWeight: 600 }}
                  >
                    {line}
                  </a>
                );
              }
              return <div key={i}>{line}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
