const express = require("express");

const { getStockJournal } = require("../controllers/stockJournalController");

const router = express.Router();

router.get("/stock", getStockJournal);

module.exports = router;
