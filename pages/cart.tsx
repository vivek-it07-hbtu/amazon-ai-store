import { useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { updateQuantity, removeFromCart } from '@/lib/slices/cartSlice';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/router';

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Shopping Cart - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              href="/"
              className="bg-amazon-orange text-white px-8 py-3 rounded-md hover:bg-orange-600 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="bg-white p-6 rounded-lg shadow flex gap-4">
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold text-amazon-orange mb-4">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-2 border-x">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-2"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-amazon-orange">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-amazon-orange text-white py-3 rounded-md hover:bg-orange-600 font-semibold"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/"
                  className="block text-center text-amazon-blue mt-4 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
