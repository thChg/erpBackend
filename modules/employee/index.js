const express = require("express");
const { getEmployeeList } = require("./controllers/getEmployeeList");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors")
require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

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
