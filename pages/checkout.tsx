import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/router';
import axios from 'axios';
import { clearCart } from '@/lib/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiTruck, FiCreditCard, FiMapPin } from 'react-icons/fi';

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: shippingInfo,
        paymentMethod: 'Credit Card',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      router.push(`/orders/${response.data.order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to checkout</p>
          <button
            onClick={() => router.push('/login?redirect=/checkout')}
            className="bg-amazon-orange text-white px-8 py-3 rounded-md hover:bg-orange-600"
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Checkout - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-6">
                  <FiMapPin className="text-2xl text-amazon-orange" />
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.street}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, street: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, state: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="text-2xl text-amazon-orange" />
                  <h2 className="text-xl font-bold">Payment Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardName}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">CVV</label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({items.length}):</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-green-600 text-sm flex items-center gap-2">
                      <FiTruck /> FREE shipping on orders over $35!
                    </p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Order Total:</span>
                    <span className="font-bold text-amazon-orange">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full bg-amazon-orange text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>

                <p className="text-xs text-gray-600 mt-4 text-center">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
