// File: server/src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

// 1. Order Item එකක හැඩය (Sub-document Interface)
interface OrderItem {
  name: string;
  qty: number;
  price: number;
  product: mongoose.Schema.Types.ObjectId;
}

// 2. Main Order එකේ හැඩය (Main Interface)
export interface IOrder extends Document {
  orderItems: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
}

// 3. Database Schema එක
const OrderSchema: Schema = new Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: { type: String, required: true, default: 'pending' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', OrderSchema);