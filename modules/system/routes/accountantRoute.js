const express = require("express");

const {
  getAccountantList,
  createAccountant,
} = require("../controllers/accountantController");

const router = express.Router();

router.get("/accountant-list", getAccountantList);
router.post("/create-accountant", createAccountant);

module.exports = router;
