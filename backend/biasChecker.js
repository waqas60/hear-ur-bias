const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let biasedData = [];

const csvPath = path.join(__dirname, "data", "dataset.csv");

fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    if (row.sentence && row.label) {
      biasedData.push({
        sentence: row.sentence.toLowerCase(),
        label: row.label,
      });
    }
  })
  .on("end", () => {
    console.log("✅ Loaded biased data:", biasedData.length);
  })
  .on("error", (err) => {
    console.error("❌ CSV Error:", err.message);
  });

function checkBias(text) {
  text = text.toLowerCase();
  let found = [];

  biasedData.forEach((item) => {
    if (text.includes(item.sentence)) {
      found.push(item);
    }
  });

  return found;
}

module.exports = { checkBias };
