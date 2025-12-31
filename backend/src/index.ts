import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes Import කිරීම
import authRoutes from './routes/authRoutes'; // Login/Register සඳහා
import productRoutes from './routes/productRoutes'; // Products සඳහා
import orderRoutes from './routes/orderRoutes'; // Orders සඳහා (මේක ඔයා හදලා ඇතැයි සිතමි)
import reservationRoutes from './routes/reservationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---

// 1. CORS Setup (වැදගත්ම කොටස)
// origin: '*' මගින් ඕනෑම තැනක සිට එන request වලට ඉඩ දේ (Frontend Port වෙනස් වුනාට ප්‍රශ්නයක් නෑ)
app.use(cors({
  origin: '*', 
  credentials: true
}));

// 2. JSON Data කියවීමට
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // OrderPage එක වැඩ කරන්න මේක ඕන
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);


// --- DATABASE CONNECTION & SERVER START ---
const MONGO_URI = process.env.MONGO_URI || '';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Error:', err);
  });