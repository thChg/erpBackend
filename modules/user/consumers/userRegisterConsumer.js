const { consumeMessage } = require("../../../masterPage/rabbitmq/consumer")
const Role = require("../models/Role")
const User = require("../models/User")

const userRegisterConsumer = () => {
    consumeMessage("user.register", async (message) => {
        try {
            const role = await Role.findOne({ _id: message.role });
            if (!role) {
                console.log("Role not found:", message.role);
                return;
            }
    
            const newUser = await User.create({
                username: message.username,
                role: role,
                apartment: message.apartment,
            })
            console.log("User registered successfully:", newUser);

        } catch(error) {
            console.error(error);
        }
    })
}

module.exports = {
    userRegisterConsumer
}