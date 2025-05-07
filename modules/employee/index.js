const express = require("express");
const { getEmployeeList } = require("./controllers/getEmployeeList");
const errorHandler = require("../../masterPage/middlewares/errorHandler");
const cors = require("cors")
const connectToDB = require("../../masterPage/config/databaseConnection");
require("dotenv").config({path: "../../.env"});

const PORT = process.env.EMPLOYEE_PORT;
const DB_NAME = process.env.EMPLOYEE_DB_NAME;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

connectToDB(DB_NAME);

app.get("/employee/get", getEmployeeList);
// app.post("/employee/post", employeeRoute);
// app.get("/employee/get/:id", employeeRoute);
// app.put("/employee/put/:id", employeeRoute);
// app.delete("/employee/delete/:id", );

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`${req.originalUrl} not found`);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee service is listening on ${PORT}`);
});
