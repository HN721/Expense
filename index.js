const express = require("express");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/UserRoutes");
const CategoryRoute = require("./routes/CategoryRoute");
const TransactionRoute = require("./routes/TransactionsRoute");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT;

//yQGsfeEmstknDh2t
// Middleware

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hosea1422:yQGsfeEmstknDh2t@tracker.khte6.mongodb.net/?retryWrites=true&w=majority&appName=Tracker"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
//Route
const corsOptions = {
  origin: "https://hn-tracstar.vercel.app", // allow this origin
  methods: "GET,POST,PUT,DELETE", // Allow required methods
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, // Specify allowed headers
};
app.use(cors(corsOptions));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self' https://vercel.live; object-src 'none';"
  );
  next();
});
app.use("/", UserRoutes);
app.use("/", CategoryRoute);
app.use("/", TransactionRoute);

//ERROR HANDLER
app.use(errorHandler);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
