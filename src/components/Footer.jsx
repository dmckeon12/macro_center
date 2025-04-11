import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-[#1f1b24] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link to="/explore" className="hover:text-blue-400">Products</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400">Cart</Link></li>
              <li><Link to="/profile" className="hover:text-blue-400">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/cpu" className="hover:text-blue-400">CPUs</Link></li>
              <li><Link to="/category/gpu" className="hover:text-blue-400">GPUs</Link></li>
              <li><Link to="/category/motherboard" className="hover:text-blue-400">Motherboards</Link></li>
              <li><Link to="/category/ram" className="hover:text-blue-400">RAM</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400">Shipping Info</a></li>
              <li><a href="#" className="hover:text-blue-400">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to our newsletter for updates and exclusive offers!</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l text-black dark:text-white dark:bg-[#2a2a2a] dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 rounded-r hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>E-Commerce Project :: Dylan McKeon</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
