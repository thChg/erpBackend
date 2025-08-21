const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("../../masterPage/middlewares/errorHandler");
const connectToDB = require("../../masterPage/config/databaseConnection");

const positionRoute = require("./routes/positionRoute");
const companyRoute = require("./routes/companyRoute");
const departmentRoute = require("./routes/departmentRoute");
const titleRoute = require("./routes/titleRoute");
const employeeRoute = require("./routes/employeeRoute");
const Authenticate = require("../../masterPage/middlewares/Authenticate");
const Authorize = require("../../masterPage/middlewares/Authorize");

require("dotenv").config({ path: "../../.env" });

const PORT = process.env.HUMAN_RESOURCE_PORT;
const DB_NAME = process.env.HUMAN_RESOURCE_DB_NAME;

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

app.use(Authenticate, Authorize);

app.use("/human-resource/position", positionRoute);
app.use("/human-resource/department", departmentRoute);
app.use("/human-resource/company", companyRoute);
app.use("/human-resource/title", titleRoute);
app.use("/human-resource/employee", employeeRoute);

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
