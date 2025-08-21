const express = require("express");

const {
  handleGetTitleList,
  handleCreateTitle,
  handleGetTitleById,
  handleGetSwagger,
} = require("../controllers/titleController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetTitleList);
router.get("/:id", handleGetTitleById);

router.post("/", handleCreateTitle);

module.exports = router;
