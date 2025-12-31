import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaTimes, 
  FaUtensils, 
  FaSignOutAlt, 
  FaWhatsapp, 
  FaSearch, 
  FaCalendarAlt, 
  FaUser,
  FaStar,
  FaHistory,
  FaHeadset,
  FaExclamationCircle // 👈 අලුත් Icon එකක්
} from 'react-icons/fa';

// Product Interface එක Update කළා
interface Product {
  _id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  description: string;
  countInStock: number; // 👈 Stock එක මෙතනට දැම්මා
}

interface CartItem {
  product: Product;
  qty: number;
}

const CustomerPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const WHATSAPP_NUMBER = '94759417428'; 

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>('https://jabba-kitchen.vercel.app/api/products');
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  const addToCart = (product: Product) => {
    // 👇 Stock Check Logic
    if (product.countInStock === 0) {
        toast.error("Sorry! This item is out of stock. 😢");
        return;
    }

    const existItem = cart.find((x) => x.product._id === product._id);
    
    // දැනට Cart එකේ තියෙන ගාණ Stock එකට වඩා වැඩි වෙන්න දෙන්න බෑ
    if (existItem && existItem.qty >= product.countInStock) {
        toast.error(`Sorry! We only have ${product.countInStock} items left.`);
        return;
    }

    if (existItem) {
      setCart(cart.map((x) => x.product._id === product._id ? { ...x, qty: x.qty + 1 } : x));
      toast.success(`Updated quantity for ${product.name}`);
    } else {
      setCart([...cart, { product, qty: 1 }]);
      setIsCartOpen(true);
      toast.success(`${product.name} added to cart! 🛒`);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product._id === id) {
        const newQty = item.qty + delta;
        
        // Stock Limit Check
        if (delta > 0 && newQty > item.product.countInStock) {
            toast.error(`Maximum limit reached!`);
            return item;
        }

        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((x) => x.product._id !== id));
    toast('Item removed', { icon: '🗑️' });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('userInfo');
      navigate('/login');
      toast.success("Logged out successfully");
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.product.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const userInfo = localStorage.getItem('userInfo');
    const user = userInfo ? JSON.parse(userInfo) : null;

    if (!user) {
        navigate('/login');
        return;
    }

    let message = `*Hello Jabba's Kitchen!* 🍔\nI would like to place an order:\n\n`;
    cart.forEach((item) => {
      message += `▫️ ${item.product.name} x ${item.qty} - Rs.${item.product.price * item.qty}\n`;
    });
    message += `\n*Total Amount: Rs. ${totalPrice}.00*`;
    message += `\n\nCustomer: ${user.name}\nPlease confirm my order. Thank you!`;

    const loadingToast = toast.loading("Processing Order...");

    try {
        await axios.post('https://jabba-kitchen.vercel.app/api/orders', {
            orderItems: cart.map(item => ({
                name: item.product.name,
                qty: item.qty,
                image: item.product.image,
                price: item.product.price,
                product: item.product._id,
            })),
            totalPrice: totalPrice,
            user: user._id, 
            status: "Pending (WhatsApp)" 
        });

        toast.dismiss(loadingToast);
        toast.success("Order Placed! Redirecting to WhatsApp... 🚀");

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        setCart([]);
        setIsCartOpen(false);

    } catch (error) {
        console.error("Failed to save order to DB:", error);
        toast.dismiss(loadingToast);
        toast.error("Connection Error! Proceeding to WhatsApp... ⚠️");
        
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'All' ? true : p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Main Course', 'Beverage', 'Dessert', 'Appetizer'];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-2xl font-bold animate-pulse">Loading Menu... 🍔</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) blur(2px)'
        }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10">

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 p-4 shadow-xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hidden sm:block tracking-tighter">
                JABBA'S KITCHEN 🍔
            </h1>
            <h1 className="text-xl font-extrabold text-yellow-500 sm:hidden">JK 🍔</h1>
            
            <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-lg transition hover:bg-white/10 hover:border-yellow-500/50">
                    <FaHeadset /> <span className="hidden lg:inline">Contact Us</span>
                </button>
                <button onClick={() => navigate('/reservation')} className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-lg transition hover:bg-white/10">
                    <FaCalendarAlt /> <span className="hidden lg:inline">Book Table</span>
                </button>
                <button onClick={() => navigate('/feedback')} className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-lg transition hover:bg-white/10">
                    <FaStar /> <span className="hidden lg:inline">Reviews</span>
                </button>
                <button onClick={() => navigate('/history')} className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-lg transition hover:bg-white/10">
                    <FaHistory /> <span className="hidden lg:inline">History</span>
                </button>
                <button onClick={() => navigate('/profile')} className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-lg transition hover:bg-white/10">
                    <FaUser /> <span className="hidden lg:inline">Profile</span>
                </button>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 flex items-center gap-2 text-sm font-bold border border-white/10 px-3 py-2 rounded-lg transition hover:bg-red-500/10">
                    <FaSignOutAlt /> <span className="hidden lg:inline">Logout</span>
                </button>

                {/* Cart Button */}
                <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative bg-yellow-500 hover:bg-yellow-400 text-black p-3 rounded-full transition shadow-lg shadow-yellow-500/20">
                    <FaShoppingCart className="text-xl" />
                    {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-900">
                        {cart.length}
                    </span>
                    )}
                </button>
            </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-32 pb-8 px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Taste the Best <span className="text-yellow-500">Food</span></h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 drop-shadow-md">Order your favorite meals directly from our kitchen to your table.</p>
            
            <div className="max-w-xl mx-auto relative mb-10">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                    type="text" 
                    placeholder="Search for burgers, rice, drinks..." 
                    className="w-full bg-gray-900/80 backdrop-blur-md border border-gray-600 rounded-full py-4 pl-14 pr-6 text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none transition shadow-2xl text-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setCategory(cat)} 
                    className={`px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 ${
                        category === cat 
                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' 
                        : 'bg-gray-800/60 backdrop-blur-sm border border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-24">
            {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 p-10 bg-gray-900/50 backdrop-blur-md border border-dashed border-gray-700 rounded-2xl">
                    <p className="text-2xl font-bold mb-2">No items found 😢</p>
                    <p className="text-sm">Try searching for something else.</p>
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => {
                    // 👇 Check if Out of Stock
                    const isOutOfStock = product.countInStock === 0;

                    return (
                        <div key={product._id} className={`bg-black/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-gray-700 transition-all duration-300 group transform hover:-translate-y-2 ${isOutOfStock ? 'opacity-70 grayscale' : 'hover:border-yellow-500/50 hover:shadow-yellow-500/10'}`}>
                            
                            <div className="h-56 overflow-hidden relative">
                                <img 
                                    src={product.image || "https://placehold.co/400"} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400?text=No+Image"; }} 
                                />
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-yellow-400 border border-yellow-500/30 shadow-lg">
                                    Rs.{product.price}
                                </div>

                                {/* 👇 OUT OF STOCK Label */}
                                {isOutOfStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-xl transform -rotate-12 border-2 border-white">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-1 text-white truncate">{product.name}</h3>
                                <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider">{product.category}</p>
                                
                                {/* 👇 Disable button if Out of Stock */}
                                <button 
                                    onClick={() => addToCart(product)} 
                                    disabled={isOutOfStock}
                                    className={`w-full py-3 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${
                                        isOutOfStock 
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black active:scale-95'
                                    }`}
                                >
                                    {isOutOfStock ? (
                                        <>Sold Out</>
                                    ) : (
                                        <><FaPlus size={12}/> Add to Cart</>
                                    )}
                                </button>
                                
                                {/* Stock Indicator (Optional) */}
                                {!isOutOfStock && product.countInStock < 10 && (
                                    <p className="text-xs text-yellow-500 text-center mt-2 font-bold animate-pulse">
                                        Only {product.countInStock} left!
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            )}
        </div>

        {/* Cart Sidebar */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-800 transform transition-transform duration-300 z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-black/40">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white"><FaUtensils className="text-yellow-500"/> Your Order</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition"><FaTimes size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FaShoppingCart size={30} className="opacity-50"/>
                    </div>
                    <p className="text-lg font-medium">Your cart is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-yellow-500 hover:text-yellow-400 font-bold hover:underline">Start Ordering</button>
                </div>
                ) : (
                cart.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700 hover:border-gray-500 transition">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                        <img src={item.product.image || "https://placehold.co/400"} alt={item.product.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{item.product.name}</h4>
                        <p className="text-yellow-500 text-sm font-bold">Rs. {item.product.price * item.qty}</p>
                        <div className="flex items-center gap-3 mt-2 bg-gray-900 w-fit px-2 py-1 rounded-lg border border-gray-700">
                        <button onClick={() => updateQty(item.product._id, -1)} className="text-gray-400 hover:text-white transition"><FaMinus size={10}/></button>
                        <span className="text-sm font-bold w-4 text-center text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.product._id, 1)} className="text-green-400 hover:text-green-300 transition"><FaPlus size={10}/></button>
                        </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product._id)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-full transition"><FaTimes /></button>
                    </div>
                ))
                )}
            </div>
            
            <div className="p-6 border-t border-gray-800 bg-black/60 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4 text-xl font-bold">
                    <span className="text-gray-300">Total</span>
                    <span className="text-green-400">Rs. {totalPrice}.00</span>
                </div>
                <button 
                    onClick={handleCheckout} 
                    disabled={cart.length === 0} 
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg ${
                        cart.length === 0 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-500 text-white hover:scale-[1.02]'
                    }`}
                >
                <FaWhatsapp size={24} /> Order via WhatsApp
                </button>
            </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerPage;