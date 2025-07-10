import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import { long_logo, ClosedEye, Google, OpenEye } from "../../assets/icons";
import page_break from "../../assets/images/page_break.png";
import working_girl from "../../assets/images/working_girl.png";
import { images } from "../../assets/asset";
import { motion } from "framer-motion";

const UserLogin = () => {
  const { login, googleSignin } = useContext(UserContext);
  const navigate = useNavigate();
  const [view, setView] = useState("password");
  const [showBackground, setShowBackground] = useState(window.innerWidth > 1140);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleResize = () => {
    setShowBackground(window.innerWidth > 1140);
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#cfdfe0";
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email.includes("@")) {
      tempErrors.email = "Invalid email";
    }
    if (formData.password.length < 5) {
      tempErrors.password = "Password must be at least 5 characters";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login(formData);
    }
  };

  return (
    <div className="h-screen w-screen flex">
      {/* Left side - Login form */}
      <div className="w-full xl:w-1/2 flex justify-center items-center bg-[#f0f4f8]">
        <motion.div
          className="backdrop-blur-md bg-white/80 p-8 rounded-2xl shadow-lg w-full max-w-md mx-5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img className="w-5/6 ml-4 mb-4" src={images.vizoraLogo} alt="logo" />

          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-[#f2fbfc] border border-gray-300 px-4 focus:ring-2 focus:ring-purple-400"
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4 relative">
              <input
                type={view}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-[#f2fbfc] border border-gray-300 px-4 focus:ring-2 focus:ring-purple-400"
              />
              <span
                onClick={() => setView(view === "text" ? "password" : "text")}
                className="absolute top-3 right-4 cursor-pointer"
              >
                {view === "text" ? ClosedEye : OpenEye}
              </span>
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white h-11 rounded-lg hover:bg-purple-700 transition-all text-lg font-medium"
            >
              Login
            </button>
          </form>

          <img className="mx-auto h-5 my-8" src={page_break} alt="or" />

          <motion.button
            onClick={googleSignin}
            className="flex w-full items-center justify-center py-2 bg-white border border-gray-300 rounded-full hover:shadow-md transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {Google}
            <span className="ml-2 font-medium text-gray-700">Continue with Google</span>
          </motion.button>

          <p className="text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-600 font-semibold hover:underline cursor-pointer"
            >
              Signup
            </span>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image */}
      {showBackground && (
        <div
          className="hidden xl:flex w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${working_girl})` }}
        ></div>
      )}
    </div>
  );
};

export default UserLogin;
