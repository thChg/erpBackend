const AsyncHander = require("express-async-handler");
const getUserRole = require("../utils/getUserRole");
const Role = require("../models/Role");
const Menu = require("../models/Menu");
const getUserPermission = require("../utils/getUserPermission");
const User = require("../models/User");
const { clearCache } = require("../../../masterPage/utils/cacheUtils");

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

  await clearCache();

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

const deleteManyRole = AsyncHander(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[users:delete]")) {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  const { roles } = req.body;
  await Promise.all(
    roles.map(async (role) => {
      const hasRole = await User.exists({ role: role });
      if (hasRole) {
        res.status(400);
        throw new Error("Still existing user with roles specified");
      }

      await Role.findByIdAndDelete(role);
    })
  );

  res.json({ success: true, message: "Roles deleted successfully" });
});

const getRoleList = AsyncHander(async (req, res) => {
  const user = req.user;
  const userRole = await getUserRole(user);

  if (userRole !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to access this resource");
  }

  let page, limit, skip, roles;
  if (req.query.page && req.query.limit) {
    page = parseInt(req.query.page) || 1;
    limit = parseInt(req.query.limit) || 10;
    skip = (page - 1) * limit;

    roles = await Role.find({})
      .sort({ role: 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "access", model: "Menu" });
  } else {
    roles = await Role.find({})
      .sort({ role: 1 })
      .populate({ path: "access", model: "Menu" });
  }

  if (!roles) {
    res.status(400);
    throw new Error("Failed to fetch roles");
  }

  const totalRoles = await Role.countDocuments({});
  res.json({ roleList: roles, totalRoles });
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
  getRoleList,
  getAccessList,
  deleteManyRole,
};
