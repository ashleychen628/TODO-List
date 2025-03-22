require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Successfullly Connected to MongoDB")
    } catch (err) {
      // Handle specific error conditions
      if (err.name === 'MongoNetworkError') {
          console.error('Network error occurred. Check your MongoDB server.');
      } else if (err.name === 'MongooseServerSelectionError') {
          console.error('Server selection error. Ensure'
              + ' MongoDB is running and accessible.');
      } else {
          // Handle other types of errors
          console.error('An unexpected error occurred:', err);
      }
      process.exit(1);
    }
};

// Handling connection events
const db = mongoose.connection;

// db.on("error", (error) => {
//   console.error("MongoDB connection error:", error);
// });

// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Gracefully close the connection when the application exits
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection is disconnected due to application termination");
    process.exit(0);
  });
});

module.exports = connectDB;