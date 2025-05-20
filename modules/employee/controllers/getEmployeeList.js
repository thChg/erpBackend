const Employee = require("../models/Employee");
const AsyncHandler = require("express-async-handler");

const getEmployeeList = AsyncHandler(async (req, res) => {
  
  const result = await Employee.find({});
  res.send(result);
});



module.exports = { getEmployeeList };
