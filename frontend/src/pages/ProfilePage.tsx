import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaArrowLeft, FaSave } from 'react-icons/fa';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. LocalStorage එකෙන් දැනට තියෙන User Data ගන්නවා
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
      navigate('/login');
      return;
    }
    const userInfo = JSON.parse(userInfoString);
    
    setName(userInfo.name);
    setEmail(userInfo.email);
    setRole(userInfo.role);
    setUserId(userInfo._id); // හෝ userInfo.id (Backend එකෙන් එවන විදියට)
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // 2. අලුත් නම Backend එකට යවනවා
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', {
        _id: userId,
        name: name,
      });

      // 3. සාර්ථක වුනාම LocalStorage එක Update කරනවා
      localStorage.setItem('userInfo', JSON.stringify(data));
      setMessage('Profile Updated Successfully! ✅');
    } catch (error) {
      setMessage('Update Failed ❌');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>

      <div className="relative z-10 w-full max-w-md bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        
        <button onClick={() => navigate('/customer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
           <FaArrowLeft /> Back to Menu
        </button>

        <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-6xl text-yellow-500 mb-3" />
            <h1 className="text-2xl font-bold">{name}</h1>
            <span className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 mt-2 uppercase">{role} Account</span>
        </div>

        {message && <div className={`p-3 mb-4 rounded text-center ${message.includes('Success') ? 'bg-green-600' : 'bg-red-600'}`}>{message}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-3 bg-gray-800 rounded border border-gray-600 focus:border-yellow-500 outline-none text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email Address (Cannot be changed)</label>
            <input 
                type="email" 
                value={email} 
                disabled 
                className="w-full p-3 bg-gray-800/50 rounded border border-gray-700 text-gray-400 cursor-not-allowed"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition flex items-center justify-center gap-2 mt-4">
            <FaSave /> Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;