const produceAndConsume = require("../../../masterPage/rabbitmq/produceAndConsume");
const { getCache } = require("../../../masterPage/utils/cacheUtils");

const getUserPermissions = async (user) => {
  const permissions = await getCache(`user:permissions:${user.username}`);
  console.log(`user's permissions: ${permissions}`);
  if (permissions) {
    return permissions;
  }
  console.log("No cached permission, querying via RabbitMQ...");
  const message = await produceAndConsume(`user.permissions`, user.username);

  console.log(`user's permissions from queue: ${JSON.stringify(message)}`);
  return message;
};

module.exports = getUserPermissions;
