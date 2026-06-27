import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiShield, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';

export default function Security() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/password`,
        { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login & Security - Amazon Clone</title>
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/account" className="flex items-center gap-2 text-amazon-blue hover:underline mb-6">
          <FiArrowLeft /> Back to Your Account
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <FiShield className="text-3xl text-amazon-orange" />
          <h1 className="text-3xl font-bold">Login &amp; Security</h1>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiMail className="text-amazon-orange" /> Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-semibold">Name</p>
                <p className="text-gray-600">{user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-semibold">Role</p>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiLock className="text-amazon-orange" /> Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-amazon-orange text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
