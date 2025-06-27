const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
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

router.get("/vendor-list", AuthValidate, getVendorList);
router.post("/create-vendor", AuthValidate, createVendor);
router.post("/delete-many", AuthValidate, deleteManyVendor);
router.post("/create-many", AuthValidate, parseExcel, createManyVendor);
router.post("/print", AuthValidate, printVendorList);
router.post("/vendor-data", AuthValidate, getVendorData);

module.exports = router;
