const AsyncHandler = require("express-async-handler");
const getUserData = require("../../../masterPage/functions/getUserData");
const Product = require("../models/Product");
const { generatePdf } = require("../../../masterPage/functions/generatePdf");
const moment = require("moment");

const getProductList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await getUserData(user);
  if (!userData.permissions.includes("[product:view]")) {
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

const createProduct = AsyncHandler(async (req, res) => {
  const user = req.user;

  const userData = await getUserData(user);

  if (!userData.permissions.includes("[product:create]")) {
    res.status(401);
    throw new Error("You are not authorized to access this resource");
  }
  const { name, category, price, description } = req.body;

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    res.status(400);
    throw new Error("Product already existed");
  }

  await Product.create({
    name,
    category,
    price: parseFloat(price),
    description,
    vendor: userData._id,
  });

  res.json({ success: true, message: `Product ${name} created successfully` });
});

const printVendorProductList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  if (!userData.permissions.includes("[product:print]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const body = req.body;

  const data = await Promise.all(
    body.map(async (productId, index) => {
      const product = await Product.findById(productId).select(
        "name category description"
      );
      return { ...product.toObject(), num: index + 1 };
    })
  );

  const pdf = await generatePdf("ProductList.html", {
    time: moment(new Date()).format("MMMM Do YYYY"),
    products: data,
  });

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

const getVendorProductData = AsyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await getUserData(user);
  if (!userData.permissions.includes("[product:export]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }
  const productIds = req.body;

  const data = await Promise.all(productIds.map(async productId => 
    await Product.findById(productId)
  ));

  res.json(data);
})

module.exports = { getProductList, createProduct, printVendorProductList, getVendorProductData };
