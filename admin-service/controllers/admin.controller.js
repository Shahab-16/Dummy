const jwt = require('jsonwebtoken');
const axios = require('axios');
const {
  publishProductCreated,
  publishProductDeleted,
} = require("../events/publisher");


const admins = [
  { email: "shahab@gmail.com", password: "12345678", name: "Shahab" },
  { email: "damodar@gmail.com", password: "12345678", name: "Damodar" },
  { email: "arsalan@gmail.com", password: "12345678", name: "Arsalan" },
];

// PRODUCT_SERVICE config
const PRODUCT_SERVICE_URL = "http://localhost:5003/api/products";

exports.login = (req, res) => {
  const { email, password } = req.body;
  const admin = admins.find(a => a.email === email && a.password === password);
  
  if (!admin) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ email: admin.email, name: admin.name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("adminToken", token, { httpOnly: true }).json({
    message: "Login successful",
    admin: { email: admin.email, name: admin.name, token },
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

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const token = req.cookies.adminToken;
    console.log('token', token);
    const response = await axios.post(PRODUCT_SERVICE_URL, req.body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('products are', response.data);

    await publishProductCreated(response.data);

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: 'Product service error' };
    res.status(status).json(data);
  }
};

// Remove product
exports.removeProduct = async (req, res) => {
  try {
    const token = req.cookies.adminToken;
    const { id } = req.params;
    const response = await axios.delete(`${PRODUCT_SERVICE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // ✅ Publish delete event to RabbitMQ
    await publishProductDeleted(id);
    
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: 'Product service error' };
    res.status(status).json(data);
  }
};

// List all products
exports.listAllProducts = async (req, res) => {
  try {
    const response = await axios.get(PRODUCT_SERVICE_URL);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: 'Product service error' };
    res.status(status).json(data);
  }
};