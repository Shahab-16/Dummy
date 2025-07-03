const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    default: "visitor",
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
  },
  models: [
    {
      modelName: { type: String, required: true },
      imageUrl: { type: String, required: true },
      modelUrl: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      status: { type: String, default: "pending" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
