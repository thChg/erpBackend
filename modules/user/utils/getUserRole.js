const User = require("../models/User");
const { setCache, getCache } = require("../../../masterPage/utils/cacheUtils");

const getUserRole = async (user) => {
  const { username } = user;
  const userPermissions = await getCache(`user:permissions:${username}`);
  if (userPermissions) {
    return userPermissions.role;
  }

  const userData = await User.findOne({ username }).populate({
    path: "role",
  });

  if (!userData) {
    throw new Error("User not found");
  }

  await setCache(`user:permissions:${username}`, {
    role: userData.role.role,
    apartment: userData.apartment,
    permissions: userData.role.permissions,
  });

  return userData.role.role;
};

module.exports = getUserRole;
