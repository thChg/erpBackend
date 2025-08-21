const express = require("express");

const {
  handleGetCompanyList,
  handleCreateCompany,
  handleGetCompanyById,
  handleGetSwagger,
} = require("../controllers/companyController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetCompanyList);
router.get("/:id", handleGetCompanyById);

router.post("/", handleCreateCompany);

module.exports = router;
