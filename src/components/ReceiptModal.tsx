import React, { useState } from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { db } from '../supabase/supabaseMock';
import { usePOSStore } from '../store/posStore';
import { motion, AnimatePresence } from 'motion/react';

interface ReceiptModalProps {
  orderId: string;
  triggerButton?: React.ReactElement;
}

export default function ReceiptModal({ orderId, triggerButton }: ReceiptModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, systemSettings } = usePOSStore();
  const currency = systemSettings?.currency || '€';
  
  const receipt = db.edgeFunctionGenerateReceipt(orderId);

  const handlePrint = () => {
    // Standard quick browser trigger for demonstration,
    // with CSS-scoped selector isolation as defined in index.css
    window.print();
  };

  if (!receipt) return null;

  return (
    <div>
      {/* Trigger Button component */}
      {triggerButton ? (
        React.cloneElement(triggerButton, { onClick: () => setIsOpen(true) })
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Printer size={13} />
          {language === 'en' ? 'Receipt' : 'វិក្កយបត្រ'}
        </button>
      )}

      {/* Main Dialogue Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs"
            />

            {/* Receipt Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-zinc-100 dark:bg-gray-950 rounded-[28px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-850"
            >
              
              {/* Header block with close */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
                <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider">
                  Thermal Receipt Preview
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Thermal ticket paper container (Scrollable on tablet) */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                
                {/* Physical ticket mock */}
                <div 
                  id="print-area" 
                  className="w-full max-w-sm bg-white text-zinc-900 p-5 rounded-sm shadow-md border border-zinc-200 relative thermal-receipt leading-relaxed"
                  style={{ minHeight: '480px' }}
                >
                  {/* Jagged paper top */}
                  <div className="absolute top-0 inset-x-0 h-1.5 flex justify-between overflow-hidden">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="h-3 w-3 bg-zinc-100 dark:bg-gray-950 shrink-0 transform rotate-45 -translate-y-2.5 border-b border-r border-zinc-200" 
                      />
                    ))}
                  </div>

                  {/* Receipt Core Content */}
                  <div className="text-center pt-4 mb-4">
                    <span className="text-2xl">🍕</span>
                    <h2 className="text-sm font-extrabold uppercase mt-1.5 tracking-wide">{receipt.restaurant}</h2>
                    <p className="text-[10px] text-zinc-500 mt-1">{receipt.address}</p>
                    <p className="text-[10px] text-zinc-500">{receipt.phone}</p>
                  </div>

                  {/* Meta Details List */}
                  <div className="text-[10px] space-y-1 block border-t border-b border-dashed border-zinc-300 py-3 mb-3">
                    <div className="flex justify-between">
                      <span>ORDER NUMBER:</span>
                      <span className="font-extrabold">{receipt.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TABLE PORTION:</span>
                      <span className="font-extrabold">{receipt.tableNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ATTENDANT/CASHIER:</span>
                      <span>Senghakk POS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CLIENT LOYALTY:</span>
                      <span className="font-extrabold truncate max-w-[150px]">{receipt.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ACCUMULATED POINTS:</span>
                      <span>{receipt.customerPoints} pts</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>DATE STAMP:</span>
                      <span>{new Date(receipt.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Item Rows */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[10px] font-extrabold flex justify-between border-b border-dashed border-zinc-200 pb-1 mb-1">
                      <span className="w-1/2">ITEM NAME</span>
                      <span className="w-1/6 text-center">QTY</span>
                      <span className="w-1/3 text-right">TOTAL</span>
                    </div>

                    {receipt.items.map((item) => (
                      <div key={item.id} className="text-[10px] block leading-tight">
                        <div className="flex justify-between font-bold">
                          <span className="w-1/2 truncate font-bold text-zinc-800">{item.productName} ({item.size})</span>
                          <span className="w-1/6 text-center text-zinc-600">x{item.quantity}</span>
                          <span className="w-1/3 text-right">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {/* Selected optional toppings */}
                        {item.toppings && item.toppings.length > 0 && (
                          <div className="text-[9px] text-zinc-500 pl-2">
                            + Toppings: {item.toppings.map(t => t.name).join(', ')}
                          </div>
                        )}
                        {/* Line Notes */}
                        {item.notes && (
                          <div className="text-[9px] text-zinc-400 italic pl-2">
                             * Notes: {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Calculations Details Block */}
                  <div className="text-[10px] space-y-1 block border-t border-dashed border-zinc-300 pt-3 mb-4">
                    <div className="flex justify-between">
                      <span>SUBTOTAL:</span>
                      <span>{currency}{receipt.subtotal.toFixed(2)}</span>
                    </div>
                    {receipt.discount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>PROMO DISCOUNT:</span>
                        <span>-{currency}{receipt.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>TAX (VAT {systemSettings?.taxPercent ?? 10}%):</span>
                      <span>{currency}{receipt.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black border-t border-double border-zinc-400 pt-2.5">
                      <span>GRAND TOTAL:</span>
                      <span>{currency}{receipt.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-500 pt-1">
                      <span>TENDER METHOD:</span>
                      <span className="font-bold uppercase text-zinc-800">{receipt.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Verification QR section */}
                  <div className="flex flex-col items-center justify-center py-2.5 border-t border-dashed border-zinc-200">
                    {/* Simulated digital barcode layout */}
                    <div className="py-1 px-4 bg-zinc-50 border border-zinc-200 rounded-md mb-2 flex flex-col items-center">
                      <div className="flex gap-0.5 h-6 items-center">
                        {[1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 1, 4, 1, 2, 1, 3, 2].map((w, index) => (
                          <div key={index} className="bg-zinc-900 h-full" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                        * {receipt.orderNumber} *
                      </span>
                    </div>
                    
                    <p className="text-[9px] text-zinc-400 font-extrabold uppercase mt-1 mb-1">
                      {language === 'en' ? 'Invoice QR Verification' : 'ផ្ទៀងផ្ទាត់វិក្កយបត្រ'}
                    </p>
                    <div className="h-20 w-20 border-2 border-zinc-900 p-1 bg-white relative flex flex-col items-center justify-center rounded-lg">
                      {/* Matrix Grid dots layout block mock */}
                      <div className="grid grid-cols-5 gap-1 w-full h-full">
                        {Array.from({ length: 25 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`rounded-sm ${(idx === 0 || idx === 4 || idx === 12 || idx === 20 || idx === 24 || idx % 3 === 0) ? 'bg-zinc-900' : 'bg-transparent'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Thank you footline */}
                  <div className="text-center text-[9px] font-bold text-zinc-500 mt-4 border-t border-zinc-200 pt-3">
                    {receipt.thankYouMessage}
                    <p className="text-[8px] text-zinc-400 mt-1">Baked with Fresh Dough Daily</p>
                  </div>

                </div>

              </div>

              {/* Printing drawer triggers */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2 shrink-0">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/10 transition"
                >
                  <Printer size={14} />
                  Print Receipt (Thermal)
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-xs font-semibold cursor-pointer transition"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
