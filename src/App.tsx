import React, { useState, useEffect } from 'react';
import { usePOSStore } from './store/posStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ChefHat, LayoutGrid, FileText, BarChart3, Menu, FolderSearch, Users, KeyRound, Settings2, Moon, Sun, MonitorSmartphone 
} from 'lucide-react';

// Pages import
import POS from './pages/POS';
import Kitchen from './pages/Kitchen';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import UsersPage from './pages/Users';
import Settings from './pages/Settings';

export default function App() {
  const { 
    currentTab, 
    setCurrentTab, 
    darkMode, 
    language, 
    setLanguage, 
    currentUserRole 
  } = usePOSStore();

  const [time, setTime] = useState(new Date());

  // Keep a ticking UTC Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Update dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sidebar navigation options configuration mapping
  const navItems = [
    { id: 'pos', label_en: 'POS Checkout', label_kh: 'ទូទាត់ប្រាក់', icon: <MonitorSmartphone size={18} /> },
    { id: 'kitchen', label_en: 'Kitchen KDS', label_kh: 'ផ្ទះបាយ KDS', icon: <ChefHat size={18} /> },
    { id: 'orders', label_en: 'Log Receipts', label_kh: 'ប្រវត្តិវិក្កយបត្រ', icon: <FileText size={18} /> },
    { id: 'tables', label_en: 'Table Grid', label_kh: 'ប្លង់តុអាហារ', icon: <LayoutGrid size={18} /> },
    { id: 'dashboard', label_en: 'Live Analytics', label_kh: 'ផ្ទាំងវិភាគទិន្នន័យ', icon: <BarChart3 size={18} /> },
    { id: 'products', label_en: 'Foods Catalog', label_kh: 'បញ្ជីម្ហូបអាហារ', icon: <Menu size={18} /> },
    { id: 'categories', label_en: 'Menu Selections', label_kh: 'ផ្នែកកាតេហ្គោរី', icon: <FolderSearch size={18} /> },
    { id: 'customers', label_en: 'Loyalty CRM', label_kh: 'សមាជិកប្រព័ន្ធ', icon: <Users size={18} /> },
    { id: 'users', label_en: 'Staff Profiles', label_kh: 'គណនីបុគ្គលិក', icon: <KeyRound size={18} /> },
    { id: 'settings', label_en: 'Preferences', label_kh: 'ការកំណត់', icon: <Settings2 size={18} /> },
  ] as const;

  // Render proper targeted view tab
  const renderPage = () => {
    switch (currentTab) {
      case 'pos': return <POS />;
      case 'kitchen': return <Kitchen />;
      case 'orders': return <Orders />;
      case 'tables': return <TablePageWrapper />;
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'categories': return <Categories />;
      case 'customers': return <Customers />;
      case 'users': return <UsersPage />;
      case 'settings': return <Settings />;
      default: return <POS />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-200 antialiased overflow-hidden h-screen`}>
      
      {/* 1. LEFT-HAND NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-850 flex flex-col justify-between shrink-0 overflow-y-auto no-scrollbar select-none z-30">
        
        <div>
          {/* Top Logo Brand block */}
          <div className="p-4.5 border-b border-gray-100 dark:border-gray-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-xl shadow-lg shadow-primary/20 transform hover:rotate-12 transition-transform cursor-pointer"
                onClick={() => setCurrentTab('pos')}
              >
                🍕
              </div>
              <div>
                <h1 className="text-sm font-black font-display tracking-wider text-gray-850 dark:text-gray-100 leading-none">
                  PIZZARIA
                </h1>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1.5 leading-none">
                  Smart Tablet POS
                </span>
              </div>
            </div>

            {/* Language quick switcher pills */}
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/80 p-1 rounded-lg border border-gray-100 dark:border-gray-750">
              <button
                onClick={() => setLanguage('en')}
                className={`text-[8px] font-black px-1.5 py-0.5 rounded-md transition ${language === 'en' ? 'bg-primary text-white shadow-xs' : 'text-gray-450 hover:bg-gray-200'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('kh')}
                className={`text-[8px] font-black px-1.5 py-0.5 rounded-md transition ${language === 'kh' ? 'bg-[#FFD84D] text-gray-900' : 'text-gray-450 hover:bg-gray-200'}`}
              >
                KH
              </button>
            </div>
          </div>

          {/* Nav Links Stack */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const lbl = language === 'en' ? item.label_en : item.label_kh;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                    isActive 
                      ? 'text-primary dark:text-white bg-primary/5 dark:bg-primary/10' 
                      : 'text-gray-450 dark:text-gray-400 hover:text-gray-800 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-gray-850/40'
                  }`}
                >
                  {/* Left accent column selection strip */}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebarActiveStrip"
                      className="absolute left-0 top-2 h-6 w-1 rounded-r-full bg-primary"
                    />
                  )}

                  <span className={isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}>
                    {item.icon}
                  </span>
                  
                  <span className="truncate">{lbl}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile staff credentials */}
        <div className="p-4 border-t border-gray-150 dark:border-gray-850 bg-slate-50/50 dark:bg-gray-950/20 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm ring-1 ring-primary/20 shrink-0">
              👑
            </div>
            <div className="min-w-0">
              <strong className="text-[11px] font-bold text-gray-850 dark:text-gray-100 truncate block leading-tight">
                {currentUserRole === 'Admin' ? 'Senghakk Seng' : `Staff - ${currentUserRole}`}
              </strong>
              <span className="text-[9px] font-black text-primary uppercase block mt-1 leading-none tracking-widest">
                {currentUserRole}
              </span>
            </div>
          </div>

          {/* Live System clock counters */}
          <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-semibold flex items-center justify-between uppercase leading-none">
            <span>Dined Time:</span>
            <span className="font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

        </div>

      </aside>

      {/* 2. RIGHT-HAND VIEW AREA CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`flex-1 min-h-0 no-scrollbar ${
              (currentTab === 'pos' || currentTab === 'kitchen') 
                ? 'h-full flex flex-col overflow-hidden' 
                : 'overflow-y-auto'
            }`}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}

// Quick wrapper layout adjustments for responsive page dimensions
function TablePageWrapper() {
  return <Tables />;
}
