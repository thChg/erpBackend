const {
  assertToQueue,
  assertManyToQueue,
} = require("../../../masterPage/rabbitmq/producer");

const onUserCreate = async (user) => {
  await assertToQueue("auth:register", user);
};

const onManyUserCreate = async (users) => {
  await assertManyToQueue("auth:register", users);
};

module.exports = { onUserCreate, onManyUserCreate };
