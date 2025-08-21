const AsyncHandler = require("express-async-handler");
const {
  getDocumentById,
  createNewDocument,
  getDocumentList,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { Title, model } = require("../models/TitleModel");

const handleGetTitleList = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Title,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleGetTitleById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const titleData = await getDocumentById(
    Title,
    req.params.id,
    "Title",
    access
  );
  res.json(titleData);
});

const handleCreateTitle = AsyncHandler(async (req, res) => {
  const newTitle = await createNewDocument(Title, req.body, "Title");
  res.json({ success: true, newTitle });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetSwagger,
  handleGetTitleList,
  handleGetTitleById,
  handleCreateTitle,
};
