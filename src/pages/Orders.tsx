import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { 
  FileText, Search, Tag, Eye, Heart, Calendar, CheckSquare, RefreshCw, XCircle, ChevronRight, Clock 
} from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';
import { OrderStatus, Order, PaymentMethod } from '../types';

export default function Orders() {
  const { orders, tables, updateOrderStatusAndNotify, language, systemSettings } = usePOSStore();
  const currency = systemSettings?.currency || '€';
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Status map tags styling
  const statusBadges: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
    Pending: { bg: 'bg-blue-50 dark:bg-blue-955/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    Preparing: { bg: 'bg-amber-50 dark:bg-amber-955/20', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    Ready: { bg: 'bg-purple-50 dark:bg-purple-955/20', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
    Completed: { bg: 'bg-green-50 dark:bg-green-955/20', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
    Cancelled: { bg: 'bg-red-50 dark:bg-red-955/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' }
  };

  // List of tables mapping
  const getTableName = (tableId: string | null) => {
    if (!tableId) return 'Takeaway';
    const t = tables.find(item => item.id === tableId);
    return t ? t.table_number : 'Takeaway';
  };

  // Filter orders in real-time
  const filteredOrders = orders
    .filter((o) => {
      const matchStatus = filterStatus === 'all' || o.status === filterStatus;
      const matchNum = o.order_number.toLowerCase().includes(searchTerm.toLowerCase());
      const pm = o.payment_method;
      const matchMethod = pm ? pm.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      return matchStatus && (matchNum || matchMethod || searchTerm === '');
    })
    // Sort youngest first
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div id="page-orders" className="p-4 md:p-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Active Sales Orders' : 'បញ្ជីវិក្កយបត្រលក់'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Audit active checks, change kitchen states, and reprint tickets</p>
          </div>
        </div>

        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          {orders.length} TOTAL CHECKS
        </span>
      </div>

      {/* Control Filters bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch justify-between bg-white dark:bg-gray-900 p-4 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm transition">
        
        {/* Status filtering buttons */}
        <div className="flex gap-1 overflow-x-auto pb-1 xl:pb-0 no-scrollbar">
          {(['all', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterStatus === st
                  ? 'bg-primary text-white shadow-sm shadow-primary/15'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {st === 'all' ? (language === 'en' ? 'All Orders' : 'វិក្កយបត្រទាំងអស់') : st}
            </button>
          ))}
        </div>

        {/* Local Search input */}
        <div className="relative w-full xl:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'en' ? "Search order number..." : "ស្វែងរកលេខវិក្កយបត្រ..."}
            className="w-full text-xs font-medium pl-8.5 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-white border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-750 outline-none transition"
          />
        </div>

      </div>

      {/* Main Table Matrix */}
      <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider bg-gray-50/50 dark:bg-gray-950/20">
                <th className="p-4">{language === 'en' ? 'Order Ref' : 'កូដវិក្កយបត្រ'}</th>
                <th className="p-4">{language === 'en' ? 'Portion Table' : 'លេខតុ'}</th>
                <th className="p-4">{language === 'en' ? 'Dined Date' : 'កាលបរិច្ឆេទ'}</th>
                <th className="p-4">{language === 'en' ? 'Bill Items Count' : 'ចំនួនទំនិញ'}</th>
                <th className="p-4">{language === 'en' ? 'Final Total' : 'តម្លៃសរុប'}</th>
                <th className="p-4">{language === 'en' ? 'Tender Method' : 'ការបង់ប្រាក់'}</th>
                <th className="p-4">{language === 'en' ? 'Operational Status' : 'ស្ថានភាព'}</th>
                <th className="p-4 text-center">{language === 'en' ? 'Actions Control' : 'សកម្មភាព'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-bold">
                    No orders matching selected criteria was found in record logs.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const badge = statusBadges[o.status] || { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-500' };
                  const tableLabel = getTableName(o.table_id);
                  const itemsList = db.getOrderItems(o.id);

                  return (
                    <tr key={o.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-950/20 transition-colors">
                      {/* Ref */}
                      <td className="p-4 font-black text-gray-800 dark:text-gray-150">
                        {o.order_number}
                      </td>
                      
                      {/* Table placement */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                          tableLabel === 'Takeaway' 
                            ? 'bg-blue-50/20 text-blue-500 dark:bg-blue-900/10' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {tableLabel}
                        </span>
                      </td>

                      {/* Created date representation */}
                      <td className="p-4 text-gray-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Items details hover lists */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-700 dark:text-gray-200">
                            {itemsList.length} items
                          </span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[200px] font-medium leading-relaxed">
                            {itemsList.map(it => {
                              const p = db.getProducts().find(pr => pr.id === it.product_id);
                              return p ? `${p.name} x${it.quantity}` : 'Dish';
                            }).join(', ')}
                          </span>
                        </div>
                      </td>

                      {/* Value total price */}
                      <td className="p-4 font-black text-gray-800 dark:text-white">
                        {currency}{o.total.toFixed(2)}
                      </td>

                      {/* Payout method with visual icons */}
                      <td className="p-4">
                        <span className="font-extrabold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.8 rounded-lg border border-gray-100 dark:border-gray-700/40">
                          {o.payment_method || 'Unpaid'}
                        </span>
                      </td>

                      {/* Status indicator */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase ${badge.bg} ${badge.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {o.status}
                        </span>
                      </td>

                      {/* Action trigger states controls */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Receipt Modal launch */}
                          <ReceiptModal orderId={o.id} />

                          {/* Progressive Next Status controller */}
                          {o.status === 'Pending' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Preparing')}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase transition cursor-pointer"
                            >
                              Prepare
                            </button>
                          )}

                          {o.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Ready')}
                              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase transition cursor-pointer"
                            >
                              Ready!
                            </button>
                          )}

                          {o.status === 'Ready' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Completed')}
                              className="bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-1.5 rounded-lg text-[10px] uppercase transition cursor-pointer"
                            >
                              Complete
                            </button>
                          )}

                          {/* Cancellation helper */}
                          {o.status !== 'Completed' && o.status !== 'Cancelled' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Cancelled')}
                              className="p-1 px-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                              title="Cancel Receipt Checked"
                            >
                              Cancel
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
