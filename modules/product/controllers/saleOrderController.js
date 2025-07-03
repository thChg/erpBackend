const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const SaleOrder = require("../models/SaleOrder");
const Inventory = require("../models/Inventory");

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

  const saleOrder = await SaleOrder.findById(SOId);
  if (!saleOrder) {
    res.status(404);
    throw new Error("Sale Order not found");
  }

  for (const soldProduct of saleOrder.products) {
    const inventory = await Inventory.findOne({
      "product._id": soldProduct._id,
    });

    const projectedExport = inventory.exportQty + soldProduct.quantity;
    if (projectedExport > inventory.importQty) {
      throw new Error(
        `Not enough inventory for product: ${soldProduct.name}. ` +
          `Available: ${inventory.importQty - inventory.exportQty}, ` +
          `Requested: ${soldProduct.quantity}`
      );
    }
  }

  saleOrder.status = "approved";
  await saleOrder.save();

  for (const soldProduct of saleOrder.products) {
    await Inventory.updateOne(
      { "product._id": soldProduct._id },
      { $inc: { exportQty: soldProduct.quantity } }
    );
  }
  res.json({ success: true, message: `Approved SO ${SOId}` });
});

module.exports = { getSaleOrderList, createSaleOrder, approveSaleOrder };
