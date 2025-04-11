import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { Cart, CategoryPage, Deals, Explore, Home, PCBuilder, Preview } from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] relative">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/build" element={<PCBuilder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
