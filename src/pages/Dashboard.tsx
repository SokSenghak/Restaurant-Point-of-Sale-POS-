import React from 'react';
import DashboardCharts from '../components/DashboardCharts';
import { usePOSStore } from '../store/posStore';
import { Sparkles, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { db } from '../supabase/supabaseMock';

export default function Dashboard() {
  const { language } = usePOSStore();
  const stats = db.edgeFunctionDashboardStatistics();

  return (
    <div id="page-dashboard" className="p-4 md:p-6 space-y-6">
      
      {/* Title page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Analytical Dashboard' : 'ផ្ទាំងវិភាគទិន្នន័យ'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Real-time restaurant operational intelligence & performance metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 py-1.5 px-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <Sparkles size={11} className="text-amber-500" />
            Live Sync Feed
          </span>
        </div>
      </div>

      {/* Main Charts module */}
      <DashboardCharts />

    </div>
  );
}
