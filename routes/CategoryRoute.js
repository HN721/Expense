const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const categoryController = require("../controller/CategoryCtrl");

const router = express.Router();

router.post("/categories/create", isAuthenticated, categoryController.create);
router.get("/categories/lists", isAuthenticated, categoryController.list);

// Add additional routes for login and profile when implemented in userController

module.exports = router;
