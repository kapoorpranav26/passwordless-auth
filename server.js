require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// JSON BODY PARSER
app.use(express.json());

// DB
connectDB();

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
