import express from 'express';
import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import { notifyDistributorOnNewOrder } from '../services/notifications.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, deliveryAddress, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const medicine = await Medicine.findById(item.medicineId);
        if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
        const subtotal = medicine.price * item.quantity;
        totalAmount += subtotal;
        return {
          medicineId: medicine._id,
          medicineName: medicine.name,
          quantity: item.quantity,
          price: medicine.price,
          subtotal,
        };
      })
    );

    const orderNumber = `ORD-${Date.now()}`;
    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items: processedItems,
      totalAmount,
      deliveryAddress,
      notes,
    });

    const notificationResults = await notifyDistributorOnNewOrder(order);

    res.status(201).json({ success: true, data: order, notifications: notificationResults });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all orders (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { email, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (email) query.customerEmail = email;
    if (status) query.status = status;

    const orders = await Order.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
