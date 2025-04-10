import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Cart, CategoryPage, Deals, Explore, Home, PCBuilder, Preview } from "./pages/index";

const App = () => {
  return (
    <div className="bg-gray-50 dark:bg-[#121212] min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/build" element={<PCBuilder />} />
      </Routes>
    </div>
  );
};

export default App;
