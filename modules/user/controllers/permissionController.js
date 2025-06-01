const AsyncHander = require("express-async-handler");
const getUserRole = require("../utils/getUserRole");
const Role = require("../models/Role");
const Menu = require("../models/Menu");

const createRole = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { role } = req.body;

  if (!role) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const existingRole = await Role.findOne({ role });
  if (existingRole) {
    res.status(400);
    throw new Error("Role already exists");
  }

  const newRole = await Role.create({ role });
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

const updateRole = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { access, permissions } = req.body;
  const { id } = req.params;

  const existingRole = await Role.findById(id);
  if (!existingRole) {
    res.status(400);
    throw new Error("Role not found");
  }

  existingRole.access = access;
  existingRole.permissions = permissions;

  const updatedRole = await existingRole.save();
  if (!updatedRole) {
    res.status(400);
    throw new Error("Failed to update role");
  }

  res.json({
    status: "success",
    message: "Role updated successfully",
    data: updatedRole,
  });
});

const deleteRole = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { id } = req.params;

  const existingRole = await Role.findById(id);
  if (!existingRole) {
    res.status(400);
    throw new Error("Role not found");
  }

  const deletedRole = await Role.findByIdAndDelete(id);
  if (!deletedRole) {
    res.status(400);
    throw new Error("Failed to delete role");
  }

  res.json({
    status: "success",
    message: "Role deleted successfully",
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

  const roles = await Role.find({})
    .populate({ path: "access", model: "Menu" })
    .sort({ role: 1 });
  if (!roles) {
    res.status(400);
    throw new Error("Failed to fetch roles");
  }
  res.json(roles);
});

const getAccessList = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const accessList = await Menu.find({}).sort({ menu: 1 });
  if (!accessList) {
    res.status(400);
    throw new Error("Failed to fetch access list");
  }

  res.json(accessList);
});

module.exports = {
  createRole,
  updateRole,
  deleteRole,
  createPermission,
  getRoleList,
  getAccessList,
};
