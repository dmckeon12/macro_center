import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { products } from "../assets/data";
import { BiChip, BiMemoryCard, BiDesktop } from "react-icons/bi";
import { BsMotherboard, BsLightningCharge } from "react-icons/bs";
import { CgSmartphoneRam } from "react-icons/cg";

const CategoryPage = () => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  const categoryInfo = {
    cpu: {
      name: "CPUs",
      icon: BiChip,
      description: "Central Processing Units from top manufacturers",
    },
    gpu: {
      name: "GPUs",
      icon: BiMemoryCard,
      description: "High-performance Graphics Cards for gaming and work",
    },
    motherboard: {
      name: "Motherboards",
      icon: BsMotherboard,
      description: "Feature-rich motherboards for your build",
    },
    ram: {
      name: "RAM",
      icon: CgSmartphoneRam,
      description: "Memory modules for optimal performance",
    },
    storage: {
      name: "Storage",
      icon: BiDesktop,
      description: "SSDs and HDDs for all your storage needs",
    },
    psu: {
      name: "Power Supplies",
      icon: BsLightningCharge,
      description: "Reliable power supplies for your system",
    },
  };

  useEffect(() => {
    let filtered = products.filter((product) => 
      product.category.toLowerCase() === category.toLowerCase()
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured sorting (default)
        break;
    }

    // Apply price filtering
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) => 
          product.price_cents >= min * 100 &&
          (max ? product.price_cents <= max * 100 : true)
      );
    }

    setFilteredProducts(filtered);
  }, [category, sortBy, priceRange]);

  const CategoryIcon = categoryInfo[category]?.icon || BiChip;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CategoryIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold dark:text-white">
            {categoryInfo[category]?.name || "Products"}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {categoryInfo[category]?.description || "Browse our selection of products"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Filters */}
        <div className="md:w-64 space-y-4">
          <div className="bg-white dark:bg-[#1f1b24] rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-3 dark:text-white">Sort By</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="bg-white dark:bg-[#1f1b24] rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-3 dark:text-white">Price Range</h2>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white"
            >
              <option value="all">All Prices</option>
              <option value="0-100">Under ₹10,000</option>
              <option value="100-300">₹10,000 - ₹30,000</option>
              <option value="300-500">₹30,000 - ₹50,000</option>
              <option value="500">Over ₹50,000</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                No products found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;