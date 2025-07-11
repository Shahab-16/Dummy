const mongoose = require('mongoose');
const Product = require('../models/product.model');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

exports.addProduct = async (req, res) => {
  try {
    console.log("Adding product...");
    const {
      name,
      description,
      price,
      category,
      subCategory,
      material,
      color,
      size,
      stockQuantity,
      brand,
      weight,
      dimensions,
      style,
      roomType,
      assemblyRequired,
      warrantyPeriod,
      careInstructions,
      isFeatured,
      isCustomizable,
      tags,
      returnPolicy,
      sku
    } = req.body;

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
        ? JSON.parse(tags || '[]')
        : [];

    if (!name || !description || !price || !category || !stockQuantity || !sku) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, description, price, category, stockQuantity, sku"
      });
    }

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU already exists"
      });
    }


    let imageUrls = [];
    if (req.files && req.files.image && req.files.image[0]) {
      const imageFile = req.files.image[0];
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: "products/images"
      });
      imageUrls.push(result.secure_url);

      if (fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path);
      }
    }

    let modelUrl = null;
    if (req.files && req.files.model && req.files.model[0]) {
      const modelFile = req.files.model[0];
      const result = await cloudinary.uploader.upload(modelFile.path, {
        resource_type: "raw",
        folder: "products/models"
      });
      modelUrl = result.secure_url;

      if (fs.existsSync(modelFile.path)) {
        fs.unlinkSync(modelFile.path);
      }
    }


    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      subCategory,
      material,
      color,
      size,
      stockQuantity: parseInt(stockQuantity),
      brand,
      weight: parseFloat(weight) || 0,
      dimensions,
      style,
      roomType,
      assemblyRequired: assemblyRequired === true || assemblyRequired === 'true',
      warrantyPeriod,
      careInstructions,
      isFeatured: isFeatured === true || isFeatured === 'true',
      isCustomizable: isCustomizable === true || isCustomizable === 'true',
      tags: parsedTags,
      returnPolicy: returnPolicy || "30 days return policy",
      sku,
      images: imageUrls,
      modelUrl,
      status: "active"
    });

    await newProduct.save();

    console.log("Product added successfully:", newProduct);
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });

  } catch (err) {
    console.error("Error in adding product:", err);
    return res.status(500).json({
      success: false,
      message: "Error in adding product",
      error: err.message
    });
  }
};



exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// controllers/productController.js
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// Add to existing product controller
// GET /products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({ _id: id, status: 'active' });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
