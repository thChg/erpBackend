const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("../../masterPage/middlewares/errorHandler");
const connectToDB = require("../../masterPage/config/databaseConnection");

const InventoryRoute = require("./routes/inventoryRoute");
const PurchaseOrderRoute = require("./routes/purchaseOrderRoute");
const BOLRoute = require("./routes/billOfLadingRoute");
const ProductRoute = require("./routes/productRoute");
const SaleOrderRoute = require("./routes/saleOrderRoute");

require("dotenv").config({ path: "../../.env" });

const PORT = process.env.PRODUCT_PORT;
const DB_NAME = process.env.PRODUCT_DB_NAME;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

connectToDB(DB_NAME);
app.use("/product/inventory", InventoryRoute);
app.use("/product/purchase-order", PurchaseOrderRoute);
app.use("/product/bill-of-lading", BOLRoute);
app.use("/product", ProductRoute);
app.use("/product/sale-order", SaleOrderRoute);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
