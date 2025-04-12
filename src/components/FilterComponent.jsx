/**
 * FilterComponent - side bar for filtering products in specific areas
 * includes price range filtering as well as name and featured 
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FilterComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const priceRanges = [
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100 - $500', min: 100, max: 500 },
    { label: '$500 - $1000', min: 500, max: 1000 },
    { label: 'Over $1000', min: 1000, max: null },
  ];

  const handlePriceFilter = (min, max) => {
    searchParams.set('minPrice', min);
    if (max) searchParams.set('maxPrice', max);
    else searchParams.delete('maxPrice');
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg">Filters</h3>
      
      <div className="space-y-2">
        <h4 className="font-medium">Price Range</h4>
        {priceRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => handlePriceFilter(range.min, range.max)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterComponent;
