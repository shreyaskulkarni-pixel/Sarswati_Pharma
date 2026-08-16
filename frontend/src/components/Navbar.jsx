import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-medical-500 to-cyan-500 text-white font-bold flex items-center justify-center">
            M
          </div>
          <span className="font-bold text-lg hidden md:inline">SARASWATI PHARMA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-medical-600 transition">
            Home
          </Link>
          <Link to="/catalog" className="hover:text-medical-600 transition">
            Catalog
          </Link>
          <Link to="/chat" className="hover:text-medical-600 transition">
            Chat
          </Link>
          <Link to="/orders" className="hover:text-medical-600 transition">
            Orders
          </Link>
          <Link to="/about" className="hover:text-medical-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-medical-600 transition">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
          <Link to="/" className="block py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            Home
          </Link>
          <Link to="/catalog" className="block py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            Catalog
          </Link>
          <Link to="/chat" className="block py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            Chat
          </Link>
          <Link to="/orders" className="block py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            Orders
          </Link>
          <Link to="/about" className="block py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            About
          </Link>
          <Link to="/contact" className="block py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
