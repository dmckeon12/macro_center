import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/CartSlice';
import toast from 'react-hot-toast';
import { getProductById } from '../api';
import ProductRecommendation from '../components/ProductRecommendation';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { BiCheckCircle, BiXCircle } from 'react-icons/bi';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty: quantity }));
      toast.success(`${product.name} added to cart!`);
    }
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-6"></div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg mb-6 md:mb-0 md:mr-6"></div>
            <div className="md:w-1/2">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 w-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-6">
          <p>{error || 'Product not found'}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row" data-testid="product-detail">
        {/* Product Image Section */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <img 
              src={product.main_picture_url} 
              alt={product.name} 
              className="w-full h-auto object-contain max-h-96"
            />
          </div>
        </div>
        
        {/* Product Info Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white" data-testid="product-name">
            {product.name}
          </h1>
          
          <div className="text-sm text-gray-500 mb-4">
            <span className="mr-4">Brand: {product.brand_name}</span>
            <span>Category: {product.category}</span>
          </div>
          
          <div className="text-2xl font-bold text-blue-600 mb-6" data-testid="product-price">
            ${(product.price_cents / 100).toFixed(2)}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
          </div>
          
          {/* Specifications */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <ul className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                <li key={key} className="flex">
                  <span className="font-medium w-1/3 text-gray-600 dark:text-gray-400">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-gray-900 dark:text-gray-200">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Stock Status */}
          <div className="mb-6 flex items-center">
            <span className="mr-2">Availability:</span>
            {product.stock ? (
              <span className="text-green-600 flex items-center">
                <BiCheckCircle className="mr-1" /> In Stock
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <BiXCircle className="mr-1" /> Out of Stock
              </span>
            )}
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button 
                onClick={decrementQuantity}
                className="px-3 py-1 border border-gray-300 rounded-l text-gray-600 hover:bg-gray-100"
                aria-label="Decrease quantity"
                data-testid="decrease-quantity"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300 text-center min-w-[40px]" data-testid="product-quantity">
                {quantity}
              </span>
              <button 
                onClick={incrementQuantity}
                className="px-3 py-1 border border-gray-300 rounded-r text-gray-600 hover:bg-gray-100"
                aria-label="Increase quantity"
                data-testid="increase-quantity"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className={`w-full py-3 px-6 rounded-lg flex items-center justify-center text-white font-medium ${
              product.stock 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            data-testid="add-to-cart-button"
          >
            <HiOutlineShoppingCart className="mr-2 text-xl" />
            Add to Cart
          </button>
        </div>
      </div>
      
      {/* Product Recommendations */}
      <div className="mt-16">
        {/* Similar products in the same category */}
        <ProductRecommendation 
          productId={productId} 
          category={product.category} 
        />
        
        {/* Cross-category recommendations based on the product type */}
        {product.category === 'cpu' && (
          <ProductRecommendation 
            productId={productId}
            category={product.category}
            relatedCategory="motherboard"
          />
        )}
        
        {product.category === 'motherboard' && (
          <ProductRecommendation 
            productId={productId}
            category={product.category}
            relatedCategory="ram"
          />
        )}
        
        {product.category === 'gpu' && (
          <ProductRecommendation 
            productId={productId}
            category={product.category}
            relatedCategory="psu"
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
