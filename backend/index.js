const express = require("express");
const cors = require("cors");
const { checkBias } = require("./biasChecker");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/check-bias", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const matches = checkBias(text);

  res.json({
    bias_found: matches.length > 0,
    matches: matches,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
