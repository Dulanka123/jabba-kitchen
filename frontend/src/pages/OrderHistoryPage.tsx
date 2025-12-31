import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHistory, FaClock, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status?: string;
}

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(userInfo);

      try {
        // User ID එක යවලා එයාගේ Orders ගෙන්වා ගන්නවා
        const { data } = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
       {/* Background */}
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop')] bg-cover bg-center opacity-20 fixed"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <button onClick={() => navigate('/customer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
           <FaArrowLeft /> Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-8 flex items-center justify-center gap-3">
            <FaHistory /> My Order History
        </h1>

        {loading ? (
           <p className="text-center text-gray-400">Loading history...</p>
        ) : orders.length === 0 ? (
           <div className="text-center bg-gray-900/80 p-10 rounded-2xl border border-gray-700">
               <FaShoppingBag className="mx-auto text-5xl text-gray-600 mb-4" />
               <p className="text-xl text-gray-400">You haven't placed any orders yet.</p>
           </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-900/90 p-6 rounded-2xl border border-gray-700 hover:border-yellow-500/50 transition shadow-lg">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-700 pb-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order ID: {order._id.slice(-6)}</p>
                        <div className="flex items-center gap-2 text-yellow-500 font-bold">
                             <FaClock /> {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                        <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                            <FaCheckCircle /> {order.status || 'WhatsApp Order'}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-300">
                            <span>{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                            <span>Rs. {item.price * item.qty}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total Amount</span>
                    <span className="text-xl font-bold text-white">Rs. {order.totalPrice}.00</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;