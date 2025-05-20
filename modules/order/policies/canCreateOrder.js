const getUserPermissions = require("./getUserPermissions");

const canCreateOrder = async (user) => {
  const permissions = await getUserPermissions(user);
  const { role, apartment } = permissions;

  return role === "admin" || (role === "employee" && apartment === "sales");
};

module.exports = canCreateOrder;
