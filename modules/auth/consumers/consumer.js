const authDeleteConsumer = require("./authDeleteConsumer");
const authUpdateConsumer = require("./authUpdateConsumer");

const consume = () => {
    authDeleteConsumer();
    authUpdateConsumer();
}

module.exports = consume;