import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  const fetchRecentlyViewed = async () => {
    try {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      if (recentlyViewed.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch product details for recently viewed products
      const productPromises = recentlyViewed.slice(0, 12).map((id: string) =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
          .then(res => res.data.product)
          .catch(() => null)
      );

      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts.filter(p => p !== null));
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      <h2 className="text-2xl font-bold mb-6">Your Recently Viewed Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
