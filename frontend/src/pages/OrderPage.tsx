import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaShoppingCart, FaPrint, FaTrash, FaArrowLeft, FaCashRegister } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Invoice } from '../components/Invoice'; // Invoice එක import කළා

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

const OrderPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  
  const [orderNumber, setOrderNumber] = useState(() => `#ORD-${Date.now().toString().slice(-6)}`);
  const [printOrderData, setPrintOrderData] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) { console.error(error); }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existItem = cart.find((x) => x.product._id === product._id);
    if (existItem) {
      setCart(cart.map((x) => x.product._id === product._id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((x) => x.product._id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product._id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.product.price, 0);

  // 👇 අලුත් Checkout Function එක (Manual Print)
  const handleCheckout = async () => {
    try {
      if (cart.length === 0) return alert("Cart is empty!");

      const orderItems = cart.map((item) => ({
        name: item.product.name, qty: item.qty, price: item.product.price, product: item.product._id,
      }));

      // 1. Print Data ලෑස්ති කරනවා
      setPrintOrderData({
          _id: orderNumber,
          orderItems: orderItems,
          totalPrice: totalPrice,
          createdAt: new Date().toISOString()
      });

      // 2. Database එකට Save කරනවා
      await axios.post('http://localhost:5000/api/orders', { 
        orderItems, 
        totalPrice,
      });

      // 3. පොඩි වෙලාවක් ඉඳලා Print කරනවා (Data load වෙන්න තත්පර භාගයක් දෙනවා)
      setTimeout(() => {
          window.print(); // 👈 Browser එකේ Print Dialog එක එනවා
          
          // Print Dialog එක වැහුණම Cart එක Clear කරනවා
          setCart([]);
          setPrintOrderData(null);
          setOrderNumber(`#ORD-${Date.now().toString().slice(-6)}`);
          // alert('Order Placed & Printed Successfully! 🚀');
      }, 500);

    } catch (error) { console.error(error); alert('Order Failed!'); }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.2)' 
        }}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row h-screen p-4 gap-4">
        
        {/* LEFT: Product Catalog */}
        <div className="flex-1 flex flex-col h-full overflow-hidden rounded-2xl bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-black/40">
            <div className="flex items-center gap-3">
                <Link to="/" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition border border-gray-600">
                    <FaArrowLeft />
                </Link>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaCashRegister className="text-green-500"/> POS Terminal
                </h1>
            </div>
            <div className="relative w-64 md:w-96">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full bg-gray-800/80 border border-gray-600 rounded-xl py-2 pl-12 pr-4 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none placeholder-gray-500 transition"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => addToCart(product)}
                  className="group bg-gray-800/60 rounded-xl overflow-hidden border border-gray-700 cursor-pointer hover:border-yellow-500 hover:shadow-yellow-500/10 hover:shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm"
                >
                  <div className="h-32 w-full overflow-hidden relative bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img
                      src={product.image || "https://placehold.co/400"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400?text=No+Image"; }}
                    />
                    <span className="absolute bottom-2 right-2 z-20 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 border border-yellow-500/30">
                      Rs.{product.price}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-100 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Panel */}
        <div className="w-full md:w-[400px] bg-black/80 backdrop-blur-xl border border-gray-700 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-700 bg-gray-900/50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <FaShoppingCart className="text-yellow-500" /> Current Order
              </h2>
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300 border border-gray-600 font-mono">
                {orderNumber}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                <FaShoppingCart size={50} className="mb-4 text-gray-700" />
                <p className="text-lg">Cart is empty</p>
                <p className="text-xs">Select items to start an order</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center bg-gray-800/60 p-3 rounded-xl border border-gray-700 hover:border-gray-500 transition">
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-700">
                      <button onClick={() => updateQty(item.product._id, 1)} className="w-6 h-6 flex items-center justify-center text-xs text-green-400 hover:bg-green-500/20 rounded transition">+</button>
                      <span className="text-sm font-bold text-white w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product._id, -1)} className="w-6 h-6 flex items-center justify-center text-xs text-red-400 hover:bg-red-500/20 rounded transition">-</button>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-gray-200 truncate w-32">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">@{item.product.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-yellow-500 block mb-1">{(item.qty * item.product.price).toFixed(0)}</span>
                    <button onClick={() => removeFromCart(item.product._id)} className="text-gray-600 hover:text-red-500 transition p-1">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 bg-gray-900 border-t border-gray-700">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total Amount</span>
                <span className="text-green-400">Rs. {totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${cart.length === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black hover:from-yellow-400 hover:to-orange-500 hover:scale-[1.02]'
                }`}
            >
              <FaPrint /> CHARGE & PRINT BILL
            </button>
          </div>
        </div>
      </div>

      {/* 👇 HIDDEN INVOICE (Print එකට විතරයි) 
          ID එක "invoice-section" ලෙස දැම්මා (CSS වලින් අල්ලන්න)
      */}
      <div id="invoice-section" className="hidden">
        <Invoice order={printOrderData} />
      </div>

    </div>
  );
};

export default OrderPage;