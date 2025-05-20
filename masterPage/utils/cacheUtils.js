const redisClient = require("../config/sharedRedis");

const setCache = async (key, value, expiration = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", expiration);
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

const getCache = async (key) => {
  try {
    const cachedValue = await redisClient.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
};

module.exports = { setCache, getCache };
