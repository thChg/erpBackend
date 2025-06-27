const AsyncHandler = require("express-async-handler");
const moment = require("moment");
const getUserPermission = require("../utils/getUserPermission");
const Employee = require("../models/Employee");
const {
  onUserCreate,
  onManyUserCreate,
} = require("../producers/userRegisterProducer");
const Role = require("../models/Role");
const User = require("../models/User");
const { onManyUserDelete } = require("../producers/userDeleteProducer");
const { generatePdf } = require("../../../masterPage/functions/generatePdf");

const getEmployeeList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:view]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const employees = await Employee.find({}).skip(skip).limit(limit);

  const totalEmployees = await Employee.countDocuments({});
  res.json({ employees, totalEmployees });
});

const createEmployee = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const { fullname, password, email, phone, apartment } = req.body;
  const existingEmployee = await User.findOne({ username: email });

  if (existingEmployee) {
    res.status(400);
    throw new Error("Email already used!");
  }
  try {
    await Employee.create({
      fullname: fullname,
      email: email,
      phone: phone,
      apartment: apartment,
    });
  } catch (error) {
    console.log(error);
  }

  const { _id } = await Role.findOne({ role: "employee" });

  await User.create({ username: email, role: _id });

  await onUserCreate({ username: email, password: password });

  res.json({
    success: true,
    message: `Employee ${fullname} created successfully`,
  });
});

const deleteManyEmployee = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:delete]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const employeeIds = req.body;

  const usernames = await Promise.all(
    employeeIds.map(async (id) => {
      const { email } = await Employee.findByIdAndDelete(id);
      await User.findOneAndDelete({ username: email });
      return email;
    })
  );

  onManyUserDelete(usernames);

  res.json({
    success: true,
    message: `Employees deleted successfully`,
  });
});

const createManyEmployee = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const data = req.excelData;

  const { _id } = await Role.findOne({ role: "employee" });

  const newAccounts = await Promise.all(
    data.map(async (employee) => {
      const { fullname, password, email, phone, apartment } = employee;

      const existingUser = await User.findOne({
        $or: [{ username: email }, { phone: phone }],
      });
      if (existingUser) {
        res.status(401);
        throw new Error(`Email: ${email} or Phone number: ${phone} used`);
      }

      await Employee.create({ fullname, password, email, phone, apartment });
      await User.create({ username: email, role: _id });
      return { username: email, password };
    })
  );

  await onManyUserCreate(newAccounts);

  res.json({
    success: true,
    message: `Employees created successfully`,
  });
});

const printEmployeeList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:print]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const body = req.body;

  const data = await Promise.all(
    body.map(async (employeeId, index) => {
      const employee = await Employee.findById(employeeId).select(
        "fullname password email phone apartment"
      );
      return { ...employee.toObject(), num: index + 1 };
    })
  );
  const pdf = await generatePdf("EmployeeList.html", {
    time: moment(new Date()).format("MMMM Do YYYY"),
    employees: data,
  });

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

const getEmployeeData = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:export]")) {
    res.status(401);
    throw new Error("You are not authorized to this resouce");
  }

  const body = req.body;

  const employees = await Promise.all(
    body.map(
      async (employeeId) =>
        await Employee.findById(employeeId).select(
          "fullname password email phone apartment"
        )
    )
  );

  res.json(employees);
});

module.exports = {
  getEmployeeList,
  createEmployee,
  deleteManyEmployee,
  createManyEmployee,
  printEmployeeList,
  getEmployeeData,
};
