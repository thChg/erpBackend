const User = require("../models/User");
const consumeAndProduce = require("../../../masterPage/rabbitmq/consumeAndProduce");
const { setCache } = require("../../../masterPage/utils/cacheUtils");

const userPermissionHandler = () => {
  consumeAndProduce("user.permissions", async (message) => {
    //lay quyen
    const user = await User.findOne({ username: message }).populate({
      path: "role",
    });

    //vut vao redis
    await setCache(`user:permissions:${message}`, {
      role: user.role.role,
      apartment: user.apartment,
      permissions: user.role.permissions,
    });

    return { role: user.role.role, apartment: user.apartment };
  });
};

module.exports = userPermissionHandler;
