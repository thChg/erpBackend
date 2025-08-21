const AsyncHandler = require("express-async-handler");
const {
  getDocumentList,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Access, model } = require("../models/AccessModel");

const handleGetAccessList = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Access,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = { handleGetAccessList, handleGetSwagger };
