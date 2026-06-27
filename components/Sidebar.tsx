import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface SidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
  rating: number;
  discount: number;
  availability: string;
  condition: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    departments: true,
    brands: true,
    price: true,
    rating: true,
    color: false,
    size: false,
    discount: false,
    availability: false,
    condition: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    discount: 0,
    availability: 'all',
    condition: 'all',
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    
    const newFilters = { ...filters, colors: newColors };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    
    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (min: number, max: number) => {
    const newFilters = { ...filters, priceRange: { min, max } };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDiscountChange = (discount: number) => {
    const newFilters = { ...filters, discount };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleAvailabilityChange = (availability: string) => {
    const newFilters = { ...filters, availability };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleConditionChange = (condition: string) => {
    const newFilters = { ...filters, condition };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      discount: 0,
      availability: 'all',
      condition: 'all',
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const departments = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Toys & Games',
    'Beauty & Personal Care',
    'Automotive',
    'Health & Household',
    'Office Products',
    'Pet Supplies',
    'Baby',
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Sony',
    'LG',
    'Dell',
    'HP',
    'Lenovo',
    'Nike',
    'Adidas',
    'Puma',
    'Levi\'s',
    'Calvin Klein',
  ];

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Orange', hex: '#FFA500' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 to $50', min: 25, max: 50 },
    { label: '$50 to $100', min: 50, max: 100 },
    { label: '$100 to $200', min: 100, max: 200 },
    { label: '$200 & Above', min: 200, max: 10000 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-amazon-blue hover:text-amazon-orange"
          >
            Clear all
          </button>
        </div>

        {/* Departments */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('departments')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Department</span>
            {expandedSections.departments ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.departments && (
            <div className="space-y-2">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center cursor-pointer hover:text-amazon-orange">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(dept)}
                    onChange={() => handleCategoryChange(dept)}
                    className="mr-2"
                  />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Price</span>
            {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.price && (
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center cursor-pointer hover:text-amazon-orange">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      filters.priceRange.min === range.min &&
                      filters.priceRange.max === range.max
                    }
                    onChange={() => handlePriceChange(range.min, range.max)}
                    className="mr-2"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), filters.priceRange.max)
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      handlePriceChange(filters.priceRange.min, Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Reviews */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('rating')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Customer Reviews</span>
            {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center cursor-pointer hover:text-amazon-orange"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="mr-2"
                  />
                  <span className="text-sm flex items-center">
                    <span className="text-amazon-yellow">{'★'.repeat(rating)}</span>
                    <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
                    <span className="ml-1">& Up</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('brands')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Brand</span>
            {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.brands && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer hover:text-amazon-orange">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="mr-2"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('color')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Color</span>
            {expandedSections.color ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.color && (
            <div className="space-y-2">
              {colors.map((color) => (
                <label
                  key={color.name}
                  className="flex items-center cursor-pointer hover:text-amazon-orange"
                >
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.name)}
                    onChange={() => handleColorChange(color.name)}
                    className="mr-2"
                  />
                  <div
                    className="w-4 h-4 rounded border border-gray-300 mr-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Size */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('size')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Size</span>
            {expandedSections.size ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.size && (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-1 border rounded ${
                    filters.sizes.includes(size)
                      ? 'bg-amazon-blue text-white border-amazon-blue'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amazon-blue'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Discount */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('discount')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Discount</span>
            {expandedSections.discount ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.discount && (
            <div className="space-y-2">
              {[50, 40, 30, 20, 10].map((discount) => (
                <label
                  key={discount}
                  className="flex items-center cursor-pointer hover:text-amazon-orange"
                >
                  <input
                    type="radio"
                    name="discount"
                    checked={filters.discount === discount}
                    onChange={() => handleDiscountChange(discount)}
                    className="mr-2"
                  />
                  <span className="text-sm">{discount}% Off or more</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('availability')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Availability</span>
            {expandedSections.availability ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.availability && (
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === 'all'}
                  onChange={() => handleAvailabilityChange('all')}
                  className="mr-2"
                />
                <span className="text-sm">All</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === 'in-stock'}
                  onChange={() => handleAvailabilityChange('in-stock')}
                  className="mr-2"
                />
                <span className="text-sm">In Stock</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === 'prime'}
                  onChange={() => handleAvailabilityChange('prime')}
                  className="mr-2"
                />
                <span className="text-sm">Prime Eligible</span>
              </label>
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="mb-4 pb-4">
          <button
            onClick={() => toggleSection('condition')}
            className="flex justify-between items-center w-full font-semibold mb-2"
          >
            <span>Condition</span>
            {expandedSections.condition ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedSections.condition && (
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="condition"
                  checked={filters.condition === 'all'}
                  onChange={() => handleConditionChange('all')}
                  className="mr-2"
                />
                <span className="text-sm">All</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="condition"
                  checked={filters.condition === 'new'}
                  onChange={() => handleConditionChange('new')}
                  className="mr-2"
                />
                <span className="text-sm">New</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="condition"
                  checked={filters.condition === 'used'}
                  onChange={() => handleConditionChange('used')}
                  className="mr-2"
                />
                <span className="text-sm">Used</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-amazon-orange">
                <input
                  type="radio"
                  name="condition"
                  checked={filters.condition === 'refurbished'}
                  onChange={() => handleConditionChange('refurbished')}
                  className="mr-2"
                />
                <span className="text-sm">Refurbished</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
