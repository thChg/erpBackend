const User = require("../models/User");
const consumeAndProduce = require("../../../masterPage/rabbitmq/consumeAndProduce");
const { setCache } = require("../../../masterPage/utils/cacheUtils");

const userDataHandler = () => {
  consumeAndProduce("user.data", async (message) => {
    //lay quyen
    const user = await User.findOne({ username: message }).populate({
      path: "role",
    });

    //vut vao redis
    await setCache(`user:data:${message}`, {
      _id: user._id,
      role: user.role.role,
      apartment: user.apartment,
      permissions: user.role.permissions,
    });

    return {
      _id: user._id,
      role: user.role.role,
      apartment: user.apartment,
      permissions: user.role.permissions,
    };
  });
};

module.exports = userDataHandler;
