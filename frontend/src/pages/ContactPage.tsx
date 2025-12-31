import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaInstagram, 
  FaFacebookF, 
  FaMapMarkerAlt, 
  FaArrowLeft, 
  FaPaperPlane 
} from 'react-icons/fa';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // 👇 ඔයාගේ විස්තර මෙතන වෙනස් කරගන්න
  const CONTACT_INFO = {
    whatsapp: '94759417428', // + ලකුණ නැතුව දාන්න
    phone: '+94 75 941 7428',
    email: 'hello@jabbaskitchen.com',
    address: 'No. 123, Food Street, Colombo 07',
    facebookLink: 'https://www.facebook.com',
    instagramLink: 'https://www.instagram.com'
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return alert('Please fill in all fields');
    
    // WhatsApp හරහා මැසේජ් එක යවන්න
    const text = `Name: ${name}\nMessage: ${message}`;
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    
    setName('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative flex items-center justify-center">
      
      {/* 👇 1. Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25) blur(3px)'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-5xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                    Get in Touch
                </h1>
                <p className="text-gray-400">We'd love to hear from you. Here's how you can reach us.</p>
            </div>
            <Link to="/customer" className="bg-gray-800/80 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-700 transition border border-gray-600 hover:border-yellow-500 group text-sm font-bold">
                <FaArrowLeft className="group-hover:-translate-x-1 transition"/> Back to Menu
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side: Contact Cards */}
          <div className="space-y-6">
            
            {/* Phone & WhatsApp Card */}
            <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 group-hover:scale-110 transition">
                        <FaWhatsapp size={24}/>
                    </div>
                    <h3 className="text-xl font-bold text-white">Call or Chat</h3>
                </div>
                <div className="space-y-3 pl-2">
                    <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition">
                        <FaPhoneAlt /> {CONTACT_INFO.phone} <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-500">Hotline</span>
                    </a>
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} target="_blank" className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition">
                        <FaWhatsapp /> {CONTACT_INFO.whatsapp} <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20">WhatsApp</span>
                    </a>
                </div>
            </div>

            {/* Email & Location Card */}
            <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700 hover:border-yellow-500/50 transition group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition">
                        <FaMapMarkerAlt size={24}/>
                    </div>
                    <h3 className="text-xl font-bold text-white">Visit Us</h3>
                </div>
                <div className="space-y-3 pl-2">
                    <p className="flex items-center gap-3 text-gray-300">
                        <FaMapMarkerAlt /> {CONTACT_INFO.address}
                    </p>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition">
                        <FaEnvelope /> {CONTACT_INFO.email}
                    </a>
                </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition text-center">
                <h3 className="text-lg font-bold text-white mb-4">Follow us on Social Media</h3>
                <div className="flex justify-center gap-6">
                    <a href={CONTACT_INFO.facebookLink} target="_blank" className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 transition">
                        <FaFacebookF />
                    </a>
                    <a href={CONTACT_INFO.instagramLink} target="_blank" className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50 transition">
                        <FaInstagram />
                    </a>
                </div>
            </div>

          </div>

          {/* Right Side: Quick Message Form */}
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl border border-gray-600 shadow-2xl h-fit">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-yellow-500" /> Send a Message
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Your Name</label>
                    <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full p-4 bg-black/40 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition text-white outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Message</label>
                    <textarea 
                        rows={5} 
                        placeholder="I want to know about..." 
                        className="w-full p-4 bg-black/40 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition text-white outline-none resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition flex justify-center items-center gap-2">
                    Send via WhatsApp <FaWhatsapp size={20}/>
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;