const express = require("express");
const router = express.Router();

const { handleGetAccessList, handleGetSwagger } = require("../controllers/accessController");

router.get("/swagger", handleGetSwagger)
router.get("/", handleGetAccessList);

module.exports = router;
