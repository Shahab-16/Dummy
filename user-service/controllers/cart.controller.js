const User = require("../models/user.model");
const axios = require("axios");

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

exports.addToCart = async (req, res) => {
  try {
    console.log("Inside addtocart in user service and the data are", req.body);

    const { productId, userId, quantity } = req.body;

    // 1. Verify product exists AND check available quantity
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
    if (!productResponse.data) {
      return res.status(404).json({ message: "Product not found" });
    }

    const availableQty = productResponse.data.availableQuantity;
    if (availableQty < quantity) {
      return res.status(400).json({
        message: `Only ${availableQty} items available`
      });
    }

    // 2. Get user and update cart
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cart.items.find(item =>
      item.productId.toString() === productId
    );

    if (existingItem) {
      const newTotalQty = existingItem.quantity + quantity;
      if (availableQty < newTotalQty) {
        return res.status(400).json({
          message: `Only ${availableQty} items available (you already have ${existingItem.quantity} in cart)`
        });
      }
      existingItem.quantity = newTotalQty;
    } else {
      user.cart.items.push({ productId, quantity }); // ✅ now quantity is defined
    }

    await user.save();

    res.json({
      success: true,
      message: "Product added to cart",
      cart: user.cart
    });

  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    console.log("i m inside remove from cart and the data are", req.body);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart.items = user.cart.items.filter(
      item => item.productId.toString() !== productId
    );
    
    await user.save();
    
    res.json({ 
      success: true,
      message: "Product removed from cart" 
    });
    
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Failed to remove from cart", error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, userId } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Verify available quantity
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}/inventory`);
    if (productResponse.data.availableQuantity < quantity) {
      return res.status(400).json({ 
        message: `Only ${productResponse.data.availableQuantity} items available` 
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cart.items.find(
      item => item.productId.toString() === productId
    );
    
    if (!cartItem) {
      return res.status(404).json({ message: "Item not in cart" });
    }
    
    cartItem.quantity = quantity;
    await user.save();
    
    res.json({ 
      success: true,
      message: "Cart updated"
    });
    
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    console.log("Inside getcart in user service and the data are", req.params.userId);
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: 'cart.items.productId',
      select: 'name price images'
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify availability for each product
    const cartWithAvailability = await Promise.all(
      user.cart.items.map(async (item) => {
        try {
          const response = await axios.get(`${PRODUCT_SERVICE_URL}/${item.productId._id}`);
          return {
            ...item.toObject(),
            available: response.data.availableQuantity >= item.quantity
          };
        } catch {
          return {
            ...item.toObject(),
            available: false
          };
        }
      })
    );

    res.json({ 
      success: true,
      cart: {
        items: cartWithAvailability,
        totalItems: user.cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to get cart", error: error.message });
  }
};