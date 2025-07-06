const jwt = require("jsonwebtoken");

exports.protectUser = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, role: "user" };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.protectAdmin = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // In real app, check if user has admin role
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.user = { _id: decoded.id, role: "admin" };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};