const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const transactionController = require("../controller/TransactionsCtrl");
const router = express.Router();

router.post("/transaksi/create", isAuthenticated, transactionController.create);
router.get("/transaksi/lists", isAuthenticated, transactionController.list);

// Add additional routes for login and profile when implemented in userController

module.exports = router;
