import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaQuoteLeft } from 'react-icons/fa';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
}

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); // Mouse එක තියද්දි පාට වෙන්න
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  // දැනට තියෙන Reviews ගන්නවා
  useEffect(() => {
    fetchReviews();
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setName(JSON.parse(userInfo).name);
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/feedback');
      setReviews(data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a star rating! ⭐');
    
    try {
      await axios.post('http://localhost:5000/api/feedback', { name, rating, comment });
      alert('Thank you for your review! ❤️');
      setComment('');
      setRating(0);
      fetchReviews(); // අලුත් එක ලිස්ට් එකට එන්න Refresh කරනවා
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 fixed"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <button onClick={() => navigate('/customer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
           <FaArrowLeft /> Back to Menu
        </button>

        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-2">Customer Reviews ⭐</h1>
        <p className="text-center text-gray-400 mb-10">We value your feedback!</p>

        {/* Review Form */}
        <div className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl mb-12">
          <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input 
                        type="radio" 
                        name="rating" 
                        value={ratingValue} 
                        onClick={() => setRating(ratingValue)}
                        className="hidden"
                    />
                    <FaStar 
                        className="cursor-pointer transition" 
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#4b5563"} 
                        size={30}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            <textarea 
                className="w-full bg-gray-800 p-4 rounded-xl border border-gray-600 focus:border-yellow-500 outline-none text-white h-32 mb-4"
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            ></textarea>

            <button type="submit" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-400 transition">
              Submit Review
            </button>
          </form>
        </div>

        {/* Existing Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {reviews.map((review) => (
            <div key={review._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center font-bold text-black">
                      {review.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="font-bold text-white">{review.name}</h3>
                     <div className="flex text-yellow-500 text-xs">
                       {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                     </div>
                   </div>
                </div>
                <FaQuoteLeft className="text-gray-600 text-2xl" />
              </div>
              <p className="text-gray-300 italic">"{review.comment}"</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeedbackPage;