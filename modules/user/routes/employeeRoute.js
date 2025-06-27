const express = require("express");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  getEmployeeList,
  createEmployee,
  deleteManyEmployee,
  createManyEmployee,
  printEmployeeList,
  getEmployeeData,
} = require("../controllers/employeeController");
const parseExcel = require("../../../masterPage/middlewares/parseExcel");

const router = express.Router();

router.get("/employee-list", AuthValidate, getEmployeeList);
router.post("/create-employee", AuthValidate, createEmployee);
router.post("/delete-many", AuthValidate, deleteManyEmployee);
router.post("/create-many", AuthValidate, parseExcel, createManyEmployee);
router.post("/print", AuthValidate, printEmployeeList);
router.post("/employee-data", AuthValidate, getEmployeeData);

module.exports = router;
