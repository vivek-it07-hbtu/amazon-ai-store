import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { FiUser, FiMapPin, FiCreditCard, FiShield, FiPackage, FiHeart, FiSettings } from 'react-icons/fi';

export default function Account() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRecentOrders();
  }, [user]);

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders?limit=3`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecentOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <Head>
        <title>Your Account - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Orders */}
          <Link
            href="/orders"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-amazon-orange"
          >
            <FiPackage className="text-4xl text-amazon-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Your Orders</h2>
            <p className="text-gray-600">Track, return, or buy things again</p>
          </Link>

          {/* Login & Security */}
          <Link
            href="/account/security"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-amazon-orange"
          >
            <FiShield className="text-4xl text-amazon-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Login & Security</h2>
            <p className="text-gray-600">Edit login, name, and mobile number</p>
          </Link>

          {/* Addresses */}
          <Link
            href="/account/addresses"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-amazon-orange"
          >
            <FiMapPin className="text-4xl text-amazon-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Your Addresses</h2>
            <p className="text-gray-600">Edit addresses for orders and gifts</p>
          </Link>

          {/* Payment Options */}
          <Link
            href="/account/payment"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-amazon-orange"
          >
            <FiCreditCard className="text-4xl text-amazon-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Payment Options</h2>
            <p className="text-gray-600">Edit or add payment methods</p>
          </Link>

          {/* Wish List */}
          <Link
            href="/wishlist"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-amazon-orange"
          >
            <FiHeart className="text-4xl text-amazon-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Your Wish List</h2>
            <p className="text-gray-600">View and manage your wish list</p>
          </Link>

          {/* Account Settings */}
          <Link
            href="/account/settings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-amazon-orange"
          >
            <FiSettings className="text-4xl text-amazon-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Account Settings</h2>
            <p className="text-gray-600">Manage your preferences</p>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/orders" className="text-amazon-blue hover:underline">
              See all orders
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Link
                href="/"
                className="bg-amazon-orange text-white px-6 py-2 rounded hover:bg-orange-600 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 3).map((order: any) => (
                <div key={order._id} className="border rounded p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items?.length || 0} item(s) - ${order.total?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
