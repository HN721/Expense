const express = require("express");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/UserRoutes");
const CategoryRoute = require("./routes/CategoryRoute");
const TransactionRoute = require("./routes/TransactionsRoute");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const PORT = process.env.PORT || 3000;
// YgW0HsXSTutIG8GH
// Middleware

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hosea1422:YgW0HsXSTutIG8GH@cluster0.2grzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
//Route
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/", UserRoutes);
app.use("/", CategoryRoute);
app.use("/", TransactionRoute);

//ERROR HANDLER
app.use(errorHandler);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
