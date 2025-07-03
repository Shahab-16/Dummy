const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  modelUrl: { type: String }, // 3D model file (optional)
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number },
  description: { type: String },
  status: { type: String, default: "active" }, // active, archived
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
