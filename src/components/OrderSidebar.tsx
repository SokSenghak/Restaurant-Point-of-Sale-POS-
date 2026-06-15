import React, { useState } from 'react';
import { ShoppingBasket, Plus, Minus, Trash2, Users, ReceiptText, Tag, MapPin, Sparkles } from 'lucide-react';
import { usePOSStore, CartItem } from '../store/posStore';
import CouponInput from './CouponInput';
import { motion, AnimatePresence } from 'motion/react';

interface OrderSidebarProps {
  onOpenCheckout: () => void;
}

export default function OrderSidebar({ onOpenCheckout }: OrderSidebarProps) {
  const { 
    cart, 
    tables, 
    customers, 
    activeTableId, 
    activeCustomerId, 
    setTable, 
    setCustomer,
    removeFromCart, 
    updateCartQty,
    discountPercent,
    discountAmount,
    language,
    systemSettings
  } = usePOSStore();

  const currency = systemSettings?.currency || '€';
  const taxRatePercent = systemSettings?.taxPercent ?? 10;

  const [showTableSelect, setShowTableSelect] = useState(false);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const activeDiscountAmount = discountAmount || (subtotal * (discountPercent / 100));
  const remainingTotal = Math.max(0, subtotal - activeDiscountAmount);
  const taxAmount = Number((remainingTotal * (taxRatePercent / 100)).toFixed(2));
  const grandTotal = Number((remainingTotal + taxAmount).toFixed(2));

  // Names helper
  const selectedTable = tables.find(t => t.id === activeTableId);
  const selectedCustomer = customers.find(c => c.id === activeCustomerId);

  return (
    <div id="pos-order-sidebar" className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 transition-colors duration-200">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBasket size={18} className="text-primary animate-pulse" />
          <h2 className="text-sm font-black font-display text-gray-800 dark:text-white uppercase tracking-wider">
            {language === 'en' ? 'Order Summary' : 'បញ្ជីកម្ម៉ង់'}
          </h2>
        </div>
        <span className="bg-primary/5 text-primary text-xs font-black px-2.5 py-1 rounded-xl">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} {language === 'en' ? 'Items' : 'មុខ'}
        </span>
      </div>

      {/* Quick Table & Customer Anchors */}
      <div className="p-3 border-b border-gray-50 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/30 grid grid-cols-2 gap-2 shrink-0">
        
        {/* Table Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTableSelect(!showTableSelect);
              setShowCustomerSelect(false);
            }}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer border transition ${
              selectedTable 
                ? 'bg-[#FFD84D]/10 border-[#FFD84D] text-amber-600 dark:text-amber-400 font-extrabold'
                : 'bg-white dark:bg-gray-800 border-gray-150 dark:border-gray-700 text-gray-500'
            }`}
          >
            <MapPin size={12} />
            <span className="truncate">{selectedTable ? selectedTable.table_number : (language === 'en' ? 'Link Table' : 'ភ្ជាប់តុ')}</span>
          </button>

          {/* Quick Dropdown List */}
          <AnimatePresence>
            {showTableSelect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-1 w-44 bg-white dark:bg-gray-950 rounded-xl border border-gray-150 dark:border-gray-800 shadow-xl p-1 z-30 max-h-48 overflow-y-auto"
              >
                <button
                  onClick={() => { setTable(null); setShowTableSelect(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                >
                  -- Takeaway (No Table)
                </button>
                {tables.filter(t => t.active).map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTable(t.id);
                      setShowTableSelect(false);
                    }}
                    className={`w-full text-[11px] text-left px-2.5 py-1.5 font-bold rounded-lg flex items-center justify-between transition ${
                      activeTableId === t.id
                        ? 'bg-primary/5 text-primary'
                        : t.status === 'Occupied'
                        ? 'text-red-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <span>{t.table_number} ({t.capacity} pax)</span>
                    <span className={`h-2 w-2 rounded-full ${
                      t.status === 'Available' ? 'bg-green-500' : t.status === 'Occupied' ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customer loyalty Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCustomerSelect(!showCustomerSelect);
              setShowTableSelect(false);
            }}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer border transition ${
              selectedCustomer 
                ? 'bg-primary/10 border-primary text-primary font-extrabold'
                : 'bg-white dark:bg-gray-800 border-gray-150 dark:border-gray-700 text-gray-500'
            }`}
          >
            <Users size={12} />
            <span className="truncate">{selectedCustomer ? selectedCustomer.name : (language === 'en' ? 'Add Loyalty' : 'សមាជិក') }</span>
          </button>

          {/* Quick loyalty Dropdown List */}
          <AnimatePresence>
            {showCustomerSelect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-950 rounded-xl border border-gray-150 dark:border-gray-800 shadow-xl p-1 z-30 max-h-48 overflow-y-auto"
              >
                <button
                  onClick={() => { setCustomer(null); setShowCustomerSelect(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
                >
                  -- Walk-in (No Member)
                </button>
                {customers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCustomer(c.id);
                      setShowCustomerSelect(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 font-bold rounded-lg flex flex-col transition ${
                      activeCustomerId === c.id
                        ? 'bg-primary/5 text-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-[11px] truncate">{c.name}</span>
                    <span className="text-[9px] text-gray-400 font-semibold">{c.points} pts • {c.visits} visits</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Main Selected Items List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 hover-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 dark:text-gray-500">
            <ShoppingBasket size={38} className="stroke-1 text-gray-300 dark:text-gray-700 mb-2 animate-bounce" />
            <p className="text-xs font-bold font-display">{language === 'en' ? 'Basket is empty' : 'កន្ត្រកកម្ម៉ង់ទំនេរ'}</p>
            <p className="text-[10px] font-medium leading-relaxed mt-1">
              Select mouthwatering dishes from the menu to start checking out orders.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2.5 bg-gray-50 dark:bg-gray-850 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 transition"
                >
                  {/* Product small thumbnail */}
                  <div className="h-14 w-14 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shrink-0 overflow-hidden p-1.5 border border-gray-150 dark:border-gray-800">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Core details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-primary transition p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Meta info sizes and toppings */}
                    <div className="flex flex-col mt-0.5">
                      <span className="text-[9px] font-extrabold text-primary bg-primary/5 dark:bg-primary/20 self-start px-1.5 py-0.2 rounded-md uppercase">
                        {item.size}
                      </span>
                      
                      {item.toppings.length > 0 && (
                        <p className="text-[9px] text-gray-500 leading-snug mt-1 font-semibold">
                          + {item.toppings.map(t => `${t.name} (+${currency}${t.price.toFixed(1)})`).join(', ')}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-[9px] text-blue-500 font-semibold italic mt-0.5">
                          ✍️ "{item.notes}"
                        </p>
                      )}
                    </div>

                    {/* Quantity controls & Line cost */}
                    <div className="flex justify-between items-center gap-1 mt-2.5 pt-1.5 border-t border-dashed border-gray-150 dark:border-gray-750">
                      
                      {/* Plus Minus Qty control */}
                      <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="h-5 w-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500"
                        >
                          <Minus size={10} strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center text-[10px] font-black text-gray-800 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="h-5 w-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500"
                        >
                          <Plus size={10} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Cost */}
                      <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">
                        {currency}{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bill calculations, Promo Coupon Box and Checkout CTA */}
      <div className="p-2.5 sm:p-4 border-t border-gray-100 dark:border-gray-800 space-y-2.5 sm:space-y-4 bg-gray-50/30 dark:bg-gray-950/20 shrink-0">
        
        {/* Coupon Input module */}
        {cart.length > 0 && <CouponInput />}

        {/* Detailed Invoice Values */}
        <div className="space-y-1 sm:space-y-1.5 pt-0.5 text-[11px] sm:text-xs">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>{language === 'en' ? 'Subtotal' : 'តម្លៃសរុប'}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{currency}{subtotal.toFixed(2)}</span>
          </div>
          
          {activeDiscountAmount > 0 && (
            <div className="flex justify-between text-green-500">
              <span className="flex items-center gap-1">
                <Tag size={10} /> {language === 'en' ? 'Discount applied' : 'បញ្ចុះតម្លៃ'}
              </span>
              <span className="font-extrabold">-{currency}{activeDiscountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>{language === 'en' ? `Tax (VAT ${taxRatePercent}%)` : `ពន្ធដារ (${taxRatePercent}%)`}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{currency}{taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-800 dark:text-gray-100 pt-1.5 border-t border-gray-150 dark:border-gray-850">
            <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider">{language === 'en' ? 'Grand total' : 'រួមសរុប'}</span>
            <span className="text-sm sm:text-base font-black text-primary">{currency}{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Selected Customer & Table Info in checkout bar */}
        {cart.length > 0 && (
          <div className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 font-medium flex justify-between gap-1.5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-1.5 sm:p-2">
            <span>Table: <strong className="text-gray-700 dark:text-gray-300">{selectedTable ? selectedTable.table_number : 'Takeaway'}</strong></span>
            <span>Customer: <strong className="text-gray-700 dark:text-gray-300 text-right truncate max-w-[100px]">{selectedCustomer ? selectedCustomer.name : 'Walk-in'}</strong></span>
          </div>
        )}

        {/* Checkout Primary CTA Button */}
        <button
          onClick={onOpenCheckout}
          disabled={cart.length === 0}
          className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 transition shadow-md ${
            cart.length > 0
              ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/10 cursor-pointer'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <ReceiptText size={13} />
          {language === 'en' ? 'Proceed To Payment' : 'ទូទាត់ប្រាក់'} ({currency}{grandTotal.toFixed(2)})
        </button>

      </div>

    </div>
  );
}
