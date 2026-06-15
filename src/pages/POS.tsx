import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { Product } from '../types';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import OrderSidebar from '../components/OrderSidebar';
import PaymentDialog from '../components/PaymentDialog';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function POS() {
  const { products, searchQuery, selectedCategoryId, cart, language } = usePOSStore();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter products in real-time by category, search queries (name, ingredients, descriptions)
  const filteredProducts = products.filter(p => {
    // Check category matches
    const catMatch = selectedCategoryId === 'all' || p.category_id === selectedCategoryId;
    
    // Check search term matches
    const searchLow = searchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(searchLow);
    const descMatch = p.description.toLowerCase().includes(searchLow);
    const tagMatch = p.badge && p.badge.toLowerCase().includes(searchLow);
    const termMatch = nameMatch || descMatch || tagMatch;
    
    // Only show active menu items
    return p.active && catMatch && termMatch;
  });

  return (
    <div id="page-pos" className="h-full flex flex-col md:flex-row items-stretch overflow-hidden">
      
      {/* LEFT SIDE (70% Viewport) - Menu marketplace */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-gray-950/60 overflow-hidden h-full">
        
        {/* Core Header Search widget */}
        <SearchBar />

        {/* Promo Banner with elegant micro-interactions */}
        <div className="px-4 pt-4 shrink-0">
          <div className="rounded-[20px] bg-gradient-to-r from-primary to-[#ff3b45] p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md relative overflow-hidden group select-none">
            {/* Background design elements */}
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 -mr-10 -mt-10 transform group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/5 -mb-5 transform group-hover:scale-125 transition-transform duration-700" />

            <div className="z-10 flex-1">
              <span className="bg-white/20 text-[10px] font-black px-2.5 py-0.8 rounded-full uppercase tracking-wider mb-2 inline-block">
                🔥 {language === 'en' ? 'SUMMER FESTIVAL OFFER' : 'ការផ្តល់ជូនពិសេសមហោស្រពរដូវក្តៅ'}
              </span>
              <h2 className="text-xl md:text-2xl font-black font-display tracking-tight leading-tight mt-1">
                {language === 'en' ? 'Capricciosa Pizza - 15% Off!' : 'ភីហ្សា Capricciosa បញ្ចុះតម្លៃ ១៥%!'}
              </h2>
              <p className="text-xs text-white/80 mt-1 max-w-lg leading-relaxed">
                Delicious artisanal classic loaded with ham, mushrooms, black olives, and premium mozzarella. Valid for all digital table-side checkouts today.
              </p>
            </div>

            <button
              onClick={() => {
                const pizzaCap = products.find(p => p.id === 'prod-1');
                if (pizzaCap) setSelectedProduct(pizzaCap);
              }}
              className="bg-white hover:bg-[#FFD84D] text-gray-950 font-extrabold text-xs py-2.5 px-4 rounded-xl cursor-pointer shadow-sm transition-all duration-150 z-10 shrink-0 flex items-center gap-1.5 self-stretch md:self-auto justify-center"
            >
              <span>{language === 'en' ? 'Savor Slice' : 'កម្ម៉ង់ឥឡូវនេះ'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Categories Horizontal Tabs */}
        <CategoryTabs />

        {/* Product Grid Matrix */}
        <div className="flex-1 overflow-y-auto p-4 hover-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 dark:text-gray-500">
              <ShoppingBag size={48} className="stroke-1 mb-2 text-gray-300 dark:text-gray-700" />
              <p className="font-bold text-sm">{language === 'en' ? 'No items found matching search' : 'រកមិនឃើញមុខទំនិញទេ'}</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Try modifying your query constraints or looking into alternative menus categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-12">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onSelect={(prod) => setSelectedProduct(prod)} 
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT SIDE (30% Viewport) - Order panel */}
      <div className="w-full md:w-80 lg:w-[360px] xl:w-[400px] shrink-0 border-l border-gray-100 dark:border-gray-800 h-full">
        <OrderSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      </div>

      {/* Detail selection Overlay */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      {/* Payment processing Overlay */}
      <PaymentDialog 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onPaymentSuccess={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
}
