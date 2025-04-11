import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { Cart, CategoryPage, Deals, Explore, Home, PCBuilder, Preview } from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  useEffect(() => {
    console.log("App component mounted"); // Log when App component mounts
    // Add dark mode class if it's saved in localStorage
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/preview/:id" element={<Preview />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/build" element={<PCBuilder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
