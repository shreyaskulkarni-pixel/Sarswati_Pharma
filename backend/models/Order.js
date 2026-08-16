import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: String,
    items: [
      {
        medicineId: mongoose.Schema.Types.ObjectId,
        medicineName: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
