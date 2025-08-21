const express = require("express");

const {
  handleCreateModule,
  handleGetModuleList,
  handleGetSwagger,
  handleGetModuleById,
  handleUpdateModuleById,
} = require("../controllers/moduleController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetModuleList);
router.get("/:id", handleGetModuleById);

router.post("/", handleCreateModule);
router.put("/:id", handleUpdateModuleById);

module.exports = router;
