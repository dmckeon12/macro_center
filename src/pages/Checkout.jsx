import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkoutCart } from "../redux/slices/CartSlice";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, addOrder } = useAuth();
  
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Calculate total price with safety checks for price_cents
    setTotal(
      cart.reduce((acc, curr) => {
        // Ensure price_cents is a valid number
        const price = typeof curr.price_cents === 'number' ? curr.price_cents : 0;
        // Ensure qty is a valid number
        const qty = typeof curr.qty === 'number' ? curr.qty : 1;
        return acc + (price * qty);
      }, 0)
    );
    
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/cart');
      toast.error("Your cart is empty");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'address', 
      'city', 'state', 'zipCode', 'cardName', 
      'cardNumber', 'expiration', 'cvv'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Card number validation (simple check for 16 digits)
    if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Expiration date validation (MM/YY format)
    if (formData.expiration && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiration)) {
      errors.expiration = 'Please use MM/YY format';
    }
    
    // CVV validation (3 or 4 digits)
    if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Create order data
      const orderTotal = (total || 0) + ((total || 0) * 0.07); // Include tax
      const orderId = uuidv4().substring(0, 8).toUpperCase();
      const orderDate = new Date().toISOString();
      
      const orderData = {
        id: orderId,
        date: new Date().toLocaleDateString(),
        total: (orderTotal / 100).toFixed(2),
        status: 'Processing',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price_cents,
          quantity: item.qty,
          image: item.main_picture_url
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentInfo: {
          cardName: formData.cardName,
          cardNumber: formData.cardNumber.replace(/\d(?=\d{4})/g, "*"), // Mask card number
          expiration: formData.expiration
        },
        orderDate: orderDate
      };
      
      // Save order to user profile
      try {
        // Add the order to the user's profile
        addOrder(orderData);
        
        // Clear cart
        dispatch(checkoutCart());
        localStorage.removeItem("localCart");
        
        // Show success message
        toast.success("Order placed successfully! Thank you for your purchase.");
        
        // Redirect to order confirmation with order ID
        navigate("/order-confirmation", { state: { orderId } });
      } catch (error) {
        toast.error("Error saving your order. Please try again.");
        console.error("Order error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-[#1f1b24] rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center py-2 border-b dark:border-gray-700">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.main_picture_url}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <div className="text-sm font-medium dark:text-white">
                        ${(((item.price_cents || 0) * (item.qty || 1)) / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="dark:text-white">${((total || 0) / 100).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="dark:text-white">${(((total || 0) * 0.07) / 100).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span className="dark:text-white">Total</span>
                  <span className="dark:text-white">
                    ${(((total || 0) + ((total || 0) * 0.07)) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-[#1f1b24] rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input 
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input 
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input 
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                </div>
                
                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input 
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                    <input 
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                    <input 
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Information</h2>
                  
                  {/* Card Name */}
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name on Card</label>
                    <input 
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.cardName && <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>}
                  </div>
                  
                  {/* Card Number */}
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                    <input 
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                  </div>
                  
                  {/* Expiration & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
                      <input 
                        type="text"
                        id="expiration"
                        name="expiration"
                        value={formData.expiration}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.expiration ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.expiration && <p className="text-red-500 text-xs mt-1">{formErrors.expiration}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                      <input 
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="XXX"
                        className={`w-full p-2 border rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing...' : `Place Order - $${(((total || 0) + ((total || 0) * 0.07)) / 100).toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
