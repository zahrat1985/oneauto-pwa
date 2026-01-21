import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { searchProductsFromSheet } from "./googleSheets.js";

dotenv.config();

// ================================
// APP INIT
// ================================
const app = express();
app.use(cors());
app.use(express.json());

// ================================
// OPENAI
// ================================
console.log("✅ ENV LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("✅ OpenAI client initialized");

// ================================
// ROOT
// ================================
app.get("/", (req, res) => {
  res.send("OneAuto Backend is running 🚀");
});

// ================================
// HEALTH
// ================================
app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

// ================================
// AI + GOOGLE SHEETS (AUTO SELL – NO QUESTIONS)
// ================================
app.post("/api/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1️⃣ Extract keyword
    const intentResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract the main product keyword from the user message. Reply with only one or two words.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const keyword =
      intentResponse.choices[0].message.content.trim();

    // 2️⃣ Search product in Google Sheets
    const products = await searchProductsFromSheet(keyword);

    // 3️⃣ ALWAYS SELL FIRST PRODUCT IF EXISTS
    if (products.length > 0) {
      const product = products[0];

      return res.json({
        success: true,
        type: "product",
        product,
        answer: `🛒 ${product.name}

💰 Price: ${product.price} ${product.currency}
🏬 Store: ${product.store}

👉 Buy here:
${product.link}`,
      });
    }

    // 4️⃣ Fallback (NO QUESTIONS)
    return res.json({
      success: true,
      type: "no-product",
      answer:
        "Sorry, I couldn’t find a matching product right now. Please try another product name.",
    });
  } catch (error) {
    console.error("AUTO SELL ERROR:", error);
    res.status(500).json({
      error: "Auto-sell failed",
      details: error.message,
    });
  }
});

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

});
