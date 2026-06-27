import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import Sidebar, { FilterState } from '@/components/Sidebar';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; alt: string }[];
  ratings: { average: number; count: number };
  category: string;
  discount?: number;
}

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
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
    if (category) {
      fetchProducts();
    }
  }, [category, sortBy, filters.brands, filters.priceRange, filters.rating]);

  const getCategoryName = (slug: string): string => {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Electronics',
      'clothing': 'Clothing',
      'books': 'Books',
      'home-kitchen': 'Home & Kitchen',
      'sports-outdoors': 'Sports & Outdoors',
      'toys-games': 'Toys & Games',
      'beauty-personal-care': 'Beauty & Personal Care',
      'automotive': 'Automotive',
      'health-household': 'Health & Household',
      'groceries': 'Groceries',
      'baby': 'Baby',
      'pet-supplies': 'Pet Supplies',
      'office-products': 'Office Products',
    };
    return categoryMap[slug.toLowerCase()] || slug;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categoryName = getCategoryName(category as string);
      const params = new URLSearchParams();
      params.append('category', categoryName);
      if (sortBy) params.append('sort', sortBy);
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

  const categoryName = getCategoryName(category as string || '');

  return (
    <Layout>
      <Head>
        <title>{categoryName} - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

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
                <p className="text-gray-600">Check back later for new items!</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  {products.length} {products.length === 1 ? 'result' : 'results'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
