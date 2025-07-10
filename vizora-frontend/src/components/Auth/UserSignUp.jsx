import React, { useEffect, useState, useContext } from "react";
import { ClosedEye, Google, OpenEye } from "../../assets/icons";
import page_break from "../../assets/images/page_break.png";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";
import { motion } from "framer-motion";
import working_girl from "../../assets/images/working_girl.png";
import { images } from "../../assets/asset";

const SignUp = () => {
  const { signup, googleSignin } = useContext(UserContext);
  const [view, setView] = useState("password");
  const [showBackground, setShowBackground] = useState(window.innerWidth > 1140);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => setShowBackground(window.innerWidth > 1140);
    document.body.style.backgroundColor = "#cfdfe0";
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.trim().length < 3) {
      newErrors.name = "Too Short!";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email";
    }
    if (formData.password.length < 5) {
      newErrors.password = "Password too short";
    }
    if (formData.phone.length !== 10 || isNaN(formData.phone)) {
      newErrors.phone = "Must be 10 digits";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must accept Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      signup(formData);
    }
  };

  return (
    <div className="h-screen w-screen flex">
      {/* Left side - SignUp box */}
      <div className="w-full xl:w-1/2 flex justify-center items-center bg-[#f0f4f8]">
        <motion.div
          className="backdrop-blur-md bg-white/80 min-h-[90vh] p-6 rounded-2xl shadow-lg w-full max-w-md mx-5 flex flex-col justify-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img className="w-[200px] mx-auto mb-4" src={images.vizoraLogo} alt="Vizora Logo" />
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full h-11 rounded-lg bg-[#f2fbfc] border border-gray-300 px-4"
              />
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full h-11 rounded-lg bg-[#f2fbfc] border border-gray-300 px-4"
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4 relative">
              <input
                type={view}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full h-11 rounded-lg bg-[#f2fbfc] border border-gray-300 px-4"
              />
              <span
                onClick={() => setView(view === "text" ? "password" : "text")}
                className="absolute top-3 right-4 cursor-pointer"
              >
                {view === "text" ? ClosedEye : OpenEye}
              </span>
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full h-11 rounded-lg bg-[#f2fbfc] border border-gray-300 px-4"
              />
              {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                I accept all Terms and Conditions
              </label>
            </div>
            {errors.agreeToTerms && (
              <div className="text-red-500 text-sm mb-2">{errors.agreeToTerms}</div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white h-11 rounded-lg hover:bg-purple-700 transition-all text-lg font-medium"
            >
              Create Account
            </button>
          </form>

          <img className="mx-auto h-5 my-6" src={page_break} alt="or" />

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
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Background image */}
      {showBackground && (
        <div
          className="hidden xl:flex w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${working_girl})` }}
        >
          <img src={images.house_login} alt="illustration" />
        </div>
      )}
    </div>
  );
};

export default SignUp;
