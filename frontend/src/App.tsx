import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 👈 1. මේක Import කළා

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import KitchenPage from './pages/KitchenPage';
import ContactPage from './pages/ContactPage';
import CustomerPage from './pages/CustomerPage';
import ReservationPage from './pages/ReservationPage';
import ProfilePage from './pages/ProfilePage';
import AdminReservationPage from './pages/AdminReservationPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Admin ලට විතරක් යන්න පුළුවන් පිටු ආරක්ෂා කිරීම
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // User කෙනෙක් Admin පිටුවකට යන්න හැදුවොත්, Customer Page එකට විසි කරනවා
  if (userInfo.role !== 'admin') {
    return <Navigate to="/customer" />;
  }

  return children;
};

// Customer ලට (සහ Log වුනු ඕනෑම කෙනෙක්ට) යන්න පුළුවන් පිටු
const CustomerRoute = ({ children }: { children: JSX.Element }) => {
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        
        {/* 👇 2. Toaster එක මෙතනට දැම්මා. Jabba's Theme එකට ගැලපෙන්න පාට හැදුවා */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              border: '1px solid #F59E0B', // තැඹිලි පාට Border එකක්
              borderRadius: '8px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#F59E0B',
                secondary: 'black',
              },
            },
          }} 
        />

        <Routes>
          {/* Public Routes (ඕන කෙනෙක්ට යන්න පුළුවන්) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔴 ADMIN Routes (POS, Kitchen, Menu - මේවා User ට පේන්නේ නෑ) */}
          <Route path="/" element={<AdminRoute><HomePage /></AdminRoute>} />
          <Route path="/menu" element={<AdminRoute><MenuPage /></AdminRoute>} />
          <Route path="/orders" element={<AdminRoute><OrderPage /></AdminRoute>} />
          <Route path="/kitchen" element={<AdminRoute><KitchenPage /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><AdminReservationPage /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />

          {/* 🟢 CUSTOMER Routes (User ට පෙනෙන පිටු) */}
          <Route path="/customer" element={<CustomerRoute><CustomerPage /></CustomerRoute>} />
          
          {/* 👇 Contact Page එක */}
          <Route path="/contact" element={<CustomerRoute><ContactPage /></CustomerRoute>} />
          
          <Route path="/reservation" element={<CustomerRoute><ReservationPage /></CustomerRoute>} />
          <Route path="/profile" element={<CustomerRoute><ProfilePage /></CustomerRoute>} />
          <Route path="/feedback" element={<CustomerRoute><FeedbackPage /></CustomerRoute>} />
          <Route path="/history" element={<CustomerRoute><OrderHistoryPage /></CustomerRoute>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;