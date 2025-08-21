const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    username: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
    password: { type: DATA_TYPE.STRING },
    fullname: { type: DATA_TYPE.STRING },
    email: { type: DATA_TYPE.STRING, unique: true },
    phone: { type: DATA_TYPE.STRING },
    roleList: [
      {
        roleId: { type: DATA_TYPE.ID },
        roleCode: { type: DATA_TYPE.STRING },
        roleName: { type: DATA_TYPE.STRING },
        functionList: [
          {
            functionId: { type: DATA_TYPE.ID },
            functionName: { type: DATA_TYPE.STRING },
            functionUrl: { type: DATA_TYPE.STRING },
            functionOrder: { type: DATA_TYPE.NUMBER },

            parentId: { type: DATA_TYPE.ID },
            parentName: { type: DATA_TYPE.STRING },
            parentUrl: { type: DATA_TYPE.STRING },
            parentOrder: { type: DATA_TYPE.NUMBER },

            moduleId: { type: DATA_TYPE.ID },
            moduleName: { type: DATA_TYPE.STRING },
            moduleCode: { type: DATA_TYPE.STRING },
            moduleOrder: { type: DATA_TYPE.NUMBER },
          },
        ],
      },
    ],
    functionList: [
      {
        functionId: { type: DATA_TYPE.ID },
        functionName: { type: DATA_TYPE.STRING },
        functionUrl: { type: DATA_TYPE.STRING },
        functionOrder: { type: DATA_TYPE.NUMBER },

        parentId: { type: DATA_TYPE.ID },
        parentName: { type: DATA_TYPE.STRING },
        parentUrl: { type: DATA_TYPE.STRING },
        parentOrder: { type: DATA_TYPE.NUMBER },

        moduleId: { type: DATA_TYPE.ID },
        moduleName: { type: DATA_TYPE.STRING },
        moduleCode: { type: DATA_TYPE.STRING },
        moduleOrder: { type: DATA_TYPE.NUMBER },
      },
    ],
    moduleList: [
      {
        moduleId: { type: DATA_TYPE.ID },
        moduleName: { type: DATA_TYPE.STRING },
        moduleCode: { type: DATA_TYPE.STRING },
        moduleOrder: { type: DATA_TYPE.NUMBER },
      },
    ],
    departmentList: [
      {
        departmentId: { type: DATA_TYPE.ID },
        departmentCode: { type: DATA_TYPE.STRING },
        departmentName: { type: DATA_TYPE.STRING },

        companyId: { type: DATA_TYPE.ID },
        companyCode: { type: DATA_TYPE.STRING },
        companyName: { type: DATA_TYPE.STRING },

        positionId: { type: DATA_TYPE.ID },
        positionCode: { type: DATA_TYPE.STRING },
        positionName: { type: DATA_TYPE.STRING },
      },
    ],
    departmentManagerId: [{ type: DATA_TYPE.ID }],
    companyList: [
      {
        companyId: { type: DATA_TYPE.ID },
        companyCode: { type: DATA_TYPE.STRING },
        companyName: { type: DATA_TYPE.STRING },
      },
    ],
    companyCEOId: [{ type: DATA_TYPE.ID }],
  },

  apiList: API_LIST.CRUD,
};

const userSchema = new mongoose.Schema(model.data, { timestamps: true });
const User = mongoose.model("User", userSchema);

module.exports = { model, User };
