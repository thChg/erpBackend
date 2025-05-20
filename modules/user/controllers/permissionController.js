const AsyncHander = require("express-async-handler");
const getUserRole = require("../utils/getUserRole");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const createRole = AsyncHander(async (req, res) => {
  const user = req.user;
  console.log(JSON.stringify(user));
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { role, pages } = req.body;

  if (!role || !pages) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const existingRole = await Role.findOne({ role });
  if (existingRole) {
    res.status(400);
    throw new Error("Role already exists");
  }

  const newRole = await Role.create({ role, access: pages });
  if (!newRole) {
    res.status(400);
    throw new Error("Failed to create role");
  }

  res.json({
    status: "success",
    message: "Role created successfully",
    data: newRole,
  });
});

const createPermission = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const existingPermission = await Permission.findOne({ name });
  if (existingPermission) {
    res.status(400);
    throw new Error("Permission already exists");
  }

  const newPermission = await Permission.create({ name });
  if (!newPermission) {
    res.status(400);
    throw new Error("Failed to create permission");
  }

  res.json({
    status: "success",
    message: "Permission created successfully",
    data: newPermission,
  });
});

const getRoleList = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const roles = await Role.find({});
  if (!roles) {
    res.status(400);
    throw new Error("Failed to fetch roles");
  }
  const result = roles.map((role) => ({ _id: role._id, role: role.role }));
  res.json(result);
});

module.exports = {
  createRole,
  createPermission,
  getRoleList,
};
