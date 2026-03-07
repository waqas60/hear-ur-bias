import express from "express";
import cors from "cors";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import sanitizeHtml from 'sanitize-html';
import hpp from 'hpp';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(express.json({ limit: '10kb' })); // Body limit to prevent DoS

// CORS Configuration - Update with your frontend URL
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  // Add production URL here
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Input Validation and Sanitization Middleware
const validateAnalyze = [
  body('text').trim().notEmpty().withMessage('Text is required')
    .isLength({ max: 5000 }).withMessage('Text must be under 5000 characters')
    .escape(), // Basic escaping
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateRephrase = [
  body('text').trim().notEmpty().withMessage('Text is required')
    .isLength({ max: 2000 }).withMessage('Text must be under 2000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))

      return res.status(422).json({
        errors: extractedErrors,
      })
    }
    // Sanitize input
    if (req.body.text) {
        req.body.text = sanitizeHtml(req.body.text, {
            allowedTags: [],
            allowedAttributes: {}
        });
    }
    next();
  }
];

app.post("/analyze", validateAnalyze, async (req, res) => {
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

app.post("/rephrase", validateRephrase, async (req, res) => {
  try {
    const { text } = req.body;
    // validation handled by middleware

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
