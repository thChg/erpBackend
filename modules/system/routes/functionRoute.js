const express = require("express");

const {
  handleCreateFunction,
  handleGetFunctionList,
  handleGetFunctionById,
  handleUpdateFunctionById,
  handleGetSwagger,
} = require("../controllers/functionController");

const router = express.Router();

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetFunctionList);
router.get("/:id", handleGetFunctionById);

router.post("/", handleCreateFunction);
router.put("/:id", handleUpdateFunctionById);

module.exports = router;
