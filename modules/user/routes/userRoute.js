const express = require ("express");
const router = express.Router();
const AuthValidate = require("../../../masterPage/middlewares/authValidate");
const { getUserInfo, getUserList, updateUser, deleteUser, deleteManyUsers, printUserList, getSelectedUSerInfo } = require("../controllers/userController");

router.get("/me", AuthValidate, getUserInfo);
router.get("/list" , AuthValidate, getUserList);
router.put("/update/:id", AuthValidate, updateUser);
router.delete("/delete/:id", AuthValidate, deleteUser);

router.post("/delete-many", AuthValidate, deleteManyUsers);
router.post("/print", AuthValidate, printUserList);

router.post("/selected-list", getSelectedUSerInfo)
module.exports = router;