const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
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

router.get("/customer-list", AuthValidate, getCustomerList);
router.post("/create-customer", AuthValidate, createCustomer);
router.post("/delete-many", AuthValidate, deleteManyCustomer);
router.post("/create-many", AuthValidate, parseExcel, createManyCustomer);
router.post("/print", AuthValidate, printCustomerList);
router.post("/customer-data", AuthValidate, getCustomerData);
module.exports = router;
