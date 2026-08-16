import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    manufacturer: String,
    description: String,
    dosage: String,
    sideEffects: String,
    uses: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
