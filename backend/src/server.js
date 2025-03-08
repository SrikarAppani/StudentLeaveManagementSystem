const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes.js");
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();
app.use(express.json())
app.use(cors());
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("MERN App Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
