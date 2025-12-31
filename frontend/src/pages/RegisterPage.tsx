import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role 'user'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('https://jabba-kitchen.vercel.app/api/auth/register', {
        name,
        email,
        password,
        role, 
      });
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900">
      
      {/* 👇 1. Background Image එක මෙතනට දැම්මා */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)' // පින්තූරේ ටිකක් අඳුරු කළා අකුරු පේන්න
        }}
      ></div>

      {/* 👇 2. Register Form Container (Glass Effect එක්ක) */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-600">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Join JABBA'S
          </h1>
          <p className="text-gray-300 text-sm mt-2">Create your account to start ordering.</p>
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-500/80 text-white rounded-lg text-sm text-center border border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-bold text-gray-300 mb-1">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-bold text-gray-300 mb-1">Account Type</label>
            <div className="relative">
                <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                >
                <option value="user" className="bg-gray-800">Customer (I want to order food)</option>
                <option value="admin" className="bg-gray-800">Admin (Staff Member)</option>
                </select>
                {/* Custom arrow icon for dropdown */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 font-bold text-white text-lg bg-gradient-to-r from-orange-500 to-red-600 rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200 mt-6"
          >
            Create Account 🚀
          </button>
        </form>
        
        <div className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;