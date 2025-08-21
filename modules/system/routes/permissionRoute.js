const express = require("express");
const router = express.Router();

const {
  createRole,
  getRoleList,
  getAccessList,
  updateRole,
  deleteRole,
  deleteManyRole,
} = require("../controllers/permissionController");

router.get("/role-list", getRoleList);
router.post("/create-role", createRole);
router.put("/update-role/:id", updateRole);
router.delete("/delete-role/:id", deleteRole);
router.post("/delete-many-role", deleteManyRole);

router.get("/access-list", getAccessList);

module.exports = router;
