const express = require("express");
const userController = require("../controller/usersCtrl");
const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

// Register route
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", isAuthenticated, userController.profile);
router.put("/changePassword", isAuthenticated, userController.changePassword);
router.put("/updateProfile", isAuthenticated, userController.updateProfile);

// Add additional routes for login and profile when implemented in userController

module.exports = router;
