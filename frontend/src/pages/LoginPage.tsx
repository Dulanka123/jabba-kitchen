import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // 1. Backend එකට Login Request එක යවනවා
      const response = await axios.post('https://jabba-kitchen.vercel.app/api/auth/login', { email, password });
      
      // 2. එන Data (Token & User Info) LocalStorage එකේ Save කරගන්නවා
      const userData = response.data;
      localStorage.setItem('userInfo', JSON.stringify(userData));

      // 3. Role එක Check කරලා අදාල තැනට යවනවා (Redirection Logic)
      if (userData.role === 'admin') {
        // Admin නම් Dashboard / POS එකට
        navigate('/'); 
      } else {
        // Customer (User) නම් කෙලින්ම කෑම ඇණවුම් කරන පිටුවට
        navigate('/customer'); 
      }

    } catch (err) {
      // Error Handling (any type error එක එන්නෙ නැති විදියට)
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Login Failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)'
        }}
      ></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-600">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
            JABBA'S KITCHEN
          </h1>
          <p className="text-gray-300">Welcome Back! Please login to continue.</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="p-3 mb-4 bg-red-500/80 text-white rounded-lg text-sm text-center border border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-5 py-3 bg-gray-800/50 text-white border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder-gray-500"
              placeholder="admin@jabba.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-5 py-3 bg-gray-800/50 text-white border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder-gray-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold text-white text-lg bg-gradient-to-r from-orange-500 to-red-600 rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Sign In 🚀
          </button>
        </form>

        <div className="text-center text-gray-400 text-sm mt-6">
          New to Jabba's?{' '}
          <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;