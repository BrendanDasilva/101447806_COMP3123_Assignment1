require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "password123";

// Middleware
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/comp3123_assigment1")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const userRoutes = require("./routes/user");
app.use("/api/v1/user", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
