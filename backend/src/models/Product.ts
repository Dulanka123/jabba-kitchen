import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  image?: string;       
  description?: string; 
  isAvailable: boolean;
  countInStock: number; // 👈 1. අලුතින් එකතු කළ කොටස (Interface එකට)
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: false },
    isAvailable: { type: Boolean, default: true },

    // 👈 2. අලුතින් එකතු කළ කොටස (Database Schema එකට)
    // Default value එක 0 දැම්මා. ඒ කියන්නේ Stock එක දැම්මේ නැත්නම් 0 කියලා ගන්නවා.
    countInStock: { type: Number, required: true, default: 0 }, 
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>('Product', ProductSchema);