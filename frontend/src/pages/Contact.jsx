import { useState } from 'react';
import { contactsAPI } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await contactsAPI.submit(form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-12 md:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">Contact Us</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Have questions? We'd love to hear from you. Fill out the form below and we'll get back to you soon.</p>

        {submitted && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
            ✅ Thank you! We've received your message and will respond soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Message *</label>
            <textarea
              required
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-lg font-medium disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-2">📍 Address</h3>
            <p className="text-slate-600 dark:text-slate-400">SHRI DATTASHILP APT, SHOP NO.2, SOMWAR PETH, SATARA 415002</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-2">📞 Phone</h3>
            <p className="text-slate-600 dark:text-slate-400">+91 9850744794</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-2">📧 Email</h3>
            <p className="text-slate-600 dark:text-slate-400">shri.shrikulkarni09@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
