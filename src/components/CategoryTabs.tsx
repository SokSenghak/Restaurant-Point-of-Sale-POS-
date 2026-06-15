import React from 'react';
import { usePOSStore } from '../store/posStore';
import { motion } from 'motion/react';

export default function CategoryTabs() {
  const { 
    categories, 
    products, 
    selectedCategoryId, 
    setSelectedCategoryId,
    language 
  } = usePOSStore();

  // Dynamically count active products in each category
  const getProductCount = (catId: string) => {
    return products.filter(p => p.category_id === catId && p.active).length;
  };

  const totalActiveProducts = products.filter(p => p.active).length;

  return (
    <div className="w-full overflow-x-auto select-none no-scrollbar py-3 px-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="flex gap-2.5 min-w-max pb-1">
        
        {/* 'All Products' Tab */}
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`relative px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            selectedCategoryId === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-755 border border-transparent dark:border-gray-700/30'
          }`}
        >
          <span className="text-sm">🍽️</span>
          <span>{language === 'en' ? 'All Items' : 'មុខជំនាញទាំងអស់'}</span>
          <span className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-[10px] font-bold ${
            selectedCategoryId === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-gray-200/80 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {totalActiveProducts}
          </span>
        </button>

        {/* Dynamic Category Tabs */}
        {categories.filter(c => c.active).map((cat) => {
          const count = getProductCount(cat.id);
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`relative px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 border border-transparent dark:border-gray-700/30'
              }`}
            >
              <span className="text-sm">{cat.icon || '🍕'}</span>
              <span>{cat.name}</span>
              <span className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200/80 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
