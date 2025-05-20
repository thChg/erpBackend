const { DATA_TYPE } = require("../../../constants/DataType");
const mongoose = require("../../../masterPage/config/sharedMongoose");

const PermissionSchema = mongoose.Schema(
  {
    name: {
      type: DATA_TYPE.STRING,
      required: true,
      unique: true,
    },
  },
  { collection: "permissions" }
);

module.exports = mongoose.model("Permission", PermissionSchema);
