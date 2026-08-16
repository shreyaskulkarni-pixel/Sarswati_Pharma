export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-12 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">About SARASWATI PHARMA</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Revolutionizing pharmaceutical distribution with intelligent, real-time solutions.
        </p>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            At SARASWATI PHARMA, we aim to bridge the gap between pharmaceutical distributors and modern technology. Our intelligent chatbot and order management system help pharmacies and distributors streamline their operations, reduce time spent on inquiries, and ensure seamless access to quality medicines.
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            We believe that healthcare should be efficient, accessible, and powered by technology that understands the unique needs of the pharmaceutical industry.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Why Choose SARASWATI PHARMA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-2">🤖 AI-Powered Chat</h3>
              <p className="text-slate-600 dark:text-slate-400">Instant responses to medicine availability, pricing, and stock queries 24/7.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-2">📦 Smart Inventory</h3>
              <p className="text-slate-600 dark:text-slate-400">Real-time tracking of stock levels across all product categories.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-2">📋 Easy Orders</h3>
              <p className="text-slate-600 dark:text-slate-400">Simple, fast order placement with automated confirmation and tracking.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-2">🔒 Secure & Reliable</h3>
              <p className="text-slate-600 dark:text-slate-400">Enterprise-grade security with regular backups and 99.9% uptime.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Our Team</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            SARASWATI PHARMA is powered by a dedicated team of healthcare technology experts, pharmacists, and engineers who are passionate about improving the pharmaceutical distribution industry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-20 w-20 mx-auto bg-medical-100 dark:bg-medical-900 rounded-full flex items-center justify-center mb-4 text-2xl">
                👨‍⚕️
              </div>
              <h3 className="font-bold">Healthcare Expert</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pharma knowledge</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 mx-auto bg-medical-100 dark:bg-medical-900 rounded-full flex items-center justify-center mb-4 text-2xl">
                💻
              </div>
              <h3 className="font-bold">Tech Team</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Full-stack developers</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 mx-auto bg-medical-100 dark:bg-medical-900 rounded-full flex items-center justify-center mb-4 text-2xl">
                🎯
              </div>
              <h3 className="font-bold">Product Team</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">User experience</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-medical-500 to-medical-700 dark:from-medical-700 dark:to-medical-900 p-8 rounded-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Pharmacy Operations?</h2>
          <p className="mb-6 opacity-90">Get in touch with us to learn how SARASWATI PHARMA can help your business grow.</p>
          <a href="/contact" className="inline-block px-6 py-3 bg-white text-medical-700 font-bold rounded-lg hover:bg-slate-100 transition">
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}
