const express = require("express");
const { checkBiasController } = require("../controllers/biasController");

const router = express.Router();

router.post("/check-bias", checkBiasController);

module.exports = router;
