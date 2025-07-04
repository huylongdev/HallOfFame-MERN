const Member = require("../models/member.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register account
exports.register = async (req, res) => {
  try {
    const { membername, password, name, YOB } = req.body;
    const year = parseInt(YOB);

    const existingUser = await Member.findOne({ membername });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year > currentYear) {
      return res.status(400).json({ message: "Invalid year of birth." });
    }

    const newMember = new Member({
      membername,
      password,
      name,
      YOB,
    });

    await newMember.save();

    return res
      .status(201)
      .json({ message: "Registration successful! Please log in." });
  } catch (err) {
    return res.status(500).json({
      message: "Registration failed.",
      error: err.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { membername, password } = req.body;
    const member = await Member.findOne({ membername });

    if (!member) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      { id: member._id, isAdmin: member.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        membername: member.membername,
        isAdmin: member.isAdmin,
        _id: member._id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed.",
      error: err.message,
    });
  }
};