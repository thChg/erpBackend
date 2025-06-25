const AsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Handlebars = require("../../../masterPage/config/sharedHandlebars");
const {
  assertToQueue,
  assertManyToQueue,
} = require("../../../masterPage/rabbitmq/producer");
const getUserPermission = require("../utils/getUserPermission");
const {
  onManyUserDelete,
  onUserDelete,
} = require("../producers/userDeleteProducer");
const { readFileSync } = require("fs");
const puppeteer = require("puppeteer");
const moment = require("moment");

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
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[users:view]")) {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const users = await User.find({}).skip(skip).limit(limit).populate("role");
  const totalUsers = await User.countDocuments({});
  res.json({ users, totalUsers });
};

const updateUser = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[users:update]")) {
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
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[users:delete]")) {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }
  const { id } = req.params;

  const deletingUser = await User.findByIdAndDelete(id);
  if (!deletingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  await onUserDelete(deletingUser.username);
  res.json({ success: true, message: "User deleted successfully" });
});

const deleteManyUsers = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[users:delete]")) {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { users } = req.body;

  const usernames = [];

  await Promise.all(
    users.map(async (element) => {
      const curUser = await User.findByIdAndDelete(element);
      usernames.push(curUser.username);
    })
  );

  await onManyUserDelete(usernames);

  res.json({ success: true, message: "Users deleted successfully" });
});

const printUserList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);

  if (!permissions.includes("[users:print]")) {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }
  const source = readFileSync("./templates/UserManagementList.html", "utf8");

  const template = Handlebars.compile(source);

  const body = req.body;

  const data = await Promise.all(
    body.map(async (userId, index) => {
      const user = await User.findById(userId)
        .select("username apartment")
        .populate({ path: "role", select: "role" });
      return { ...user.toObject(), num: index + 1 };
    })
  );

  const result = template({
    users: data,
    time: moment(new Date()).format("MMMM Do YYYY"),
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(result);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

const getSelectedUSerInfo = AsyncHandler(async (req, res) => {
  const userIds = req.body;
  const users = await Promise.all(
    userIds.map((userId) =>
      User.findById(userId)
        .select("username apartment")
        .populate({ path: "role", select: "role" })
    )
  );
  res.json(users);
});

module.exports = {
  getUserInfo,
  getUserList,
  updateUser,
  deleteUser,
  deleteManyUsers,
  printUserList,
  getSelectedUSerInfo,
};
