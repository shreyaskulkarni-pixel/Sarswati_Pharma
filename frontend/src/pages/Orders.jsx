import { useState } from 'react';
import { ordersAPI, medicinesAPI } from '../api';

export default function Orders() {
  const [step, setStep] = useState('form'); // 'form' or 'confirmation'
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useState(() => {
    loadMedicines();
  }, []);

  async function loadMedicines() {
    try {
      const res = await medicinesAPI.getAll({ limit: 50 });
      setMedicines(res.data.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  }

  function addToCart(medicine) {
    const existing = cart.find((item) => item.medicineId === medicine._id);
    if (existing) {
      setCart(cart.map((item) => (item.medicineId === medicine._id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { medicineId: medicine._id, medicineName: medicine.name, quantity: 1, price: medicine.price }]);
    }
  }

  function removeFromCart(medicineId) {
    setCart(cart.filter((item) => item.medicineId !== medicineId));
  }

  function updateQuantity(medicineId, quantity) {
    if (quantity <= 0) {
      removeFromCart(medicineId);
    } else {
      setCart(cart.map((item) => (item.medicineId === medicineId ? { ...item, quantity } : item)));
    }
  }

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Please add items to your order');
      return;
    }

    setLoading(true);
    try {
      const res = await ordersAPI.create({
        ...form,
        items: cart,
      });
      setCreatedOrder(res.data.data);
      setStep('confirmation');
      setCart([]);
    } catch (error) {
      alert('Error placing order: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'confirmation' && createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-12 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">Order Confirmed!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Your order has been successfully placed.</p>

          <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-lg text-left mb-6">
            <p className="mb-2">
              <strong>Order Number:</strong> {createdOrder.orderNumber}
            </p>
            <p className="mb-2">
              <strong>Total Amount:</strong> ₹{createdOrder.totalAmount}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {createdOrder.status}
            </p>
            <p>
              <strong>Email:</strong> {createdOrder.customerEmail}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3">Order Items</h3>
            {createdOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-2 border-b border-slate-300 dark:border-slate-600 pb-2">
                <span>
                  {item.medicineName} x{item.quantity}
                </span>
                <span>₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setStep('form')} className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-lg font-medium">
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-12 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-slate-100">Place an Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Medicine List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Select Medicines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicines.map((med) => (
                <div key={med._id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold">{med.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{med.category}</p>
                  <p className="text-medical-600 dark:text-medical-400 font-bold my-2">₹{med.price}</p>
                  <button
                    onClick={() => addToCart(med)}
                    disabled={med.stock === 0}
                    className={`w-full py-2 rounded font-medium transition ${med.stock > 0 ? 'bg-medical-600 hover:bg-medical-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                  >
                    {med.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cart & Form */}
          <div>
            {/* Cart Summary */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="font-bold text-lg mb-4">Shopping Cart ({cart.length})</h3>
              {cart.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400 text-sm">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.medicineId} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span>{item.medicineName}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.medicineId, item.quantity - 1)} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">
                            -
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.medicineId, item.quantity + 1)} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">
                            +
                          </button>
                          <button onClick={() => removeFromCart(item.medicineId)} className="text-red-600 text-xs ml-2">
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-medical-600 dark:text-medical-400">₹{total}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handlePlaceOrder} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-4">Delivery Details</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Name *</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded dark:bg-slate-700 dark:text-slate-100 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email *</label>
                <input
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded dark:bg-slate-700 dark:text-slate-100 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Phone</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded dark:bg-slate-700 dark:text-slate-100 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Delivery Address</label>
                <textarea
                  rows="3"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded dark:bg-slate-700 dark:text-slate-100 text-sm"
                />
              </div>

              <button type="submit" disabled={loading || cart.length === 0} className="w-full py-2 bg-medical-600 hover:bg-medical-700 text-white rounded font-medium disabled:opacity-50 text-sm">
                {loading ? 'Placing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
