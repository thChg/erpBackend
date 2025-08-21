const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    policyName: { type: DATA_TYPE.STRING, required: true, unique: true },

    serviceId: { type: DATA_TYPE.ID, required: true },
    serviceCode: { type: DATA_TYPE.STRING, required: true },
    serviceName: { type: DATA_TYPE.STRING, required: true },

    actionCode: { type: DATA_TYPE.STRING, required: true },
    method: { type: DATA_TYPE.STRING, required: true },
    path: { type: DATA_TYPE.STRING, required: true },

    functionId: { type: DATA_TYPE.ID, required: true },
    functionName: { type: DATA_TYPE.STRING, required: true },
    functionUrl: { type: DATA_TYPE.STRING, required: true },

    recordFeatureList: {
      type: DATA_TYPE.ARRAY,
      sharp: [
        {
          featureName: DATA_TYPE.STRING,
          type: DATA_TYPE.STRING,
          operator: DATA_TYPE.STRING,
          isUserFeature: DATA_TYPE.BOOLEAN,
          featureValue: [DATA_TYPE.STRING],
        },
      ],
    },
    apiFeatureList: {
      type: DATA_TYPE.ARRAY,
      sharp: [
        {
          featureName: DATA_TYPE.STRING,
          type: DATA_TYPE.STRING,
          operator: DATA_TYPE.STRING,
          isUserFeature: DATA_TYPE.BOOLEAN,
          featureValue: [DATA_TYPE.STRING],
        },
      ],
    },
    userFeatureList: {
      type: DATA_TYPE.ARRAY,
      sharp: {
        featureName: DATA_TYPE.STRING,
        operator: DATA_TYPE.STRING,
        featureValue: [DATA_TYPE.STRING],
      },
    },
  },

  apiList: API_LIST.CRUD,
};

const policySchema = new mongoose.Schema(model.data, { timestamps: true });
const Policy = mongoose.model("Policy", policySchema);

module.exports = { Policy, model };
