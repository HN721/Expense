const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const categoryController = {
  create: async (req, res) => {
    const { username, email, password } = req.body;
  },
  //login
  list: async (req, res) => {},

  //profile
  update: async (req, res) => {},
  delete: async (req, res) => {},
};

module.exports = categoryController;
