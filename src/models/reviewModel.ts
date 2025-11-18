import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    rating: number;
    description: string;
    author: string;
    product_id: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    author: { type: String, default: 'Anônimo' },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true });

export default mongoose.model<IReview>('Review', ReviewSchema);