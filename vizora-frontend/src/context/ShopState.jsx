import React, { useContext } from "react";
import ShopContext from "./shopContext";
import { useState } from "react";
import { extractPublicId } from "cloudinary-build-url";
import userContext from "./userContext";

function ShopState(props) {
  const host = import.meta.env.VITE_HOST;
  const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL;
  const { showAlert } = props;
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const { user } = useContext(userContext);


  const getProducts = async () => {
    try {
      const res = await fetch(`${host}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error.message);
    }
  };
  const getCart = async () => {
    try {
      const response = await fetch(`${host}/user/carts/${user._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        console.log("cart = ", data.data);

        showAlert("Cart loaded succesfully", "success");
      }
    } catch (error) {
      showAlert("Failed to fetch cart", "danger");
      console.log("Error Occured in getCart ShopState", error);
    }
  };

  // add to cart
const addToCart = async (productId) => {
  console.log("Inside addtocart in shopstate");
  if (!user) {
    showAlert("Please login to add to cart", "danger");
    return;
  }
  try {
    // Update frontend count
    setProducts((prevProducts) =>
      prevProducts.map((prod) =>
        prod._id === productId
          ? {
              ...prod,
              inCart: true,
              count: prod.count ? prod.count + 1 : 1,
            }
          : prod
      )
    );

    // Backend API call to user-service
    const res = await fetch(`${host}/user/carts`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, userId: user._id, quantity: 1 }),
    });

    console.log(res);

    const data = await res.json();

    if (!data.success) {
      showAlert("Failed to add to cart", "danger");
    } else {
      showAlert("Item added to cart", "success");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    showAlert("Error while adding to cart", "danger");
  }
};


  // remove from cart
const removeFromCart = async (productId) => {
  if (!user) {
    showAlert("Please login to remove from cart", "danger");
    return;
  }

  try {
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        if (prod._id === productId) {
          const newCount = (prod.count || 1) - 1;
          return {
            ...prod,
            count: newCount > 0 ? newCount : 0,
            inCart: newCount > 0,
          };
        }
        return prod;
      })
    );

    // Backend API call to user-service
    const res = await fetch(`${host}/user/carts/${productId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, userId: user._id }),
    });

    const data = await res.json();

    if (!data.success) {
      showAlert("Failed to remove from cart", "danger");
    } else {
      showAlert("Item removed from cart", "success");
    }
  } catch (error) {
    console.error("Remove from cart error:", error);
    showAlert("Error while removing from cart", "danger");
  }
};


  // get Paints
  const getPaints = async () => {
    try {
      const response = await fetch(`${host}/paints`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setSubCategories(data.subCategories);
        return data.categories;
      }
    } catch (error) {
      props.showAlert("Failed to fetch paints", "danger");
      console.log("Error Occured in getPaints EditorState", error);
    }
  };
  // get Tiles
  const getTiles = async () => {
    try {
      const response = await fetch(`${host}/tiles`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setSubCategories(data.subCategories);
        return data.categories;
      }
    } catch (error) {
      props.showAlert("Failed to fetch tiles", "danger");
      console.log("Error Occured in getTiles EditorState", error);
    }
  };
  // get Wallpapers
  const getWallpapers = async () => {
    try {
      const response = await fetch(`${host}/wallpapers`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setSubCategories(data.subCategories);
        return data.categories;
      }
    } catch (error) {
      props.showAlert("Failed to fetch wallpapers", "danger");
      console.log("Error Occured in getWallpapers EditorState", error);
    }
  };

  //get categories
  const getCategories = async () => {
    try {
      const response = await fetch(host + "/categories", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        showAlert("Categories Fetched", "success");
      } else {
        showAlert("Failed to fetch Categories", "danger");
      }
    } catch (err) {
      showAlert("Failed to fetch Categories", "danger");
      console.log("Error occured in getCategories", err);
    }
  };

  //get design categories
  const getDesignCategories = async () => {
    const response = await fetch(host + "/designcategory", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      setCategories(data.categories);
    } else {
      showAlert("Failed to Fetched Design Categories", "danger");
    }
  };

  //get sub categories
  const getSubCategories = async (categoryId) => {
    try {
      const response = await fetch(host + "/subcategories", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      });
      const data = await response.json();
      if (!data.success) {
        showAlert("Failed to Fetched Sub Categories", "danger");
      } else {
        setSubCategories(data.subCategories);
        showAlert("Fetched Sub Categories", "success");
      }
    } catch (err) {
      showAlert("Failed to fetch SubCategories", "danger");
      console.log("Error occured in getSubCategories", err);
    }
  };

  // getModels
  const getModels = async (categoryId) => {
    const response = await fetch(`${host}/models/${categoryId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      setModels(data.models);
      showAlert("Models fetched", "success");
    } else {
      showAlert("Failed to fetch Models", "danger");
    }
  };

  // get all Models
  const getAllModels = async () => {
    const response = await fetch(`${host}/allmodels`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      setModels(data.models);
      showAlert("Models fetched", "success");
    } else {
      showAlert("Failed to fetch Models", "danger");
    }
  };

  // getProductModels
  const getProductModels = async (subcategoryId) => {
    const response = await fetch(`${host}/productmodels`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      setProductModels(data.data);
      showAlert("Product Models fetched", "success");
    } else {
      showAlert("Failed to fetch Product Models", "danger");
    }
  };

  // savemodel
  const saveModel = async (model, modelName, imageUrl) => {
    console.log("model = ", model);
    console.log("modelName = ", modelName);
    console.log("imageUrl = ", imageUrl);
    const modelBlob = new Blob([model], { type: "application/octet-stream" });

    const formData = new FormData();
    formData.append("model", modelBlob);
    formData.append("modelName", modelName);
    formData.append("imageUrl", imageUrl);

    const response = await fetch(host + "/savemodel", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      showAlert("Model saved", "success");
    } else {
      showAlert("Model not saved", "danger");
    }
  };

  // overwrite
  const overwriteModel = async (modelData, modelName, imageUrl, model) => {
    const modelId = model._id;
    console.log("modelData = ", modelData);
    console.log("modelName = ", modelName);
    console.log("imageUrl = ", imageUrl);
    console.log("modelId = ", modelId);

    if (!user) {
      showAlert("You are not logged in", "danger");
      return;
    }

    const modelUrl = user.models.filter((model) => model._id === modelId)[0]
      .modelUrl;

    const publicId = extractPublicId(modelUrl);
    const modelBlob = new Blob([modelData], {
      type: "application/octet-stream",
    });

    const formData = new FormData();

    formData.append("model", modelBlob);
    formData.append("modelName", modelName);
    formData.append("imageUrl", imageUrl);
    formData.append("modelId", modelId);
    formData.append("publicId", publicId);

    const response = await fetch(host + "/overwritemodel", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      showAlert("Model saved", "success");
    } else {
      showAlert("Model not saved", "danger");
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        getCart,
        addToCart,
        removeFromCart,
        getProducts,
        products,
        setProducts,
        getCategories,
        getDesignCategories,
        getSubCategories,
        getPaints,
        getTiles,
        getWallpapers,
        categories,
        subCategories,
        saveModel,
        overwriteModel,
        getModels,
        models,
        getProductModels,
        productModels,
        getAllModels,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
}

export default ShopState;
