const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    policyId: { type: DATA_TYPE.ID },
    policyName: { type: DATA_TYPE.STRING, canQuery: true, clickable: true },

    userId: { type: DATA_TYPE.ID },
    username: { type: DATA_TYPE.STRING, canQuery: true },
    fullname: { type: DATA_TYPE.STRING },

    functionId: { type: DATA_TYPE.ID },
    functionName: { type: DATA_TYPE.STRING },
    functionUrl: { type: DATA_TYPE.STRING, canQuery: true },

    serviceId: { type: DATA_TYPE.ID },
    serviceCode: { type: DATA_TYPE.STRING, required: true },
    serviceName: { type: DATA_TYPE.STRING, required: true },

    actionCode: { type: DATA_TYPE.STRING },
    method: { type: DATA_TYPE.STRING, required: true },
    path: { type: DATA_TYPE.STRING, required: true },

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

  apiList: API_LIST.R,
};

const accessSchema = new mongoose.Schema(model.data, { timestamps: true });
const Access = mongoose.model("Access", accessSchema);

module.exports = { Access, model };
