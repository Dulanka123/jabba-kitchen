import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHamburger, FaCashRegister, FaUtensils, FaHeadset, FaSignOutAlt } from 'react-icons/fa';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: <FaHamburger />, label: 'Dashboard' },
        { path: '/menu', icon: <FaHamburger />, label: 'Menu' },
        { path: '/orders', icon: <FaCashRegister />, label: 'POS' },
        { path: '/kitchen', icon: <FaUtensils />, label: 'Kitchen' },
        { path: '/contact', icon: <FaHeadset />, label: 'Support' },
    ];

    return (
        <div className="flex h-screen bg-black text-white font-['Outfit'] overflow-hidden">
            {/* Sidebar */}
            <aside
                className="w-80 glass-card border-r border-white/5 flex flex-col p-8 z-50 fixed h-full shadow-[5px_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out transform translate-x-0 opacity-100"
            >
                <div className="mb-12 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xl">
                        J
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-tighter">
                            JABBA'S
                        </h1>
                        <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">Control Center</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"
                                    />
                                )}

                                <span className="relative z-10 text-xl">{item.icon}</span>
                                <span className="relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors mt-auto p-4 rounded-xl hover:bg-red-500/10 group"
                >
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Logout System</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-80 relative overflow-hidden bg-zinc-950">
                {/* Ambient Background Lights */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div
                    key={location.pathname}
                    className="h-full w-full overflow-y-auto p-10 relative z-10 scrollbar-hide animate-fadeIn"
                >
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
