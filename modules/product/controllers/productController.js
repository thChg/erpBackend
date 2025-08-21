const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

const getProductList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await getUserData(user);
  if (
    !["[sales:view]", "[product:view]"].some((p) =>
      userData.permissions.includes(p)
    )
  ) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const products = await Product.find({}).skip(skip).limit(limit);
  const totalProducts = await Product.countDocuments();

  res.json({ products: products, totalProducts: totalProducts });
});

const createProduct = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await getUserData(user);
  if (
    !["[sales:delete]", "[product:delete]"].some((p) =>
      userData.permissions.includes(p)
    )
  ) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const { name, price, unit } = req.body;

  const existingProduct = await Product.findOne({ name: name, unit: unit });
  if (existingProduct) {
    res.status(400);
    throw new Error("Product already existed");
  }

  const product = await Product.create({ name, price, unit });
  await Inventory.create({ product: product, importQty: 0, exportQty: 0 });

  res.json({ success: true, message: "Product created successfully" });
});

module.exports = {
  getProductList,
  createProduct,
};
