/**
 * Navbar - used for navigation
 * used for movement through cart, profile, and dark mode
 * also used for catagories
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaSun, FaMoon, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiChip } from "react-icons/bi";
import data from "../assets/data";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

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
              <img src={data.logo} alt="Macro Center" className="h-8" />
              <BiChip className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Macro
                <span className="text-blue-600 dark:text-blue-400">Center</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            
            <div className="relative group">
              <button 
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
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
            
            <Link to="/deals" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Deals</Link>
            <Link to="/build" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">PC Builder</Link>
            
            {/* User Authentication Menu */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaUser className="mr-1" />
                    <span>{currentUser.name.split(' ')[0]}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg py-2 z-50">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f1b24]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/login');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f1b24]"
                      >
                        <div className="flex items-center">
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                    Register
                  </Link>
                </div>
              )}
            </div>
            
            {/* Cart Link */}
            {currentUser && (
              <Link to="/cart" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="relative">
                  <FaShoppingCart className="text-xl" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-blue-600 text-xs w-4 h-4 flex justify-center items-center rounded-full text-white">
                      {cart.length}
                    </span>
                  )}
                </div>
              </Link>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
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
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <div className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
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
            <Link to="/deals" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Deals</Link>
            <Link to="/build" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">PC Builder</Link>
            {/* Auth Links - Mobile */}
            {currentUser ? (
              <>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    My Profile
                  </div>
                </Link>
                <Link to="/cart" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                  Cart {cart.length > 0 && `(${cart.length})`}
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setClick(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default Navbar;
