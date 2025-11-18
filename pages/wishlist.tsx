import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/slices/cartSlice';
import toast from 'react-hot-toast';

interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: { url: string; alt: string }[];
    stock: number;
    ratings: { average: number; count: number };
  };
  addedAt: string;
}

export default function Wishlist() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/wishlist');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlist(wishlist.filter((item) => item._id !== itemId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(
      addToCart({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: 1,
        image: item.productId.images[0]?.url || '',
      })
    );
    toast.success('Added to cart!');
  };

  if (!user) return null;

  return (
    <Layout>
      <Head>
        <title>Your Wish List - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <FiHeart className="text-4xl text-amazon-orange" />
          <h1 className="text-3xl font-bold">Your Wish List</h1>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-16">
            <FiHeart className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your wish list is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love for later!</p>
            <Link
              href="/"
              className="bg-amazon-orange text-white px-8 py-3 rounded-md hover:bg-orange-600 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <Link href={`/products/${item.productId._id}`}>
                  <div className="aspect-square relative">
                    <Image
                      src={item.productId.images[0]?.url || '/placeholder.jpg'}
                      alt={item.productId.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/products/${item.productId._id}`}>
                    <h3 className="font-semibold mb-2 hover:text-amazon-orange line-clamp-2">
                      {item.productId.name}
                    </h3>
                  </Link>

                  <p className="text-2xl font-bold text-amazon-orange mb-4">
                    ${item.productId.price.toFixed(2)}
                  </p>

                  {item.productId.stock > 0 ? (
                    <p className="text-green-600 text-sm mb-4">In Stock</p>
                  ) : (
                    <p className="text-red-600 text-sm mb-4">Out of Stock</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.productId.stock === 0}
                      className="flex-1 bg-amazon-orange text-white py-2 rounded hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="p-2 border rounded hover:bg-red-50 hover:border-red-600 hover:text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
