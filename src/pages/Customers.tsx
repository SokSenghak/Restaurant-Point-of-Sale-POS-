import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { 
  Users, Plus, Trash2, Key, Search, Star, Award, Gift, Phone, Mail, X, Check 
} from 'lucide-react';
import { Customer } from '../types';

export default function Customers() {
  const { customers, refreshFromDB, language } = usePOSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPoints, setFormPoints] = useState(100);

  const filteredCustomers = customers.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.phone.includes(searchTerm) || 
           c.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddPoints = (id: string, amount: number) => {
    const idx = customers.findIndex(c => c.id === id);
    if (idx >= 0) {
      const updated = { ...customers[idx] };
      updated.points = Math.max(0, updated.points + amount);
      db.saveCustomer(updated);
      refreshFromDB();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      alert('Customer Name and Phone number are required!');
      return;
    }

    const payload: Customer = {
      id: `cust-${Date.now()}`,
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || 'walk-in@example.com',
      points: Number(formPoints) || 100,
      visits: 1
    };

    db.saveCustomer(payload);
    refreshFromDB();
    
    // Reset
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormPoints(100);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you strictly sure you want to remove this loyalty customer from record?')) {
      db.deleteCustomer(id);
      refreshFromDB();
    }
  };

  return (
    <div id="page-customers" className="p-4 md:p-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Customer Loyalty CRM' : 'សមាជិកនិងពិន្ទុអតិថិជន (ឡូយាល់ធី)'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Sponsor client reward structures, increment loyalty point tiers, and register profiles</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <Plus size={14} />
          {language === 'en' ? 'Register Customer' : 'បង្កើតសមាជិកថ្មី'}
        </button>
      </div>

      {/* Dynamic Add Loyalty Member Form */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[20px] shadow-sm max-w-2xl transition space-y-4"
        >
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 pb-1.5 border-b border-gray-100">Enroll New Loyalty Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Full Human Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Sreyleap Heng"
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white border border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Active Contact Phone</label>
              <input
                type="text"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="012 555 777"
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white border border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Client Email Address</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="sreyleap@example.com"
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white border border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Initial Enroll Points Reward</label>
              <input
                type="number"
                min="0"
                value={formPoints}
                onChange={(e) => setFormPoints(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white border border-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end text-xs">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-2 hover:bg-gray-150 rounded-lg text-gray-500 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg font-black uppercase shadow-xs cursor-pointer"
            >
              Verify & Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Lookup filter bar */}
      <div className="relative max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-2.5 rounded-2xl shadow-sm">
        <Search size={14} className="absolute left-6 inset-y-0 my-auto text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Lookup loyalty member by name, phone or email..."
          className="w-full text-xs font-semibold pl-8 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-white border border-transparent outline-none transition"
        />
      </div>

      {/* Customers Cards Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => {
          // tiers
          let tier = 'Silver Tier';
          let tierBg = 'bg-stone-100 text-stone-600';
          if (c.points >= 2000) {
            tier = 'Diamond Elite';
            tierBg = 'bg-sky-50 text-sky-600 dark:bg-sky-950/20';
          } else if (c.points >= 1000) {
            tier = 'Gold Star Member';
            tierBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/10';
          }

          return (
            <div 
              key={c.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-sm relative overflow-hidden transition"
            >
              {/* Card design accents */}
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

              {/* Header profile block */}
              <div className="flex justify-between items-start gap-1">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800 dark:text-white font-display leading-tight">{c.name}</h4>
                  <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-1.5 ${tierBg}`}>
                    {tier}
                  </span>
                </div>
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-1 text-gray-300 hover:text-primary rounded-lg transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Body stats lists */}
              <div className="mt-4 pt-3.5 border-t border-dashed border-gray-150 dark:border-gray-800 text-[11px] text-gray-500 space-y-1.5 font-semibold">
                <div className="flex items-center gap-2">
                  <Phone size={11} className="text-gray-400 shrink-0" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={11} className="text-gray-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
              </div>

              {/* Loyalty statistics points */}
              <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Visits Logged</span>
                  <strong className="text-sm font-black text-gray-800 dark:text-white mt-1 block font-display">{c.visits} checks</strong>
                </div>

                <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-850 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <Gift size={13} className="text-amber-500" />
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Reward Balance</span>
                    <strong className="text-xs font-black text-primary mt-0.5 block font-display">{c.points} pts</strong>
                  </div>
                </div>
              </div>

              {/* Point adjuster buttons */}
              <div className="mt-4 grid grid-cols-2 gap-1.5 pt-3.5 border-t border-dashed border-gray-150 dark:border-gray-800/85">
                <button
                  onClick={() => handleAddPoints(c.id, 100)}
                  className="bg-gray-50 hover:bg-primary/5 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-amber-400 py-1 px-1.5 rounded-lg font-bold transition text-center cursor-pointer"
                >
                  +100 pts gift
                </button>
                <button
                  onClick={() => handleAddPoints(c.id, -100)}
                  className="bg-gray-50 hover:bg-red-50 dark:bg-gray-800 text-[10px] text-gray-400 hover:text-red-500 py-1 px-1.5 rounded-lg font-bold transition text-center cursor-pointer"
                >
                  -100 pts redact
                </button>
              </div>

            </div>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-bold">
            No active customer records matching keywords exist in CRM database.
          </div>
        )}
      </div>

    </div>
  );
}
