const AsyncHandler = require("express-async-handler");
const { Module, model } = require("../models/ModuleModel");
const {
  getDocumentList,
  getDocumentById,
  updateDocumentById,
  createNewDocument,
  updateRelatedModel,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Function } = require("../models/FunctionModel");
const { Role } = require("../models/RoleModel");
const { User } = require("../models/UserModel");

const handleCreateModule = AsyncHandler(async (req, res) => {
  //check quyen

  const newModule = await createNewDocument(Module, req.body);

  res.json({ success: true, newModule });
});

const handleGetModuleList = AsyncHandler(async (req, res) => {
  //check quyen
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Module,
    req.query,
    access
  );

  res.json({ objectList, length, accessList, accessList });
});

const handleGetModuleById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const moduleData = await getDocumentById(
    Module,
    req.params.id,
    "module",
    access
  );
  res.json(moduleData);
});

const handleUpdateModuleById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "update");
  const updatedModule = await updateDocumentById(
    Module,
    req.params.id,
    req.body,
    "module",
    access
  );

  await Promise.all([
    updateRelatedModel(
      Function,
      { moduleId: updatedModule._id },
      updatedModule
    ),
    updateRelatedModel(
      Role,
      { "functionList.moduleId": updatedModule._id },
      updatedModule
    ),
    updateRelatedModel(
      User,
      { "functionList.moduleId": updatedModule._id },
      updatedModule
    ),
    updateRelatedModel(
      User,
      { "moduleList.moduleId": updatedModule._id },
      updatedModule
    ),
  ]);

  res.json({ success: true, updatedModule });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleCreateModule,
  handleGetModuleList,
  handleGetModuleById,
  handleUpdateModuleById,
  handleGetSwagger,
};
