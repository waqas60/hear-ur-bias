const { checkBias } = require("../services/biasChecker");

const checkBiasController = (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const matches = checkBias(text);

  res.json({
    bias_found: matches.length > 0,
    matches: matches,
  });
};

module.exports = { checkBiasController };
