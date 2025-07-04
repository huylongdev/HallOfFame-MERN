require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// ======= MongoDB =======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ======= Middleware =======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// ======= Routes =======
const authRoutes = require("./routes/auth.routes");
const memberRoutes = require("./routes/members.routes");
const teamRoutes = require("./routes/teams.routes");
const playerRoutes = require("./routes/player.routes");
const accountRoutes = require("./routes/accounts.routes");
const adminRoutes = require("./routes/admin.routes"); 


app.use("/api", authRoutes);
app.use("/api", memberRoutes);
app.use("/api/admin", teamRoutes);
app.use("/api", playerRoutes);
app.use("/api/admin", accountRoutes);
app.use("/api/admin/players", adminRoutes); // admin routes

module.exports = app;
