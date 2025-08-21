const AsyncHandler = require("express-async-handler");
const {
  getDocumentList,
  createNewDocument,
  getDocumentById,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Department, model } = require("../models/DepartmentModel");
const { Company } = require("../models/CompanyModel");
const { assertManyToQueue } = require("../../../masterPage/rabbitmq/producer");

const handleGetDepartmentList = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Department,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleGetDepartmentById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const departmentData = await getDocumentById(
    Department,
    req.params.id,
    "Department",
    access
  );

  res.json(departmentData);
});

const handleCreateDepartment = AsyncHandler(async (req, res) => {
  const newDepartment = await createNewDocument(
    Department,
    req.body,
    "Document"
  );

  await Company.findByIdAndUpdate(newDepartment.companyId, {
    $addToSet: {
      departmentList: {
        departmentId: newDepartment._id,
        departmentCode: newDepartment.departmentCode,
        departmentName: newDepartment.departmentName,

        managerId: newDepartment.managerId,
        managerUsername: newDepartment.managerUsername,
        managerFullname: newDepartment.managerFullname,
      },
      staffList: {
        $each: newDepartment.staffList.map((s) => ({
          staffId: s.staffId,
          staffUsername: s.staffUsername,
          staffFullname: s.staffFullname,

          positionId: s.positionId,
          positionCode: s.positionCode,
          positionName: s.positionName,

          titleCode: s.titleCode,
          titleName: s.titleName,

          departmentId: newDepartment._id,
          departmentCode: newDepartment.departmentCode,
          departmentName: newDepartment.departmentName,
        })),
      },
    },
  });
  const departmentMessages = newDepartment.staffList.map((s) => ({
    userId: s.staffId,
    department: {
      departmentId: newDepartment._id,
      departmentCode: newDepartment.departmentCode,
      departmentName: newDepartment.departmentName,

      companyId: newDepartment.companyId,
      companyCode: newDepartment.companyCode,
      companyName: newDepartment.companyName,

      positionId: s.positionId,
      positionCode: s.positionCode,
      positionName: s.positionName,
    },
    departmentManagerId: newDepartment.managerId,
  }));

  const companyMessages = newDepartment.staffList.map((s) => ({
    userId: s.staffId,
    company: {
      companyId: newDepartment.companyId,
      companyCode: newDepartment.companyCode,
      companyName: newDepartment.companyName,
    },
    companyCEOId: newDepartment.companyCEOId,
  }));

  await assertManyToQueue("user.department", departmentMessages);
  await assertManyToQueue("user.company", companyMessages);

  res.json({ success: true, newDepartment });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetDepartmentList,
  handleGetDepartmentById,
  handleCreateDepartment,
  handleGetSwagger,
};
