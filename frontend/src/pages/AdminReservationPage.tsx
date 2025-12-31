import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaCalendarAlt, FaArrowLeft, FaUser, FaPhoneAlt, FaUsers } from 'react-icons/fa';

interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const AdminReservationPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Bookings Backend එකෙන් ගෙන්වා ගැනීම
  const fetchReservations = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/reservations');
      setReservations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Status වෙනස් කිරීම (Confirm/Cancel)
  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/reservations/${id}`, { status });
      fetchReservations(); // Data ආයේ refresh කරනවා
      alert(`Reservation ${status} Successfully!`);
    } catch (error) {
      alert('Action Failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      
      {/* 👇 1. Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)' 
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-900/60 p-6 rounded-2xl backdrop-blur-md border border-gray-700 shadow-xl">
            <div>
                <h1 className="text-3xl font-bold text-yellow-500 flex items-center gap-3">
                    <FaCalendarAlt /> Table Reservations
                </h1>
                <p className="text-gray-400 text-sm mt-1 ml-1">Manage incoming dining requests.</p>
            </div>
            
            <Link 
                to="/" 
                className="mt-4 md:mt-0 bg-gray-800/80 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-700 transition border border-gray-600 hover:border-yellow-500 group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition"/> Back to Dashboard
            </Link>
        </div>

        {/* Reservations Table Container */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-700">
                  <th className="p-5">Customer Details</th>
                  <th className="p-5">Date & Time</th>
                  <th className="p-5">Guests</th>
                  <th className="p-5">Contact Info</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {reservations.map((res) => (
                  <tr key={res._id} className="hover:bg-white/5 transition duration-200">
                    
                    {/* Customer Name */}
                    <td className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <FaUser />
                            </div>
                            <span className="font-bold text-white text-lg">{res.name}</span>
                        </div>
                    </td>

                    {/* Date & Time */}
                    <td className="p-5">
                        <div className="font-medium text-yellow-500">{res.date}</div>
                        <div className="text-xs text-gray-400 mt-1 bg-gray-800 px-2 py-1 rounded w-fit">
                            {res.time}
                        </div>
                    </td>

                    {/* Guests */}
                    <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-300">
                            <FaUsers className="text-gray-500"/> {res.guests} Pax
                        </div>
                    </td>

                    {/* Contact */}
                    <td className="p-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm flex items-center gap-2 text-gray-300"><FaPhoneAlt size={10}/> {res.phone}</span>
                            <span className="text-xs text-gray-500">{res.email}</span>
                        </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        res.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        res.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse'
                      }`}>
                        {res.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-center">
                      {res.status === 'Pending' ? (
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => updateStatus(res._id, 'Confirmed')}
                            className="bg-green-600 p-2 rounded-lg hover:bg-green-500 text-white transition shadow-lg hover:shadow-green-500/20"
                            title="Confirm Booking"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => updateStatus(res._id, 'Cancelled')}
                            className="bg-red-600 p-2 rounded-lg hover:bg-red-500 text-white transition shadow-lg hover:shadow-red-500/20"
                            title="Cancel Booking"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {reservations.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center opacity-60">
                <FaCalendarAlt className="text-6xl text-gray-600 mb-4" />
                <p className="text-xl text-gray-400">No reservations found yet.</p>
                <p className="text-sm text-gray-500">Wait for customers to book a table.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReservationPage;