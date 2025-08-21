const AsyncHandler = require("express-async-handler");
const _ = require("lodash");
const { Role, model } = require("../models/RoleModel");
const {
  getDocumentList,
  getDocumentById,
  createNewDocument,
  updateDocumentById,
  updateRelatedModel,
  generateSwagger,
} = require("../../../masterPage/helpers/controllerHelper");
const { User } = require("../models/UserModel");

const handleCreateRole = AsyncHandler(async (req, res) => {
  //check quyen

  const createdRole = await createNewDocument(Role, req.body);

  res.json({ success: true, createdRole });
});

const handleGetRoleList = AsyncHandler(async (req, res) => {
  //check quyen
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const { objectList, length } = await getDocumentList(
    skip,
    limit,
    Role,
    req.query,
    access
  );

  res.json({ objectList, length, accessList });
});

const handleGetRoleById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "getById");
  const roleData = await getDocumentById(Role, req.params.id, "Role", access);
  res.json(roleData);
});

const handleUpdateRoleById = AsyncHandler(async (req, res) => {
  const access = req.accessList.find((a) => a.actionCode === "update");
  const updatedRole = await updateDocumentById(
    Role,
    req.params.id,
    req.body,
    "Role",
    access
  );

  const roleIdToUpdate = updatedRole._id;
  const fieldsToSet = {
    "roleList.$[elem].roleCode": updatedRole.roleCode,
    "roleList.$[elem].roleName": updatedRole.roleName,
    "roleList.$[elem].functionList": updatedRole.functionList,
  };

  await User.updateMany(
    // Condition to find the parent documents
    { "roleList.roleId": roleIdToUpdate },
    // The `$set` operation using the placeholder
    { $set: fieldsToSet },
    // Options object containing the arrayFilters
    {
      arrayFilters: [
        // This filter defines 'elem' as the object inside roleList
        // that matches our roleIdToUpdate.
        { "elem.roleId": roleIdToUpdate },
      ],
    }
  );
  const users = await User.find({ "roleList.roleId": updatedRole._id }).lean();
  console.log("----------- FunctionList", users[0].roleList[0].functionList);
  const usersWithUniqueFunctions = users.map((u) => {
    const allFunctions = _.flatMap(u.roleList, "functionList");
    const uniqueFunctions = _.uniqBy(allFunctions, (f) => f.functionId);

    return {
      ...u,
      functionList: uniqueFunctions,
    };
  });
  // console.log(usersWithUniqueFunctions)
  const bulkOps = usersWithUniqueFunctions.map((u) => ({
    updateOne: {
      filter: { _id: u._id },
      update: { $set: { functionList: u.functionList } },
    },
  }));

  if (bulkOps.length) {
    await User.bulkWrite(bulkOps);
  }

  res.json({ success: true, updatedRole });
});

const handleGetSwagger = AsyncHandler(async (req, res) => {
  const swagger = generateSwagger(req, model);

  res.json(swagger);
});

module.exports = {
  handleCreateRole,
  handleGetRoleList,
  handleGetRoleById,
  handleUpdateRoleById,
  handleGetSwagger,
};
