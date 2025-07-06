const jwt = require("jsonwebtoken");

exports.protectUser = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  // Handle token from 'Authorization' header
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      // Format: "Bearer <token>"
      token = authHeader.split(" ")[1];
    } else {
      // Format: "<token>" (no 'Bearer' prefix)
      token = authHeader;
    }
  }

  // Fallback: try to read token from cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }


  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
