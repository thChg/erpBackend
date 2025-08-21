const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("../../masterPage/middlewares/errorHandler");
const connectToDB = require("../../masterPage/config/databaseConnection");
const Authenticate = require("../../masterPage/middlewares/Authenticate");
const Authorize = require("../../masterPage/middlewares/Authorize");
const { consume } = require("./consumers/consumer");

const userRoute = require("./routes/userRoute");
const moduleRoute = require("./routes/moduleRoute");
const functionRoute = require("./routes/functionRoute");
const authRoute = require("./routes/authRoute");
const roleRoute = require("./routes/roleRoute");
const resourceRoute = require("./routes/resourceRoute");
const policyRoute = require("./routes/policyRoute");
const accessRoute = require("./routes/accessRoute");

require("dotenv").config({ path: "../../.env" });

const PORT = process.env.SYSTEM_PORT;
const DB_NAME = process.env.SYSTEM_DB_NAME;

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
consume();

app.use("/system/auth", authRoute);

app.use(Authenticate, Authorize);

app.use("/system/user", userRoute);
app.use("/system/role", roleRoute);
app.use("/system/module", moduleRoute);
app.use("/system/function", functionRoute);
app.use("/system/resource", resourceRoute);
app.use("/system/policy", policyRoute);
app.use("/system/access", accessRoute);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
