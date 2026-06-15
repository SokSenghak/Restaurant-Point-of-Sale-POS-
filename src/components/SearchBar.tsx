import React, { useState } from 'react';
import { Search, Bell, AlertCircle, ShoppingCart } from 'lucide-react';
import { usePOSStore } from '../store/posStore';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export default function SearchBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    currentUserRole, 
    setCurrentUserRole,
    notifications,
    cart,
    language,
    setLanguage
  } = usePOSStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const roles: UserRole[] = ['Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter'];

  const unreadCount = notifications.length;

  return (
    <div id="pos-search-header" className="sticky top-0 z-30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 transition-colors duration-200">
      
      {/* Search Input Box */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
          <Search size={18} />
        </div>
        <input
          id="product-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'en' ? "Search pizzas, drinks, starters..." : "ស្វែងរកភីហ្សា ភេសជ្ជៈ អាហារសម្រន់..."}
          className="w-full rounded-2xl bg-gray-50 dark:bg-gray-800/80 py-3 pl-10 pr-4 text-sm font-sans font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all duration-200"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-400 hover:text-primary"
          >
            Clear
          </button>
        )}
      </div>

      {/* Control Actions & User Roles */}
      <div className="flex items-center justify-end gap-3">
        
        {/* Language selector */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${language === 'en' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary font-bold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('kh')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${language === 'kh' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary font-bold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            ខ្មែរ
          </button>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            id="notifications-toggle"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowRoleMenu(false);
            }}
            className="relative p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 shadow-xl ring-1 ring-black/5 z-40"
              >
                <div className="p-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 dark:text-white">Live Operations Logs</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Real-time alerts</span>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400 dark:text-gray-500">
                      <AlertCircle size={28} className="stroke-1.5 mb-1" />
                      <span className="text-[11px] font-medium">No live events registered yet</span>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl flex gap-2 items-start transition"
                      >
                        <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-primary' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{n.title}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Active Role Switcher */}
        <div className="relative">
          <button
            id="role-dropdown-btn"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 max-w-[170px] rounded-2xl bg-gray-50 dark:bg-gray-800 p-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-bold text-xs">
              {currentUserRole[0]}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">ROLE</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">{currentUserRole}</p>
            </div>
          </button>

          <AnimatePresence>
            {showRoleMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-1.5 shadow-xl ring-1 ring-black/5 z-40"
              >
                <div className="px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Select System Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setShowRoleMenu(false);
                      setSearchQuery(''); // reset search
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      currentUserRole === r
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUserRole === r && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
