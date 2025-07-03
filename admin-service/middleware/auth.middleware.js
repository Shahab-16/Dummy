const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};
