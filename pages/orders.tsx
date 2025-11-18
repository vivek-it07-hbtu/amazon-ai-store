import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import axios from 'axios';
import Link from 'next/link';
import { FiPackage, FiClock, FiCheck, FiX } from 'react-icons/fi';

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FiCheck className="text-green-600" />;
      case 'cancelled':
        return <FiX className="text-red-600" />;
      case 'processing':
        return <FiClock className="text-yellow-600" />;
      default:
        return <FiPackage className="text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (!user) {
    return (
      <Layout>
        <Head>
          <title>My Orders - Amazon Clone</title>
        </Head>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your orders</p>
          <Link
            href="/login?redirect=/orders"
            className="bg-amazon-orange text-white px-8 py-3 rounded-md hover:bg-orange-600 inline-block"
          >
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Orders - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to create your first order!</p>
            <Link
              href="/"
              className="bg-amazon-orange text-white px-8 py-3 rounded-md hover:bg-orange-600 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">ORDER PLACED</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">TOTAL</p>
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">SHIP TO</p>
                    <p className="font-semibold">{order.shippingAddress?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">ORDER # {order.orderNumber}</p>
                    <Link
                      href={`/orders/${order._id}`}
                      className="text-amazon-blue hover:underline"
                    >
                      View order details
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {order.status.toLowerCase() === 'delivered' && (
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href={`/orders/${order._id}/review`}
                        className="text-amazon-blue hover:underline"
                      >
                        Write a product review
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
