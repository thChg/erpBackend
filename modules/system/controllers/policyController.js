const AsyncHandler = require("express-async-handler");
const _ = require("lodash");
const {
  getDocumentList,
  createNewDocument,
  getDocumentById,
  generateSwagger,
  generateQuery,
} = require("../../../masterPage/helpers/controllerHelper");
const { Policy, model } = require("../models/PolicyModel");
const { User } = require("../models/UserModel");
const { Access } = require("../models/AccessModel");
const handleGetPolicyList = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Policy,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleCreatePolicy = AsyncHandler(async (req, res) => {
  const { userFeatureList } = req.body;

  const newPolicy = await createNewDocument(Policy, req.body, "Policy");

  // Use the spread syntax to combine the elements of all three arrays
  const userFeatureQuery = [...userFeatureList];
  const query = generateQuery(userFeatureQuery);
  const users = await User.find(query);

  const accessDocs = users.map((u) => ({
    policyId: newPolicy._id,
    policyName: newPolicy.policyName,

    userId: u._id,
    username: u.username,
    fullname: u.username,

    functionId: newPolicy.functionId,
    functionName: newPolicy.functionName,
    functionUrl: newPolicy.functionUrl,

    serviceId: newPolicy.serviceId,
    serviceCode: newPolicy.serviceCode,
    serviceName: newPolicy.serviceName,

    actionCode: newPolicy.actionCode,
    method: newPolicy.method,
    path: newPolicy.path,

    recordFeatureList: newPolicy.recordFeatureList,
    apiFeatureList: newPolicy.apiFeatureList,
    userFeatureList: newPolicy.userFeatureList,
  }));

  await Access.insertMany(accessDocs);

  res.json({ success: true, newPolicy });
});

const handleGetPolicyById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const policyData = await getDocumentById(
    Policy,
    req.params.id,
    "Policy",
    access
  );

  res.json(policyData);
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleGetPolicyList,
  handleCreatePolicy,
  handleGetPolicyById,
  handleGetSwagger,
};
