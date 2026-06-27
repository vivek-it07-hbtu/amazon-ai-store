import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiChevronRight, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface Subcategory {
  name: string;
  url: string;
}

interface Category {
  name: string;
  url: string;
  subcategories?: Subcategory[];
}

const menuData: Category[] = [
  {
    name: 'Electronics',
    url: '/category/electronics',
    subcategories: [
      { name: 'Laptops & Computers', url: '/category/electronics?subcategory=laptops' },
      { name: 'Smartphones & Tablets', url: '/category/electronics?subcategory=smartphones' },
      { name: 'TV & Home Theater', url: '/category/electronics?subcategory=tv' },
      { name: 'Cameras & Photography', url: '/category/electronics?subcategory=cameras' },
      { name: 'Headphones & Audio', url: '/category/electronics?subcategory=audio' },
      { name: 'Gaming Consoles', url: '/category/electronics?subcategory=gaming' },
    ],
  },
  {
    name: 'Clothing',
    url: '/category/clothing',
    subcategories: [
      { name: "Men's Fashion", url: '/category/clothing?subcategory=mens' },
      { name: "Women's Fashion", url: '/category/clothing?subcategory=womens' },
      { name: "Kids' Clothing", url: '/category/clothing?subcategory=kids' },
      { name: 'Shoes & Footwear', url: '/category/clothing?subcategory=shoes' },
      { name: 'Accessories', url: '/category/clothing?subcategory=accessories' },
      { name: 'Activewear', url: '/category/clothing?subcategory=activewear' },
    ],
  },
  {
    name: 'Home & Kitchen',
    url: '/category/home-kitchen',
    subcategories: [
      { name: 'Kitchen & Dining', url: '/category/home-kitchen?subcategory=kitchen' },
      { name: 'Furniture', url: '/category/home-kitchen?subcategory=furniture' },
      { name: 'Home Decor', url: '/category/home-kitchen?subcategory=decor' },
      { name: 'Bedding & Bath', url: '/category/home-kitchen?subcategory=bedding' },
      { name: 'Appliances', url: '/category/home-kitchen?subcategory=appliances' },
      { name: 'Storage & Organization', url: '/category/home-kitchen?subcategory=storage' },
    ],
  },
  {
    name: 'Books',
    url: '/category/books',
    subcategories: [
      { name: 'Fiction & Literature', url: '/category/books?subcategory=fiction' },
      { name: 'Non-Fiction', url: '/category/books?subcategory=nonfiction' },
      { name: 'Children & Young Adult', url: '/category/books?subcategory=childrens' },
      { name: 'Textbooks', url: '/category/books?subcategory=textbooks' },
      { name: 'Comics & Graphic Novels', url: '/category/books?subcategory=comics' },
      { name: 'eBooks & Kindle', url: '/category/books?subcategory=ebooks' },
    ],
  },
  {
    name: 'Sports & Outdoors',
    url: '/category/sports-outdoors',
    subcategories: [
      { name: 'Exercise & Fitness', url: '/category/sports-outdoors?subcategory=fitness' },
      { name: 'Outdoor Recreation', url: '/category/sports-outdoors?subcategory=outdoor' },
      { name: 'Team Sports', url: '/category/sports-outdoors?subcategory=team-sports' },
      { name: 'Cycling', url: '/category/sports-outdoors?subcategory=cycling' },
      { name: 'Water Sports', url: '/category/sports-outdoors?subcategory=water-sports' },
      { name: 'Camping & Hiking', url: '/category/sports-outdoors?subcategory=camping' },
    ],
  },
  {
    name: 'Toys & Games',
    url: '/category/toys-games',
    subcategories: [
      { name: 'Action Figures & Toys', url: '/category/toys-games?subcategory=action-figures' },
      { name: 'Board Games & Puzzles', url: '/category/toys-games?subcategory=board-games' },
      { name: 'Educational Toys', url: '/category/toys-games?subcategory=educational' },
      { name: 'Video Games', url: '/category/toys-games?subcategory=video-games' },
      { name: 'Dolls & Accessories', url: '/category/toys-games?subcategory=dolls' },
      { name: 'Building Sets', url: '/category/toys-games?subcategory=building-sets' },
    ],
  },
  {
    name: 'Beauty & Personal Care',
    url: '/category/beauty-personal-care',
    subcategories: [
      { name: 'Makeup', url: '/category/beauty-personal-care?subcategory=makeup' },
      { name: 'Skincare', url: '/category/beauty-personal-care?subcategory=skincare' },
      { name: 'Hair Care', url: '/category/beauty-personal-care?subcategory=haircare' },
      { name: 'Fragrances', url: '/category/beauty-personal-care?subcategory=fragrances' },
      { name: 'Personal Care', url: '/category/beauty-personal-care?subcategory=personal-care' },
      { name: 'Salon & Spa', url: '/category/beauty-personal-care?subcategory=salon-spa' },
    ],
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccountClick = () => {
    onClose();
    if (user) {
      router.push('/account');
    } else {
      router.push('/login');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-0 left-0 h-full bg-white z-50 shadow-xl w-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-amazon-light p-4 flex items-center justify-between">
          <button
            onClick={handleAccountClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amazon-blue">
              <FiUser className="text-xl" />
            </div>
            <div className="text-left">
              <div className="text-white text-sm">Hello, {mounted && user ? user.firstName : 'Sign In'}</div>
              <div className="text-white font-bold text-base">{mounted && user ? 'Your Account' : 'Sign In'}</div>
            </div>
          </button>
          <button
            onClick={onClose}
            className="text-white text-3xl hover:bg-amazon-dark rounded px-2 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Menu Items */}
        <div>
          <div className="border-b">
            <h2 className="px-4 py-3 font-bold text-lg">Shop By Department</h2>
          </div>

          {menuData.map((category) => (
            <div key={category.name} className="border-b">
              <div className="relative">
                <Link
                  href={category.url}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setTimeout(() => setActiveCategory(null), 100)}
                >
                  <span className="font-semibold text-gray-800">{category.name}</span>
                  {category.subcategories && <FiChevronRight className="text-gray-500" />}
                </Link>

                {/* Subcategories */}
                {category.subcategories && activeCategory === category.name && (
                  <div
                    className="bg-gray-50"
                    onMouseEnter={() => setActiveCategory(category.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.url}
                        onClick={onClose}
                        className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-amazon-orange transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Additional Links */}
          <div className="border-b bg-gray-50">
            <h2 className="px-4 py-3 font-bold text-lg text-gray-800">Programs & Features</h2>
          </div>
          <Link
            href="/prime"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors"
          >
            <span className="font-semibold">Prime Membership</span>
          </Link>
          <Link
            href="/deals"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Today's Deals
          </Link>
          <Link
            href="/gift-cards"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Gift Cards
          </Link>
          <Link
            href="/registry"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Registry
          </Link>
          <Link
            href="/sell"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Sell on Amazon
          </Link>
          
          {/* Settings & Help */}
          <div className="border-t bg-gray-50 mt-4">
            <h2 className="px-4 py-3 font-bold text-lg text-gray-800">Help & Settings</h2>
          </div>
          <Link
            href="/account"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Your Account
          </Link>
          <Link
            href="/orders"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Your Orders
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-gray-100 text-gray-800 transition-colors border-b"
          >
            Your Wish List
          </Link>
          {mounted && !user && (
            <Link
              href="/login"
              onClick={onClose}
              className="block px-4 py-3 hover:bg-gray-100 text-amazon-orange font-semibold transition-colors border-b"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
