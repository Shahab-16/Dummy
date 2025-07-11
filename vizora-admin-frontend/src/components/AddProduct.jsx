import React, { useState } from "react";
import { useContext } from "react";
import AdminContext from "../contexts/adminContext";

const AddProduct = () => {
  const { createProduct } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    material: "",
    color: "",
    size: "",
    stockQuantity: "",
    brand: "",
    weight: 0,
    dimensions: "",
    style: "",
    roomType: "",
    assemblyRequired: false,
    warrantyPeriod: "",
    careInstructions: "",
    isFeatured: false,
    isCustomizable: false,
    tags: [],
    returnPolicy: "30 days return policy",
    sku: ""
  });
  
  const [productImage, setProductImage] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [currentTag, setCurrentTag] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, productImage: "Image size must be less than 5MB" }));
      return;
    }
    setProductImage(file);
    setErrors(prev => ({ ...prev, productImage: null }));
  };

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) { // 50MB limit
      setErrors(prev => ({ ...prev, modelFile: "File size must be less than 50MB" }));
      return;
    }
    setModelFile(file);
    setErrors(prev => ({ ...prev, modelFile: null }));
  };

  const handleTagAdd = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      if (formData.tags.length >= 10) {
        setErrors(prev => ({ ...prev, tags: "Maximum 10 tags allowed" }));
        return;
      }
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag]
      });
      setCurrentTag("");
      setErrors(prev => ({ ...prev, tags: null }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.stockQuantity || Number(formData.stockQuantity) < 0) newErrors.stockQuantity = "Valid quantity is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!productImage) newErrors.productImage = "Product image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image file
      if (productImage) {
        formDataToSend.append('image', productImage);
      }

      // Append model file if exists
      if (modelFile) {
        formDataToSend.append('model', modelFile);
      }

      console.log("formDataToSend = ", formDataToSend);

      const result = await createProduct(formDataToSend);
      
      if (result) {
        alert("Product created successfully!");
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          subCategory: "",
          material: "",
          color: "",
          size: "",
          stockQuantity: "",
          brand: "",
          weight: 0,
          dimensions: "",
          style: "",
          roomType: "",
          assemblyRequired: false,
          warrantyPeriod: "",
          careInstructions: "",
          isFeatured: false,
          isCustomizable: false,
          tags: [],
          returnPolicy: "30 days return policy",
          sku: ""
        });
        setProductImage(null);
        setModelFile(null);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render error messages
  const renderError = (field) => {
    return errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="h-full-screen w-full bg-[#1e1e2f] min-h-screen flex items-center justify-center overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="m-5 w-full max-w-4xl bg-white text-white rounded-2xl shadow-lg p-8"
        encType="multipart/form-data"
      >
        <p className="font-bold text-3xl text-center text-blue-800 mb-6">
          Add New Product
        </p>
        <div className="bg-white p-5 rounded-xl shadow-md text-gray-700">
          
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  className={`border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {renderError('name')}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  className={`border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full ${
                    errors.sku ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                />
                {renderError('sku')}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  className={`border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Flooring">Flooring</option>
                  <option value="Wall Decor">Wall Decor</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Storage">Storage</option>
                  <option value="Accessories">Accessories</option>
                </select>
                {renderError('category')}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  className={`border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
                {renderError('price')}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  className={`border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full ${
                    errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                />
                {renderError('stockQuantity')}
              </div>
            </div>
          </div>
          
          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Description
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Description *
              </label>
              <textarea
                className={`border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {renderError('description')}
            </div>
          </div>
          
          {/* Attributes Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Product Attributes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions (L x W x H)
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="number"
                  name="weight"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style
                </label>
                <select
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                >
                  <option value="">Select Style</option>
                  <option value="Modern">Modern</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Mid-Century">Mid-Century</option>
                  <option value="Scandinavian">Scandinavian</option>
                  <option value="Rustic">Rustic</option>
                  <option value="Bohemian">Bohemian</option>
                  <option value="Coastal">Coastal</option>
                  <option value="Transitional">Transitional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                >
                  <option value="">Select Room Type</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Office">Office</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Period
                </label>
                <input
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  type="text"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Care Instructions
                </label>
                <textarea
                  className="border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 w-full"
                  rows="2"
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="assemblyRequired"
                    checked={formData.assemblyRequired}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Assembly Required
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isCustomizable"
                    checked={formData.isCustomizable}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Customizable Product
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tags Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Tags
            </h3>
            <div>
              <div className="flex">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add tags..."
                  className="border rounded-l-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-300 flex-grow"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {renderError('tags')}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded flex items-center">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-gray-600 hover:text-gray-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Media Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image *
                </label>
                <input
                  className={`block w-full text-sm text-gray-900 border ${
                    errors.productImage ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg cursor-pointer focus:outline-none`}
                  type="file"
                  name="productImage"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload high-quality image of the product (max 5MB)
                </p>
                {renderError('productImage')}
                
                {/* Image preview */}
                {productImage && (
                  <div className="mt-4">
                    <div className="relative w-full h-48">
                      <img 
                        src={URL.createObjectURL(productImage)} 
                        alt="Preview"
                        className="h-full w-full object-contain rounded border border-gray-200"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {productImage.name} ({(productImage.size / 1024).toFixed(2)} KB)
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  3D Model File (Optional)
                </label>
                <input
                  className={`block w-full text-sm text-gray-900 border ${
                    errors.modelFile ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg cursor-pointer focus:outline-none`}
                  type="file"
                  name="modelFile"
                  onChange={handleModelUpload}
                  accept=".glb,.gltf,.fbx,.obj"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Supported formats: .glb, .gltf, .fbx, .obj (max 50MB)
                </p>
                {renderError('modelFile')}
                
                {/* Model file info */}
                {modelFile && (
                  <div className="mt-4 p-2 bg-gray-100 rounded">
                    <p className="text-sm text-gray-700">
                      Selected file: {modelFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(modelFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;