import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const ReservationSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model<IReservation>('Reservation', ReservationSchema);