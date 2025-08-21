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
  if (!permissions.includes("[community:view]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const accessList = req.accessList.map((a) => a.actionCode);
  const access = req.accessList.find((a) => a.actionCode === "getList");

  const vendors = await Vendor.find({}).skip(skip).limit(limit);

  const totalVendors = await Vendor.countDocuments({});
  res.json({ vendors, totalVendors });
});

const createVendor = AsyncHandler(async (req, res) => {
  const user = req.user;

  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const { name, email, address, phone, taxId } = req.body;
  const existingVendor = await Vendor.findOne({ name: name });

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

  res.json({
    success: true,
    message: `Vendor ${name} created successfully`,
  });
});

const deleteManyVendor = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:delete]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const vendorIds = req.body;

  await Promise.all(
    vendorIds.map(async (id) => {
      await Vendor.findByIdAndDelete(id);
    })
  );

  res.json({
    success: true,
    message: `Vendors deleted successfully`,
  });
});

const createManyVendor = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:create]")) {
    res.status(401);
    throw new Error("You are not authorized to this resource");
  }

  const data = req.excelData;

  await Promise.all(
    data.map(async (vendor) => {
      const { name, address, email, phone, taxId } = vendor;

      const existingVendor = await Vendor.findOne({
        $or: [{ name: name }, { phone: phone }],
      });
      if (existingVendor) {
        res.status(401);
        throw new Error(`Vendor name ${name} or Phone number: ${phone} used`);
      }

      await Vendor.create({ name, address, email, phone, taxId });
    })
  );

  res.json({
    success: true,
    message: `Vendors created successfully`,
  });
});

const printVendorList = AsyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = await getUserPermission(user);
  if (!permissions.includes("[community:print]")) {
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
  if (!permissions.includes("[community:export]")) {
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
