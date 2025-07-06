const mongoose = require("mongoose");
const axios = require("axios");

const PRODUCT_SERVICE_URL = "http://localhost:5003/api/products";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [cartItemSchema]
});

// ✅ Define method properly here
userSchema.methods.populateCartDetails = async function () {
  const user = this;

  if (!user.cart.length) return user;

  try {
    const productIds = user.cart.map(item => item.productId);

    const response = await axios.get(PRODUCT_SERVICE_URL, {
      params: { ids: productIds.join(',') }
    });

    const products = response.data.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});

    user.cart = user.cart.map(item => ({
      ...item.toObject(),
      product: products[item.productId] || null
    }));

    return user;

  } catch (error) {
    console.error("Error populating cart:", error.message);
    return user; // fallback
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
