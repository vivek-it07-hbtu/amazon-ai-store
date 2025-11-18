import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-amazon-blue text-white mt-auto">
      {/* Back to top */}
      <div
        className="bg-amazon-light text-center py-3 cursor-pointer hover:bg-gray-700"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:underline">
                Press Releases
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/sell" className="hover:underline">
                Sell on Amazon Clone
              </Link>
            </li>
            <li>
              <Link href="/affiliate" className="hover:underline">
                Become an Affiliate
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:underline">
                Advertise Your Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/account" className="hover:underline">
                Your Account
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:underline">
                Your Orders
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline">
                Help
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:underline">
                Shipping Rates
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:underline">
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-amazon-light text-center py-4 text-sm">
        <p>© 2025 Amazon Clone. Built with Next.js, Express, MongoDB, PostgreSQL</p>
        <p className="text-xs text-gray-400 mt-1">
          Educational project demonstrating full-stack e-commerce development
        </p>
      </div>
    </footer>
  );
}
