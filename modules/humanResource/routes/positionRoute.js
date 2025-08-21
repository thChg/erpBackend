const express = require("express");

const {
  handleGetPositionList,
  handleGetPositionById,
  handleCreatePosition,
  handleUpdatePositionById,
  handleGetSwagger,
} = require("../controllers/positionController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetPositionList);
router.get("/:id", handleGetPositionById);

router.post("/", handleCreatePosition);
router.put("/:id", handleUpdatePositionById);

module.exports = router;
