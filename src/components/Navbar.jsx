import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiChip } from "react-icons/bi";
import { logo } from "../assets/data";

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const mobile = () => {
    setClick(!click);
  };

  const categories = [
    { name: "CPUs", path: "/category/cpu" },
    { name: "GPUs", path: "/category/gpu" },
    { name: "Motherboards", path: "/category/motherboard" },
    { name: "RAM", path: "/category/ram" },
    { name: "Storage", path: "/category/storage" },
    { name: "Power Supplies", path: "/category/psu" },
  ];

  return (
    <div className="relative bg-white dark:bg-[#1f1b24] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Macro Center" className="h-8" />
              <BiChip className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Macro
                <span className="text-blue-600 dark:text-blue-400">Center</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            
            <div className="relative group">
              <button 
                className="nav-link flex items-center gap-1"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                Categories
              </button>
              {showCategories && (
                <div 
                  className="absolute top-full left-0 w-48 py-2 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg z-50"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f1b24]"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/deals" className="nav-link">Deals</Link>
            <Link to="/build" className="nav-link">PC Builder</Link>
            
            <Link to="/cart" className="nav-link">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-xs w-4 h-4 flex justify-center items-center rounded-full text-white">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button onClick={mobile} className="p-2">
              {!click ? (
                <GiHamburgerMenu className="h-6 w-6 dark:text-white" />
              ) : (
                <FaTimes className="h-6 w-6 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {click && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-[#1f1b24] shadow-lg">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <div className="mobile-nav-link">
              <span className="block text-sm font-medium mb-2">Categories</span>
              <div className="pl-4 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/deals" className="mobile-nav-link">Deals</Link>
            <Link to="/build" className="mobile-nav-link">PC Builder</Link>
            <Link to="/cart" className="mobile-nav-link">
              Cart {cart.length > 0 && `(${cart.length})`}
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          @apply text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400;
        }
        .mobile-nav-link {
          @apply block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
