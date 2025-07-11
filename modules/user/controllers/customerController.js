const AsyncHandler = require("express-async-handler");
const moment = require("moment");
const getUserPermission = require("../utils/getUserPermission");
const Customer = require("../models/Customer");
const { generatePdf } = require("../../../masterPage/functions/generatePdf");

const getCustomerList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:view]")) {
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
  if (!permissions.includes("[community:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const { fullname, email, phone } = req.body;
  const existingCustomer = await Customer.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (existingCustomer) {
    res.status(400);
    throw new Error("Email or phone number already used!");
  }

  await Customer.create({
    fullname: fullname,
    email: email,
    phone: phone,
  });

  res.json({
    success: true,
    message: `Customer ${fullname} created successfully`,
  });
});

const deleteManyCustomer = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:delete]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const customerIds = req.body;

  await Promise.all(
    customerIds.map(async (id) => {
      await Customer.findByIdAndDelete(id);
    })
  );

  res.json({
    success: true,
    message: `Customers deleted successfully`,
  });
});

const createManyCustomer = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const data = req.excelData;

  await Promise.all(
    data.map(async (customer) => {
      const { fullname, email, phone } = customer;

      const existingUser = await Customer.findOne({
        $or: [{ email: email }, { phone: phone }],
      });
      if (existingUser) {
        res.status(401);
        throw new Error(`Email: ${email} or Phone number: ${phone} used`);
      }

      await Customer.create({ fullname, email, phone });
    })
  );

  res.json({
    success: true,
    message: `Customers created successfully`,
  });
});

const printCustomerList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:print]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const body = req.body;

  const data = await Promise.all(
    body.map(async (customerId, index) => {
      const customer = await Customer.findById(customerId).select(
        "fullname email phone"
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
  if (!permissions.includes("[community:export]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const body = req.body;

  const customers = await Promise.all(
    body.map(
      async (customerId) =>
        await Customer.findById(customerId).select(
          "fullname email phone"
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
