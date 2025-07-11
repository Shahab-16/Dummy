const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  if (authHeader) {
    // Handle both "Bearer <token>" and raw "<token>"
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader; // raw token
    }
  }

  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
