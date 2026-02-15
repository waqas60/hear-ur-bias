import express from "express";
import cors from "cors";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/analyze", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/analyze",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Service unavailable" });
  }
});

app.post("/rephrase", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content:"Rewrite the following text in a clear, professional tone. Keep the sentence roughly the same length as the original. It should be positive sentence. No negativity. Return ONLY the rewritten text, with no quotes or explanations:\n\n" +
            text,
        },
      ],
      temperature: 0.5,
    });

    let rephrased = response.choices[0].message.content.trim();

    rephrased = rephrased.replace(/^["']|["']$/g, "");

    res.json({ rephrased });
  } catch (error) {
    console.error("DeepSeek error:", error);
    res.status(500).json({ error: "Rephrase failed" });
  }
});


app.listen(5000, () =>
  console.log("Server running at http://localhost:5000")
);
