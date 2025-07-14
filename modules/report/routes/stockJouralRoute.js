const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { getStockJournal } = require("../controllers/stockJournalController");

const router = express.Router();

router.get("/stock", AuthValidate, getStockJournal);

module.exports = router;
