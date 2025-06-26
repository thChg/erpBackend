const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
    access: [{ type: DATA_TYPE.OBJECT_ID, ref: "Menu" }],
    permissions: [{ type: DATA_TYPE.STRING }],
  },
  { timestamps: true, collection: "roles" }
);

module.exports = mongoose.model("Role", RoleSchema);
