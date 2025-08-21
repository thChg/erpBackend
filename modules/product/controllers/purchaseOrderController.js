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

  const { name, vendor, orderDate, estimatedDeliveryDate, products } = req.body;

  const existedPO = await PurchaseOrder.findOne({ name: name });
  if (existedPO) {
    res.status(400);
    throw new Error("Existed purchase order name");
  }

  await PurchaseOrder.create({
    name,
    orderDate,
    vendor,
    estimatedDeliveryDate,
    products,
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
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const purchaseOrders = await PurchaseOrder.find({}).skip(skip).limit(limit);

  const totalPurchaseOrders = await PurchaseOrder.countDocuments();
  res.json({ purchaseOrders, totalPurchaseOrders });
});

const resolvePurchaseOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[accounting:resolve]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }
  const { POId, status } = req.body;
  console.log(POId, status);
  await PurchaseOrder.findByIdAndUpdate(POId, {
    status,
    approvedAt: new Date().toISOString().split("T")[0],
  });
  res.json({ success: true, message: `Approved PO ${POId}` });
});

const updatePurchaseOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[accounting:approve]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }
  const { _id, name, estimatedDeliveryDate, orderDate } = req.body;

  await PurchaseOrder.findByIdAndUpdate(_id, {
    name,
    estimatedDeliveryDate,
    orderDate,
  });
  res.json({ success: true, message: `updated purchase order ${_id}` });
});

module.exports = {
  createPurchaseOrder,
  getPurchaseOrderList,
  resolvePurchaseOrder,
  updatePurchaseOrder,
};
