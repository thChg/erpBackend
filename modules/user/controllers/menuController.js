const AsyncHandler = require("express-async-handler");
const Menu = require("../models/Menu");
const User = require("../models/User");
const getUserRole = require("../utils/getUserRole");

const addToMenu = AsyncHandler(async (req, res) => {
  const user = req.user;

  const role = await getUserRole(user);
  if (role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to perform this action");
  }

  const { pageName, subMenu } = req.body;

  if (!pageName) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if the page already exists
  const existingPage = await Menu.findOne({ pageName });
  if (existingPage) {
    res.status(400);
    throw new Error("Page already exists");
  }

  // Create a new page
  const newPage = await Menu.create({ menu: pageName, subMenu: subMenu });
  if (!newPage) {
    res.status(400);
    throw new Error("Failed to create page");
  }

  res.json({
    status: "success",
    message: "Page created successfully",
    data: newPage,
  });
});

module.exports = {
  addToMenu,
};
