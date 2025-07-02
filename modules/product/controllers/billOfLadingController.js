const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const BillOfLading = require("../models/BillOfLading");
const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

const getBillOfLadingList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[product:view]")) {
    res.status(401);
    throw new Error("you are not authorized to access this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const billOfLadings = await BillOfLading.find({}).skip(skip).limit(limit);
  const totalBillOfLadings = await BillOfLading.countDocuments();

  res.json({ billOfLadings, totalBillOfLadings });
});

const createBillOfLading = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[product:create]")) {
    res.status(401);
    throw new Error("you are not authorized to access this resource");
  }
  //affect bol done, po, inventory done
  const { name, purchaseOrderItems } = req.body;
  const enrichedData = await Promise.all(
    purchaseOrderItems.map(async (item) => {
      const purchaseOrder = await PurchaseOrder.findById(
        item.purchaseOrder
      ).select("_id name status products");
      const product = purchaseOrder.products.find(
        (product) => String(product._id) === String(item.product)
      );

      const existingProductInInventory = await Inventory.findOne({
        "product.name": product.name,
      });
      if (!existingProductInInventory) {
        await Inventory.create({
          product: {
            _id: product._id,
            name: product.name,
            unit: product.unit,
            price: product.price,
          },
          importQty: product.quantity,
          exportQty: 0,
        });
      } else {
        await Inventory.updateOne(
          { _id: existingProductInInventory._id },
          {
            $inc: { importQty: product.quantity },
          }
        );
      }

      await PurchaseOrder.updateOne(
        { _id: purchaseOrder._id },
        {
          $set: {
            "products.$[elem].status": "completed",
          },
        },
        {
          arrayFilters: [{ "elem._id": product._id }],
        }
      );
      const updatedPO = await PurchaseOrder.findById(purchaseOrder._id);

      const notCompleted = updatedPO.products.find(
        (product) => product.status === "pending"
      );
      if (!notCompleted) {
        await PurchaseOrder.updateOne(
          { _id: purchaseOrder._id },
          { status: "completed" }
        );
      }

      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        purchaseOrder: {
          _id: purchaseOrder._id,
          name: purchaseOrder.name,
          status: purchaseOrder.status,
        },
      };
    })
  );

  await BillOfLading.create({ products: enrichedData, name: name });

  res.json({ success: true, message: `Created BOL successfully` });
});

module.exports = { getBillOfLadingList, createBillOfLading };
