const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userController = {
  //register
  register: async (req, res) => {
    const { username, email, password } = req.body;
    //validdate
    if (!username || !email || !password) {
      throw new Error("Please all fields are required");
    }
    //checkif user exixts
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    //create user save to db
    const userCreated = await User.create({
      email,
      username,
      password: hashPass,
    });
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  },
  //login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if the user exists by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid Login credential" });
      }

      // Compare user password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Login credential" });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, "H122osea", { expiresIn: "2d" });
      return res.json({
        message: "Login Success",
        token,
        id: user._id,
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      // Optional: Add a catch block to handle any unexpected errors
      return res
        .status(500)
        .json({ message: "An error occurred during login" });
    }
  },

  //profile
  profile: async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) res.status(401).json({ message: "user NotFound" });
    res.json({ username: user.username, email: user.email });
  },
  changePassword: async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) res.status(400).json({ message: "User Not Found" });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(newPassword, salt);
    user.password = hashPass;
    //resave
    await user.save();
    res.json({ message: "Sucessfulyyy change password" });
  },
  updateProfile: async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({ message: "Sucessfully Update Profile", updatedUser });
  },
};

module.exports = userController;
