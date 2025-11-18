import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  price: number;
  description: string;
  published: boolean;
  imageUrl: string;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  price: Number,
  description: String,
  published: { type: Boolean, default: false },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);