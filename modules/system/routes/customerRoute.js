const express = require("express");

const {
  getCustomerList,
  createCustomer,
  deleteManyCustomer,
  createManyCustomer,
  printCustomerList,
  getCustomerData,
} = require("../controllers/customerController");
const parseExcel = require("../../../masterPage/middlewares/parseExcel");
const router = express.Router();

router.get("/customer-list", getCustomerList);
router.post("/create-customer", createCustomer);
router.post("/delete-many", deleteManyCustomer);
router.post("/create-many", parseExcel, createManyCustomer);
router.post("/print", printCustomerList);
router.post("/customer-data", getCustomerData);
module.exports = router;
