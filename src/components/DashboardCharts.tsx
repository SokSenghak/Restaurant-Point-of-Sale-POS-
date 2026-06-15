import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { db } from '../supabase/supabaseMock';
import { usePOSStore } from '../store/posStore';
import { 
  TrendingUp, ShoppingBag, CreditCard, Users, DollarSign, Activity, PieChart as PieIcon 
} from 'lucide-react';

export default function DashboardCharts() {
  const { darkMode, language, systemSettings } = usePOSStore();
  const currency = systemSettings?.currency || '€';
  const stats = db.edgeFunctionDashboardStatistics();

  // Color theme selectors
  const textColor = darkMode ? '#9ca3af' : '#4b5563';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';
  
  // Real Mock Datasets modeled after actual seeded database records
  const revenueTrendData = [
    { day: 'Mon', revenue: 1420 },
    { day: 'Tue', revenue: 1850 },
    { day: 'Wed', revenue: 2100 },
    { day: 'Thu', revenue: 1950 },
    { day: 'Fri', revenue: 3200 },
    { day: 'Sat', revenue: 4700 },
    { day: 'Sun', revenue: stats.today_sales || 1200 }
  ];

  const hourlyPeakData = [
    { hour: '11 AM', orders: 15 },
    { hour: '12 PM', orders: 42 },
    { hour: '1 PM', orders: 38 },
    { hour: '5 PM', orders: 22 },
    { hour: '6 PM', orders: 55 },
    { hour: '7 PM', orders: 68 },
    { hour: '8 PM', orders: 48 },
    { hour: '9 PM', orders: 24 }
  ];

  const categoryShareData = [
    { name: 'Pizzas', value: 45, color: '#E71B23' },
    { name: 'Starters', value: 20, color: '#FFD84D' },
    { name: 'Desserts', value: 15, color: '#10b981' },
    { name: 'Drinks', value: 12, color: '#3b82f6' },
    { name: 'Canned Bev', value: 8, color: '#a855f7' }
  ];

  const dailyVolumeData = [
    { day: 'Mon', count: 48 },
    { day: 'Tue', count: 52 },
    { day: 'Wed', count: 58 },
    { day: 'Thu', count: 47 },
    { day: 'Fri', count: 82 },
    { day: 'Sat', count: 110 },
    { day: 'Sun', count: stats.orders_count || 32 }
  ];

  const kpis = [
    {
      title: language === 'en' ? "Today's Revenue" : "សរុបលក់ថ្ងៃនេះ",
      value: `${currency}${stats.today_sales.toFixed(2)}`,
      icon: <DollarSign size={20} />,
      color: 'bg-primary/5 text-primary',
      change: '+14.5% vs yesterday'
    },
    {
      title: language === 'en' ? 'Weekly Volume' : 'លក់ប្រចាំសប្តាហ៍',
      value: `${currency}${stats.weekly_sales.toFixed(2)}`,
      icon: <TrendingUp size={20} />,
      color: 'bg-amber-500/5 text-amber-500',
      change: '+8.2% vs last week'
    },
    {
      title: language === 'en' ? 'Monthly Revenue' : 'លក់ប្រចាំខែ',
      value: `${currency}${stats.monthly_sales.toFixed(2)}`,
      icon: <CreditCard size={20} />,
      color: 'bg-blue-500/5 text-blue-500',
      change: '+22.4% vs last month'
    },
    {
      title: language === 'en' ? 'Total Active Orders' : 'ចំនួនការកម្ម៉ង់',
      value: stats.orders_count.toString(),
      icon: <ShoppingBag size={20} />,
      color: 'bg-emerald-500/5 text-emerald-500',
      change: `${stats.completed_orders} Completed`
    },
    {
      title: language === 'en' ? 'Acre Customers' : 'អតិថិជនសរុប',
      value: stats.customer_count.toString(),
      icon: <Users size={20} />,
      color: 'bg-purple-500/5 text-purple-500',
      change: 'Active in database'
    },
    {
      title: language === 'en' ? 'Average Order Value' : 'តម្លៃកម្ម៉ង់ជាមធ្យម',
      value: `${currency}${stats.average_order_value.toFixed(2)}`,
      icon: <Activity size={20} />,
      color: 'bg-indigo-500/5 text-indigo-500',
      change: 'Lifetime value'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. KPIs Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
            
            <p className="text-xl font-black text-gray-800 dark:text-white mt-3 font-display">
              {kpi.value}
            </p>
            <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Charts Layout (Bento Grid Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Double-pane: Revenue progression AreaChart */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-150 uppercase tracking-wide leading-none">Weekly Revenue Pipeline</h4>
              <p className="text-[11px] text-gray-400 mt-1">Summation of daily receipt checkouts ({currency})</p>
            </div>
            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg uppercase tracking-wider">
              Real-time update
            </span>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E71B23" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#E71B23" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="day" stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#E71B23" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Single-pane: Dessert/Pizza Category Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-150 uppercase tracking-wide leading-none">Category Share</h4>
              <PieIcon size={14} className="text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-400 mb-3">Menu item popularity distribution</p>
          </div>

          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered Total Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-sm font-black text-gray-800 dark:text-white leading-none">100%</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Menu Mix</span>
            </div>
          </div>

          {/* Color Indicators Legend */}
          <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-gray-50 dark:border-gray-850 text-[10px]">
            {categoryShareData.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 font-bold text-gray-600 dark:text-gray-300">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate">{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Left Single-pane: Hourly peak orders BarChart */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-150 uppercase tracking-wide leading-none">Peak Operations Intensity</h4>
            <p className="text-[11px] text-gray-400 mt-1">Total completed checks mapped by operating hour</p>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPeakData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="hour" stroke={textColor} fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#FFD84D" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Right Single-pane: Daily checks volume count LineChart */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-150 uppercase tracking-wide leading-none">Weekly Sales Checks count</h4>
            <p className="text-[11px] text-gray-400 mt-1">Total orders processed weekly</p>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVolumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="day" stroke={textColor} fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
