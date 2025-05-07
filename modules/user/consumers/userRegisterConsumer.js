const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer")
const User = require("../models/User")

const userRegisterConsumer = () => {
    consumeMessage("user.register", async (message) => {
        const newUser = await User.create({
            username: message.username,
            role: message.role
        })
        console.log("User registered successfully:", newUser);
    })
}

module.exports = {
    userRegisterConsumer
}