const AsyncHandler = require("express-async-handler");
const moment = require("moment");
const getUserPermission = require("../utils/getUserPermission");
const Vendor = require("../models/Vendor");
const {
  onUserCreate,
  onManyUserCreate,
} = require("../producers/userRegisterProducer");
const Role = require("../models/Role");
const User = require("../models/User");
const { onManyUserDelete } = require("../producers/userDeleteProducer");
const { generatePdf } = require("../../../masterPage/functions/generatePdf");

const getVendorList = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:view]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const vendors = await Vendor.find({}).skip(skip).limit(limit);

  const totalVendors = await Vendor.countDocuments({});
  res.json({ vendors, totalVendors });
});

const createVendor = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const { name, password, email, address, phone, taxId } = req.body;
  const existingVendor = await User.findOne({ username: email });

  if (existingVendor) {
    res.status(400);
    throw new Error("Email already used!");
  }

  await Vendor.create({
    name: name,
    email: email,
    address: address,
    phone: phone,
    taxId: taxId,
  });

  const { _id } = await Role.findOne({ role: "vendor" });

  await User.create({ username: email, role: _id });

  await onUserCreate({ username: email, password: password });

  res.json({
    success: true,
    message: `Vendor ${name} created successfully`,
  });
});

const deleteManyVendor = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:delete]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const vendorIds = req.body;

  const usernames = await Promise.all(
    vendorIds.map(async (id) => {
      const { email } = await Vendor.findByIdAndDelete(id);
      await User.findOneAndDelete({ username: email });
      return email;
    })
  );

  onManyUserDelete(usernames);

  res.json({
    success: true,
    message: `Vendors deleted successfully`,
  });
});

const createManyVendor = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const data = req.excelData;

  const { _id } = await Role.findOne({ role: "vendor" });

  const newAccounts = await Promise.all(
    data.map(async (vendor) => {
      const { name, password, address, email, phone, taxId } = vendor;

      const existingUser = await User.findOne({
        $or: [{ username: email }, { phone: phone }],
      });
      if (existingUser) {
        res.status(401);
        throw new Error(`Email: ${email} or Phone number: ${phone} used`);
      }

      await Vendor.create({ name, address, email, phone, taxId });
      await User.create({ username: email, role: _id });
      return { username: email, password };
    })
  );

  await onManyUserCreate(newAccounts);

  res.json({
    success: true,
    message: `Vendors created successfully`,
  });
});

const printVendorList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:print]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const body = req.body;

  const data = await Promise.all(
    body.map(async (vendorId, index) => {
      const vendor = await Vendor.findById(vendorId).select(
        "name email address phone taxId"
      );
      return { ...vendor.toObject(), num: index + 1 };
    })
  );

  const pdf = await generatePdf("VendorList.html", {
    time: moment(new Date()).format("MMMM Do YYYY"),
    vendors: data,
  });

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

const getVendorData = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[people:export]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const body = req.body;

  const vendors = await Promise.all(
    body.map(
      async (vendorId) =>
        await Vendor.findById(vendorId).select("name email address phone taxId")
    )
  );

  res.json(vendors);
});

module.exports = {
  getVendorList,
  createVendor,
  deleteManyVendor,
  createManyVendor,
  printVendorList,
  getVendorData,
};
