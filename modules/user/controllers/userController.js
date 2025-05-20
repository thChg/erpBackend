const AsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/Role");
const getUserRole = require("../utils/getUserRole");
const { permission } = require("process");

const getUserInfo = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await User.findOne({ username: user.username }).populate({
    path: "role",
    populate: [
      {
        path: "access",
        model: "Menu",
      },
      {
        path: "permissions",
        model: "Permission",
      },
    ],
  });

  const result = {
    username: userData.username,
    role: userData.role.role,
    apartment: userData.apartment,
    access: userData.role.access,
    permissions: userData.role.permissions.map((permission) => permission.name),
  };

  res.json(result);
});

const getUserList = async (req, res) => {
  const user = req.user;

  const role = await getUserRole(user);
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const users = await User.find({}).populate("role");
  res.json(users);
};

const updateUser = (req, res) => {
  const user = req.user;
  res.json(user);
};

const deleteUser = (req, res) => {
  const user = req.user;
  res.json(user);
};

module.exports = {
  getUserInfo,
  getUserList,
  updateUser,
  deleteUser,
};
