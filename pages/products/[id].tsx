import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ImageGallery from '@/components/ImageGallery';
import PrimeBadge from '@/components/PrimeBadge';
import Recommendations from '@/components/Recommendations';
import ReviewForm from '@/components/ReviewForm';
import axios from 'axios';
import Image from 'next/image';
import { FiStar, FiShoppingCart, FiHeart, FiMapPin, FiThumbsUp, FiShield, FiTruck } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/lib/slices/cartSlice';
import { RootState } from '@/lib/store';
import toast from 'react-hot-toast';
import { formatINR } from '@/lib/currency';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  stock: number;
  images: { url: string; alt: string }[];
  ratings: { average: number; count: number };
  brand: string;
  specifications: { [key: string]: string };
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  verifiedPurchase?: boolean;
  helpfulVotes?: number;
  createdAt: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
      fetchSentiment();
      // Track recently viewed
      trackRecentlyViewed(id as string);
    }
  }, [id]);

  const trackRecentlyViewed = (productId: string) => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [productId, ...recentlyViewed.filter((id: string) => id !== productId)].slice(0, 12);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}`
      );
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchSentiment = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}/sentiment`
      );
      setSentiment(response.data);
    } catch (error) {
      console.error('Error fetching sentiment:', error);
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    if (!token) {
      toast.error('Please login to vote');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}/helpful`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Thank you for your feedback!');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit vote');
    }
  };

  const handleAddToWishlist = async () => {
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/add`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInWishlist(true);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0]?.url || '',
      })
    );
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-amazon-orange text-white px-6 py-2 rounded"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{product.name} - Amazon Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <span className="text-sm text-gray-600 hover:underline cursor-pointer">
              Visit the {product.brand} Store
            </span>

            {/* Rating */}
            <div className="flex items-center gap-2 my-4 pb-4 border-b">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${
                      i < Math.round(product.ratings.average)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-amazon-blue hover:underline cursor-pointer text-sm">
                {product.ratings.count} ratings
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              {product.discount != null && product.discount > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-red-600">-{product.discount}%</span>
                    <span className="text-3xl font-bold text-red-600">
                      {formatINR(product.price * (1 - product.discount / 100))}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    List Price: <span className="line-through">{formatINR(product.price)}</span>
                  </div>
                </>
              )}
              {(product.discount == null || product.discount === 0) && (
                <span className="text-3xl font-bold">
                    {formatINR(product.price)}
                </span>
              )}
            </div>

            <PrimeBadge price={product.price} />

            {/* Description */}
            <div className="my-6 pb-6 border-b">
              <h2 className="font-bold text-base mb-2">About this item</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {product.description.split('.').filter(s => s.trim()).slice(0, 4).map((point, idx) => (
                  <li key={idx}>{point.trim()}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4 sticky top-4">
              <div className="text-3xl font-bold mb-4">
                {product.discount != null && product.discount > 0 
                  ? formatINR(product.price * (1 - product.discount / 100))
                  : formatINR(product.price)
                }
              </div>

              {product.price >= 25 && (
                <div className="flex items-center gap-2 text-sm mb-3">
                  <FiTruck className="text-amazon-blue" />
                  <span>
                    <span className="font-bold">FREE delivery</span> tomorrow
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <FiMapPin />
                <span>Deliver to United States</span>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 20 ? (
                  <p className="text-green-600 font-semibold text-lg">In Stock</p>
                ) : product.stock > 0 ? (
                  <p className="text-orange-600 font-semibold">Only {product.stock} left in stock - order soon</p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mb-3">
                <label className="text-sm font-semibold mb-2 block">Quantity:</label>
                <div className="flex items-center border rounded w-20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x text-center flex-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-amazon-orange text-white py-2 rounded-full hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-md"
                >
                  Add to Cart
                </button>
                <button 
                  disabled={product.stock === 0}
                  className="w-full bg-yellow-400 text-gray-900 py-2 rounded-full hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold shadow-md"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <FiShield className="mt-0.5 flex-shrink-0" />
                  <span>Secure transaction</span>
                </div>
                <div>
                  <span className="text-amazon-blue hover:underline cursor-pointer">Ships from</span> Amazon.com
                </div>
                <div>
                  <span className="text-amazon-blue hover:underline cursor-pointer">Sold by</span> {product.brand}
                </div>
              </div>

              <button
                onClick={handleAddToWishlist}
                className="w-full mt-4 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
              >
                <FiHeart className={inWishlist ? 'fill-red-500 text-red-500' : ''} />
                {inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="my-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-3 font-semibold text-sm w-1/3">{key}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Frequently Bought Together */}
        <div className="my-8 border-t pt-8">
          <Recommendations productId={product._id} type="frequently-bought-together" />
        </div>

        {/* Customers Who Bought This Also Bought */}
        <div className="my-8 border-t pt-8">
          <Recommendations productId={product._id} type="recommended" />
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Sentiment Summary */}
          {sentiment && sentiment.total > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">AI Sentiment Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm font-semibold">Positive</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-green-500 h-full flex items-center justify-end px-2 text-white text-xs font-semibold"
                      style={{ width: `${sentiment.percentage.positive}%` }}
                    >
                      {sentiment.percentage.positive > 10 && `${sentiment.percentage.positive}%`}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">{sentiment.count.positive}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm font-semibold">Neutral</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full flex items-center justify-end px-2 text-white text-xs font-semibold"
                      style={{ width: `${sentiment.percentage.neutral}%` }}
                    >
                      {sentiment.percentage.neutral > 10 && `${sentiment.percentage.neutral}%`}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">{sentiment.count.neutral}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm font-semibold">Negative</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-red-500 h-full flex items-center justify-end px-2 text-white text-xs font-semibold"
                      style={{ width: `${sentiment.percentage.negative}%` }}
                    >
                      {sentiment.percentage.negative > 10 && `${sentiment.percentage.negative}%`}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">{sentiment.count.negative}</div>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          {user && product && (
            <div className="mb-8">
              <ReviewForm productId={product._id} onReviewSubmitted={() => { fetchReviews(); fetchSentiment(); }} />
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
              {!user && (
                <p className="text-sm text-gray-500">
                  Please <a href="/login" className="text-amazon-blue hover:underline">login</a> to write a review
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Customer Reviews ({reviews.length})</h3>
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amazon-blue rounded-full flex items-center justify-center text-white font-bold">
                        {review.userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.userName || 'Anonymous User'}</span>
                          {review.verifiedPurchase && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded flex items-center gap-1">
                              <FiShield size={12} />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                } text-sm`}
                              />
                            ))}
                          </div>
                          {review.title && <span className="font-semibold text-sm">{review.title}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {review.sentiment && (
                    <div className="mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)} Sentiment
                      </span>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => handleHelpfulVote(review._id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-amazon-blue"
                    >
                      <FiThumbsUp size={14} />
                      Helpful {review.helpfulVotes ? `(${review.helpfulVotes})` : ''}
                    </button>
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
