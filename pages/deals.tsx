import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import axios from 'axios';
import { FiTag, FiClock, FiTrendingUp, FiZap, FiPercent } from 'react-icons/fi';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; alt: string }[];
  ratings: { average: number; count: number };
  category: string;
  discount?: number;
}

export default function Deals() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    fetchDeals();
    
    // Countdown timer for daily deals
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?hasDiscount=true&sort=discount-desc`
      );
      setDeals(response.data.products || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Today's Deals - Amazon Clone</title>
      </Head>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 text-white py-16 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Section */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 animate-fade-in">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FiTag className="text-5xl" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg">
                    Today's Deals
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <FiZap className="text-yellow-300" />
                    <span className="text-yellow-200 font-semibold text-lg">Lightning Deals Active</span>
                  </div>
                </div>
              </div>
              <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium max-w-2xl">
                🔥 Save up to 70% on our best products - limited time only!
              </p>
              
              {/* Stats Bar */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="text-yellow-300 text-2xl" />
                    <div>
                      <div className="text-sm text-white/80">Available Deals</div>
                      <div className="text-2xl font-bold">{deals.length}+</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                  <div className="flex items-center gap-2">
                    <FiPercent className="text-yellow-300 text-2xl" />
                    <div>
                      <div className="text-sm text-white/80">Max Savings</div>
                      <div className="text-2xl font-bold">70% OFF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border-2 border-white/30 shadow-2xl min-w-[320px]">
              <div className="flex items-center gap-3 mb-4">
                <FiClock className="text-4xl text-yellow-300" />
                <h3 className="text-2xl font-bold">Deals End In</h3>
              </div>
              <div className="flex justify-center gap-3 text-center">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 min-w-[80px]">
                  <div className="text-4xl font-bold tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Hours</div>
                </div>
                <div className="flex items-center text-3xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 min-w-[80px]">
                  <div className="text-4xl font-bold tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Minutes</div>
                </div>
                <div className="flex items-center text-3xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 min-w-[80px]">
                  <div className="text-4xl font-bold tabular-nums animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Seconds</div>
                </div>
              </div>
              <div className="mt-4 text-center text-yellow-200 text-sm font-semibold animate-pulse">
                ⚡ Hurry! Deals refresh at midnight
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mb-4"></div>
            <p className="text-gray-600 text-xl font-semibold">Loading amazing deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
            <FiTag className="text-gray-400 text-7xl mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800">No deals available right now</h2>
            <p className="text-gray-600 text-lg">Check back later for amazing offers!</p>
          </div>
        ) : (
          <>
            {/* Deals Header */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900 flex items-center gap-3">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg">
                      {deals.length}
                    </span>
                    Exclusive Deals Available
                  </h2>
                  <p className="text-gray-700 text-lg flex items-center gap-2">
                    <FiZap className="text-orange-500" />
                    Don't miss out on these limited-time offers!
                  </p>
                </div>
                <div className="bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Average Savings</div>
                  <div className="text-3xl font-bold text-red-600 flex items-center gap-2">
                    <FiPercent />
                    {deals.length > 0 
                      ? Math.round(deals.reduce((acc, p) => acc + (p.discount || 0), 0) / deals.length)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map((product) => (
                <div 
                  key={product._id} 
                  className="relative group"
                >
                  {product.discount && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center gap-1">
                          <FiPercent size={18} />
                          <span className="text-xl">{product.discount}%</span>
                        </div>
                        <div className="text-[10px] text-red-100 text-center">OFF</div>
                      </div>
                    </div>
                  )}
                  <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-2xl text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">🔥 Don't Miss Out!</h3>
              <p className="text-xl mb-6 text-white/90">
                These deals won't last forever. Shop now and save big!
              </p>
              <div className="flex justify-center items-center gap-4 text-lg font-semibold">
                <FiClock className="text-2xl" />
                <span>New deals added daily at midnight</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
