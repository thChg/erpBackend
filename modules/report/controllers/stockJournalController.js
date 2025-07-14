const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const StockJournal = require("../models/StockJournal");

const getStockJournal = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await getUserData(user);
  if (!userData.permissions.includes("[reports:view]")) {
    res.status(401);
    throw new Error("You don't have the permissions to access this resource");
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  
  const journal = await StockJournal.find({});

  const summaryMap = {};

  for (const entry of journal) {
    const { _id, name, unit, price, quantity } = entry.product;
    const key = _id.toString();

    if (!summaryMap[key]) {
      summaryMap[key] = {
        productId: _id,
        productName: name,
        unit,
        importQuantity: 0,
        importTotal: 0,
        exportQuantity: 0,
        exportTotal: 0,
      };
    }

    const record = summaryMap[key];

    if (entry.action === "purchase") {
      record.importQuantity += quantity;
      record.importTotal += quantity * price;
    } else if (entry.action === "sale") {
      record.exportQuantity += quantity;
      record.exportTotal += quantity * price;
    }
  }

  const inventorySummary = Object.values(summaryMap).map((item) => ({
    productId: item.productId,
    productName: item.productName,
    unit: item.unit,
    importQuantity: item.importQuantity,
    importAvgPrice:
      item.importQuantity > 0
        ? (item.importTotal / item.importQuantity).toFixed(2)
        : "0.00",
    exportQuantity: item.exportQuantity,
    exportAvgPrice:
      item.exportQuantity > 0
        ? (item.exportTotal / item.exportQuantity).toFixed(2)
        : "0.00",
  }));

  const data = inventorySummary.slice(skip, limit + skip);

  res.json({
    inventorySummary: data,
    inventorySummaryLength: inventorySummary.length,
  });
});

module.exports = { getStockJournal };
