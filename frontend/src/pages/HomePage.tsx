import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// 👇 Recharts imports මෙතනින් අයින් කළා (දැන් ඒවා DashboardCharts එක ඇතුලේ තියෙනවා)
import { 
  FaHamburger, 
  FaMoneyBillWave, 
  FaClipboardList, 
  FaUserCircle, 
  FaCalendarAlt, 
  FaUtensils, 
  FaCashRegister, 
  FaFire,
  FaStar,
  FaSignOutAlt,
  FaTimes,
  FaEnvelope,
  FaShieldAlt 
} from 'react-icons/fa'; 
import type { UserData, Order } from '../types';

// 👇 1. අපි අර කලින් හදපු Chart Component එක Import කළා
import { DashboardCharts } from '../components/DashboardCharts';

const HomePage = () => {
  const navigate = useNavigate();
  const [user] = useState<UserData | null>(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });

  // 👇 2. Chart එකට යවන්න Orders ටික Save කරගන්න State එකක් හැදුවා
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get<Order[]>('https://jabba-kitchen.vercel.app/api/orders');
        const productsRes = await axios.get('https://jabba-kitchen.vercel.app/api/products');
        
        const ordersData = ordersRes.data;
        setOrders(ordersData); // 👇 Orders ටික State එකට දැම්මා

        const revenue = ordersData.reduce((acc, order) => acc + (order.status !== 'Cancelled' ? order.totalPrice : 0), 0);

        setStats({
          totalOrders: ordersData.length,
          totalRevenue: revenue,
          totalProducts: productsRes.data.length
        });

        // (පරණ manual chart calculation එක මෙතනින් අයින් කළා, මොකද දැන් DashboardCharts එක ඒක බලාගන්නවා)

      } catch (error) { console.error("Error:", error); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) blur(2px)'
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header - Glass Effect */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome Back, <span className="text-yellow-500">{user?.name?.split(' ')[0] || 'Admin'}</span> 👋
            </h2>
            <p className="text-gray-300">Here's what's cooking in your business today.</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            
            {/* User Profile Button */}
            <button 
                onClick={() => setShowProfile(true)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-[2px] shadow-lg shadow-orange-500/20 hover:scale-110 transition-transform duration-200 cursor-pointer"
                title="View Profile"
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <FaUserCircle className="text-gray-200 text-2xl" />
              </div>
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg border border-red-500/50"
              title="Log Out"
            >
              <FaSignOutAlt /> <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
            icon={<FaMoneyBillWave className="text-green-400" />}
            trend="+12.5%"
            color="border-green-500/30 bg-green-900/20"
          />
          <StatCard
            title="Active Orders"
            value={stats.totalOrders.toString()}
            icon={<FaClipboardList className="text-yellow-400" />}
            trend="+5 New"
            color="border-yellow-500/30 bg-yellow-900/20"
          />
          <StatCard
            title="Menu Items"
            value={stats.totalProducts.toString()}
            icon={<FaHamburger className="text-orange-400" />}
            trend="Updated"
            color="border-orange-500/30 bg-orange-900/20"
          />
        </div>

        {/* Management Dashboard Section */}
        <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pl-2 border-l-4 border-yellow-500">
                Management Dashboard
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <DashboardLink 
                    to="/admin/reservations" 
                    icon={<FaCalendarAlt size={24} />} 
                    title="Reservations" 
                    subtitle="Manage Bookings"
                    color="text-blue-400"
                    bg="bg-blue-500/20"
                    borderColor="hover:border-blue-500"
                />
                <DashboardLink 
                    to="/orders" 
                    icon={<FaCashRegister size={24} />} 
                    title="POS Terminal" 
                    subtitle="New Order & Billing"
                    color="text-green-400"
                    bg="bg-green-500/20"
                    borderColor="hover:border-green-500"
                />
                <DashboardLink 
                    to="/kitchen" 
                    icon={<FaFire size={24} />} 
                    title="Kitchen Display" 
                    subtitle="View Active Orders"
                    color="text-red-400"
                    bg="bg-red-500/20"
                    borderColor="hover:border-red-500"
                />
                <DashboardLink 
                    to="/menu" 
                    icon={<FaUtensils size={24} />} 
                    title="Menu Items" 
                    subtitle="Add or Edit Foods"
                    color="text-yellow-400"
                    bg="bg-yellow-500/20"
                    borderColor="hover:border-yellow-500"
                />
                <DashboardLink 
                    to="/admin/reviews" 
                    icon={<FaStar size={24} />} 
                    title="Reviews" 
                    subtitle="View Feedback"
                    color="text-purple-400"
                    bg="bg-purple-500/20"
                    borderColor="hover:border-purple-500"
                />
            </div>
        </div>

        {/* 👇 3. ALUTH CHARTS SECTION */}
        {/* පරණ Chart div එක අයින් කරලා මේ අලුත් Component එක දැම්මා */}
        <DashboardCharts orders={orders} />

      </div>

      {/* PROFILE MODAL (POPUP) */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900/90 border border-yellow-500/50 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative transform scale-100">
                
                {/* Close Button */}
                <button 
                    onClick={() => setShowProfile(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <FaTimes size={20} />
                </button>

                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 p-1 shadow-lg shadow-orange-500/30">
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                            <FaUserCircle className="text-gray-300 text-6xl" />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="text-center space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.name || 'Admin User'}</h2>
                        <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-yellow-500/30">
                            <FaShieldAlt /> Administrator
                        </span>
                    </div>

                    <div className="bg-black/40 p-4 rounded-xl border border-gray-700 text-left space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                                <FaEnvelope />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Email Address</p>
                                <p className="text-sm font-medium text-gray-200 break-all">{user?.email || 'admin@example.com'}</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setShowProfile(false); handleLogout(); }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg mt-4 flex items-center justify-center gap-2"
                    >
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, icon, trend, color }: any) => (
  <div className={`bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border ${color} hover:bg-gray-800/80 transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-black/40 rounded-xl">{icon}</div>
      <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white/70">{trend}</span>
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
  </div>
);

const DashboardLink = ({ to, icon, title, subtitle, color, bg, borderColor }: any) => (
    <Link to={to} className={`bg-gray-900/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 ${borderColor} hover:bg-gray-800 transition group shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${bg} rounded-xl ${color} group-hover:text-white transition`}>
                {icon}
            </div>
        </div>
        <h3 className={`font-bold text-white text-lg group-hover:${color} transition`}>{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </Link>
);

export default HomePage;