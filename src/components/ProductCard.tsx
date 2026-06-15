import React from 'react';
import { Star, Award, TrendingUp, Percent } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { usePOSStore } from '../store/posStore';

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const { language, systemSettings } = usePOSStore();
  const currency = systemSettings?.currency || '€';
  
  // Custom discount calculation for badge view
  const hasDiscount = product.discount_percent > 0;
  const originalSmallPrice = product.small_price;
  const discountedSmallPrice = hasDiscount 
    ? originalSmallPrice * (1 - product.discount_percent / 100) 
    : originalSmallPrice;

  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.015, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={() => onSelect(product)}
      className="relative flex flex-col justify-between bg-white dark:bg-gray-800 rounded-[20px] p-4 border border-gray-100 dark:border-gray-750 shadow-sm cursor-pointer overflow-hidden group select-none transition-colors duration-200"
    >
      
      {/* Top Badges overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        
        {/* Discount Percent Badge */}
        {hasDiscount && (
          <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm uppercase tracking-wide">
            <Percent size={10} strokeWidth={3} />
            {product.discount_percent}% OFF
          </span>
        )}

        {/* Custom Custom Badge (e.g. Best Seller / Classic) */}
        {product.badge && (
          <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm uppercase tracking-wide">
            <Award size={10} />
            {product.badge}
          </span>
        )}

        {/* Popular Badge */}
        {product.popular && (
          <span className="bg-[#FFD84D] text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm uppercase tracking-wide">
            <TrendingUp size={10} />
            {language === 'en' ? 'Popular' : 'ល្បីខ្លាំង'}
          </span>
        )}
      </div>

      {/* Floating Rating Badge Top Right */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-gray-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 border border-gray-100 dark:border-gray-700 pointer-events-none shadow-xs">
        <Star size={11} className="fill-amber-400 stroke-amber-400" />
        <span className="text-[10px] font-extrabold text-gray-700 dark:text-gray-200">{product.rating.toFixed(1)}</span>
      </div>

      {/* Image container centering */}
      <div className="w-full h-36 flex items-center justify-center p-3 relative mt-3 mb-1 overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900/50">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Information Details */}
      <div className="mt-3 flex flex-col flex-grow">
        <h3 className="text-sm font-bold font-display text-gray-800 dark:text-gray-150 leading-snug tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-sans mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Pricing Footer */}
      <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between gap-1">
        
        {/* Small Size Price Layout */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Small</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-gray-800 dark:text-gray-200">
              {currency}{discountedSmallPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through">
                {currency}{originalSmallPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Large Size Price Layout */}
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Large</span>
          <span className="text-sm font-black text-primary">
            {currency}{product.large_price.toFixed(2)}
          </span>
        </div>

      </div>

    </motion.div>
  );
}
