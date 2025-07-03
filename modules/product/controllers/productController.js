const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const Product = require("../models/Product");
const PurchaseOrder = require("../models/PurchaseOrder");
const BillOfLading = require("../models/BillOfLading");
const Inventory = require("../models/Inventory");
const SaleOrder = require("../models/SaleOrder");

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
  const products = await Product.find({}).skip(skip).limit(limit);
  const totalProducts = await Product.countDocuments();

  res.json({ products: products, totalProducts: totalProducts });
});

const updateProduct = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  console.log(userData);
  if (
    !["[sales:update]", "[product:update]"].some((p) =>
      userData.permissions.includes(p)
    )
  ) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }

  const { id, name, price, unit } = req.body;

  const updatingProduct = await Product.findById(id);
  if (!updatingProduct) {
    res.status(400);
    throw new Error("The product you're updating doesn't exist");
  }

  updatingProduct.name = name;
  updatingProduct.price = price;
  updatingProduct.unit = unit;

  await PurchaseOrder.updateMany(
    { "products._id": id },
    {
      $set: {
        "products.$.name": name,
        "products.$.price": price,
        "products.$.unit": unit,
      },
    }
  );

  await SaleOrder.updateMany(
    { "products._id": id },
    {
      $set: {
        "products.$.name": name,
        "products.$.price": price,
        "products.$.unit": unit,
      },
    }
  );

  await BillOfLading.updateMany(
    { "products._id": id },
    {
      $set: {
        "products.$.name": name,
        "products.$.price": price,
        "products.$.unit": unit,
      },
    }
  );

  await Inventory.updateOne(
    { "product._id": id },
    {
      $set: {
        "product.name": name,
        "product.price": price,
        "product.unit": unit,
      },
    }
  );

  await updatingProduct.save();

  res.json({ success: true, message: "Product updated successfully" });
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
  updateProduct,
  createProduct,
};
