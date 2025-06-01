const express = require ("express");
const router = express.Router();
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { getUserInfo, getUserList, updateUser, deleteUser } = require("../controllers/userController");

router.get("/me", AuthValidate, getUserInfo);
router.get("/list" , AuthValidate, getUserList);
router.put("/update/:id", AuthValidate, updateUser);
router.delete("/delete/:id", AuthValidate, deleteUser);

module.exports = router;