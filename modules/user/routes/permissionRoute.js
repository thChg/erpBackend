const express = require("express");
const router = express.Router();
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const {
  createRole,
  createPermission,
  getRoleList,
  getPermissionList,
  getAccessList,
  updateRole,
  deleteRole,
} = require("../controllers/permissionController");

router.get("/role-list", AuthValidate, getRoleList);
router.post("/create-role", AuthValidate, createRole);
router.put("/update-role/:id", AuthValidate, updateRole);
router.delete("/delete-role/:id", AuthValidate, deleteRole);

router.get("/access-list", AuthValidate, getAccessList);

router.post("/create-permission", AuthValidate, createPermission);

module.exports = router;
