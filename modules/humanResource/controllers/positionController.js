const AsyncHandler = require("express-async-handler");
const {
  getDocumentList,
  getDocumentById,
  createNewDocument,
  updateDocumentById,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Position, model } = require("../models/PositionModel");

const handleGetPositionList = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Position,
    req.query,
    access
  );
  res.json({ objectList, length, accessList });
});

const handleGetPositionById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const positionData = await getDocumentById(
    Position,
    req.params.id,
    "Position",
    access
  );

  res.json(positionData);
});

const handleCreatePosition = AsyncHandler(async (req, res) => {
  const newPosition = await createNewDocument(Position, req.body, "Position");

  res.json({ success: true }, newPosition);
});

const handleUpdatePositionById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find(a => a.actionCode === "update")
  const updatedPosition = await updateDocumentById(
    Position,
    req.params.id,
    req.body,
    "Position",
    access
  );

  res.json({ success: true, updatedPosition });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetPositionList,
  handleGetPositionById,
  handleCreatePosition,
  handleUpdatePositionById,
  handleGetSwagger,
};
