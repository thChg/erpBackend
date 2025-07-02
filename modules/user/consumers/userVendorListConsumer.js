const consumeAndProduce = require("../../../masterPage/rabbitmq/consumeAndProduce");
const { setCache } = require("../../../masterPage/utils/cacheUtils");
const User = require("../models/User");
const Role = require("../models/Role");
const Vendor = require("../models/Vendor");

const userVendorListConsumer = async () => {
  await consumeAndProduce("user.vendor-list", async (_) => {
    const vendorRoleId = await Role.findOne({ role: "vendor" });
    const users = await User.find({ role: vendorRoleId });
    const vendors = await Vendor.find();
    // Step 1: Create a map from user emails
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user.username, user);
    });

    // Step 2: Filter or enrich vendors
    const matchedVendors = vendors
      .filter((vendor) => userMap.has(vendor.email))
      .map((vendor) => {
        const user = userMap.get(vendor.email);
        return {
          ...vendor.toObject(),
          userId: user._id, // or any extra info you want to merge
          role: user.role,
        };
      });
    await setCache("vendor-list", vendors);

    return matchedVendors;
  });
};

module.exports = userVendorListConsumer;
