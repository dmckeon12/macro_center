import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import data from "../assets/data";
import { BiChip, BiMemoryCard, BiDesktop, BiSelectMultiple } from "react-icons/bi";
import { BsMotherboard, BsLightningCharge } from "react-icons/bs";
import { CgSmartphoneRam } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";
import toast from 'react-hot-toast';
import ProductRecommendation from "../components/ProductRecommendation";
//PCBuilder: allows user to custom build a PC with each Component
// all extra functions are explained in readme
const PCBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [build, setBuild] = useState({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
  });
  
  // State for showing part selection modal
  const [showPartSelection, setShowPartSelection] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // State for tracking compatibility and performance metrics
  const [buildMetrics, setBuildMetrics] = useState({
    performance: 0,
    compatibility: true,
    wattage: 0,
    compatibilityIssues: []
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
      .reduce((total, item) => {
        // Ensure price_cents is a valid number
        const price = typeof item.price_cents === 'number' ? item.price_cents : 0;
        return total + price;
      }, 0);
  };

  const removePart = (category) => {
    setBuild(prev => ({
      ...prev,
      [category]: null
    }));
    toast.success(`${categories[category].name} removed from build`);
  };
  
  const addPart = (category, part) => {
    setBuild(prev => ({
      ...prev,
      [category]: part
    }));
    setShowPartSelection(false);
    toast.success(`${part.name} added to your build`);
  };
  
  const openPartSelection = (category) => {
    setCurrentCategory(category);
    setShowPartSelection(true);
  };
  
  // Calculate system performance and compatibility
  useEffect(() => {
    // Simple performance metric based on components
    let performanceScore = 0;
    let totalWattage = 0;
    const issues = [];
    
    // CPU impact
    if (build.cpu) {
      performanceScore += 20;
      totalWattage += 65; // Estimate CPU wattage
      
      // Check CPU+Motherboard compatibility
      if (build.motherboard && build.cpu.specs?.socket !== build.motherboard.specs?.socket) {
        issues.push(`CPU socket (${build.cpu.specs?.socket}) is not compatible with motherboard socket (${build.motherboard.specs?.socket})`);
      }
    }
    
    // GPU impact (highest impact on performance)
    if (build.gpu) {
      performanceScore += 40;
      totalWattage += 150; // Estimate GPU wattage
    }
    
    // RAM impact
    if (build.ram) {
      performanceScore += 15;
      totalWattage += 10; // Minimal RAM wattage
    }
    
    // Other components impact
    if (build.motherboard) performanceScore += 10;
    if (build.storage) performanceScore += 10;
    if (build.psu) {
      // Check if PSU can handle the build
      const psuWattage = build.psu.wattage || 500; // Default to 500W if not specified
      if (totalWattage > psuWattage * 0.8) { // 80% rule for PSU capacity
        issues.push(`Power supply (${psuWattage}W) may be insufficient for this build (${totalWattage}W estimated)`); 
      }
    }
    
    setBuildMetrics({
      performance: Math.min(performanceScore, 100),
      compatibility: issues.length === 0,
      wattage: totalWattage,
      compatibilityIssues: issues
    });
  }, [build]);
  
  const addAllToCart = () => {
    const parts = Object.values(build).filter(item => item);
    parts.forEach(part => {
      const validPart = {
        ...part,
        price_cents: typeof part.price_cents === 'number' ? part.price_cents : 0,
        qty: 1
      };
      dispatch(addToCart(validPart));
    });
    
    toast.success(`${parts.length} items added to cart`);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">PC Builder</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select compatible components for your custom PC build
        </p>
        
        {/* Build Performance Metrics */}
        {Object.values(build).some(item => item) && (
          <div className="p-6 bg-white dark:bg-[#1f1b24] rounded-lg shadow mb-8" data-testid="performance-metrics">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Performance Score */}
              <div className="flex-1 min-w-[200px]">
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-sm mb-2" data-testid="gaming-performance">Gaming Performance</span>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className={`h-2.5 rounded-full ${buildMetrics.performance > 70 ? 'bg-green-600' : buildMetrics.performance > 40 ? 'bg-yellow-400' : 'bg-red-600'}`}
                      style={{ width: `${buildMetrics.performance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Estimated Wattage */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Estimated Wattage</p>
                <p className="font-semibold dark:text-white">{buildMetrics.wattage} W</p>
              </div>
            </div>
            
            {/* Compatibility Status */}
            <div className="bg-white dark:bg-[#1f1b24] p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Compatibility Status</h2>
              
              {/* Show compatibility status */}
              <div 
                className={`p-4 rounded-md mb-6 ${buildMetrics.compatibility 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}
                data-testid="compatibility-status"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${buildMetrics.compatibility ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="font-medium">
                    {buildMetrics.compatibility ? 'Compatible' : 'Incompatible'}
                  </p>
                </div>
              </div>
              
              {/* Compatibility Issues */}
              {buildMetrics.compatibilityIssues.map((issue, index) => (
                <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-2" data-testid="compatibility-warning">
                  <p className="text-sm text-red-700 dark:text-red-200">{issue}</p>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
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
                  <button
                    onClick={() => openPartSelection(key)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    {selectedPart ? "Change" : "Select"}
                  </button>
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
                          ${((selectedPart.price_cents || 0) / 100).toFixed(2)}
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
                    {part ? `$${((part.price_cents || 0) / 100).toFixed(2)}` : "—"}
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">
                  ${(calculateTotal() / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={addAllToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!Object.values(build).some(item => item)}
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
      
      {/* Part Selection Modal */}
      {showPartSelection && currentCategory && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1f1b24] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold dark:text-white">Select {categories[currentCategory].name}</h2>
              <button 
                onClick={() => setShowPartSelection(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Show recommendations based on current build */}
              {build.cpu && currentCategory === 'motherboard' && (
                <div className="mb-6" data-testid="motherboard-recommendations">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Recommended for your CPU</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <p className="text-sm">These motherboards are compatible with your {build.cpu.name} CPU (Socket: {build.cpu.specs?.socket})</p>
                  </div>
                </div>
              )}
              
              {build.motherboard && currentCategory === 'ram' && (
                <div className="mb-6" data-testid="ram-recommendations">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Recommended for your Motherboard</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <p className="text-sm">These memory modules are compatible with your {build.motherboard.name} motherboard</p>
                  </div>
                </div>
              )}
              
              {build.cpu && currentCategory === 'gpu' && (
                <div className="mb-6" data-testid="gpu-recommendations">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Recommended Graphics Cards</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <p className="text-sm">These GPUs are balanced performance matches for your {build.cpu.name} CPU</p>
                  </div>
                </div>
              )}
              
              {/* If we have a CPU, motherboard, or GPU selected, show recommendations */}
              {((build.cpu && currentCategory === 'motherboard') || 
                (build.motherboard && currentCategory === 'ram') || 
                (build.cpu && currentCategory === 'gpu')) && (
                <div className="mb-6">
                  {build.cpu && currentCategory === 'motherboard' && (
                    <ProductRecommendation 
                      productId={build.cpu.id} 
                      category="cpu" 
                      relatedCategory="motherboard" 
                    />
                  )}
                  {build.motherboard && currentCategory === 'ram' && (
                    <ProductRecommendation 
                      productId={build.motherboard.id} 
                      category="motherboard" 
                      relatedCategory="ram" 
                    />
                  )}
                  {build.cpu && currentCategory === 'gpu' && (
                    <ProductRecommendation 
                      productId={build.cpu.id} 
                      category="cpu" 
                      relatedCategory="gpu" 
                    />
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.products
                  .filter(product => product.category.toLowerCase() === currentCategory)
                  .map(product => (
                    <div 
                      key={product.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex-shrink-0 h-40 flex items-center justify-center mb-4">
                          <img 
                            src={product.main_picture_url} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2 line-clamp-2 dark:text-white">{product.name}</h3>
                          <p className="text-green-600 font-semibold">${(product.price_cents / 100).toLocaleString()}</p>
                          
                          <div className="mt-2 space-y-1">
                            {/* Show key specs based on category */}
                            {currentCategory === 'cpu' && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">Socket: {product.specs?.socket || 'N/A'}</p>
                            )}
                            {currentCategory === 'motherboard' && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">Form Factor: {product.specs?.form_factor || 'ATX'}</p>
                            )}
                            {currentCategory === 'gpu' && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">VRAM: {product.specs?.memory || '8GB'}</p>
                            )}
                            {currentCategory === 'ram' && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">Capacity: {product.specs?.capacity || '16GB'}</p>
                            )}
                            {currentCategory === 'storage' && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">Type: {product.specs?.form_factor || 'SSD'}</p>
                            )}
                            {currentCategory === 'psu' && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">Wattage: {product.specs?.wattage || '650W'}</p>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => addPart(currentCategory, product)}
                          className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCBuilder;