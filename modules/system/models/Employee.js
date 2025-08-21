const { DATA_TYPE } = require("../../../constants/dataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    fullname: { type: DATA_TYPE.STRING, required: true, unique: true },
    email: { type: DATA_TYPE.STRING, required: true, unique: true },
    phone: { type: DATA_TYPE.STRING, required: true, unique: true },
    apartment: { type: DATA_TYPE.STRING, required: true },
  },
  { timestamps: true, collection: "employees" }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
