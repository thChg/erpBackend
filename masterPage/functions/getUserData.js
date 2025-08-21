const produceAndConsume = require("../rabbitmq/produceAndConsume");
const { getCache } = require("../utils/cacheHelper");

const getUserData = async (user) => {
  const data = await getCache(`user:data:${user.username}`);
  if (data) {
    return data;
  }
  console.log("No cached data, querying via RabbitMQ...");
  const message = await produceAndConsume(`user.data`, user.username);

  console.log(`user's data from queue: ${JSON.stringify(message)}`);
  return message;
};

module.exports = getUserData;
