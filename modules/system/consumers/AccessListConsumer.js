const { setCache } = require("../../../masterPage/helpers/cacheHelper");
const consumeAndProduce = require("../../../masterPage/rabbitmq/consumeAndProduce");
const { Access } = require("../models/AccessModel");
const { User } = require("../models/UserModel");

const AccessListConsumer = async () => {
  await consumeAndProduce("access.list", async (msg) => {
    const { username, functionUrl, serviceName } = msg;
    const accessList = await Access.find({
      username,
      functionUrl,
      serviceName,
    })
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
    console.log(accessList);
    return normalizedAccessList;
  });
};

module.exports = { AccessListConsumer };
