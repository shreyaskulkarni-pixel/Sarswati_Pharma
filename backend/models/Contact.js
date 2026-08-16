import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: String,
    subject: String,
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'responded'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
