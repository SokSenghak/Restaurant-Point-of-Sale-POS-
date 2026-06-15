import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Scale } from 'lucide-react';
import { Product, Topping } from '../types';
import { usePOSStore } from '../store/posStore';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { toppings, addToCart, language, systemSettings } = usePOSStore();
  const currency = systemSettings?.currency || '€';
  
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>('Small');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Reset values when a new product is selected
  useEffect(() => {
    if (product) {
      setSelectedSize('Small');
      setSelectedToppings([]);
      setQuantity(1);
      setNotes('');
    }
  }, [product]);

  if (!product) return null;

  // Base price selection based on active size
  let basePrice = product.small_price;
  if (selectedSize === 'Medium') basePrice = product.medium_price;
  if (selectedSize === 'Large') basePrice = product.large_price;

  // Calculate product discount if active
  if (product.discount_percent > 0) {
    basePrice = basePrice * (1 - product.discount_percent / 100);
  }

  // Topping cost sum
  const toppingsCost = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const singleUnitPrice = basePrice + toppingsCost;
  const totalCost = singleUnitPrice * quantity;

  // Toggle Topping selection
  const handleToggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity, selectedToppings, notes);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Dark blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs"
        />

        {/* Modal Card Layout */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] border border-gray-100 dark:border-gray-800 transition-colors duration-200"
        >
          
          {/* Close button */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white p-2 rounded-full cursor-pointer z-20 transition"
          >
            <X size={18} />
          </button>

          {/* Left panel: Image (70%) */}
          <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-950 p-8 flex flex-col justify-center items-center relative min-h-[250px] md:min-h-0 border-r border-gray-100 dark:border-gray-805">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
            >
              <img
                src={product.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {product.discount_percent > 0 && (
              <div className="absolute bottom-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                SAVE {product.discount_percent}% TODAY
              </div>
            )}
          </div>

          {/* Right panel: Details Controls */}
          <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-none h-full justify-between">
            <div>
              {/* Product Info */}
              <div className="mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/5 dark:bg-primary/10 px-2.5 py-1 rounded-lg">
                  {language === 'en' ? 'Product Detail' : 'ពត៌មានលម្អិតមុខទំនិញ'}
                </span>
                <h2 className="text-xl md:text-2xl font-black font-display text-gray-800 dark:text-white mt-2 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed mt-2.5">
                  {product.description}
                </p>
              </div>

              {/* Step 1: Select Size */}
              <div className="mb-5">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 block uppercase tracking-wider mb-2">
                  1. {language === 'en' ? 'Choose portion size' : 'ជ្រើសរើសទំហំ'}
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Small', 'Medium', 'Large'] as const).map((sz) => {
                    let cost = sz === 'Small' 
                      ? product.small_price 
                      : (sz === 'Medium' ? product.medium_price : product.large_price);
                    
                    if (product.discount_percent > 0) {
                      cost = cost * (1 - product.discount_percent / 100);
                    }

                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 dark:bg-primary/10'
                            : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-xs font-bold leading-none">{sz}</span>
                        <span className="text-xs font-black mt-1.5">{currency}{cost.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Extras & Toppings */}
              <div className="mb-5">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 block uppercase tracking-wider mb-2">
                  2. {language === 'en' ? 'Add Extra Toppings' : 'បន្ថែមគ្រឿងគោក'}
                </span>
                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {toppings.filter(t => t.active).map((top) => {
                    const isSelected = selectedToppings.some(t => t.id === top.id);

                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => handleToggleTopping(top)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FFD84D] bg-[#FFD84D]/5 text-gray-900 dark:bg-[#FFD84D]/10 dark:text-white'
                            : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-white dark:bg-gray-800 p-1 rounded-lg shadow-xs">{top.image}</span>
                          <div>
                            <p className="text-xs font-bold truncate leading-none">{top.name}</p>
                            <p className="text-[10px] text-gray-500 font-semibold mt-1">+{currency}{top.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border transition ${
                          isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={4} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Notes */}
              <div className="mb-4">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 block uppercase tracking-wider mb-2">
                  3. {language === 'en' ? 'Special Kitchen Instructions' : 'កំណត់សម្គាល់ផ្ទះបាយ'}
                </span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'en' ? "e.g., No onions, extra crispy..." : "ឧទាហរណ៍៖ កុំដាក់ខ្ទឹមបារាំង, ចម្អិនឲ្យស្រួយ..."}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-750 text-gray-800 dark:text-white focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-gray-850 transition"
                />
              </div>
            </div>

            {/* Bottom Actions pricing and confirmation */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 mt-4">
              
              {/* Quantity selector */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="w-10 text-center text-xs font-black text-gray-800 dark:text-gray-100">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="h-8 w-8 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Add To Cart CTA */}
              <motion.button
                layout
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-2xl py-3 px-4 text-xs font-bold flex items-center justify-between shadow-md shadow-primary/10 cursor-pointer transition-all duration-150"
              >
                <span>{language === 'en' ? 'Add To Cart' : 'បញ្ចូលទៅកន្ត្រក'}</span>
                <span className="bg-white/15 px-3 py-1 rounded-xl text-xs font-black">
                  {currency}{totalCost.toFixed(2)}
                </span>
              </motion.button>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
