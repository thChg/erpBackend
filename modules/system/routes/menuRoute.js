const express = require("express");
const router = express.Router();

const { addToMenu } = require("../controllers/menuController");

router.post("/create-page", addToMenu);

module.exports = router;
