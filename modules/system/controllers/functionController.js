const AsyncHandler = require("express-async-handler");
const { Function, model } = require("../models/FunctionModel");
const {
  createNewDocument,
  getDocumentList,
  getDocumentById,
  updateDocumentById,
  updateRelatedModel,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Role } = require("../models/RoleModel");
const { User } = require("../models/UserModel");

const handleCreateFunction = AsyncHandler(async (req, res) => {
  //check quyen

  const createdFunction = await createNewDocument(
    Function,
    req.body,
    "function"
  );

  res.json({ success: true, createdFunction });
});

const handleGetFunctionList = AsyncHandler(async (req, res) => {
  //check quyen

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Function,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleGetFunctionById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const functionData = await getDocumentById(
    Function,
    req.params.id,
    "function",
    access
  );

  res.json(functionData);
});

const handleUpdateFunctionById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "update");
  const updatedFunction = await updateDocumentById(
    Function,
    req.params.id,
    req.body,
    "function",
    access
  );

  const parentFunction = {
    parentId: updatedFunction._id,
    parentName: updatedFunction.functionName,
    parentUrl: updatedFunction.functionUrl,
    parentOrder: updatedFunction.functionOrder,
  };

  await Promise.all([
    await updateRelatedModel(
      Function,
      { parentId: parentFunction.parentId },
      parentFunction
    ),
    await updateRelatedModel(
      Role,
      { "functionList.functionId": updatedFunction._id },
      updatedFunction
    ),
    await updateRelatedModel(
      Role,
      { "functionList.parentId": parentFunction.parentId },
      parentFunction
    ),
    await updateRelatedModel(
      User,
      { "functionList.functionId": updatedFunction._id },
      updatedFunction
    ),
    await updateRelatedModel(
      User,
      { "functionList.parentId": parentFunction.parentId },
      parentFunction
    ),
  ]);

  res.json({ success: true, updatedFunction });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleCreateFunction,
  handleGetFunctionList,
  handleGetFunctionById,
  handleUpdateFunctionById,
  handleGetSwagger,
};
