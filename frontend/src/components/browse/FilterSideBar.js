import React from 'react';
import { Sliders, ChevronDown } from 'lucide-react';

//#region Demo data for testing
const priceRanges = [
  'Under $100',
  '$100 - $300',
  '$300 - $500',
  '$500 - $1000',
  'Over $1000'
];

const brands = [
  'Apple',
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Huawei',
  'Others'
];

const conditions = [
  'Brand New',
  'Like New',
  'Excellent',
  'Good',
  'Fair'
];
//#endregion

function FilterSidebar() {
    return (
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-6">
          <Sliders className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
  
        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
            Price Range
            <ChevronDown className="h-4 w-4" />
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range} className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-600">{range}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
            Brand
            <ChevronDown className="h-4 w-4" />
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Condition Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
            Condition
            <ChevronDown className="h-4 w-4" />
          </h3>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label key={condition} className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-600">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default FilterSidebar;