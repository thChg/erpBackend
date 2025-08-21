const AsyncHandler = require("express-async-handler");
const { Employee, model } = require("../models/EmployeeModel");
const {
  getDocumentList,
  createNewDocument,
  getDocumentById,
  updateDocumentById,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");

const handleGetEmployeeList = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Employee,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleGetEmployeeById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const employeeData = await getDocumentById(
    Employee,
    req.params.id,
    "Employee",
    access
  );

  res.json(employeeData);
});

const handleCreateEmployee = AsyncHandler(async (req, res) => {
  const newEmployee = await createNewDocument(Employee, req.body, "Employee");

  res.json({ success: true, newEmployee });
});

const handleUpdateEmployee = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "updateById");
  const updatedEmployee = await updateDocumentById(
    Employee,
    req.params.id,
    req.body,
    "Employee",
    access
  );

  res.json({ success: true, updatedEmployee });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetEmployeeList,
  handleCreateEmployee,
  handleGetEmployeeById,
  handleUpdateEmployee,
  handleGetSwagger,
};
