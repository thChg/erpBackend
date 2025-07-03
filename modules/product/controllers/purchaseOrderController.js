const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../models/Product");

const createPurchaseOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[product:create]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const { name, products } = req.body;
  const existedPO = await PurchaseOrder.findOne({ name: name });
  if (existedPO) {
    res.status(400);
    throw new Error("Existed purchase order name");
  }
  const enrichedProducts = products.map((product) => ({
    ...product,
    status: "pending",
  }));

  await PurchaseOrder.create({
    name,
    products: enrichedProducts,
    status: "pending",
  });

  res.json({ success: true, message: "Product order created successfully" });
});

const getPurchaseOrderList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[product:view]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  const purchaseOrders = await PurchaseOrder.find({}).skip(skip).limit(limit);

  const totalPurchaseOrders = await PurchaseOrder.countDocuments();
  res.json({ purchaseOrders, totalPurchaseOrders });
});

const approvePurchaseOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[accounting:approve]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }
  const { POId } = req.body;

  await PurchaseOrder.findByIdAndUpdate(POId, { status: "approved" });
  res.json({ success: true, message: `Approved PO ${POId}` });
});

module.exports = {
  createPurchaseOrder,
  getPurchaseOrderList,
  approvePurchaseOrder,
};
