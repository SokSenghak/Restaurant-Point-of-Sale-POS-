import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { 
  FolderPlus, Plus, Edit2, Trash2, X, Star, Sparkles, Check, MoveUp, MoveDown 
} from 'lucide-react';
import { Category } from '../types';

export default function Categories() {
  const { categories, products, refreshFromDB, language } = usePOSStore();
  
  // States
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🍕');
  const [formSort, setFormSort] = useState(1);
  const [formActive, setFormActive] = useState(true);

  const startEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormIcon(cat.icon);
    setFormSort(cat.sort_order);
    setFormActive(cat.active);
    setShowForm(true);
  };

  const startNew = () => {
    setEditingCat(null);
    setFormName('');
    setFormIcon('🍕');
    setFormSort(categories.length + 1);
    setFormActive(true);
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Category Name is required!');
      return;
    }

    const payload: Category = {
      id: editingCat ? editingCat.id : `cat-${Date.now()}`,
      name: formName.trim(),
      icon: formIcon,
      sort_order: Number(formSort) || 1,
      active: formActive
    };

    db.saveCategory(payload);
    refreshFromDB();
    setShowForm(false);
    setEditingCat(null);
  };

  const handleDelete = (id: string) => {
    const associatedProds = products.filter(p => p.category_id === id);
    if (associatedProds.length > 0) {
      alert(`Cannot delete this category. There are ${associatedProds.length} active menu products linked to it! Re-assign those items first.`);
      return;
    }

    if (confirm('Are you strictly sure you want to permanently delete this category?')) {
      db.deleteCategory(id);
      refreshFromDB();
      if (editingCat && editingCat.id === id) {
        setEditingCat(null);
        setShowForm(false);
      }
    }
  };

  const sortedCategories = [...categories].sort((a,b) => a.sort_order - b.sort_order);

  return (
    <div id="page-categories" className="p-4 md:p-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <FolderPlus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Category Taxonomy CRUD' : 'គ្រប់គ្រងផ្នែកមុខម្ហូប (កាតេហ្គោរី)'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Configure menu categories headings, sort orders hierarchy, and section visibility</p>
          </div>
        </div>

        <button
          onClick={startNew}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <Plus size={14} />
          {language === 'en' ? 'Add Category' : 'បន្ថែមផ្នែកថ្មី'}
        </button>
      </div>

      {/* Grid split of Category lists vs Edit Form details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (7 cols) - Categories list */}
        <div className={`${showForm ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider bg-gray-50/50 dark:bg-gray-950/20">
                    <th className="p-4 w-12 text-center">Icon</th>
                    <th className="p-4">{language === 'en' ? 'Category Name' : 'ឈ្មោះផ្នែក'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Sort Index' : 'លំដាប់លំដោយ'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Associated Foods' : 'ចំនួនម្ហូបលីង'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Status' : 'ស្ថានភាព'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Actions' : 'សកម្មភាព'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-55 dark:divide-gray-800 font-sans">
                  {sortedCategories.map((c) => {
                    const linkedProductCount = products.filter(p => p.category_id === c.id).length;

                    return (
                      <tr key={c.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-955/20 transition">
                        {/* Icon */}
                        <td className="p-4 text-center text-lg">{c.icon || '🍕'}</td>
                        
                        {/* Name */}
                        <td className="p-4 font-black text-gray-800 dark:text-gray-200">{c.name}</td>
                        
                        {/* Sort Order ranking */}
                        <td className="p-4 text-center">
                          <span className="font-extrabold bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-100 dark:border-gray-700/50">
                            #{c.sort_order}
                          </span>
                        </td>

                        {/* Associated product total index */}
                        <td className="p-4 text-center font-bold text-gray-500">
                          {linkedProductCount} dishes
                        </td>

                        {/* Status Toggle */}
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full text-[10px] font-black ${
                            c.active 
                              ? 'bg-green-50/25 text-green-600 dark:bg-green-900/10' 
                              : 'bg-gray-50 text-gray-400 dark:bg-gray-800'
                          }`}>
                            {c.active ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </td>

                        {/* Actions buttons */}
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            <button
                              onClick={() => startEdit(c)}
                              className="p-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary rounded-lg transition"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="p-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 text-gray-300 hover:text-primary rounded-lg transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column (5 cols) - Add/Edit Form drawer */}
        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[24px] shadow-sm space-y-4 transition sticky top-24"
          >
            {/* Form Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#FFD84D] bg-[#FFD84D]/10 px-2.5 py-1 rounded-lg uppercase">
                  Category Panel
                </span>
                <h3 className="text-sm font-black text-gray-800 dark:text-white mt-1.5">
                  {editingCat ? `Modify Category '${editingCat.name}'` : 'Create New Category Group'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingCat(null); }}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-150 hover:text-gray-900 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form list fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Category Header Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Craft Beer Beverages"
                  className="w-full font-semibold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white border border-transparent focus:border-primary outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Emoji Icon</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="🍕">🍕 Classic Pizza</option>
                    <option value="🍟">🍟 Starters/Sides</option>
                    <option value="🍰">🍰 Sweet Desserts</option>
                    <option value="🥤">🥤 Cold Drinks</option>
                    <option value="🥫">🥫 Canned Bev</option>
                    <option value="🌶️">🌶️ Spicy/Extra</option>
                    <option value="🍻">🍻 Craft Beer</option>
                    <option value="🥐">🥐 Croissants</option>
                    <option value="🥗">🥗 Green Salads</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Sort Hierarchy Weight</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formSort}
                    onChange={(e) => setFormSort(parseInt(e.target.value) || 1)}
                    className="w-full font-bold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-850 p-2.5 rounded-xl border border-gray-150 dark:border-gray-800 mt-2">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold block text-gray-700 dark:text-gray-250">Publish Active Status</span>
                  <span className="text-[9px] text-gray-400 block leading-none mt-0.5">Toggle visibility on tablet checkout screens</span>
                </div>
              </label>

            </div>

            {/* Form CTA Buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 font-bold uppercase tracking-wider cursor-pointer transition shadow-xs"
              >
                {editingCat ? 'Apply Changes' : 'Publish Section'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingCat(null); }}
                className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-bold transition"
              >
                Cancel
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
