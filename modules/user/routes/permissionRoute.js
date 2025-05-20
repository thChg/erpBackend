const express = require ("express");
const router = express.Router();
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { createRole, createPermission, getRoleList } = require("../controllers/permissionController");

router.get("/role-list", AuthValidate, getRoleList)
router.post("/create-role", AuthValidate, createRole);
router.put("/update-role/:id", AuthValidate, createRole);

router.post("/create-permission", AuthValidate, createPermission);

module.exports = router;