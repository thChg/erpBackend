const express = require("express");
const router = express.Router();
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createRole,
  createPermission,
  getRoleList,
  getAccessList,
  updateRole,
  deleteRole,
  deleteManyRole
} = require("../controllers/permissionController");

router.get("/role-list", AuthValidate, getRoleList);
router.post("/create-role", AuthValidate, createRole);
router.put("/update-role/:id", AuthValidate, updateRole);
router.delete("/delete-role/:id", AuthValidate, deleteRole);
router.post("/delete-many-role", AuthValidate, deleteManyRole)

router.get("/access-list", AuthValidate, getAccessList);

router.post("/create-permission", AuthValidate, createPermission);

module.exports = router;
