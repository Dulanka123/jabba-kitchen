import React from 'react';

// 👇 Order එකේ දත්ත වලට අදාල Type එක
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface OrderItem {
  product: string; // Product ID
  name: string;
  price: number;
  qty: number;
}

interface OrderData {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

interface InvoiceProps {
  order: OrderData | null;
}

// 👇 Print වෙන Invoice Component එක
export const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(({ order }, ref) => {
  
  if (!order) return null;

  return (
    <div 
      ref={ref} 
      className="w-full max-w-[80mm] mx-auto bg-white text-black text-xs font-sans leading-tight p-2"
      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} 
    >
      
      {/* 1. HEADER */}
      <div className="bg-gray-900 text-center p-4 rounded-b-xl mb-4 border-b-4 border-orange-500 text-white">
          <div className="text-4xl mb-2">🍔</div> 
          <h1 className="text-xl font-extrabold text-orange-500 uppercase tracking-widest">JABBA'S</h1>
          <h2 className="text-lg font-bold uppercase tracking-tighter -mt-1">KITCHEN</h2>
          <p className="text-[10px] text-gray-400 mt-2 font-mono">
              No. 123, Food Street, Colombo.<br/>
              077-1234567 | jabbaskitchen.lk
          </p>
      </div>
  
      {/* 2. ORDER INFO */}
      <div className="px-2 mb-2 flex justify-between font-bold text-gray-700 border-b border-dashed border-gray-400 pb-2">
          <div className="text-left">
              <p>NO: {order._id}</p>
              <p>DATE: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
              <p>TIME: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              <p>TYPE: Dine-in</p>
          </div>
      </div>
  
      {/* 3. ITEMS TABLE */}
      <div className="px-2 mb-4">
          <table className="w-full">
              <thead className="border-b-2 border-orange-500 text-orange-600">
                  <tr className="text-left">
                      <th className="py-1 w-[45%]">ITEM</th>
                      <th className="py-1 w-[15%] text-center">QTY</th>
                      <th className="py-1 w-[20%] text-right">PRICE</th>
                      <th className="py-1 w-[20%] text-right">AMT</th>
                  </tr>
              </thead>
              <tbody className="font-medium text-gray-800">
                  {order.orderItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 border-dashed">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-center">{item.qty}</td>
                          <td className="py-2 text-right">{item.price}</td>
                          <td className="py-2 text-right font-bold">{(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  
      {/* 4. TOTAL */}
      <div className="px-2 mb-4">
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">NET TOTAL</span>
              <span className="text-2xl font-extrabold text-orange-600">Rs.{order.totalPrice.toFixed(2)}</span>
          </div>
      </div>
  
      {/* 5. FOOTER */}
      <div className="text-center px-4 pb-6">
          <p className="font-bold text-gray-800 text-sm">THANK YOU!</p>
          <p className="text-[10px] text-gray-500 italic mb-2">Come back for more tasty bites!</p>
      </div>
  
    </div>
  );
});