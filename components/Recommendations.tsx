import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

interface RecommendationsProps {
  productId: string;
  title?: string;
  type: 'recommended' | 'frequently-bought-together';
}

export default function Recommendations({ productId, title, type }: RecommendationsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultTitle = type === 'recommended' 
    ? 'Customers who bought this also bought'
    : 'Frequently bought together';

  useEffect(() => {
    fetchRecommendations();
  }, [productId, type]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'recommended' 
        ? `/api/recommendations/recommended/${productId}`
        : `/api/recommendations/frequently-bought-together/${productId}`;
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
      );
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">{title || defaultTitle}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
