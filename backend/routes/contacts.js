import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({ success: true, message: 'We received your message! We will respond soon.', data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all contact messages (admin)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
