const AsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/Role");
const getUserRole = require("../utils/getUserRole");
const { assertToQueue } = require("../../../masterPage/rabbitmq/producer");

const getUserInfo = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await User.findOne({ username: user.username }).populate({
    path: "role",
    populate: {
      path: "access",
      model: "Menu",
      options: { sort: { menu: 1 } },
    },
  });

  const result = {
    username: userData.username,
    role: userData.role.role,
    apartment: userData.apartment,
    access: userData.role.access,
    permissions: userData.role.permissions,
  };

  res.json(result);
});

const getUserList = async (req, res) => {
  const user = req.user;

  const role = await getUserRole(user);
  if (role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }
  const users = await User.find({}).populate("role");
  res.json(users);
};

const updateUser = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);
  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }
  const { id } = req.params;
  const { username, apartment, role } = req.body;

  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const { username: oldUsername } = existingUser;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username, role, apartment },
    { new: true }
  ).populate("role");

  if (oldUsername !== username) {
    assertToQueue("auth:update", {
      oldUsername,
      newUsername: updatedUser.username,
    });
  }

  res.json({
    success: true,
    message: "User updated successfully",
    updatedUser,
  });
});

const deleteUser = AsyncHandler(async (req, res) => {
  const user = req.user;
  const role = await getUserRole(user);
  if (role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }
  const { id } = req.params;

  const deletingUser = await User.findByIdAndDelete(id);
  if (!deletingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  assertToQueue("auth:delete", { username: deletingUser.username });
  res.json({ success: true, message: "User deleted successfully" });
});

module.exports = {
  getUserInfo,
  getUserList,
  updateUser,
  deleteUser,
};
