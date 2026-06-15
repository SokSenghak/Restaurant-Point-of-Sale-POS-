import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { 
  Menu, Trash2, Edit2, Plus, X, Search, Star, Sparkles, Filter, Check 
} from 'lucide-react';
import { Product } from '../types';

export default function Products() {
  const { products, categories, refreshFromDB, language, systemSettings } = usePOSStore();
  const currency = systemSettings?.currency || '€';
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formSmallPrice, setFormSmallPrice] = useState(0);
  const [formMedPrice, setFormMedPrice] = useState(0);
  const [formLargePrice, setFormLargePrice] = useState(0);
  const [formImage, setFormImage] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formPopular, setFormPopular] = useState(false);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formRating, setFormRating] = useState(4.5);
  const [formActive, setFormActive] = useState(true);

  // Filter products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.category_id === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  // Handle Edit click
  const startEdit = (p: Product) => {
    setEditingProd(p);
    setFormName(p.name);
    setFormDesc(p.description);
    setFormCat(p.category_id);
    setFormSmallPrice(p.small_price);
    setFormMedPrice(p.medium_price);
    setFormLargePrice(p.large_price);
    setFormImage(p.image);
    setFormBadge(p.badge || '');
    setFormPopular(p.popular);
    setFormDiscount(p.discount_percent);
    setFormRating(p.rating);
    setFormActive(p.active);
    setShowAddDrawer(true);
  };

  // Handle New click
  const startNew = () => {
    setEditingProd(null);
    setFormName('');
    setFormDesc('');
    setFormCat(categories[0]?.id || '');
    setFormSmallPrice(10.00);
    setFormMedPrice(14.00);
    setFormLargePrice(18.00);
    setFormImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80');
    setFormBadge('');
    setFormPopular(false);
    setFormDiscount(0);
    setFormRating(4.5);
    setFormActive(true);
    setShowAddDrawer(true);
  };

  // Save / Update Submit Action
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCat) {
      alert('Product Name and Category are required!');
      return;
    }

    const payload: Product = {
      id: editingProd ? editingProd.id : `prod-${Date.now()}`,
      category_id: formCat,
      name: formName.trim(),
      description: formDesc.trim(),
      small_price: Number(formSmallPrice) || 0,
      medium_price: Number(formMedPrice) || 0,
      large_price: Number(formLargePrice) || 0,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
      popular: formPopular,
      discount_percent: Number(formDiscount) || 0,
      rating: Number(formRating) || 4.5,
      active: formActive,
      badge: formBadge.trim() || undefined,
      created_at: editingProd ? editingProd.created_at : new Date().toISOString()
    };

    db.saveProduct(payload);
    refreshFromDB();
    setShowAddDrawer(false);
    setEditingProd(null);
  };

  // Delete Action
  const handleDelete = (id: string) => {
    if (confirm('Are you strictly sure you want to permanently delete this product?')) {
      db.deleteProduct(id);
      refreshFromDB();
      if (editingProd && editingProd.id === id) {
        setEditingProd(null);
        setShowAddDrawer(false);
      }
    }
  };

  return (
    <div id="page-products" className="p-4 md:p-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Menu size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Product Catalog CRUD' : 'គ្រប់គ្រងមុខទំនិញម្ហូបអាហារ'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Configure pricing indexes, active categories, discounts, and popular badges</p>
          </div>
        </div>

        <button
          onClick={startNew}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <Plus size={14} />
          {language === 'en' ? 'Create Product' : 'បង្កើតមុខទំនិញថ្មី'}
        </button>
      </div>

      {/* Grid split of list vs form drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Product lists (8 cols) or (12 cols if close drawer) */}
        <div className={`${showAddDrawer ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between transition-all">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 inset-y-0 my-auto text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Lookup product by name..."
                className="w-full text-xs font-semibold pl-8 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-700 dark:text-white border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-800 outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={13} className="text-gray-400" />
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-none"
              >
                <option value="all" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-150">All Food Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-150">{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List display */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-gray-800 transition">
            {filteredProducts.map((p) => {
              const catObj = categories.find(c => c.id === p.category_id);
              
              return (
                <div 
                  key={p.id} 
                  className="p-4 flex gap-4 items-center justify-between hover:bg-gray-55/35 dark:hover:bg-gray-950/20 transition group"
                >
                  <div className="flex gap-4.5 items-center min-w-0">
                    
                    {/* Thumbnail */}
                    <div className="h-14 w-14 rounded-xl bg-gray-50 dark:bg-gray-850 p-1 flex items-center justify-center shrink-0 border border-gray-150 dark:border-gray-800">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{catObj ? catObj.name : 'Pizza'}</span>
                        {p.discount_percent > 0 && (
                          <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                            -{p.discount_percent}%
                          </span>
                        )}
                        {!p.active && (
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 text-[8px] font-bold px-1 py-0.2 rounded-md">
                            INACTIVE
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-xs font-extrabold text-gray-850 dark:text-gray-150 truncate mt-0.5">{p.name}</h4>
                      
                      {/* Price labels */}
                      <p className="text-[10px] text-gray-500 font-semibold mt-1">
                        S: <strong className="text-gray-800 dark:text-gray-200">{currency}{p.small_price.toFixed(1)}</strong> • 
                        M: <strong className="text-gray-800 dark:text-gray-200"> {currency}{p.medium_price.toFixed(1)}</strong> • 
                        L: <strong className="text-primary font-bold"> {currency}{p.large_price.toFixed(1)}</strong>
                      </p>
                    </div>

                  </div>

                  {/* Operational controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="p-2 bg-gray-50 dark:bg-gray-850 text-gray-500 hover:text-primary rounded-xl transition hover:scale-105"
                      title="Edit Product"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-gray-50 dark:bg-gray-850 text-gray-300 hover:text-primary rounded-xl transition hover:scale-105"
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-gray-400 font-bold">
                No active matching products found in POS catalog databases.
              </div>
            )}
          </div>

        </div>

        {/* Right side editing drawer (5 cols) */}
        {showAddDrawer && (
          <form 
            onSubmit={handleFormSubmit}
            className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[24px] shadow-sm space-y-4 transition sticky top-24"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#FFD84D] bg-[#FFD84D]/10 px-2.5 py-1 rounded-lg uppercase">
                  Product Editor
                </span>
                <h3 className="text-sm font-black text-gray-800 dark:text-white mt-2 leading-none">
                  {editingProd ? `Modify '${editingProd.name}'` : 'Create New Menu Item'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddDrawer(false); setEditingProd(null); }}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-150 hover:text-gray-900 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              
              {/* Product title */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Margherita Pizza"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary outline-none transition text-gray-800 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Menu Descriptions</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  placeholder="Ingredients, sauce preparation details..."
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary outline-none transition text-gray-800 dark:text-white"
                />
              </div>

              {/* Category selector Group & Image combo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Category Group</label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent text-gray-750 dark:text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-150">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Rating Star Index</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(parseFloat(e.target.value) || 4.5)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent text-gray-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Size prices */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Small Price ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formSmallPrice}
                    onChange={(e) => setFormSmallPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-bold px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-850 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 font-display">Medium Price ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formMedPrice}
                    onChange={(e) => setFormMedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-bold px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-850 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Large Price ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formLargePrice}
                    onChange={(e) => setFormLargePrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-bold px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-850 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Image URL link */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Image Asset URL (Supabase/Unsplash)</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary outline-none transition text-gray-800 dark:text-white"
                />
              </div>

              {/* Discount index & custom badge */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Discount Percent (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-850 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Custom Label (Best Seller)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Popular, spicy, etc."
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary outline-none transition text-gray-850 dark:text-white"
                  />
                </div>
              </div>

              {/* Checkboxes parameters */}
              <div className="grid grid-cols-2 gap-4 py-2 bg-gray-50 dark:bg-gray-850 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPopular}
                    onChange={(e) => setFormPopular(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-bold block text-gray-700 dark:text-gray-200">Flag Popular</span>
                    <span className="text-[9px] text-gray-450 block leading-none mt-0.5">Displays yellow tag badge</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-bold block text-gray-700 dark:text-gray-200">Active status</span>
                    <span className="text-[9px] text-gray-450 block leading-none mt-0.5">Toggle catalog visibility</span>
                  </div>
                </label>
              </div>

            </div>

            {/* Submit Action footer */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer transition"
              >
                {editingProd ? 'Confirm Changes' : 'Publish Product'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddDrawer(false); setEditingProd(null); }}
                className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-bold transition"
              >
                Discard
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
