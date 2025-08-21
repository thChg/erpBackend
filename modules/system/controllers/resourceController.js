const AsyncHandler = require("express-async-handler");
const {
  getDocumentList,
  generateSwagger,
  createNewDocument,
  getDocumentById,
} = require("../../../masterPage/helpers/controllerHelper");
const { Resource, model } = require("../models/ResourceModel");

const handleGetResourceList = AsyncHandler(async (req, res) => {
  //check quyen

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Resource,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleCreateResource = AsyncHandler(async (req, res) => {
  const newResource = await createNewDocument(Resource, req.body, "Resource");

  res.json({ success: true, newResource });
});

const handleGetResourceById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const resourceData = await getDocumentById(
    Resource,
    req.params.id,
    "Resource",
    access
  );

  res.json(resourceData);
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetResourceList,
  handleCreateResource,
  handleGetSwagger,
  handleGetResourceById,
};
