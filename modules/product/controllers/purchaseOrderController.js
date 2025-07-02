const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../models/Product");

const createPurchaseOrder = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  console.log(userData);
  if (!userData.permissions.includes("[product:create]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const { name, productItems } = req.body;
  const enrichedProductItems = await Promise.all(
    productItems.map(async (item) => {
      const existingProduct = await Product.findOne({ name: item.productName });
      if (existingProduct) {
        return {
          _id: existingProduct._id,
          name: item.productName,
          unit: item.unit,
          price: 0,
          quantity: item.quantity,
          status: "pending",
        };
      }

      const newProduct = await Product.create({
        name: item.productName,
        price: 0,
        unit: item.unit,
      });

      return {
        _id: newProduct._id,
        name: item.productName,
        unit: item.unit,
        price: 0,
        quantity: item.quantity,
        status: "pending",
      };
    })
  );

  await PurchaseOrder.create({
    name,
    products: enrichedProductItems,
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

  await PurchaseOrder.findByIdAndUpdate(POId, {status: "approved"})
  res.json({success: true, message: `Approved PO ${POId}`})
});

module.exports = {
  createPurchaseOrder,
  getPurchaseOrderList,
  approvePurchaseOrder,
};
