const axios = require("axios");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  likedProducts: {
    type: [Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  models: {
    type: [
      {
        modelName: { type: String, required: true },
        imageUrl: { type: String, required: true },
        modelUrl: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        status: { type: String, default: "pending" },
      },
    ],
    default: [],
  },
}, { timestamps: true });

// Cart methods
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );
  
  const updatedCartItems = [...this.cart.items];
  
  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += 1;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }
  
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);