const express = require("express");
const router = express.Router();

const {
  getUserInfo,
  handleGetUserList,
  updateUser,
  deleteUser,
  deleteManyUsers,
  printUserList,
  handleGetUserById,
  handleCreateUser,
  handleGetSwagger,
} = require("../controllers/userController");

router.get("/swagger", handleGetSwagger);

router.get("/me", getUserInfo);
router.get("/", handleGetUserList);
router.get("/:id", handleGetUserById);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

router.post("/delete-many", deleteManyUsers);
router.post("/print", printUserList);
router.post("/", handleCreateUser);

module.exports = router;
