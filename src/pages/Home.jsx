import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { data } from "../assets/data";
import { BiChip, BiMemoryCard, BiDesktop } from "react-icons/bi";
import { BsMotherboard, BsLightningCharge } from "react-icons/bs";
import { CgSmartphoneRam } from "react-icons/cg";

const Home = () => {
  const categories = [
    { name: "CPUs", icon: BiChip, path: "/category/cpu" },
    { name: "GPUs", icon: BiMemoryCard, path: "/category/gpu" },
    { name: "Motherboards", icon: BsMotherboard, path: "/category/motherboard" },
    { name: "RAM", icon: CgSmartphoneRam, path: "/category/ram" },
    { name: "Storage", icon: BiDesktop, path: "/category/storage" },
    { name: "Power Supplies", icon: BsLightningCharge, path: "/category/psu" },
  ];

  const featuredProducts = data.products;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Build Your Dream PC</h1>
          <p className="text-lg mb-6">
            High-performance computer parts at competitive prices. From CPUs to GPUs, we've got everything you need.
          </p>
          <Link
            to="/build"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Building →
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.path}
                to={category.path}
                className="flex flex-col items-center p-6 bg-white dark:bg-[#1f1b24] rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Featured Products</h2>
          <Link
            to="/explore"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Deals Section */}
      <section className="mb-12">
        <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Today's Deals</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Save big on selected components
              </p>
            </div>
            <Link
              to="/deals"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Deals →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1f1b24] p-4 rounded-xl shadow-sm"
              >
                <div className="text-red-600 dark:text-red-400 font-semibold mb-2">
                  Save {Math.floor(Math.random() * 30 + 20)}%
                </div>
                <Card product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PC Builder CTA */}
      <section>
        <div className="bg-gray-900 dark:bg-[#121015] rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Build Your Custom PC</h2>
            <p className="text-gray-300 mb-6">
              Use our PC Builder tool to create your perfect custom build. We'll help you
              pick compatible parts and get the best performance for your budget.
            </p>
            <Link
              to="/build"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Launch PC Builder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
