process.env.MONGODB_SUPPRESS_COMMON_WARNINGS = "true";

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
connectDB();

app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/taskRoutes"));

app.listen(process.env.PORT || 8000, () => console.log("Server is successfully running."));
