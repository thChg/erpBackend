const express = require("express");
const router = express.Router();

const {
  handleGetResourceList,
  handleGetSwagger,
  handleCreateResource,
  handleGetResourceById,
} = require("../controllers/resourceController");

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetResourceList);
router.get("/:id", handleGetResourceById);

router.post("/", handleCreateResource);

module.exports = router;
