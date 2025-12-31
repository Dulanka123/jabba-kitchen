import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaQuoteLeft, FaUser, FaRegCommentDots } from 'react-icons/fa';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/feedback');
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Calculate Average Rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      
      {/* 👇 1. Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25)' 
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gray-900/60 p-6 rounded-2xl backdrop-blur-md border border-gray-700 shadow-xl">
            <div className="flex items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-yellow-500 flex items-center gap-3">
                        <FaStar className="text-yellow-400"/> Customer Reviews
                    </h1>
                    <p className="text-gray-400 text-sm mt-1 ml-1">See what people are saying about us.</p>
                </div>
                
                {/* Average Rating Badge */}
                <div className="hidden md:flex flex-col items-center bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-600">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Average</span>
                    <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                        {averageRating} <FaStar size={16}/>
                    </div>
                </div>
            </div>
            
            <Link 
                to="/" 
                className="mt-4 md:mt-0 bg-gray-800/80 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-700 transition border border-gray-600 hover:border-yellow-500 group shadow-lg"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition"/> Back to Dashboard
            </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {loading ? (
                 <div className="col-span-full text-center text-gray-400 py-20">Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-gray-900/50 rounded-3xl border border-dashed border-gray-700 backdrop-blur-sm">
                    <FaRegCommentDots className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-xl">No reviews received yet.</p>
                    <p className="text-sm text-gray-600">Feedback will appear here.</p>
                </div>
            ) : (
                reviews.map((review) => (
                    <div 
                        key={review._id} 
                        className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-yellow-500/50 hover:bg-gray-800/80 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-gray-300 shadow-inner">
                                    <FaUser />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight">{review.name}</h3>
                                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                            <div className="bg-black/40 px-2 py-1 rounded-lg flex gap-1 text-yellow-500 text-xs border border-gray-700">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? "text-yellow-400 drop-shadow-md" : "text-gray-700"} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative mt-2">
                            <FaQuoteLeft className="absolute -top-1 -left-1 text-yellow-600/20 text-3xl" />
                            <p className="text-gray-300 italic pl-8 leading-relaxed text-sm">
                                "{review.comment}"
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;