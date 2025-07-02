const express = require("express");
const { getBillOfLadingList, createBillOfLading } = require("../controllers/billOfLadingController");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");

const router = express.Router();

router.get("/bill-of-lading-list", AuthValidate, getBillOfLadingList)
router.post("/create-bill-of-lading", AuthValidate, createBillOfLading);

module.exports = router;