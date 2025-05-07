const { assertToQueue } = require("../../masterPage/rabbitmq/producer")

const onUserRegister = async (message) => {
    await assertToQueue("user.register", message);
}

module.exports = {
    onUserRegister
}