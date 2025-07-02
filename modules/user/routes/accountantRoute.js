const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  getAccountantList,
  createAccountant,
} = require("../controllers/accountantController");

const router = express.Router();

router.get("/accountant-list", AuthValidate, getAccountantList);
router.post("/create-accountant", AuthValidate, createAccountant);

module.exports = router;
