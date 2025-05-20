const asyncHander = require("express-async-handler");

const getPermissions = asyncHander(async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    message: "User permissions retrieved successfully",
    data: user.permissions,
  });
});

module.exports = { getPermissions };
