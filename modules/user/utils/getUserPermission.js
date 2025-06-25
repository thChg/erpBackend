const { getCache, setCache } = require("../../../masterPage/utils/cacheUtils");
const User = require("../models/User");

const getUserPermission = async (user) => {
    const {username} = user;
    const userPermissions = await getCache(`user:permissions:${username}`);
    if (userPermissions) {
        return userPermissions.permissions;
    }

    const userData = await User.findOne({ username }).populate("role");
    if (!userData) {
        throw new Error("User not found");
    }

    await setCache(`user:permissions:${username}`, {
        role: userData.role.role,
        apartment: userData.apartment,
        permissions: userData.role.permissions,
    })

    return userData.role.permissions;
}

module.exports = getUserPermission;