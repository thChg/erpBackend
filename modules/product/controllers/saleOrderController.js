const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const SaleOrder = require("../models/SaleOrder");
const Inventory = require("../models/Inventory");
const DeliveryNote = require("../models/DeliveryNote");

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
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

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
  const {
    name,
    orderDate,
    customer,
    deliveryAddress,
    estimatedDeliveryDate,
    products,
  } = req.body;
  const existedSO = await SaleOrder.findOne({ name: name });
  if (existedSO) {
    res.status(400);
    throw new Error("Existed sale order name");
  }

  await SaleOrder.create({
    name,
    products: products,
    orderDate,
    customer,
    deliveryAddress,
    estimatedDeliveryDate,
    status: "pending",
  });

  res.json({ success: true, message: "Sale order created successfully" });
});

const resolveSaleOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[accounting:resolve]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }
  const { SOId, status } = req.body;

  const saleOrder = await SaleOrder.findById(SOId);
  if (!saleOrder) {
    res.status(404);
    throw new Error("Sale Order not found");
  }

  saleOrder.status = status;
  saleOrder.approvedAt = new Date().toISOString().split("T")[0];
  await saleOrder.save();

  if (status === "approved") {
    await DeliveryNote.create({
      name: saleOrder.name,
      orderDate: saleOrder.orderDate,
      customer: saleOrder.customer,
      deliveryAddress: saleOrder.deliveryAddress,
      estimatedDeliveryDate: saleOrder.estimatedDeliveryDate,
      products: saleOrder.products,
      approvedAt: saleOrder.approvedAt,
      status: "pending",
    });
  }

  res.json({ success: true, message: `Resolved SO ${SOId}` });
});

const updateSaleOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[sales:update]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const {
    name,
    orderDate,
    deliveryAddress,
    estimatedDeliveryDate,
    approvedAt,
    acceptedAt,
    _id,
  } = req.body;

  const existingOrder = await SaleOrder.findById(_id);
  if (!existingOrder) {
    res.status(400);
    throw new Error(`Sale order doesn't exist!`);
  }

  await SaleOrder.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        name,
        orderDate,
        deliveryAddress,
        estimatedDeliveryDate,
        approvedAt,
        acceptedAt,
      },
    }
  );

  res.json({
    success: true,
    message: `Sale Order updated successfully`,
  });
});

const deleteSaleOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[sales:delete]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const orderId = req.params.id;

  await SaleOrder.findOneAndDelete({ _id: orderId });

  res.json({
    success: true,
    message: `Sale Order deleted successfully`,
  });
});

module.exports = {
  getSaleOrderList,
  createSaleOrder,
  resolveSaleOrder,
  updateSaleOrder,
  deleteSaleOrder,
};
