import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiMapPin, FiPlus, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function Addresses() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, address]);
    setShowForm(false);
    setNewAddress({ fullName: `${user.firstName} ${user.lastName}`, street: '', city: '', state: '', zipCode: '', country: 'United States', phone: '' });
    toast.success('Address added successfully!');
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address removed');
  };

  return (
    <Layout>
      <Head>
        <title>Your Addresses - Amazon Clone</title>
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/account" className="flex items-center gap-2 text-amazon-blue hover:underline mb-6">
          <FiArrowLeft /> Back to Your Account
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-3xl text-amazon-orange" />
            <h1 className="text-3xl font-bold">Your Addresses</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-amazon-orange text-white px-4 py-2 rounded hover:bg-orange-600 font-semibold"
          >
            <FiPlus /> Add Address
          </button>
        </div>

        {/* Add Address Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 border-2 border-amazon-orange">
            <h2 className="text-lg font-bold mb-4">Add a New Address</h2>
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input type="text" required value={newAddress.fullName}
                  onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Street Address</label>
                <input type="text" required value={newAddress.street}
                  onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input type="text" required value={newAddress.city}
                  onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">State</label>
                <input type="text" required value={newAddress.state}
                  onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ZIP Code</label>
                <input type="text" required value={newAddress.zipCode}
                  onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input type="tel" value={newAddress.phone}
                  onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-amazon-orange text-white px-6 py-2 rounded hover:bg-orange-600 font-semibold">
                  Add Address
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 && !showForm ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiMapPin className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-700">No addresses saved</h2>
            <p className="text-gray-500 mb-6">Add a delivery address to speed up checkout.</p>
            <button onClick={() => setShowForm(true)}
              className="bg-amazon-orange text-white px-8 py-3 rounded hover:bg-orange-600 font-semibold">
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(address => (
              <div key={address.id} className={`bg-white rounded-lg shadow p-5 border-2 ${address.isDefault ? 'border-amazon-orange' : 'border-transparent'}`}>
                {address.isDefault && (
                  <span className="text-xs bg-amazon-orange text-white px-2 py-0.5 rounded mb-2 inline-block">Default</span>
                )}
                <p className="font-bold">{address.fullName}</p>
                <p className="text-gray-700 text-sm mt-1">{address.street}</p>
                <p className="text-gray-700 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                <p className="text-gray-700 text-sm">{address.country}</p>
                {address.phone && <p className="text-gray-700 text-sm mt-1">Phone: {address.phone}</p>}
                <button onClick={() => handleDelete(address.id)}
                  className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                  <FiTrash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
