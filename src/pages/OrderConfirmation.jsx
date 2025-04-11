import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderConfirmation = () => {
  // Generate a random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          Thank You For Your Order!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Your order has been placed successfully.
        </p>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Order Number: <span className="font-semibold">#{orderNumber}</span>
        </p>
        
        <div className="bg-white dark:bg-[#1f1b24] rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">What's Next?</h2>
          
          <div className="text-left space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center rounded-full mr-3">
                <span className="text-blue-600 dark:text-blue-300 font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium dark:text-white">Order Confirmation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You will receive an email confirmation with your order details.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center rounded-full mr-3">
                <span className="text-blue-600 dark:text-blue-300 font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium dark:text-white">Processing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your order is now being processed and prepared for shipping.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center rounded-full mr-3">
                <span className="text-blue-600 dark:text-blue-300 font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium dark:text-white">Shipping</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Once shipped, you'll receive tracking information via email.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/profile"
            className="block w-full sm:w-auto sm:inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors sm:mr-4"
          >
            View Your Profile
          </Link>
          
          <Link
            to="/"
            className="block w-full sm:w-auto sm:inline-block bg-transparent border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
