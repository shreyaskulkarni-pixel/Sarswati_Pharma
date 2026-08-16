import { useState, useEffect } from 'react';
import { medicinesAPI } from '../api';

function ProductCard({ med }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition border border-slate-200 dark:border-slate-700">
      <div className="mb-3">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{med.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{med.category}</p>
        {med.dosage && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{med.dosage}</p>}
      </div>

      {med.description && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{med.description}</p>}

      <div className="mb-4 flex justify-between items-center">
        <span className="text-medical-600 dark:text-medical-400 font-bold text-lg">
          {med.price > 0 ? `₹${med.price}` : 'Price TBD'}
        </span>
        <span className={`text-sm font-medium px-2 py-1 rounded ${med.stock > 50 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : med.stock > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {med.stock > 0 ? `${med.stock} in stock` : 'Out of Stock'}
        </span>
      </div>

      <button disabled={med.stock === 0} className={`w-full py-2 rounded-lg font-medium transition ${med.stock > 0 ? 'bg-medical-600 hover:bg-medical-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
        {med.stock > 0 ? 'Add to Order' : 'Unavailable'}
      </button>
    </div>
  );
}

function ManufacturerSection({ manufacturer, products }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Section header — click to toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{manufacturer}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-slate-400 text-xl">{open ? '▲' : '▼'}</span>
      </button>

      {/* Collapsible product grid */}
      {open && (
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((med) => (
            <ProductCard key={med._id} med={med} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Catalog() {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const medRes = await medicinesAPI.getAll({ limit: 200 });
      setMedicines(medRes.data.data);
    } catch (error) {
      console.error('Error loading catalog:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = medicines.filter(
    (med) =>
      !searchQuery ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group by manufacturer, Vithoba always first
  const grouped = filtered.reduce((acc, med) => {
    const key = med.manufacturer || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(med);
    return acc;
  }, {});
  const manufacturers = Object.keys(grouped).sort((a, b) =>
    a === 'Vithoba' ? -1 : b === 'Vithoba' ? 1 : a.localeCompare(b),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-slate-100">Product Catalog</h1>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by product name, brand or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Manufacturer Sections */}
        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : manufacturers.length === 0 ? (
          <p className="text-slate-500">No products found.</p>
        ) : (
          manufacturers.map((mfr) => (
            <ManufacturerSection key={mfr} manufacturer={mfr} products={grouped[mfr]} />
          ))
        )}
      </div>
    </div>
  );
}
