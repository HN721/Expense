const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userController = {
  // Register
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        throw new Error("All fields are required");
      }

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error("User already exists");
      }

      // Hash the user's password
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      // Create user and save to database
      const userCreated = await User.create({
        email,
        username,
        password: hashPass,
      });

      res.status(201).json({
        username: userCreated.username,
        email: userCreated.email,
        id: userCreated._id,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid login credentials" });
      }

      // Compare user password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid login credentials" });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, "H122osea", { expiresIn: "2d" });
      return res.json({
        message: "Login successful",
        token,
        id: user._id,
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred during login" });
    }
  },

  // Profile
  profile: async (req, res) => {
    try {
      const user = await User.findById(req.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    try {
      const { newPassword } = req.body;
      const user = await User.findById(req.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPassword, salt);
      user.password = hashPass;

      // Save updated password
      await user.save();
      res.json({ message: "Password successfully changed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Profile
  updateProfile: async (req, res) => {
    try {
      const { email, username } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.user,
        { username, email },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile successfully updated", updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
