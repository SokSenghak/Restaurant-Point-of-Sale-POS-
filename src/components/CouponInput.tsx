import React, { useState } from 'react';
import { Tag, Check, X, Sparkles } from 'lucide-react';
import { usePOSStore } from '../store/posStore';
import { motion, AnimatePresence } from 'motion/react';

export default function CouponInput() {
  const { currentCouponCode, applyCoupon, removeCoupon, discountPercent, language } = usePOSStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!code.trim()) return;

    const res = applyCoupon(code);
    if (res.success) {
      setSuccess(res.message);
      setCode('');
      // Autoclear success toast after some time
      setTimeout(() => setSuccess(null), 4000);
    } else {
      setError(res.message);
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-850 p-2.5 sm:p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 transition">
      
      {/* Title */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <Tag className="text-gray-400 dark:text-gray-500" size={12} />
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">
          {language === 'en' ? 'Promo Code / Coupon' : 'លេខកូដប្រូម៉ូសិន'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!currentCouponCode ? (
          /* Input Field */
          <motion.form 
            key="input-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleClaim} 
            className="flex gap-1.5"
          >
            <input
              id="coupon-field-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., PIZZA20"
              className="flex-1 text-[11px] font-black px-2.5 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white uppercase tracking-wider focus:outline-none focus:border-primary transition min-w-0"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold px-3 py-1.5 sm:py-2 rounded-xl cursor-pointer transition flex items-center shrink-0"
            >
              {language === 'en' ? 'Claim' : 'អនុវត្ត'}
            </button>
          </motion.form>
        ) : (
          /* Active Coupon State Badge */
          <motion.div 
            key="active-coupon"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex items-center justify-between bg-primary/10 border border-primary/20 p-2 rounded-xl text-xs gap-1.5"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles size={12} className="text-primary animate-pulse shrink-0" />
              <div className="flex flex-wrap items-center gap-1 min-w-0 leading-none">
                <span className="font-extrabold text-primary tracking-wider uppercase bg-primary/20 px-1.5 py-0.5 rounded text-[9px] truncate shrink-0">
                  {currentCouponCode}
                </span>
                <span className="font-bold text-gray-600 dark:text-gray-300 text-[10px] truncate">
                  (-{discountPercent}%) {language === 'en' ? 'Applied' : 'បានអនុវត្ត'}
                </span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={removeCoupon}
              className="text-gray-400 hover:text-primary p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer shrink-0"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      {error && (
        <p className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
      {success && (
        <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
          ✨ {success}
        </p>
      )}
    </div>
  );
}
