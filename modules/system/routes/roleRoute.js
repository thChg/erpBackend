const express = require("express");
const router = express.Router();

const {
  handleCreateRole,
  handleGetRoleList,
  handleGetRoleById,
  handleUpdateRoleById,
  handleGetSwagger,
} = require("../controllers/roleController");

router.get("/swagger", handleGetSwagger);

router.get("/", handleGetRoleList);
router.get("/:id", handleGetRoleById);

router.put("/:id", handleUpdateRoleById);
router.post("/", /*Authenticate,*/ handleCreateRole);

module.exports = router;
