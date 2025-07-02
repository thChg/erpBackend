const AsyncHandler = require("express-async-handler");
const moment = require("moment");
const getUserPermission = require("../utils/getUserPermission");
const Customer = require("../models/Customer");
const {
  onUserCreate,
  onManyUserCreate,
} = require("../producers/userRegisterProducer");
const Role = require("../models/Role");
const User = require("../models/User");
const { onManyUserDelete } = require("../producers/userDeleteProducer");
const { generatePdf } = require("../../../masterPage/functions/generatePdf");

const getCustomerList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:view]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const customers = await Customer.find({}).skip(skip).limit(limit);

  const totalCustomers = await Customer.countDocuments({});
  res.json({ customers, totalCustomers });
});

const createCustomer = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const { fullname, password, email, company, phone } = req.body;
  const existingCustomer = await User.findOne({ username: email });

  if (existingCustomer) {
    res.status(400);
    throw new Error("Email already used!");
  }

  await Customer.create({
    fullname: fullname,
    email: email,
    company: company,
    phone: phone,
  });

  const { _id } = await Role.findOne({ role: "customer" });

  await User.create({ username: email, role: _id });

  await onUserCreate({ username: email, password: password });

  res.json({
    success: true,
    message: `Customer ${fullname} created successfully`,
  });
});

const deleteManyCustomer = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:delete]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const customerIds = req.body;

  const usernames = await Promise.all(
    customerIds.map(async (id) => {
      const { email } = await Customer.findByIdAndDelete(id);
      await User.findOneAndDelete({ username: email });
      return email;
    })
  );

  onManyUserDelete(usernames);

  res.json({
    success: true,
    message: `Customers deleted successfully`,
  });
});

const createManyCustomer = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const data = req.excelData;

  const { _id } = await Role.findOne({ role: "customer" });

  const newAccounts = await Promise.all(
    data.map(async (customer) => {
      const { fullname, password, company, email, phone } = customer;

      const existingUser = await User.findOne({
        $or: [{ username: email }, { phone: phone }],
      });
      if (existingUser) {
        res.status(401);
        throw new Error(`Email: ${email} or Phone number: ${phone} used`);
      }

      await Customer.create({ fullname, company, email, phone });
      await User.create({ username: email, role: _id });
      return { username: email, password };
    })
  );

  await onManyUserCreate(newAccounts);

  res.json({
    success: true,
    message: `Customers created successfully`,
  });
});

const printCustomerList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:print]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const body = req.body;

  const data = await Promise.all(
    body.map(async (customerId, index) => {
      const customer = await Customer.findById(customerId).select(
        "fullname email company phone"
      );
      return { ...customer.toObject(), num: index + 1 };
    })
  );

  const pdf = await generatePdf("CustomerList.html", {
    time: moment(new Date()).format("MMMM Do YYYY"),
    customers: data,
  });

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

const getCustomerData = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:export]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const body = req.body;

  const customers = await Promise.all(
    body.map(
      async (customerId) =>
        await Customer.findById(customerId).select(
          "fullname company email phone"
        )
    )
  );

  res.json(customers);
});

module.exports = {
  getCustomerList,
  createCustomer,
  deleteManyCustomer,
  createManyCustomer,
  printCustomerList,
  getCustomerData,
};
