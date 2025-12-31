import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaFire, FaArrowLeft, FaUtensils, FaHourglassHalf } from 'react-icons/fa';
import type { Order } from '../types';

const KitchenPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. Orders ගන්න Function එක (Sorting logic එක්ක)
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get<Order[]>('http://localhost:5000/api/orders');
      
      // Completed නැති ඒවා උඩට එන විදියට Sort කරනවා
      const sortedOrders = data.sort((a, b) => {
        if (a.status === b.status) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // අලුත් ඒවා මුලට
        }
        return a.status === 'Completed' ? 1 : -1; // Pending ඒවා මුලට
      });

      // Completed Order පෙන්නන්න ඕන නැත්නම් මෙතන filter එකක් දාන්න පුළුවන්
      // const activeOrders = sortedOrders.filter(o => o.status !== 'Completed');
      setOrders(sortedOrders); 

    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // තත්පර 5න් 5ට Refresh වෙනවා
    return () => clearInterval(interval);
  }, []);

  // 2. Status Update කරන Function එක
  const updateStatus = async (id: string, status: 'Completed' | 'Pending') => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      
      // Frontend එකේ ඉක්මනට වෙනස් වෙන්න State update කරනවා (Network delay නැතුව)
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      
      // පස්සේ හරියටම backend එකෙන් data අදිනවා
      fetchOrders(); 
    } catch (error) { console.error(error); }
  };

  // 3. වෙලාව ගණනය කරන Function එක (Time Ago)
  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return "Just Now";
    if (minutes > 60) return `${Math.floor(minutes/60)} hrs ago`;
    return `${minutes} mins ago`;
  };

  // 4. Pending Orders ගණන
  const pendingCount = orders.filter(o => o.status !== 'Completed').length;

  return (
    <div 
      className="min-h-screen text-white p-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'black'
      }}
    >

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gray-900/60 p-6 rounded-2xl backdrop-blur-md border border-gray-700 shadow-xl">
            <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-500 ${pendingCount > 0 ? 'bg-orange-600 shadow-orange-500/40 animate-pulse' : 'bg-gray-700'}`}>
                    <FaFire size={32} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 tracking-tighter">
                    KITCHEN <span className="text-white">DISPLAY</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-mono mt-1 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${pendingCount > 0 ? 'bg-green-500 animate-ping' : 'bg-gray-500'}`}></span>
                        Live Feed • <span className="text-orange-400 font-bold">{pendingCount} Active Orders</span>
                    </p>
                </div>
            </div>
            
            <Link to="/" className="mt-6 md:mt-0 bg-gray-800/80 px-6 py-4 rounded-xl flex items-center gap-3 hover:bg-gray-700 transition border border-gray-600 hover:border-orange-500 group font-bold">
                <FaArrowLeft className="group-hover:-translate-x-1 transition"/> <span className="text-sm">BACK TO DASHBOARD</span>
            </Link>
        </div>

        {/* Orders Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            
            {orders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-32 bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-800 backdrop-blur-sm">
                    <div className="bg-gray-800 p-6 rounded-full mb-6">
                        <FaUtensils className="text-6xl text-gray-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-500">All Caught Up!</h2>
                    <p className="text-gray-600 mt-2">Waiting for new delicious orders...</p>
                </div>
            )}

            {orders.map((order) => {
                const isCompleted = order.status === 'Completed';
                return (
                    <div
                        key={order._id}
                        className={`flex flex-col rounded-2xl border-2 backdrop-blur-md transition-all duration-300 relative overflow-hidden group shadow-2xl ${
                            isCompleted
                            ? 'bg-gray-900/30 border-gray-800 opacity-60 hover:opacity-100 grayscale-[0.8] hover:grayscale-0 scale-95' 
                            : 'bg-gray-900/90 border-orange-500 shadow-orange-900/20 hover:-translate-y-2 hover:shadow-orange-500/20' 
                        }`}
                    >
                        {/* Status Strip (Top Color Bar) */}
                        <div className={`h-2 w-full ${isCompleted ? 'bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-yellow-500 animate-pulse'}`}></div>

                        {/* Card Header */}
                        <div className={`p-5 border-b flex justify-between items-start ${isCompleted ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-800 border-gray-700'}`}>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">ORDER ID</span>
                                <p className={`font-mono text-2xl font-extrabold ${isCompleted ? 'text-gray-500' : 'text-white'}`}>
                                    #{order._id.slice(-4)}
                                </p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 mb-1 ${
                                    isCompleted ? 'bg-gray-700 text-gray-400' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                }`}>
                                     <FaClock size={10}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {getTimeAgo(order.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Order Items List */}
                        <div className="p-5 flex-1 space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-gray-700/50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-extrabold shadow-md ${
                                            isCompleted ? 'bg-gray-700 text-gray-400' : 'bg-yellow-500 text-black'
                                        }`}>
                                        {item.qty}
                                        </div>
                                        <span className={`font-bold text-lg leading-tight ${isCompleted ? 'text-gray-500' : 'text-gray-200'}`}>
                                        {item.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Button Area */}
                        <div className="p-4 bg-black/40 border-t border-gray-700/50 mt-auto">
                            {isCompleted ? (
                                <button
                                    className="w-full py-4 bg-gray-800 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-gray-700 uppercase tracking-wider text-sm"
                                    disabled
                                >
                                    <FaCheckCircle /> Order Completed
                                </button>
                            ) : (
                                <button
                                    onClick={() => updateStatus(order._id, 'Completed')}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-900/30 active:scale-95 border-b-4 border-green-800 active:border-b-0 active:mt-1 uppercase tracking-wider text-sm group"
                                >
                                    <FaCheckCircle className="group-hover:scale-110 transition"/> MARK AS READY
                                </button>
                            )}
                            
                            {/* Wait Time Indicator */}
                            {!isCompleted && (
                                <div className="text-center mt-3 flex items-center justify-center gap-1 text-xs text-orange-400/60 font-mono">
                                    <FaHourglassHalf className="animate-spin-slow" /> Cooking in progress...
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;