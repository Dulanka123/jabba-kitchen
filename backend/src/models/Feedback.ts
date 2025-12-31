import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    name: string;
    rating: number; // 1 to 5 stars
    comment: string;
}

const FeedbackSchema: Schema = new Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);