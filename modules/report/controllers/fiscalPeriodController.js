const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const FiscalPeriod = require("../models/FiscalPeriod");
const getFiscalPeriodList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  if (!userData.permissions.includes("[accounting:view]")) {
    res.status(401);
    throw new Error("You don't have the permissions to access this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const fiscalPeriods = await FiscalPeriod.find({}).skip(skip).limit(limit);
  const totalFiscalPeriods = await FiscalPeriod.countDocuments();

  res.json({ fiscalPeriods, totalFiscalPeriods });
});

const createFiscalPeriod = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  if (!userData.permissions.includes("[accounting:view]")) {
    res.status(401);
    throw new Error("You don't have the permissions to access this resource");
  }
  const { openDate } = req.body;

  await FiscalPeriod.create({ openDate, status: "opening" });

  res.json({ success: true, message: "Fiscal Period created successfully" });
});

const closeFiscalPeriod = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  if (!userData.permissions.includes("[accounting:view]")) {
    res.status(401);
    throw new Error("You don't have the permissions to access this resource");
  }

  const { id } = req.params;

  const fiscalPeriod = await FiscalPeriod.findById(id);
  if (!fiscalPeriod) {
    res.status(400);
    throw new Error("Fiscal period not found");
  }

  fiscalPeriod.closeDate = new Date().toISOString().split("T")[0];
  fiscalPeriod.status = "closed";

  await fiscalPeriod.save();

  res.json({ success: true, message: "Closed fiscal period" });
});

module.exports = { getFiscalPeriodList, createFiscalPeriod, closeFiscalPeriod };
