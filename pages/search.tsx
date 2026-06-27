import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import Sidebar, { FilterState } from '@/components/Sidebar';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; alt: string }[];
  ratings: { average: number; count: number };
  category: string;
  discount?: number;
}

export default function Search() {
  const router = useRouter();
  const { q, category, minPrice, maxPrice } = router.query;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (router.isReady) {
      fetchProducts();
    }
  }, [router.isReady, q, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (q) params.append('search', q as string);
      if (filters.categories.length > 0) params.append('category', filters.categories.join(','));
      if (filters.brands.length > 0) params.append('brands', filters.brands.join(','));
      params.append('minPrice', filters.priceRange.min.toString());
      params.append('maxPrice', filters.priceRange.max.toString());
      if (filters.rating > 0) params.append('minRating', filters.rating.toString());

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`
      );
      
      let filteredProducts = response.data.products || [];
      
      // Apply additional client-side filters
      if (filters.colors.length > 0) {
        filteredProducts = filteredProducts.filter((p: Product) => 
          filters.colors.some(color => p.name.toLowerCase().includes(color.toLowerCase()))
        );
      }
      
      if (filters.discount > 0) {
        filteredProducts = filteredProducts.filter((p: any) => 
          (p.discount || 0) >= filters.discount
        );
      }
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <Head>
        <title>{`${q ? `Search Results for "${q}"` : 'Search Products'} - Amazon Clone`}</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {q && (
          <h1 className="text-2xl font-bold mb-6">
            Search Results for "{q}"
            {products.length > 0 && (
              <span className="text-gray-600 font-normal ml-2">
                ({products.length} {products.length === 1 ? 'result' : 'results'})
              </span>
            )}
          </h1>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-4">No products found</h2>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
