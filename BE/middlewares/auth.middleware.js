const jwt = require("jsonwebtoken");
const Member = require("../models/member.model");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "You need to log in to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Member.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User does not exist." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ middleware NOT requiring login (assign req.user if available)
exports.verifyTokenIfExists = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Member.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (err) {
    }
  }

  next();
};