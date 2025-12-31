import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardChartsProps {
  orders: any[];
}

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'];

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ orders }) => {
  
  // 1. දිනපතා ආදායම (Last 7 Days) ගණනය කිරීම
  const processSalesData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const data = last7Days.map(date => {
        const dayOrders = orders.filter(o => 
            new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date
            && o.status !== 'Cancelled' // Cancel වුන ඒවා ගන්නේ නෑ
        );
        const total = dayOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
        return { date, Sales: total };
    });

    return data;
  };

  // 2. වැඩියෙන්ම විකිණෙන කෑම (Popular Items) ගණනය කිරීම
  const processPopularItems = () => {
      const itemCounts: { [key: string]: number } = {};
      
      orders.forEach(order => {
          if(order.status !== 'Cancelled') {
              order.orderItems.forEach((item: any) => {
                  itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
              });
          }
      });

      // Object එක Array එකක් කරලා, වැඩිම 5 තෝරාගැනීම
      return Object.keys(itemCounts)
          .map(key => ({ name: key, value: itemCounts[key] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
  };

  const salesData = processSalesData();
  const popularData = processPopularItems();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      
      {/* SALES CHART */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3">
            Last 7 Days Revenue
        </h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} 
                    itemStyle={{ color: '#F59E0B' }}
                />
                <Bar dataKey="Sales" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* POPULAR ITEMS CHART */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-green-500 pl-3">
            Top 5 Selling Items
        </h3>
        <div className="h-[300px] w-full flex justify-center items-center">
            {popularData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={popularData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {popularData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500">No sales data yet.</p>
            )}
        </div>
      </div>

    </div>
  );
};