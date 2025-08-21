const { API_LIST } = require("../../../constants/api");
const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const model = {
  data: {
    employeeCode: { type: DATA_TYPE.STRING, required: true, unique: true },
    employeeName: { type: DATA_TYPE.STRING, required: true, unique: true },
    employeePhone: { type: DATA_TYPE.STRING },
    employeeDateOfBirth: { type: DATA_TYPE.STRING },

    userId: { type: DATA_TYPE.ID },
    username: { type: DATA_TYPE.STRING },
    fullname: { type: DATA_TYPE.STRING },
    email: { type: DATA_TYPE.STRING },

    companyId: { type: DATA_TYPE.ID },
    companyCode: { type: DATA_TYPE.STRING },
    companyName: { type: DATA_TYPE.STRING },
    companyCEOUsername: { type: DATA_TYPE.STRING },
    companyCEOFullname: { type: DATA_TYPE.STRING },

    departmentId: { type: DATA_TYPE.ID },
    departmentCode: { type: DATA_TYPE.STRING },
    departmentName: { type: DATA_TYPE.STRING },
    managerUsername: { type: DATA_TYPE.STRING },
    managerFullname: { type: DATA_TYPE.STRING },

    positionId: { type: DATA_TYPE.ID },
    positionCode: { type: DATA_TYPE.STRING },
    positionName: { type: DATA_TYPE.STRING },

    titleId: { type: DATA_TYPE.ID },
    titleCode: { type: DATA_TYPE.STRING },
    titleName: { type: DATA_TYPE.STRING },

    grossSalary: { type: DATA_TYPE.NUMBER },
    travelAllowance: { type: DATA_TYPE.NUMBER },
    mealAllowance: { type: DATA_TYPE.NUMBER },
    kpiSalary: { type: DATA_TYPE.NUMBER },
  },

  apiList: API_LIST.CRUD,
};

const employeeSchema = new mongoose.Schema(model.data, { timestamps: true });
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { Employee, model };
