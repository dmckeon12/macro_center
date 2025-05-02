import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/CartSlice';
import { getRecommendations, getRecommendationsFallback } from '../api';

const ProductRecommendation = ({ productId, category, relatedCategory }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // If we have a productId and category, fetch recommendations
    if (productId && category) {
      fetchRecommendations();
    }
  }, [productId, category, relatedCategory]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Try to get recommendations from API
      const response = await getRecommendations(productId, category, relatedCategory);
      setRecommendations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
      
      // Fallback to local data if API fails
      try {
        const fallbackRecommendations = await getRecommendationsFallback(productId, category, relatedCategory);
        if (fallbackRecommendations && fallbackRecommendations.length > 0) {
          setRecommendations(fallbackRecommendations);
          setError(null);
        }
      } catch (fallbackError) {
        console.error('Fallback recommendation error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id || product._id}`);
  };

  if (loading) {
    return (
      <div className="w-full p-4">
        <h3 className="text-xl font-semibold mb-4">You might also like</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="min-w-[200px] h-[280px] bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
    return null; // Don't show anything if there's an error or no recommendations
  }

  return (
    <div className="w-full p-4" data-testid="product-recommendations">
      <h3 className="text-xl font-semibold mb-4">
        {relatedCategory 
          ? `Recommended ${relatedCategory.replace('_', ' ')} for this ${category.replace('_', ' ')}`
          : 'You might also like'}
      </h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {recommendations.map((product) => (
          <div 
            key={product.id || product._id} 
            className="min-w-[200px] border rounded-md p-4 hover:shadow-md transition-shadow"
            data-testid={`recommendation-${product.id || product._id}`}
          >
            <img 
              src={product.main_picture_url} 
              alt={product.name} 
              className="w-full h-32 object-contain mb-2 cursor-pointer" 
              onClick={() => handleProductClick(product)}
            />
            <h4 className="font-medium text-sm mb-1 cursor-pointer" onClick={() => handleProductClick(product)}>
              {product.name}
            </h4>
            <p className="text-gray-500 text-xs mb-2">{product.brand_name}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">${(product.price_cents / 100).toFixed(2)}</span>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 text-white rounded-md px-2 py-1 text-xs"
                data-testid={`add-to-cart-${product.id || product._id}`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendation;
