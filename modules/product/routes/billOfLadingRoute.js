const express = require("express");
const {
  getBillOfLadingList,
  createBillOfLading,
} = require("../controllers/billOfLadingController");

const router = express.Router();

router.get("/bill-of-lading-list", getBillOfLadingList);
router.post("/create-bill-of-lading", createBillOfLading);

module.exports = router;
