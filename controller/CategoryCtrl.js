const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Category = require("../model/Category");
const categoryController = {
  create: async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) throw new Error("Name and type required");
    const normalizeName = name.toLowerCase();
    //chacek if type is valid
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid category type" + type);
    }
    //check if category already exits on the user
    const categoryExits = Category.findOne({
      name: normalizeName,
      user: req.user,
    });
    if (categoryExits) {
      throw new Error(
        `Category ${categoryExits.name} already exits in the database`
      );
    }
    const category = await Category.create({
      name: normalizeName,
      user: req.user,
      type,
    });
    res.status(201).json(category);
  },

  list: async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  },

  //profile
  update: async (req, res) => {},
  delete: async (req, res) => {},
};

module.exports = categoryController;
