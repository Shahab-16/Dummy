import React, { useState } from "react";
import AdminContext from "./adminContext";
import { useNavigate } from "react-router-dom";
import { extractPublicId } from "cloudinary-build-url";

const AdminState = (props) => {
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const { showAlert } = props;

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [productModels, setProductModels] = useState([]);

const postProduct = async (formData) => {
  try {
    const response = await fetch(host + "/products", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log("📡 HTTP status:", response.status); // helpful line

    const text = await response.text();
    console.log("📨 Raw response text:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON parse failed:", e);
      showAlert("❌ Invalid response from server", "danger");
      return null;
    }

    console.log("✅ Parsed response JSON:", data);

    // ⚠️ Check HTTP status + success field both
    if (!response.ok || !data.success) {
      console.error("❌ Backend returned error:", data);
      showAlert(data.message || "❌ Failed to add product", "danger");
      return null;
    }

    const product = data.product;
    setProducts(prev => [...prev, product]);
    showAlert("✅ Product added successfully", "success");
    return product;

  } catch (error) {
    console.error("❌ Network or fetch error:", error);
    showAlert("❌ Error adding product", "danger");
    return null;
  }
};




const createProduct = async (productData) => {
  console.log("🚀 Inside createProduct - productData:",productData);

  return await postProduct(productData); // ⬅️ PASSING formData object
};



const getProducts = async () => {
    try {
      const res = await fetch(`${host}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
        },
      });

      const data = await res.json();
      setProducts(data); // store in context
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    }
  };




// AppState.jsx

const deleteProduct = async (productId) => {
  try {
    const res = await fetch(`${host}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      console.log("✅ Product deleted:", result);
      getProducts(); // Refresh product list
    } else {
      console.error("❌ Delete failed:", result.message);
      alert("Failed to delete product: " + result.message);
    }
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
  }
};




  const fetchData = async () => {
    const response = await fetch(host + "/login", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.success) {
      showAlert("Logged in successfully", "success");
      setUser(data.user);
    } else {
      navigate("/login");
      showAlert("You are not logged in", "info");
    }
  };

  const Logout = async () => {
    const response = await fetch(host + "/logout", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      navigate("/login");
      setUser(null);
      showAlert("Logged out successfully", "info");
    } else {
      showAlert("Failed to logout", "danger");
    }
  };

  const getCategories = async () => {
    const response = await fetch(host + "/category", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setCategories(data.categories);
    } else {
      showAlert("Failed to fetch categories", "danger");
    }
  };

  const getDesignCategories = async () => {
    const response = await fetch(host + "/designcategory", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setCategories(data.categories);
    } else {
      showAlert("Failed to fetch design categories", "danger");
    }
  };

  const postCategory = async (values) => {
    const response = await fetch(host + "/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setCategories([...categories, data.category]);
      showAlert("Category added", "success");
    } else {
      showAlert("Category not added", "danger");
    }
  };

  const patchCategory = async (categoryId, values) => {
    const response = await fetch(`${host}/category/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setCategories(categories.map(cat => cat._id === categoryId ? data.category : cat));
      showAlert("Category updated", "success");
    } else {
      showAlert("Failed to update category", "danger");
    }
  };

  const delCategory = async (categoryId) => {
    const response = await fetch(`${host}/category/${categoryId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setCategories(categories.filter(cat => cat._id !== categoryId));
      showAlert("Category deleted", "success");
    } else {
      showAlert("Failed to delete category", "danger");
    }
  };

  const getSubCategories = async (categoryId) => {
    const response = await fetch(host + "/getsubcategory", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId }),
    });
    const data = await response.json();
    if (data.success) {
      setSubCategories(data.subCategories);
      showAlert("Subcategories fetched", "success");
    } else {
      showAlert("Failed to fetch subcategories", "danger");
    }
  };

  const postSubCategory = async (values) => {
    const response = await fetch(host + "/subcategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setSubCategories([...subCategories, data.subCategory]);
      showAlert("Subcategory added", "success");
    } else {
      showAlert("Subcategory not added", "danger");
    }
  };

  const patchSubCategory = async (subCategoryId, values) => {
    const response = await fetch(`${host}/subcategory/${subCategoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setSubCategories(subCategories.map(sc => sc._id === subCategoryId ? data.subCategory : sc));
      showAlert("Subcategory updated", "success");
    } else {
      showAlert("Failed to update subcategory", "danger");
    }
  };

  const delSubCategory = async (subCategoryId) => {
    const response = await fetch(`${host}/subcategory/${subCategoryId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setSubCategories(subCategories.filter(sc => sc._id !== subCategoryId));
      showAlert("Subcategory deleted", "success");
    } else {
      showAlert("Failed to delete subcategory", "danger");
    }
  };


  const patchProduct = async (productId, values) => {
    const response = await fetch(`${host}/product/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setProducts(products.map(p => p._id === productId ? data.product : p));
      showAlert("Product updated", "success");
    } else {
      showAlert("Failed to update product", "danger");
    }
  };

  const delProduct = async (productId) => {
    const response = await fetch(`${host}/product/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setProducts(products.filter(p => p._id !== productId));
      showAlert("Product deleted", "success");
    } else {
      showAlert("Failed to delete product", "danger");
    }
  };

  const postModel = async (values) => {
    const response = await fetch(host + "/model", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setModels([...models, data.model]);
      showAlert("Model added", "success");
    } else {
      showAlert("Failed to add model", "danger");
    }
  };

  const getProductModels = async () => {
    const response = await fetch(host + "/productmodels", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setProductModels(data.data);
      showAlert("Product models fetched", "success");
    } else {
      showAlert("Failed to fetch product models", "danger");
    }
  };

  const getModels = async (categoryId) => {
    const response = await fetch(`${host}/models/${categoryId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setModels(data.models);
      showAlert("Models fetched", "success");
    } else {
      showAlert("Failed to fetch models", "danger");
    }
  };

  const patchModel = async (modelId, values) => {
    const response = await fetch(`${host}/model/${modelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      setModels(models.map(m => m._id === modelId ? data.model : m));
      showAlert("Model updated", "success");
    } else {
      showAlert("Failed to update model", "danger");
    }
  };

  const delModel = async (modelId) => {
    const response = await fetch(`${host}/model/${modelId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success) {
      setModels(models.filter(m => m._id !== modelId));
      showAlert("Model deleted", "success");
    } else {
      showAlert("Failed to delete model", "danger");
    }
  };

  const saveModel = async (model, url, modelId) => {
    const publicId = extractPublicId(url);
    const modelBlob = new Blob([model], { type: "application/octet-stream" });

    const formData = new FormData();
    formData.append("model", modelBlob);
    formData.append("publicId", publicId);
    formData.append("modelId", modelId);

    const response = await fetch(host + "/savemodel", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <AdminContext.Provider
      value={{
        fetchData,
        user,
        categories,
        subCategories,
        products,
        productModels,
        Logout,
        getCategories,
        getDesignCategories,
        postCategory,
        patchCategory,
        delCategory,
        getSubCategories,
        postSubCategory,
        patchSubCategory,
        delSubCategory,
        getProducts,
        createProduct,
        postProduct,
        deleteProduct,
        patchProduct,
        delProduct,
        getProductModels,
        models,
        postModel,
        saveModel,
        getModels,
        patchModel,
        delModel,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminState;
