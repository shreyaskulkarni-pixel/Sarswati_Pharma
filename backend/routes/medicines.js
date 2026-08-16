import express from 'express';
import Medicine from '../models/Medicine.js';

const router = express.Router();

// Get all medicines (paginated)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
      ];
    }

    const medicines = await Medicine.find(query).skip(skip).limit(Number(limit));
    const total = await Medicine.countDocuments(query);

    res.json({
      success: true,
      data: medicines,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Medicine.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get low stock medicines
router.get('/inventory/low-stock', async (req, res) => {
  try {
    const lowStock = await Medicine.find({ stock: { $lt: 100, $gt: 0 } });
    const outOfStock = await Medicine.find({ stock: 0 });
    res.json({ success: true, data: { lowStock, outOfStock } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
