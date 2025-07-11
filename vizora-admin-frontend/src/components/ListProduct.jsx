import React, { useState, useContext, useEffect } from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import AdminContext from "../contexts/adminContext"; // adjust path as needed

const ListProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, getProducts, deleteProduct } = useContext(AdminContext);
  console.log("Products:", products);

  const handleDelete = (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    deleteProduct(id);
  }
};

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col max-w-full mx-auto gap-8 p-4 sm:p-8 bg-[#1e1e2f] min-h-screen">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <AiOutlineSearch
            className="absolute top-3 left-3 text-gray-400"
            size={20}
          />
          <input
            className="p-2 pl-10 w-full rounded-lg border border-gray-700 bg-[#2c2c3c] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Header */}
      <div className="hidden sm:grid sm:grid-cols-6 gap-6 text-sm font-semibold text-gray-300 border-b border-gray-700 pb-3">
        <p className="text-center">Image</p>
        <p className="text-left">Name</p>
        <p className="text-left">Category</p>
        <p className="text-left">Price / Cost</p>
        <p className="text-center">Status</p>
        <p className="text-center">Actions</p>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-6 items-center bg-[#2a2a3b] bg-opacity-90 text-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="text-center ml-[25%] sm:ml-0">
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-[60px] h-[60px] rounded-md object-cover mx-auto"
                />
              </div>

              {/* Name & Description */}
              <div className="text-left">
                <p className="font-medium text-white">{product.name}</p>
                <p className="text-sm text-gray-400">
                  {product.description?.substring(0, 30)}...
                </p>
              </div>

              {/* Category */}
              <p className="hidden sm:block text-left text-gray-400">
                {product.category}
              </p>

              {/* Price / Cost */}
              <div className="hidden sm:block text-left">
                <p className="text-white">${product.price?.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Cost: ${product.cost?.toFixed(2)}
                </p>
              </div>

              {/* Status */}
              <p
                className={`text-center font-semibold ${
                  product.status === "Active"
                    ? "text-green-400"
                    : product.status === "Out of Stock"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {product.status}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <button className="text-purple-400 hover:text-purple-300 transition">
                  <FiEye size={20} />
                </button>
                <button className="text-indigo-400 hover:text-indigo-300 transition">
                  <FiEdit size={20} />
                </button>
                <button
                  className="text-red-400 hover:text-red-300 transition"
                  onClick={() => handleDelete(product._id)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
