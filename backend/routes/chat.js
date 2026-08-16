import express from 'express';
import Medicine from '../models/Medicine.js';

const router = express.Router();

// Rule-based chatbot logic
function ruleBasedReply(message, medicines) {
  const text = message.toLowerCase().trim();

  if (text.includes('stock') && (text.includes('low') || text.includes('summary'))) {
    const lowStock = medicines.filter((m) => m.stock < 100 && m.stock > 0).length;
    const outOfStock = medicines.filter((m) => m.stock === 0).length;
    return `📊 Stock Summary: ${lowStock} items with low stock, ${outOfStock} out of stock.`;
  }

  if (
    text.includes('antibiotic') ||
    text.includes('analgesic') ||
    text.includes('antihistamine')
  ) {
    const category = text.includes('antibiotic')
      ? 'Antibiotic'
      : text.includes('analgesic')
      ? 'Analgesic / Antipyretic'
      : 'Antihistamine';

    const items = medicines.filter(
      (m) => m.category.toLowerCase().includes(category.toLowerCase())
    );
    if (items.length === 0) {
      return `❌ No ${category.toLowerCase()} products found in catalog.`;
    }
    const names = items.slice(0, 5).map((m) => m.name);
    return `✅ Available ${category.toLowerCase()}s: ${names.join(', ')}.`;
  }

  const matches = medicines.filter(
    (m) =>
      text.includes(m.name.toLowerCase()) ||
      text.includes(m.category.toLowerCase()) ||
      text.includes(m.manufacturer?.toLowerCase() || '')
  );

  if (matches.length > 0) {
    const top = matches.slice(0, 3);
    const lines = top.map((m) => `💊 ${m.name} | Stock: ${m.stock} | ₹${m.price}/strip`).join('\n');
    return `Found ${matches.length} product(s):\n${lines}`;
  }

  if (text.includes('offer') || text.includes('discount')) {
    return '🎉 Current Offer: 8% discount on bulk orders (500+ strips). Contact support for details!';
  }

  if (text.includes('catalog') || text.includes('products')) {
    return `📦 Browse our full catalog by category (Antibiotic, Analgesic, Antihistamine, etc.). Try searching a medicine name or category.`;
  }

  return `👋 Hi! I can help with:\n• Medicine availability & pricing\n• Stock status\n• Category search (e.g., "antibiotics")\n• Special offers\n\nTry: "Paracetamol", "Show antibiotics", or "Stock summary".`;
}

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    const medicines = await Medicine.find();
    const reply = ruleBasedReply(message, medicines);

    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
