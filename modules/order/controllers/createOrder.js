const asyncHandler = require("express-async-handler");
const canCreateOrder = require("../policies/canCreateOrder");

const createOrderController = (req, res) => {
  res.json({
    success: true,
    message: "Order created successfully",
    data: req.body,
  });
};

const createOrderPermissions = asyncHandler(async (req, res) => {
  const user = req.user;
  const canCreate = await canCreateOrder(user);
  if (!canCreate) {
    res.status(403);
    throw new Error("You do not have permission to create an order");
  }
  res.json({ canCreateOrder: canCreate });
});

module.exports = { createOrderController, createOrderPermissions };
