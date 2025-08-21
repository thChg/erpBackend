const express = require("express");

const {
handleGetEmployeeList
} = require("../controllers/employeeController");
const parseExcel = require("../../../masterPage/middlewares/parseExcel");

const router = express.Router();

router.get("/", handleGetEmployeeList)

module.exports = router;
