import React, { useState } from 'react';
import { X, CheckCircle, Wallet, ArrowRight, Printer, RefreshCw, Smartphone } from 'lucide-react';
import { usePOSStore } from '../store/posStore';
import { PaymentMethod, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReceiptModal from './ReceiptModal';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export default function PaymentDialog({ isOpen, onClose, onPaymentSuccess }: PaymentDialogProps) {
  const { cart, createOrderAndPay, discountPercent, discountAmount, language } = usePOSStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
  const [cashAmountInput, setCashAmountInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalOrder, setFinalOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Cart values
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const activeDiscountAmount = discountAmount || (subtotal * (discountPercent / 100));
  const remainingTotal = Math.max(0, subtotal - activeDiscountAmount);
  const taxAmount = Number((remainingTotal * 0.1).toFixed(2));
  const grandTotal = Number((remainingTotal + taxAmount).toFixed(2));

  const paymentMethods: { method: PaymentMethod; label: string; icon: string; logoColor: string }[] = [
    { method: 'Cash', label: 'Cash Drawer', icon: '💵', logoColor: 'bg-green-500' },
    { method: 'Card', label: 'Credit Card', icon: '💳', logoColor: 'bg-blue-500' },
    { method: 'KHQR', label: 'KHQR Standard', icon: '🇰🇭', logoColor: 'bg-red-500' },
    { method: 'ABA Pay', label: 'ABA Instant', icon: '🏦', logoColor: 'bg-[#1b4363]' },
    { method: 'Wing', label: 'Wing Cash', icon: '💸', logoColor: 'bg-lime-500' },
    { method: 'ACLEDA', label: 'ACLEDA Pay', icon: '📐', logoColor: 'bg-amber-500' },
  ];

  const handleExecutePayment = () => {
    setIsProcessing(true);
    
    // Simulate short network latency for premium look
    setTimeout(() => {
      const res = createOrderAndPay(selectedMethod);
      setIsProcessing(false);
      
      if (res.success && res.order) {
        setFinalOrder(res.order);
      } else {
        alert(res.error || 'Unknown checkout error.');
      }
    }, 1200);
  };

  // Cash change helpers
  const cashGiven = parseFloat(cashAmountInput) || grandTotal;
  const changeDue = Math.max(0, cashGiven - grandTotal);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { if (!isProcessing && !finalOrder) onClose(); }}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs"
        />

        {/* Modal Outer */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800 transition-colors duration-200"
        >
          
          <AnimatePresence mode="wait">
            {!finalOrder ? (
              /* Phase 1: Payment Method Selector */
              <motion.div 
                key="billing-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-black font-display text-gray-800 dark:text-white">
                      {language === 'en' ? 'Settle Invoice Payment' : 'ទូទាត់ប្រាក់ក្នុងវិក្កយបត្រ'}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Select table tender and confirm payout</p>
                  </div>
                  <button
                    disabled={isProcessing}
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Sub Panel columns split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left Column (7 cols): Method Buttons Grid */}
                  <div className="md:col-span-7 space-y-4">
                    <span className="text-xs font-black text-gray-800 dark:text-gray-200 block uppercase tracking-wider">
                      {language === 'en' ? 'Select tender method' : 'ជ្រើសរើសវិធីសាស្ត្របង់ប្រាក់'}
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      {paymentMethods.map((pm) => {
                        const isSel = selectedMethod === pm.method;
                        return (
                          <button
                            key={pm.method}
                            type="button"
                            onClick={() => setSelectedMethod(pm.method)}
                            className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                              isSel
                                ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                                : 'border-gray-150 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="text-2xl">{pm.icon}</span>
                            <div>
                              <p className="text-xs font-bold leading-none">{pm.method}</p>
                              <p className="text-[10px] text-gray-400 font-semibold mt-1">{pm.label}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Conditional input fields: Cash change calculator */}
                    {selectedMethod === 'Cash' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/60"
                      >
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1.5">
                          {language === 'en' ? 'Cash Received' : 'ប្រាក់ទទួលបាន'}
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={cashAmountInput}
                            onChange={(e) => setCashAmountInput(e.target.value)}
                            placeholder={`€${grandTotal.toFixed(2)}`}
                            className="flex-1 text-sm font-black px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setCashAmountInput(grandTotal.toString())}
                            className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3.5 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                          >
                            Exact
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs mt-3 pt-2.5 border-t border-dashed border-gray-200 dark:border-gray-750">
                          <span className="text-gray-400">Change Return Due:</span>
                          <span className="font-black text-primary text-sm">€{changeDue.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Conditional view: Cambodian instant KHQR / ABA scan code payload mock */}
                    {(selectedMethod === 'KHQR' || selectedMethod === 'ABA Pay' || selectedMethod === 'ACLEDA' || selectedMethod === 'Wing') && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-sky-50/50 dark:bg-sky-950/20 p-4 rounded-2xl border border-sky-100 dark:border-sky-900/30 flex items-center gap-3"
                      >
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-sky-100 shrink-0">
                          <div className="h-14 w-14 flex flex-col items-center justify-center border-2 border-primary p-0.5 rounded-lg bg-white">
                            <span className="text-[10px] font-extrabold text-primary leading-none">KHQR</span>
                            <div className="h-2 w-2 bg-gray-900 mt-1" />
                            <div className="h-4 w-4 border border-gray-900 mt-0.5 border-dashed" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider block">Cambodian Standard Gateways</span>
                          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200 mt-0.5">Bakong KHQR Integrated Terminal</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Please scan matching order invoices utilizing standard mobile banking apps.</p>
                        </div>
                      </motion.div>
                    )}

                  </div>

                  {/* Right Column (5 cols): Bill breakdown display */}
                  <div className="md:col-span-5 bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3">
                        Calculated Sum Details
                      </span>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-400">
                          <span>Items Subtotal:</span>
                          <span className="font-bold text-gray-700 dark:text-gray-200">€{subtotal.toFixed(2)}</span>
                        </div>

                        {activeDiscountAmount > 0 && (
                          <div className="flex justify-between text-green-500 font-semibold">
                            <span>Total Discount:</span>
                            <span>-€{activeDiscountAmount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-gray-400">
                          <span>Flat VAT (10%):</span>
                          <span className="font-bold text-gray-700 dark:text-gray-200">€{taxAmount.toFixed(2)}</span>
                        </div>

                        <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between text-gray-800 dark:text-white">
                          <span className="font-bold">Total Payable:</span>
                          <span className="text-lg font-black text-primary">€{grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                      <div className="text-[10px] text-center text-gray-400 font-semibold flex items-center justify-center gap-1">
                        <Smartphone size={10} /> POS Receipt will auto-prime on confirm
                      </div>

                      <button
                        onClick={handleExecutePayment}
                        disabled={isProcessing}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition flex items-center justify-center gap-2 shadow-md shadow-primary/15"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            {language === 'en' ? 'Authorizing Payout...' : 'កំពុងទូទាត់ប្រាក់...'}
                          </>
                        ) : (
                          <>
                            {language === 'en' ? 'Complete Payout' : 'បញ្ជាក់ការបង់ប្រាក់'}
                            <ArrowRight size={12} />
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            ) : (
              /* Phase 2: Checkout Success Receipt Printer visualizer */
              <motion.div 
                key="success-phase"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    <CheckCircle className="text-green-500 shrink-0" size={54} strokeWidth={2.5} />
                  </motion.div>
                  
                  <h3 className="text-lg font-black font-display text-gray-800 dark:text-white mt-4">
                    {language === 'en' ? 'Invoice Paid Instantly!' : 'បានបង់ប្រាក់ដោយជោគជ័យ!'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Invoice number: {finalOrder.order_number}</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-850 p-3.5 rounded-2xl border border-gray-150 dark:border-gray-800 mt-4 text-xs max-w-sm w-full divide-y divide-gray-200 dark:divide-gray-700 space-y-2">
                    <div className="flex justify-between text-gray-500 pt-1">
                      <span>Payment Method:</span>
                      <strong className="text-gray-800 dark:text-white uppercase">{finalOrder.payment_method}</strong>
                    </div>
                    <div className="flex justify-between text-gray-500 pt-1.5">
                      <span>Tax Collected:</span>
                      <strong className="text-gray-800 dark:text-white">€{finalOrder.tax.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between text-gray-500 pt-1.5">
                      <span>Grand Total:</span>
                      <strong className="text-primary text-sm font-black">€{finalOrder.total.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Real printable receipt trigger */}
                  <ReceiptModal 
                    orderId={finalOrder.id} 
                    triggerButton={
                      <button className="mt-5 bg-[#FFD84D] hover:bg-[#FFD84D]/90 text-gray-950 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-amber-250 transition-all duration-150">
                        <Printer size={14} />
                        {language === 'en' ? 'Open & Print Thermal Receipt' : 'បោះពុម្ពវិក្កយបត្រ'}
                      </button>
                    }
                  />

                  <button
                    onClick={() => {
                      onPaymentSuccess(finalOrder);
                      setFinalOrder(null);
                      onClose();
                    }}
                    className="mt-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-amber-400 transition"
                  >
                    Return to menu matrix
                  </button>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
