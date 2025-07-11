const AsyncHandler = require("express-async-handler");
const DeliveryNote = require("../models/DeliveryNote");
const getUserPermission = require("../../user/utils/getUserPermission");
const SaleOrder = require("../models/SaleOrder");

const getDeliveryNoteList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[warehouse:view]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const deliveryNotes = await DeliveryNote.find({}).skip(skip).limit(limit);
  const totalDeliveryNotes = await DeliveryNote.countDocuments();

  res.json({ deliveryNotes, totalDeliveryNotes });
});

const resolveDeliveryNote = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[warehouse:update]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }
  const { id } = req.params;
  const { action } = req.body;
  const deliveryNote = await DeliveryNote.findById(id);
  if (!deliveryNote) {
    res.status(400);
    throw new Error("Delivery note doesn't exist");
  }

  deliveryNote.status = action;
  await deliveryNote.save();
  const saleOrder = await SaleOrder.findOne({ name: deliveryNote.name });
  if (!saleOrder) {
    res.status(400);
    throw new Error("No corresponding sale order found");
  }

  saleOrder.status = action;
  await saleOrder.save();

  res.json({ success: true, message: "Resolve delivery note successfully" });
});

module.exports = { getDeliveryNoteList, resolveDeliveryNote };
