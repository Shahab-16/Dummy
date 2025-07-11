import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import Dashboard from '../components/Dashboard';
import Products from '../components/Products';
import Design from '../components/Design';
import Orders from '../components/Orders';
import Favourites from '../components/Favourites';
import Cart from '../components/Cart';
import EditorPage from '../pages/EditorPage';
import CartItems from '../components/CartItems';
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [active, setActive] = useState("dashboard");
  const toggleSidebar=()=>{
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <SideBar 
        isSidebarOpen={isSidebarOpen} 
        active={active}
        setActive={setActive}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Main Content */}
      <div className="w-full">
        <div className="">
          <Routes>
            <Route path='/home'  element={<Dashboard />} />
            <Route path='/products'  element={<Products/>} />
            <Route path='/design'  element={<Design />} />
            <Route path='/orders'  element={<Orders />} />
            <Route path='/favourites'  element={<Favourites/>} />
            <Route path='/cart'  element={<Cart />} />
            <Route path='/editor'  element={<EditorPage />} />
            <Route path='/cartItems' element={<CartItems/>}/>
            <Route path='*'  element={<Navigate to="/dashboard/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;