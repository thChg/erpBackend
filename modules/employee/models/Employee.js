const mongoose = require("../../../masterPage/config/sharedMongoose");
const { DATA_TYPE } = require("../../../constants/DataType");

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: DATA_TYPE.STRING, required: true },
    department: { type: DATA_TYPE.STRING, required: true },
    email: { type: DATA_TYPE.STRING, required: false },
    isActive: { type: DATA_TYPE.BOOLEAN, required: true },
    isRemote: { type: DATA_TYPE.BOOLEAN, required: true },
    isManager: { type: DATA_TYPE.BOOLEAN, required: true },
    hasOnboarded: { type: DATA_TYPE.BOOLEAN, required: true },
    isFullTime: { type: DATA_TYPE.BOOLEAN, required: true },
  },
  { timestamps: true, collection: "employees" }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
