const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

dotenv.config();

const studentRoutes = require("./routes/studentRoutes.js");
const facultyRoutes = require("./routes/facultyRoutes.js");

connectDB();

const app = express();
app.use(express.json())
app.use(cors());
app.use("/assets", express.static("assets"));
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);

app.get("/", (req, res) => {
  res.send("MERN App Backend Running...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
