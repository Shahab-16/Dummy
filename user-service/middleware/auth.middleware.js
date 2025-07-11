const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.protectUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Handle both "Bearer <token>" and raw "<token>"
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader; // raw token
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user=user;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
