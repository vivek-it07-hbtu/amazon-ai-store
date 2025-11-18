import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FiSearch, FiClock } from 'react-icons/fi';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: { url: string; alt: string }[];
}

interface SearchSuggestionsProps {
  query: string;
  onClose: () => void;
}

export default function SearchSuggestions({ query, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/smart-search?q=${encodeURIComponent(query)}`
        );
        setSuggestions(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = (productId: string, productName: string) => {
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [productName, ...recent.filter((s: string) => s !== productName)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    router.push(`/products/${productId}`);
    onClose();
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  if (!query && recentSearches.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg max-h-96 overflow-y-auto z-50 border-t">
      {query.trim().length < 2 && recentSearches.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Recent Searches</h3>
          {recentSearches.map((search, idx) => (
            <button
              key={idx}
              onClick={() => handleRecentSearchClick(search)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded text-left"
            >
              <FiClock className="text-gray-400" />
              <span className="text-sm">{search}</span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && (
        <div>
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amazon-orange mx-auto"></div>
            </div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No suggestions found
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div>
              {suggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSuggestionClick(product._id, product.name)}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                >
                  <FiSearch className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {product.category} • ${product.price.toFixed(2)}
                    </div>
                  </div>
                  {product.images[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
