import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiCreditCard, FiPlus, FiArrowLeft, FiTrash2, FiLock } from 'react-icons/fi';

interface Card {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
}

export default function Payment() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [cards, setCards] = useState<Card[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCard.cardNumber.slice(-4);
    const card: Card = {
      id: Date.now().toString(),
      last4,
      brand: 'Visa',
      expiry: newCard.expiry,
      isDefault: cards.length === 0,
    };
    setCards([...cards, card]);
    setShowForm(false);
    setNewCard({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
    toast.success('Card added successfully!');
  };

  const handleDelete = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success('Card removed');
  };

  return (
    <Layout>
      <Head>
        <title>Payment Options - Amazon Clone</title>
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/account" className="flex items-center gap-2 text-amazon-blue hover:underline mb-6">
          <FiArrowLeft /> Back to Your Account
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FiCreditCard className="text-3xl text-amazon-orange" />
            <h1 className="text-3xl font-bold">Payment Options</h1>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-amazon-orange text-white px-4 py-2 rounded hover:bg-orange-600 font-semibold">
            <FiPlus /> Add Card
          </button>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 mb-6 text-sm">
          <FiLock />
          <span>Your payment information is encrypted and secure. We never store full card numbers.</span>
        </div>

        {/* Add Card Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 border-2 border-amazon-orange">
            <h2 className="text-lg font-bold mb-4">Add a Credit or Debit Card</h2>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Card Number</label>
                <input type="text" required maxLength={16} placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={e => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Name on Card</label>
                <input type="text" required value={newCard.cardName}
                  onChange={e => setNewCard({ ...newCard, cardName: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Expiry (MM/YY)</label>
                  <input type="text" required maxLength={5} placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">CVV</label>
                  <input type="password" required maxLength={3} placeholder="•••"
                    value={newCard.cvv}
                    onChange={e => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-amazon-orange text-white px-6 py-2 rounded hover:bg-orange-600 font-semibold">
                  Add Card
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cards List */}
        {cards.length === 0 && !showForm ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-700">No payment methods saved</h2>
            <p className="text-gray-500 mb-6">Add a card to speed up checkout.</p>
            <button onClick={() => setShowForm(true)}
              className="bg-amazon-orange text-white px-8 py-3 rounded hover:bg-orange-600 font-semibold">
              Add a Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map(card => (
              <div key={card.id} className={`bg-white rounded-lg shadow p-5 flex justify-between items-center border-2 ${card.isDefault ? 'border-amazon-orange' : 'border-transparent'}`}>
                <div className="flex items-center gap-4">
                  <FiCreditCard className="text-3xl text-gray-600" />
                  <div>
                    {card.isDefault && <span className="text-xs bg-amazon-orange text-white px-2 py-0.5 rounded mb-1 inline-block">Default</span>}
                    <p className="font-bold">{card.brand} ending in {card.last4}</p>
                    <p className="text-gray-600 text-sm">Expires {card.expiry}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(card.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
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
