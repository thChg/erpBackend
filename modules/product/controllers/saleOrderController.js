const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const SaleOrder = require("../models/SaleOrder");

const getSaleOrderList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[sales:view]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  const saleOrders = await SaleOrder.find({}).skip(skip).limit(limit);

  const totalSaleOrders = await SaleOrder.countDocuments();
  res.json({ saleOrders, totalSaleOrders });
});

const createSaleOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[sales:create]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const { name, products } = req.body;
  const existedSO = await SaleOrder.findOne({ name: name });
  if (existedSO) {
    res.status(400);
    throw new Error("Existed sale order name");
  }
  const enrichedProducts = products.map((product) => ({
    ...product,
    status: "pending",
  }));

  await SaleOrder.create({
    name,
    products: enrichedProducts,
    status: "pending",
  });

  res.json({ success: true, message: "Product order created successfully" });
});

const approveSaleOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[accounting:approve]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }
  const { SOId } = req.body;

  await SaleOrder.findByIdAndUpdate(SOId, { status: "approved" });
  res.json({ success: true, message: `Approved SO ${SOId}` });
});

module.exports = { getSaleOrderList, createSaleOrder, approveSaleOrder };
