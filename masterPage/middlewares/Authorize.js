const AsyncHandler = require("express-async-handler");
const produceAndConsume = require("../rabbitmq/produceAndConsume");
const { Access } = require("../../modules/system/models/AccessModel");
const { getCache } = require("../helpers/cacheHelper");
const { User } = require("../../modules/system/models/UserModel");

const Authorize = AsyncHandler(async (req, res, next) => {
  const clientPath = req.query.clientPath;
  const method = req.method;
  const { username } = req.user;

  const servicePathArr = String(req.path).split("/");
  const serviceName = servicePathArr.slice(1, 3).join("/");
  const service = servicePathArr[1];

  const clientPathArr = String(clientPath).split("/");

  const functionName = clientPathArr[2];
  const navigationPath = clientPathArr.slice(0, 3).join("/");
  const auxiliaryPath = "/" + clientPathArr.slice(3).join("/");

  const accessList = await getAccessList(
    username,
    navigationPath,
    service,
    serviceName
  );

  req.accessList = accessList;
  next();
});

const getAccessList = async (username, functionUrl, service, serviceName) => {
  if (service === "system") {
    const accessList = await Access.find({ username, functionUrl, serviceName })
      .select(
        "username actionCode serviceName functionUrl recordFeatureList apiFeatureList"
      )
      .lean();
    const user = await User.findOne({ username });

    const data = {};
    data.roleList = user.roleList.map((r) => r.roleId);
    data.companyList = user.companyList.map((c) => c.companyId);
    data.companyCEOId = user.companyCEOId;
    data.departmentList = user.departmentList.map((d) => d.departmentId);
    data.departmentManagerId = user.departmentManagerId;
    data.functionList = user.functionList.map((f) => f.functionId);
    data.moduleList = user.moduleList.map((m) => m.moduleId);

    const normalizedAccessList = accessList.map((a) => {
      const recordFeatureList = a.recordFeatureList.map((rf) => {
        if (rf.isUserFeature) {
          return { ...rf, featureValue: data[rf.featureValue] };
        }
        return rf;
      });
      const apiFeatureList = a.apiFeatureList.map((rf) => {
        if (rf.isUserFeature) {
          return { ...rf, featureValue: data[rf.featureValue] };
        }
        return rf;
      });
      return { ...a, recordFeatureList, apiFeatureList };
    });

    return normalizedAccessList;
  } else {
    const accessList = await produceAndConsume("access.list", {
      username,
      functionUrl,
      serviceName,
    });

    return accessList;
  }
};

module.exports = Authorize;
