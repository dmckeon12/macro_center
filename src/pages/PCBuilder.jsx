import React, { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../assets/data";
import { BiChip, BiMemoryCard, BiDesktop } from "react-icons/bi";
import { BsMotherboard, BsLightningCharge } from "react-icons/bs";
import { CgSmartphoneRam } from "react-icons/cg";

const PCBuilder = () => {
  const [build, setBuild] = useState({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
  });

  const categories = {
    cpu: {
      name: "CPU",
      icon: BiChip,
      description: "Central Processing Unit",
    },
    motherboard: {
      name: "Motherboard",
      icon: BsMotherboard,
      description: "Main Circuit Board",
    },
    gpu: {
      name: "Graphics Card",
      icon: BiMemoryCard,
      description: "Graphics Processing Unit",
    },
    ram: {
      name: "RAM",
      icon: CgSmartphoneRam,
      description: "Memory",
    },
    storage: {
      name: "Storage",
      icon: BiDesktop,
      description: "SSD/HDD",
    },
    psu: {
      name: "Power Supply",
      icon: BsLightningCharge,
      description: "Power Supply Unit",
    },
  };

  const calculateTotal = () => {
    return Object.values(build)
      .filter(item => item)
      .reduce((total, item) => total + item.price_cents, 0);
  };

  const removePart = (category) => {
    setBuild(prev => ({
      ...prev,
      [category]: null
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">PC Builder</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select compatible components for your custom PC build
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Component Selection */}
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            const selectedPart = build[key];

            return (
              <div
                key={key}
                className="bg-white dark:bg-[#1f1b24] rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="font-semibold dark:text-white">{category.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/category/${key}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    {selectedPart ? "Change" : "Select"}
                  </Link>
                </div>

                {selectedPart && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedPart.main_picture_url}
                        alt={selectedPart.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div>
                        <h3 className="font-medium dark:text-white">{selectedPart.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{(selectedPart.price_cents / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removePart(key)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Build Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1f1b24] rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Build Summary</h2>
            
            <div className="space-y-4 mb-6">
              {Object.entries(build).map(([category, part]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {categories[category].name}
                  </span>
                  <span className="dark:text-white">
                    {part ? `₹${(part.price_cents / 100).toLocaleString()}` : "—"}
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">
                  ₹{(calculateTotal() / 100).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!Object.values(build).some(item => item)}
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;