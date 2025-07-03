const jwt = require("jsonwebtoken");

const admins = [
  { email: "shahab@gmail.com", password: "12345678", name: "Shahab" },
  { email: "damodar@gmail.com", password: "12345678", name: "Damodar" },
  { email: "arsalan@gmail.com", password: "12345678", name: "Arsalan" },
];

exports.login = (req, res) => {
  const { email, password } = req.body;

  const admin = admins.find(
    (a) => a.email === email && a.password === password
  );

  if (!admin)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ email: admin.email, name: admin.name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("adminToken", token, { httpOnly: true }).json({
    message: "Login successful",
    admin: { email: admin.email, name: admin.name },
  });
};

exports.getAdminInfo = (req, res) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ admin: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("adminToken").json({ message: "Admin logged out" });
};
