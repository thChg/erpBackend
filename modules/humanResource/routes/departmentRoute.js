const express = require("express");

const {
  handleGetDepartmentList,
  handleGetDepartmentById,
  handleCreateDepartment,
  handleGetSwagger,
} = require("../controllers/departmentController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetDepartmentList);
router.get("/:id", handleGetDepartmentById);

router.post("/", handleCreateDepartment);

module.exports = router;
