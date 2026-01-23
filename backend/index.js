import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// ======================
// APP INIT
// ======================
const app = express();
app.use(cors());
app.use(express.json());

// ======================
// ENV CHECK
// ======================
console.log("✅ ENV LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

// ======================
// OPENAI CLIENT
// ======================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ======================
// ROOT (Railway needs this)
// ======================
app.get("/", (req, res) => {
  res.status(200).send("OneAuto Backend is running 🚀");
});

// ======================
// HEALTH CHECK (CRITICAL)
// ======================
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// ======================
// ASK ENDPOINT
// ======================
app.post("/api/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    return res.json({
      success: true,
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ API ERROR:", err);
    return res.status(500).json({ error: "server error" });
  }
});

// ======================
// START SERVER (FIXED)
// ======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
