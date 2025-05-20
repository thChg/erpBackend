const AsyncHandler = require("express-async-handler");
const getUserPermissions = require("../policies/getUserPermissions");
const canViewOrders = require("../policies/canViewOrders");

const getOrderPermissions = AsyncHandler( async (req, res) => {
  const user = req.user;
  const canView = await canViewOrders(user);
  if (!canView) {
    res.status(403);
    throw new Error("You do not have permission to view orders");
  }
  res.json({ success: canView });
});

const getOrderController = AsyncHandler(async (req, res) => {
  res.json([
    {
      _id: 1,
      name: "Order 1",
      employee: "John Doe",
      apartment: "HR",
      status: "Pending",
      createdAt: "2023-10-01T12:00:00Z",
    },
    {
      _id: 2,
      name: "Order 2",
      employee: "Jane Smith",
      apartment: "Finance",
      status: "Completed",
      createdAt: "2023-10-02T12:00:00Z",
    },
    {
      _id: 3,
      name: "Order 3",
      employee: "Alice Johnson",
      apartment: "IT",
      status: "Pending",
      createdAt: "2023-10-03T12:00:00Z",
    },
    {
      _id: 4,
      name: "Order 4",
      employee: "Bob Brown",
      apartment: "Marketing",
      status: "Pending",
      createdAt: "2023-10-04T12:00:00Z",
    },
  ]);
});

module.exports = { getOrderController, getOrderPermissions };
