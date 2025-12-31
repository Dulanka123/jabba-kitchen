import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserFriends, FaArrowLeft } from 'react-icons/fa';

const ReservationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'guests' ? parseInt(value) || 0 : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://jabba-kitchen.vercel.app/api/reservations', formData);
      alert('Table Reserved Successfully! We will contact you soon. 📅');
      navigate('/customer');
    } catch (error) {
      alert('Booking Failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>

      <div className="relative z-10 w-full max-w-lg bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        <button onClick={() => navigate('/customer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
           <FaArrowLeft /> Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-2">Book A Table 🪑</h1>
        <p className="text-center text-gray-400 mb-8">Reserve your spot at Jabba's Kitchen</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Name</label>
            <input type="text" name="name" value={formData.name} required className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none" onChange={handleChange} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} required className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none" onChange={handleChange} />
            </div>
            <div>
                <label className="block text-sm text-gray-300 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} required className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none" onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-300 mb-1"><FaCalendarAlt className="inline mr-1"/> Date</label>
                <input type="date" name="date" value={formData.date} min={new Date().toISOString().split('T')[0]} required className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none" onChange={handleChange} />
            </div>
            <div>
                <label className="block text-sm text-gray-300 mb-1"><FaClock className="inline mr-1"/> Time</label>
                <input type="time" name="time" value={formData.time} required className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1"><FaUserFriends className="inline mr-1"/> Number of Guests</label>
            <input type="number" name="guests" value={formData.guests} min="1" max="20" required className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none" onChange={handleChange} />
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold text-lg rounded-xl hover:scale-[1.02] transition shadow-lg mt-4">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;