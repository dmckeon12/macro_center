import React, { useState, useEffect } from "react";
import CartCard from "../components/CartCard";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkoutCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => {
        // Ensure price_cents is a valid number
        const price = typeof curr.price_cents === 'number' ? curr.price_cents : 0;
        // Ensure qty is a valid number
        const qty = typeof curr.qty === 'number' ? curr.qty : 1;
        return acc + (price * qty);
      }, 0)
    );
  }, [cart]);

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Looks like you haven't added any components to your cart yet.
          </p>
          <div className="space-y-4">
            <Link
              to="/build"
              className="block w-full sm:w-auto sm:inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors sm:mr-4"
            >
              Start Building a PC
            </Link>
            <Link
              to="/"
              className="block w-full sm:w-auto sm:inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Browse Components
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-4">
          {cart.map((item) => (
            <CartCard key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:w-80">
          <div className="bg-white dark:bg-[#1f1b24] rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Items ({cart.length})</span>
                <span>${((total || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold dark:text-white">
                <span>Total</span>
                <span>${((total || 0) / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={proceedToCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
