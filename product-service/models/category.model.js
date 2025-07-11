const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    enum: [
      'Furniture',
      'Lighting',
      'Textiles',
      'Flooring',
      'Wall Decor',
      'Kitchen',
      'Bathroom',
      'Outdoor',
      'Storage',
      'Accessories'
    ]
  },
  description: { type: String },
  image: { type: String },
  parentCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category" 
  },
  isFeatured: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: [{ type: String }],
  displayOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isFeatured: 1, displayOrder: 1 });

module.exports = mongoose.model("Category", categorySchema);