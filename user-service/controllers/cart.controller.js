const User = require("../models/user.model");
const axios = require("axios");

const PRODUCT_SERVICE_URL = "http://localhost:5003/api/products";

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1,userId} = req.body;
    console.log(req.body);
    // Verify product exists in product service
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
    console.log(productResponse.data);
    if (!productResponse.data) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if product already in cart
    const existingItem = user.cart.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ productId, quantity });
    }

    await user.save();
    
    res.json({ 
      message: "Product added to cart", 
      cart: user.cart 
    });
    
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove item from cart
    user.cart = user.cart.filter(item => item.productId !== productId);
    
    await user.save();
    
    res.json({ 
      message: "Product removed from cart", 
      cart: user.cart 
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find and update item
    const cartItem = user.cart.find(item => item.productId === productId);
    
    if (!cartItem) {
      return res.status(404).json({ message: "Item not in cart" });
    }
    
    cartItem.quantity = quantity;
    await user.save();
    
    res.json({ 
      message: "Cart updated", 
      cart: user.cart 
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const populatedUser = await user.populateCartDetails(); // now call method on doc

    res.json({ cart: populatedUser.cart });

  } catch (error) {
    console.error("Error in getCart:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

{/*// Custom method to populate cart with product details
User.methods.populateCartDetails = async function() {
  const user = this;
  
  if (user.cart.length === 0) return user;
  
  try {
    // Get product IDs from cart
    const productIds = user.cart.map(item => item.productId);
    
    // Fetch products from product service
    const response = await axios.get(PRODUCT_SERVICE_URL, {
      params: { ids: productIds.join(',') }
    });
    
    const products = response.data.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});
    
    // Merge product details with cart items
    user.cart = user.cart.map(item => ({
      ...item.toObject(),
      product: products[item.productId] || null
    }));
    
    return user;
  } catch (error) {
    console.error("Error populating cart:", error);
    return user; // Return cart without product details
  }
};*/}