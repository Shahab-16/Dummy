import React, { useState } from 'react';
import UserContext from './userContext';
import { useNavigate } from 'react-router-dom';
import { auth, GoogleAuthProvider, signInWithPopup } from '../util/firebase-config';

function UserState(props) {
  const navigate = useNavigate();
  const host = "http://localhost:5000";
  const [user, setUser] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [userModels, setUserModels] = useState([]);

  const getUserData = async () => {
    try {
      const response = await fetch(`${host}/user/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setLikedProducts(data.user?.likedProducts || []);
        setUserModels(data.user?.models || []);
      } else {
        props.showAlert(data.message || "Please login", "info");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      props.showAlert("Failed to fetch user data", "danger");
    }
  };

  const login = async (values) => {
    try {
      const response = await fetch(`${host}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log("data => ", data);
      if (data.success) {
        props.showAlert("Logged in successfully", "success");
        navigate("/dashboard");
      } else {
        props.showAlert(data.message || "Failed to login", "danger");
      }
    } catch (error) {
      props.showAlert("Network error. Please try again.", "danger");
      console.error("Login error:", error);
    }
  };

  const signup = async (values) => {
    try {
      const response = await fetch(`${host}/user/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        props.showAlert("Account created successfully", "success");
        navigate("/dashboard");
      } else {
        props.showAlert(data.message || "Failed to create account", "danger");
      }
    } catch (error) {
      props.showAlert("Network error. Please try again.", "danger");
      console.error("Signup error:", error);
    }
  };

  const adminLogin=async(values)=>{
    try {
      const response = await fetch(`${host}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        //props.showAlert("Logged in successfully", "success");
        console.log("Hello there in the admin login context file");
        window.location.href = "http://localhost:5174/admin/dashboard"; 
      } else {
        props.showAlert(data.message || "Failed to login", "danger");
      }
    } catch (error) {
      props.showAlert("Network error. Please try again.", "danger");
      console.error("Login error:", error);
    }
  }

  const googleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch(`${host}/user/google-auth`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await getUserData();
        props.showAlert("Logged in successfully", "success");
        navigate("/");
      } else {
        props.showAlert(data.message || "Failed to login with Google", "danger");
      }
    } catch (error) {
      console.error("Google login error:", error);
      props.showAlert("Failed to login with Google", "danger");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${host}/user/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        props.showAlert("Logged out successfully", "info");
      }
    } catch (error) {
      console.error("Logout error:", error);
      props.showAlert("Failed to logout", "danger");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        adminLogin,
        signup,
        logout,
        googleSignin,
        getUserData,
        likedProducts,
        userModels,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default UserState;