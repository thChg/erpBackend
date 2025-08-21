const express = require("express");

const {
  handleGetEmployeeList,
  handleCreateEmployee,
  handleGetEmployeeById,
  handleUpdateEmployee,
  handleGetSwagger,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetEmployeeList);
router.get("/:id", handleGetEmployeeById);

router.post("/", handleCreateEmployee);
router.put("/:id", handleUpdateEmployee);

module.exports = router;
