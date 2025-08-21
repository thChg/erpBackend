const express = require("express");
const router = express.Router();

const {
  handleGetPolicyList,
  handleCreatePolicy,
  handleGetPolicyById,
  handleGetSwagger,
} = require("../controllers/PolicyController");

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetPolicyList);
router.get("/:id", handleGetPolicyById);
router.post("/", handleCreatePolicy);

module.exports = router;
