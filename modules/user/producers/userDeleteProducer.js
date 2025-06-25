const { assertManyToQueue, assertToQueue } = require("../../../masterPage/rabbitmq/producer");

const onUserDelete = async (message) => {
  await assertToQueue("auth:delete", message)
}

const onManyUserDelete = async (messages) => {
  await assertManyToQueue("auth:delete", messages);
};

module.exports = { onUserDelete, onManyUserDelete };
