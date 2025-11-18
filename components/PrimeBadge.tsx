import { FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

interface PrimeBadgeProps {
  price: number;
}

export default function PrimeBadge({ price }: PrimeBadgeProps) {
  const isFreeShipping = price >= 25;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      {/* Prime Logo */}
      <div className="flex items-center mb-3">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded font-bold text-sm">
          prime
        </div>
        <span className="ml-2 text-sm text-gray-600">Try Prime for free</span>
      </div>

      {/* Shipping Info */}
      <div className="space-y-2">
        {isFreeShipping ? (
          <div className="flex items-start">
            <FiTruck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-600">FREE Delivery</p>
              <p className="text-xs text-gray-600">
                Order within 4 hrs 23 mins. Details
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <FiTruck className="text-amazon-blue mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm">
                <span className="font-semibold">FREE Delivery</span> on orders over $25
              </p>
            </div>
          </div>
        )}

        {/* Prime Benefits */}
        <div className="flex items-start">
          <FiShield className="text-amazon-blue mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm">Secure transaction</p>
        </div>

        <div className="flex items-start">
          <FiRefreshCw className="text-amazon-blue mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Easy returns</p>
            <p className="text-xs text-gray-600">30-day return window</p>
          </div>
        </div>
      </div>

      {/* Prime CTA */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-amazon-blue hover:text-amazon-orange cursor-pointer">
          Join Prime to save more and get unlimited FREE delivery
        </p>
      </div>
    </div>
  );
}
