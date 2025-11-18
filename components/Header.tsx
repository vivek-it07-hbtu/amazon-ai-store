import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiShoppingCart, FiSearch, FiMenu, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import MegaMenu from './MegaMenu';
import SearchSuggestions from './SearchSuggestions';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/account');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="bg-amazon-blue text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          <span className="text-white">amazon</span>
          <span className="text-amazon-orange">.clone</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 relative">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-black rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amazon-orange px-4 py-2 rounded-r-md hover:bg-orange-600"
            >
              <FiSearch className="text-xl" />
            </button>
          </div>
          {searchFocused && (
            <SearchSuggestions
              query={searchQuery}
              onClose={() => setSearchFocused(false)}
            />
          )}
        </form>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* User Account */}
          <a
            href="#"
            onClick={handleAccountClick}
            className="flex flex-col hover:opacity-80 cursor-pointer"
          >
            <span className="text-xs">Hello, {mounted ? (user?.firstName || 'Sign in') : 'Sign in'}</span>
            <span className="font-bold flex items-center">
              <FiUser className="mr-1" />
              Account
            </span>
          </a>

          {/* Orders */}
          <Link href="/orders" className="flex flex-col hover:opacity-80">
            <span className="text-xs">Returns</span>
            <span className="font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="flex items-center hover:opacity-80 relative">
            <FiShoppingCart className="text-3xl" />
            {mounted && items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amazon-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
            <span className="ml-2 font-bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-amazon-light px-4 py-2 flex items-center space-x-6 text-sm">
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center hover:opacity-80"
        >
          <FiMenu className="mr-2" />
          All
        </button>
        <Link href="/category/electronics" className="hover:opacity-80">
          Electronics
        </Link>
        <Link href="/category/clothing" className="hover:opacity-80">
          Clothing
        </Link>
        <Link href="/category/books" className="hover:opacity-80">
          Books
        </Link>
        <Link href="/category/home-kitchen" className="hover:opacity-80">
          Home & Kitchen
        </Link>
        <Link href="/deals" className="hover:opacity-80 text-amazon-yellow">
          Today's Deals
        </Link>
      </div>

      {/* Mega Menu */}
      <MegaMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
