import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    userEmail: string;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: string;
    status: 'Pending' | 'Shipped' | 'Delivered';
}

const OrderSchema: Schema = new Schema({
    userEmail: { type: String, required: true },
    items: { type: [Object], required: true },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
