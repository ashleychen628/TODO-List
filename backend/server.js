process.env.MONGODB_SUPPRESS_COMMON_WARNINGS = "true";

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const cors = require("cors");

const allowedOrigins = [
  /^http:\/\//, // for local dev
  "https://do-it-today-app.netlify.app",
  /^https:\/\/[\w-]+--do-it-today-app\.netlify\.app$/ 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some((o) => typeof o === "string" ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
connectDB();

app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/taskRoutes"));

app.listen(process.env.PORT || 8000, () => console.log("Server is successfully running."));
