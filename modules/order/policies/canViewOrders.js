const getUserPermissions = require("./getUserPermissions");

const canViewOrders = async (user) => {
    console.log("can view ?")
  const permissions = await getUserPermissions(user);

  const { role, apartment } = permissions;
  return role === "admin" || (role === "employee" && apartment === "sales");
};

module.exports = canViewOrders;
