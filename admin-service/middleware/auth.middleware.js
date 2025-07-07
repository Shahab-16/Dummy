const jwt = require("jsonwebtoken");

exports.protectedAdmin = (req, res, next) => {
  const token = req.cookies.adminToken;
  console.log("Printing token in auth middleware", token);
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};

module.exports = exports;
