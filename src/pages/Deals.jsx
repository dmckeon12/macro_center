import React from "react";
import Card from "../components/Card";
import data from "../assets/data";

const Deals = () => {
  // Simulate deals by adding a random discount to each product
  const productsWithDiscounts = data.products.map(product => {
    // Generate a random discount between 5% and 30%
    const discountPercentage = Math.floor(Math.random() * 26) + 5; // 5 to 30%
    return {
      ...product,
      original_price: product.price_cents,
      price_cents: Math.floor(product.price_cents * (1 - discountPercentage / 100)),
      discount_percentage: discountPercentage
    };
  });
  
  // Group products by category
  const productsByCategory = {};
  
  productsWithDiscounts.forEach(product => {
    const category = product.category;
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });
  
  // Get top 2 deals from each category
  const dealsProducts = [];
  
  Object.keys(productsByCategory).forEach(category => {
    // Sort by discount percentage (highest first)
    const sortedCategoryProducts = productsByCategory[category]
      .sort((a, b) => b.discount_percentage - a.discount_percentage)
      .slice(0, 2); // Take only the top 2
    
    dealsProducts.push(...sortedCategoryProducts);
  });
  
  // Sort all deals by discount percentage for display
  dealsProducts.sort((a, b) => b.discount_percentage - a.discount_percentage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 mb-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Special Deals</h1>
          <p className="text-lg opacity-90">
            Save big on premium computer components. Limited time offers on selected items.
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dealsProducts.map((product) => (
          <div key={product.id} className="relative">
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
              {product.discount_percentage}% OFF
            </div>
            <div className="bg-white dark:bg-[#1f1b24] rounded-xl p-4 shadow-sm">
              <Card product={product} />
              <div className="mt-2 text-center">
                <span className="text-gray-500 dark:text-gray-400 line-through mr-2">
                  ${((product.original_price || 0) / 100).toFixed(2)}
                </span>
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  ${((product.price_cents || 0) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;