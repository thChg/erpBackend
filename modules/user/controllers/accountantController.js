const AsyncHandler = require("express-async-handler");
const Accountant = require("../models/Accountant");
const getUserPermission = require("../utils/getUserPermission");
const Role = require("../models/Role");
const { onUserCreate } = require("../producers/userRegisterProducer");
const User = require("../models/User");

const getAccountantList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);

  if (!permissions.includes("[employee:view]")) {
    res.status(401);
    throw new Error("you are not authorized to access this resource");
  }
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accountants = await Accountant.find({}).skip(skip).limit(limit);
  const totalAccountants = await Accountant.countDocuments();

  res.json({ accountants, totalAccountants });
});

const createAccountant = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);

  if (!permissions.includes("[employee:create]")) {
    res.status(401);
    throw new Error("you are not authorized to access this resource");
  }

  const { fullname, password, phone, email } = req.body;

  const existingUser = await User.findOne({ username: email });
  if (existingUser) {
    res.status(400);
    throw new Error(`Email ${email} has already been used`);
  }

  const role = await Role.findOne({ role: "accountant" });
  const newUser = await User.create({ username: email, role: role._id });

  await Accountant.create({
    fullname,
    phone,
    email,
    user: {
      _id: newUser._id,
      username: email,
      role: {
        _id: role._id,
        role: "accountant",
      },
    },
    role: { _id: role._id, role: role.role },
  });

  await onUserCreate({ username: email, password: password });

  res.json({ success: true, message: "New Accountant created successfully" });
});

module.exports = { getAccountantList, createAccountant };
