import React, { useEffect, useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { 
  ChefHat, Clock, CheckSquare, ArrowRight, TableProperties, CheckCircle2, UserCheck, RefreshCw 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export default function Kitchen() {
  const { orders, tables, updateOrderStatusAndNotify, language } = usePOSStore();
  const [now, setNow] = useState(new Date());

  // Auto-refresh timer to update elapsed cook times dynamically
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const getTableName = (tableId: string | null) => {
    if (!tableId) return 'Takeaway';
    const t = tables.find(item => item.id === tableId);
    return t ? t.table_number : 'Takeaway';
  };

  // Helper to calculate elapsed minutes of order
  const getElapsedTime = (createdStr: string) => {
    const elapsedMs = now.getTime() - new Date(createdStr).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins < 1) return 'Just now';
    return `${elapsedMins}m ago`;
  };

  const getElapsedTimeColor = (createdStr: string) => {
    const elapsedMs = now.getTime() - new Date(createdStr).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins >= 15) return 'text-red-500 animate-pulse font-extrabold';
    if (elapsedMins >= 8) return 'text-amber-500 font-extrabold';
    return 'text-gray-400';
  };

  // Group active orders by KDS status
  const kdsColumns: { status: OrderStatus; label: string; bgClass: string; textClass: string; pillColor: string }[] = [
    { status: 'Pending', label: '1. New Tickets', bgClass: 'bg-blue-50/50 dark:bg-blue-955/15', textClass: 'text-blue-700 dark:text-blue-300', pillColor: 'bg-blue-500' },
    { status: 'Preparing', label: '2. Under Cook', bgClass: 'bg-amber-50/50 dark:bg-amber-955/15', textClass: 'text-amber-700 dark:text-amber-300', pillColor: 'bg-amber-500' },
    { status: 'Ready', label: '3. Pass Table Ready', bgClass: 'bg-purple-50/50 dark:bg-purple-955/15', textClass: 'text-purple-700 dark:text-purple-300', pillColor: 'bg-purple-500' },
    { status: 'Completed', label: '4. Serving Board', bgClass: 'bg-green-50/50 dark:bg-green-955/15', textClass: 'text-green-700 dark:text-green-300', pillColor: 'bg-green-500' }
  ];

  return (
    <div id="page-kitchen" className="p-4 md:p-6 space-y-6 h-full flex flex-col">
      
      {/* Title page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Kitchen Display System (KDS)' : 'ប្រព័ន្ធបង្ហាញការកម្ម៉ង់ផ្ទះបាយ (KDS)'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Real-time cook display for chefs, backing ticket status transition controls</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 py-1.5 px-3 rounded-xl border border-gray-100">
            AUTO REFRESH ACTIVE
          </span>
        </div>
      </div>

      {/* Columns Board Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto select-none min-h-[500px]">
        {kdsColumns.map((col) => {
          // get orders for this col
          const colOrders = orders.filter(o => o.status === col.status)
            // Sort oldest tickets on top for Pending/Preparing so chefs fulfill sequentially
            .sort((a,b) => {
              if (col.status === 'Completed') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // completed newest on top
              }
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            })
            // Limit completed visible logs to 5 items to keep screen clean
            .slice(0, col.status === 'Completed' ? 5 : 40);

          return (
            <div 
              key={col.status}
              className={`${col.bgClass} rounded-3xl p-4 flex flex-col h-full border border-gray-150 dark:border-gray-800/60 max-h-[75vh]`}
            >
              
              {/* Column Header title */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.pillColor}`} />
                  <h3 className={`font-black text-xs uppercase tracking-wider ${col.textClass}`}>
                    {col.label}
                  </h3>
                </div>
                
                <span className="bg-white/70 dark:bg-gray-900 px-2 py-0.5 rounded-lg text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-150 dark:border-gray-800 shadow-xs">
                  {colOrders.length}
                </span>
              </div>

              {/* Tickets scroll area list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide">No Tickets Active</p>
                  </div>
                ) : (
                  colOrders.map((o) => {
                    const ticketItems = db.getOrderItems(o.id);
                    const elapsed = getElapsedTime(o.created_at);
                    const elColor = getElapsedTimeColor(o.created_at);

                    return (
                      <div
                        key={o.id}
                        className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-3.5 rounded-2xl shadow-sm space-y-3 text-xs flex flex-col justify-between"
                      >
                        
                        {/* Ticket Ref Meta */}
                        <div>
                          <div className="flex justify-between items-start gap-1 leading-none">
                            <span className="font-extrabold text-gray-800 dark:text-gray-150 text-[13px] font-display">
                              {o.order_number}
                            </span>
                            
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                              o.table_id ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-50/20 text-blue-500 dark:bg-blue-900/10'
                            }`}>
                              {getTableName(o.table_id)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-gray-50 dark:border-gray-800">
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${elColor}`}>
                              <Clock size={11} /> {elapsed}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">
                              #{ticketItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                            </span>
                          </div>
                        </div>

                        {/* Fulfillable Dishes details list */}
                        <div className="space-y-2 border-t border-dashed border-gray-150 dark:border-gray-850 pt-2.5">
                          {ticketItems.map((item) => {
                            const prod = db.getProducts().find(p => p.id === item.product_id);

                            return (
                              <div key={item.id} className="block leading-tight">
                                <div className="flex justify-between font-bold text-gray-800 dark:text-gray-250">
                                  <span>{prod ? prod.name : 'Unknown'} ({item.size})</span>
                                  <span className="font-extrabold text-primary shrink-0 ml-1.5">x{item.quantity}</span>
                                </div>
                                
                                {/* Toppings list */}
                                {item.toppings && item.toppings.length > 0 && (
                                  <p className="text-[10px] text-gray-500 pl-2 leading-none mt-1">
                                    + {item.toppings.map(t => t.name).join(', ')}
                                  </p>
                                )}

                                {/* Kitchen Special Notes */}
                                {item.notes && (
                                  <p className="text-[10px] text-blue-500 bg-blue-50 dark:bg-blue-950/25 px-1.5 py-0.8 rounded-md italic mt-1.5 font-semibold">
                                    ✍️ "{item.notes}"
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Transition button triggers */}
                        <div className="pt-2 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                          
                          {o.status === 'Pending' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Preparing')}
                              className="w-full bg-[#FFD84D] hover:bg-[#FFD84D]/90 text-gray-950 py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition"
                            >
                              <span>Start Cook</span>
                              <ArrowRight size={10} />
                            </button>
                          )}

                          {o.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Ready')}
                              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition"
                            >
                              <span>Set Ready</span>
                              <CheckSquare size={10} />
                            </button>
                          )}

                          {o.status === 'Ready' && (
                            <button
                              onClick={() => updateOrderStatusAndNotify(o.id, 'Completed')}
                              className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition"
                            >
                              <span>Complete serving</span>
                              <CheckCircle2 size={10} />
                            </button>
                          )}

                          {o.status === 'Completed' && (
                            <div className="text-[9px] text-green-500 font-extrabold flex items-center gap-1 py-1">
                              ✓ FULFILLED CHECK
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
