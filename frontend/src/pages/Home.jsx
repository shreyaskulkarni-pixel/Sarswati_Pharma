import { useState, useEffect } from 'react';
import { medicinesAPI } from '../api';
import medicineHeroBg from '../assets/medicine.png';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, categories: 0, featured: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [medicinesRes, categoriesRes] = await Promise.all([
          medicinesAPI.getAll({ limit: 5 }),
          medicinesAPI.getCategories(),
        ]);
        setStats({
          total: medicinesRes.data.pagination.total,
          categories: categoriesRes.data.data.length,
          featured: medicinesRes.data.data,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75"
          style={{ backgroundImage: `url(${medicineHeroBg})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-slate-950/15" aria-hidden="true" />

        {/* Hero Section */}
        <section className="relative px-4 py-16 md:px-8 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-medical-100 dark:bg-medical-600/20 rounded-full">
              <span className="text-medical-700 dark:text-medical-200 font-medium text-sm">🏥 Welcome to SARASWATI PHARMA</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Your Trusted Pharmacy Partner
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Discover medicines, check inventory, place orders, and chat with our AI assistant — all in one place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/chat" className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-lg font-medium">
                💬 Start Chatting
              </a>
              <a href="/catalog" className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium">
                📦 Browse Catalog
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative px-4 py-12 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-200">{stats.total}</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Active Products</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <div className="text-3xl font-bold text-green-700 dark:text-green-200">{stats.categories}</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Categories</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-200">24/7</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Support Available</p>
            </div>
          </div>
        </section>
      </div>

      {/* Featured Products */}
      <section className="px-4 py-12 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">Featured Products</h2>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.featured.map((med) => (
                <div key={med._id} className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-lg mb-2">{med.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{med.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-medical-600 dark:text-medical-400 font-bold">₹{med.price}</span>
                    <span className={`text-sm ${med.stock > 50 ? 'text-green-600' : 'text-amber-600'}`}>
                      {med.stock > 0 ? `${med.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
