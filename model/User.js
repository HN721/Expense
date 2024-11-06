const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, // Keep this required but remove unique
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
