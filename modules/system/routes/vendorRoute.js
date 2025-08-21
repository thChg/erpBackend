const express = require("express");

const {
  getVendorList,
  createVendor,
  deleteManyVendor,
  createManyVendor,
  printVendorList,
  getVendorData,
} = require("../controllers/vendorController");
const parseExcel = require("../../../masterPage/middlewares/parseExcel");

const router = express.Router();

router.get("/vendor-list", getVendorList);
router.post("/create-vendor", createVendor);
router.post("/delete-many", deleteManyVendor);
router.post("/create-many", parseExcel, createManyVendor);
router.post("/print", printVendorList);
router.post("/vendor-data", getVendorData);

module.exports = router;
