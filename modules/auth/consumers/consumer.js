const authDeleteConsumer = require("./authDeleteConsumer");
const authRegisterConsumer = require("./authRegisterConsumer");
const authUpdateConsumer = require("./authUpdateConsumer");

const consume = () => {
    authDeleteConsumer();
    authUpdateConsumer();
    authRegisterConsumer();
}

module.exports = consume;