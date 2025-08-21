const redisClient = require("../config/sharedRedis");

const setCache = async (key, value, expiration = 3600) => {
  try {
    await redisClient.set(
      JSON.stringify(key),
      JSON.stringify(value),
      "EX",
      expiration
    );
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

const getCache = async (key) => {
  try {
    const cachedValue = await redisClient.get(JSON.stringify(key));
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
};

const clearCache = async () => {
  try {
    await redisClient.flushall();
  } catch (error) {
    console.error("Error clearing cache", error);
  }
};

module.exports = { setCache, getCache, clearCache };
