const express = require("express");
const { getEmployeeList } = require("../controllers/getEmployeeList");
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { getPermissions } = require("../controllers/getPermissions");

const router = express.Router();

router.get("/get", AuthValidate, getEmployeeList);
router.get("/permissions", AuthValidate, getPermissions);

module.exports = router;
