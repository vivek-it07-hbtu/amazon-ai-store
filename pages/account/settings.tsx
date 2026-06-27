import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { logout } from '@/lib/slices/authSlice';
import { clearCart } from '@/lib/slices/cartSlice';
import { FiSettings, FiArrowLeft, FiBell, FiGlobe, FiLogOut, FiTrash2 } from 'react-icons/fi';

export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    priceDrops: true,
  });
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  return (
    <Layout>
      <Head>
        <title>Account Settings - Amazon Clone</title>
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/account" className="flex items-center gap-2 text-amazon-blue hover:underline mb-6">
          <FiArrowLeft /> Back to Your Account
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <FiSettings className="text-3xl text-amazon-orange" />
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiBell className="text-amazon-orange" /> Notification Preferences
          </h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => setNotifications({ ...notifications, [key]: !value })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amazon-orange"></div>
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveNotifications}
            className="mt-4 bg-amazon-orange text-white px-6 py-2 rounded hover:bg-orange-600 font-semibold"
          >
            Save Preferences
          </button>
        </div>

        {/* Language & Currency */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiGlobe className="text-amazon-orange" /> Language &amp; Region
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => toast.success('Regional settings saved!')}
            className="mt-4 bg-amazon-orange text-white px-6 py-2 rounded hover:bg-orange-600 font-semibold"
          >
            Save Settings
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 border-2 border-red-100">
          <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
            <FiTrash2 /> Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-red-800">Sign Out</p>
                <p className="text-sm text-red-600">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
