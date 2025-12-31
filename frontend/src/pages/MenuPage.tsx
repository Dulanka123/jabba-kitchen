import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaTimes, 
  FaSave, 
  FaBoxOpen, 
  FaExclamationTriangle,
  FaHamburger 
} from 'react-icons/fa';
import toast from 'react-hot-toast'; // Toast notifications

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  countInStock: number; // 👈 Stock එක Interface එකට දැම්මා
}

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState('0'); // 👈 Stock Input State

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('https://jabba-kitchen.vercel.app/api/products');
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name,
      price: Number(price),
      category,
      image,
      description,
      countInStock: Number(countInStock) // 👈 Stock එක Backend එකට යවනවා
    };

    try {
      if (editingProduct) {
        // Edit Mode
        await axios.put(`https://jabba-kitchen.vercel.app/api/products/${editingProduct._id}`, productData);
        toast.success("Product Updated Successfully! 🔄");
      } else {
        // Add Mode
        await axios.post('https://jabba-kitchen.vercel.app/api/products', productData);
        toast.success("New Product Added! 🍔");
      }
      
      setShowModal(false);
      resetForm();
      fetchProducts(); // Refresh List
    } catch (error) {
      toast.error("Operation Failed! Check your inputs.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`https://jabba-kitchen.vercel.app/api/products/${id}`);
        toast.success("Item Deleted!");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  // Modal එක Open කරන Function එක (Add හෝ Edit සඳහා)
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setPrice(product.price.toString());
      setCategory(product.category);
      setImage(product.image);
      setDescription(product.description);
      setCountInStock(product.countInStock.toString()); // 👈 තියෙන Stock එක Form එකට ගන්නවා
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setCategory('Main Course');
    setImage('');
    setDescription('');
    setCountInStock('0');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      
       {/* Background Image Layer */}
       <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) blur(3px)'
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700">
            <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-3">
                <FaHamburger className="text-yellow-500" /> MENU MANAGEMENT
            </h1>
            <p className="text-gray-300 mt-1">Add, Edit or Remove food items and manage stock.</p>
            </div>
            <button 
            onClick={() => openModal()} 
            className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition hover:scale-105"
            >
            <FaPlus /> Add New Item
            </button>
        </div>

        {/* PRODUCTS TABLE (Grid එක වෙනුවට Table එකක් දැම්මා) */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead className="bg-black/50 text-gray-400 uppercase text-xs font-bold tracking-wider">
                    <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Stock Level</th> {/* 👈 අලුත් Column එක */}
                    <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-sm">
                    {products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition duration-150">
                        <td className="p-4">
                        <img src={product.image || "https://placehold.co/400"} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-600" />
                        </td>
                        <td className="p-4 font-bold text-white text-base">{product.name}</td>
                        <td className="p-4">
                        <span className="bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-600">
                            {product.category}
                        </span>
                        </td>
                        <td className="p-4 font-mono text-yellow-500 font-bold text-base">Rs. {product.price}</td>
                        
                        {/* 👇 STOCK DISPLAY LOGIC (Alerts) */}
                        <td className="p-4 text-center">
                        {product.countInStock === 0 ? (
                            <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 animate-pulse">
                            <FaExclamationTriangle /> Out of Stock
                            </span>
                        ) : product.countInStock < 10 ? (
                            <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
                            Low: {product.countInStock}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                            <FaBoxOpen /> In Stock: {product.countInStock}
                            </span>
                        )}
                        </td>

                        <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => openModal(product)} className="bg-blue-600/20 hover:bg-blue-600 text-blue-500 hover:text-white p-2 transition rounded-lg">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-2 transition rounded-lg">
                                <FaTrash />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        <p>No items found. Add some delicious food! 🍔</p>
                    </div>
                )}
            </div>
        </div>

        {/* MODAL FORM (Add/Edit සඳහා Pop-up එක) */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative transform scale-100">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
                <FaTimes size={20} />
                </button>
                
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                {editingProduct ? <><FaEdit className="text-blue-500"/> Edit Product</> : <><FaPlus className="text-yellow-500"/> Add New Product</>}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name & Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Item Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none" placeholder="e.g. Chicken Burger" required />
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none cursor-pointer">
                        <option>Main Course</option>
                        <option>Beverage</option>
                        <option>Dessert</option>
                        <option>Appetizer</option>
                    </select>
                    </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price (Rs)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none" placeholder="0.00" required />
                    </div>
                    <div>
                    {/* 👇 STOCK INPUT */}
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Quantity / Stock</label>
                    <input type="number" value={countInStock} onChange={e => setCountInStock(e.target.value)} className="w-full bg-black/50 border border-yellow-500/50 rounded-xl p-3 text-white focus:border-yellow-500 outline-none" placeholder="0" required />
                    </div>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2"><FaImage /> Image URL</label>
                    <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none" placeholder="https://..." />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none h-24 resize-none" placeholder="Short description..."></textarea>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl shadow-lg transition flex justify-center items-center gap-2">
                    <FaSave /> {editingProduct ? 'Update Product' : 'Save Product'}
                </button>

                </form>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;