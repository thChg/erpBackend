const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, model } = require("../models/UserModel");
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
const {
  getDocumentList,
  getDocumentById,
  createNewDocument,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");

const getUserInfo = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await User.findOne({ username: user.username }).lean();
  (userData.password = null), res.json(userData);
});

const handleGetUserList = async (req, res) => {
  //check quyen

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    User,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
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

const handleGetUserById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const user = await getDocumentById(User, req.params.id, "User", access);
  user.password = "";
  res.json(user);
});

const handleCreateUser = AsyncHandler(async (req, res) => {
  const { password, roleList } = req.body;
  req.body.password = await bcrypt.hash(password, 10);

  const allFunctions = _.flatMap(roleList, "functionList");
  const uniqueFunctions = _.unionBy(allFunctions, (f) => f.functionId);

  const allModules = uniqueFunctions.map((f) => ({
    moduleId: f.moduleId,
    moduleName: f.moduleName,
    moduleCode: f.moduleCode,
    moduleOrder: f.moduleOrder,
  }));

  const uniqueModules = _.unionBy(allModules, (m) => m.moduleId);

  req.body.functionList = uniqueFunctions;
  req.body.moduleList = uniqueModules;

  const newUser = await createNewDocument(User, req.body, "User");

  res.json({ success: true, newUser });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  getUserInfo,
  handleGetUserList,
  updateUser,
  deleteUser,
  deleteManyUsers,
  printUserList,
  handleGetUserById,
  handleCreateUser,
  handleGetSwagger,
};
