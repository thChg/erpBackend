const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const BillOfLading = require("../models/BillOfLading");
const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../models/Product");
const { onPurchaseSuccess } = require("../producers/reportPurchaseProducer");

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
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const billOfLadings = await BillOfLading.find({}).skip(skip).limit(limit);
  const totalBillOfLadings = await BillOfLading.countDocuments();

  res.json({ billOfLadings, totalBillOfLadings });
});

const createBillOfLading = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);

  if (!userData.permissions.includes("[product:create]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const { name, vendor, products } = req.body;

  await Promise.all(
    products.map(async (item) => {
      const poId = item.purchaseOrder._id;
      const productId = item._id;

      await PurchaseOrder.updateOne(
        { _id: poId },
        {
          $set: {
            "products.$[elem].status": "completed",
          },
        },
        {
          arrayFilters: [{ "elem._id": productId }],
        }
      );

      const updatedPO = await PurchaseOrder.findById(poId);
      const hasPending = updatedPO.products.some(
        (product) => product.status === "pending"
      );

      if (!hasPending) {
        await PurchaseOrder.updateOne({ _id: poId }, { status: "completed" });
      }
    })
  );

  const bol = await BillOfLading.create({ name, vendor, products });

  await onPurchaseSuccess(bol);

  res.json({ success: true, message: "Created BOL successfully" });
});

module.exports = { getBillOfLadingList, createBillOfLading };
