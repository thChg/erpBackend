const { DATA_TYPE } = require("../../../constants/DataType");
const {
  default: mongoose,
} = require("../../../masterPage/config/sharedMongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
    role: {
      type: DATA_TYPE.OBJECT_ID,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", UserSchema);
