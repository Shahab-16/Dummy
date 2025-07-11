const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  
  // Pricing and Inventory
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  
  // Categorization
  category: { type: String, required: true }, // Changed from ObjectId to String
  subCategory: { type: String },
  roomType: { type: String },
  style: { type: String },
  
  // Physical Attributes
  dimensions: { type: String },
  weight: { type: Number, default: 0 },
  material: { type: String },
  color: { type: String },
  size: { type: String },
  assemblyRequired: { type: Boolean, default: false },
  
  // Media
  images: [{ type: String }], // Changed to array for multiple images
  modelUrl: { type: String },
  
  // Product Management
  brand: { type: String },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isCustomizable: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'archived', 'draft', 'out_of_stock'], 
    default: 'active' 
  },
  
  // Product Care
  careInstructions: { type: String },
  warrantyPeriod: { type: String },
  returnPolicy: { type: String, default: "30 days return policy" },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});


module.exports = mongoose.model("Product", productSchema);