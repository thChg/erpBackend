const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const Inventory = require("../models/Inventory");

const getInventoryList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  if (!userData.permissions.includes("[inventory:view]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const inventory = await Inventory.find({}).skip(skip).limit(limit);
  const totalProducts = await Inventory.countDocuments();

  res.json({ inventory, totalProducts });
});

module.exports = { getInventoryList };
