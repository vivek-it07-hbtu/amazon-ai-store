import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/slices/cartSlice';
import toast from 'react-hot-toast';
import { formatINR } from '@/lib/currency';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; alt: string }[];
  ratings: { average: number; count: number };
  category: string;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || '/placeholder.png',
      })
    );
    toast.success('Added to cart!');
  };

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow p-4 cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 mb-4">
          <img
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-contain"
          />
          {product.discount != null && product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-grow">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-amazon-yellow">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={
                    i < Math.round(product.ratings.average)
                      ? 'fill-current'
                      : ''
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              ({product.ratings.count})
            </span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold text-red-600">
              {formatINR(finalPrice)}
            </span>
            {product.discount != null && product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatINR(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-amazon-orange hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
