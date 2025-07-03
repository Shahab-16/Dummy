const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

exports.postGoogleSignin = async (req, res) => {
  try {
    const { email, userName } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, userName, password: "google-oauth" });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Google login success", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.likedProducts.includes(productId)) {
      user.likedProducts.push(productId);
    } else {
      user.likedProducts = user.likedProducts.filter(
        (id) => id.toString() !== productId
      );
    }

    await user.save();
    res.status(200).json({ likedProducts: user.likedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getLikedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ likedProducts: user.likedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};