const AsyncHandler = require("express-async-handler");
const {
  createNewDocument,
  getDocumentList,
  getDocumentById,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Company, model } = require("../models/CompanyModel");
const { Department } = require("../models/DepartmentModel");

const handleGetCompanyList = AsyncHandler(async (req, res) => {
  //check quyen
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Company,
    req.query,
    access
  );
  
  res.json({ objectList, length, accessList });
});

const handleCreateCompany = AsyncHandler(async (req, res) => {
  const newCompany = await createNewDocument(Company, req.body, res);

  const { staffList } = newCompany;

  let taskList = [];

  staffList.forEach(async (s) => {
    const departmentStaff = {
      staffId: s.staffId,
      staffUsername: s.staffUsername,
      staffFullname: s.staffFullname,

      positionId: s.positionId,
      positionCode: s.positionCode,
      positionName: s.positionName,
    };
    taskList.push(
      await Department.findByIdAndUpdate(s.departmentId, {
        $addToSet: { staffList: departmentStaff },
      })
    );
  });

  res.json({ success: true, newCompany });
});

const handleGetCompanyById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const companyData = await getDocumentById(
    Company,
    req.params.id,
    "Company",
    access
  );

  res.json(companyData);
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetCompanyList,
  handleCreateCompany,
  handleGetCompanyById,
  handleGetSwagger,
};
