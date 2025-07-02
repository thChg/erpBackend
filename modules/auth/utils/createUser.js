const { hash } = require("bcrypt");
const Account = require("../models/Account");
const { onUserRegister } = require("../producers");

const createUser = async (username, password, role) => {
    try {
        const account = await Account.findOne({ username });
        if (account) {
          throw new Error("User already exists");
        }
        const hashedPassword = await hash(password, 10);
        const newAccount = await Account.create({
          username,
          password: hashedPassword,
        });
        await onUserRegister({ username, role });
        return newAccount;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

module.exports = createUser;
