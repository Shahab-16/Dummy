const Category = require("../models/category.model");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name: name.toLowerCase() });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
