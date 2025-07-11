import React, { useEffect, useContext } from "react";
import ShopContext from "../context/shopContext";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import userContext from "../context/userContext";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

const Cart = ({ setShowCart, showCart, setActive }) => {
  const { getCart, cart, removeFromCart } = useContext(ShopContext);
  const { user } = useContext(userContext);

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);

  return (
    <>
      {showCart && (
        <div className="fixed top-0 right-0 bg-white p-4 w-[500px] border-2 h-full overflow-y-auto z-50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-xl font-semibold">Cart</h1>
            <button onClick={() => setShowCart(false)} className="text-2xl">×</button>
          </div>
          <hr />
          <div className="flex flex-col mt-4 space-y-8">
            {cart?.length > 0 ? (
              cart.map((item) => {
                if (!item.product) return null;
                return (
                  <div key={item.product._id} className="flex items-start space-x-4">
                    <AdvancedImage
                      className="rounded-md"
                      cldImg={cld
                        .image(item.product.imageUrl)
                        .addTransformation("q_auto,c_auto,g_auto,h_150,w_200,r_10")}
                    />
                    <div className="flex flex-col text-left w-full relative">
                      <h2 className="text-lg font-medium">{item.product.productName}</h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.product.price} {item.product.unit}
                      </p>
                      <p className="text-sm font-medium">Qty: {item.quantity}</p>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-sm text-red-500 mt-2 absolute bottom-0"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center">No items in cart</p>
            )}
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => {
                setActive("orders");
                setShowCart(false);
              }}
              className="bg-primary-purple text-white font-medium rounded-md px-8 py-2 mt-10 mx-auto block"
            >
              Proceed
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;
