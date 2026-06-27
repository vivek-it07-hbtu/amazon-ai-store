import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import DealBanner from '@/components/DealBanner';
import RecentlyViewed from '@/components/RecentlyViewed';
import Hero from '@/components/Hero';
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      title: 'Gaming Accessories',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575',
      link: '/category/electronics',
      items: ['Headsets', 'Keyboards', 'Mice', 'Controllers']
    },
    {
      title: 'Shop Laptops & Tablets',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      link: '/category/electronics',
      items: ['MacBooks', 'Windows Laptops', 'iPads', 'Chromebooks']
    },
    {
      title: 'Fashion Trends',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
      link: '/category/clothing',
      items: ['Dresses', 'Tops', 'Shoes', 'Jewelry']
    },
    {
      title: 'Home Refresh Ideas',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      link: '/category/home-kitchen',
      items: ['Dining', 'Kitchen', 'Decor', 'Bedding']
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
    fetchDealProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=12`
      );
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/featured/list`
      );
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchDealProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=8&sort=-discount`
      );
      const productsWithDiscount = (response.data.products || []).filter(
        (p: Product) => p.discount && p.discount > 0
      );
      setDealProducts(productsWithDiscount);
    } catch (error) {
      console.error('Error fetching deal products:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Amazon Clone - Shop Everything</title>
      </Head>
      <Layout>
        <Hero />
        
        {/* Deal Banner */}
        {dealProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 mt-6">
            <DealBanner
              title="Today's Deals"
              endTime={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              products={dealProducts}
            />
          </section>
        )}

        {/* Category Cards */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                image={category.image}
                link={category.link}
                items={category.items}
              />
            ))}
          </div>
        </section>
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-8 px-4 max-w-7xl mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Products */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Inspired by your browsing history</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <RecentlyViewed />
        </section>
      </Layout>
    </>
  );
}
