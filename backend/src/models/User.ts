import mongoose, { Document, Schema } from 'mongoose';

// 1. User කෙනෙක්ට තියෙන දේවල් (TypeScript Interface)
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    // 👇 මෙතනට 'user' එකතු කළා
    role: 'admin' | 'staff' | 'user'; 
}

// 2. Database Schema එක (Mongoose)
const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        // 👇 මෙතන enum එකට 'user' දැම්මා, default එකත් 'user' කළා
        role: { type: String, enum: ['admin', 'staff', 'user'], default: 'user' },
    },
    {
        timestamps: true,
    }
);

// 3. Model එක එළියට යවමු
export default mongoose.model<IUser>('User', UserSchema);