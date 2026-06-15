import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { LayoutGrid, Check, Tag, Users, HelpCircle, MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { Table, TableStatus } from '../types';

export default function Tables() {
  const { tables, activeTableId, setTable, setCurrentTab, refreshFromDB, language } = usePOSStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  // Extra helper: Table Filter states
  const [filterType, setFilterType] = useState<'all' | TableStatus>('all');
  
  // Custom Table creation state
  const [newTableNum, setNewTableNum] = useState('');
  const [newTableCap, setNewTableCap] = useState(4);
  const [showAddForm, setShowAddForm] = useState(false);

  // Status mapping
  const statusColors: Record<TableStatus, { border: string; text: string; bg: string }> = {
    Available: { border: 'border-green-200 dark:border-green-900/30', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' },
    Occupied: { border: 'border-red-200 dark:border-red-900/30', text: 'text-red-500 dark:text-red-400', bg: 'bg-red-500' }, // requested color occupied: Red
    Reserved: { border: 'border-amber-200 dark:border-amber-900/30', text: 'text-amber-500 dark:text-amber-400', bg: 'bg-[#FFD84D]' } // requested color Reserved: Yellow/Amber
  };

  const handleUpdateStatus = (tableId: string, status: TableStatus) => {
    db.updateTableStatus(tableId, status);
    refreshFromDB();
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleSelectForOrder = (tableId: string) => {
    setTable(tableId);
    setCurrentTab('pos');
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum.trim()) return;

    const exists = tables.some(t => t.table_number.toUpperCase() === newTableNum.trim().toUpperCase());
    if (exists) {
      alert('Table number already exists!');
      return;
    }

    const tId = `table-id-${Date.now()}`;
    const newTab: Table = {
      id: tId,
      table_number: newTableNum.trim().toUpperCase(),
      capacity: newTableCap,
      status: 'Available',
      active: true
    };

    db.saveTable(newTab);
    refreshFromDB();
    setNewTableNum('');
    setShowAddForm(false);
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Are you sure you want to remove this table registration?')) {
      db.deleteTable(tableId);
      refreshFromDB();
      setSelectedTable(null);
    }
  };

  const filteredTables = tables.filter(t => {
    const isAct = t.active;
    const isMatchedType = filterType === 'all' || t.status === filterType;
    return isAct && isMatchedType;
  });

  return (
    <div id="page-tables" className="p-4 md:p-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Restaurant Tables Layout' : 'ប្លង់គ្រប់គ្រងតុអាហារ'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Simulate table-side orders, change occupancy levels, or link bill receipts</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <Plus size={14} />
          {language === 'en' ? 'Add New Table' : 'បន្ថែមតុថ្មី'}
        </button>
      </div>

      {/* Conditional Add Table Form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddTableSubmit} 
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[20px] shadow-sm max-w-xl transition"
        >
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Add Custom Dine-in Table</h4>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Table Number (e.g., T-51)</label>
              <input
                type="text"
                value={newTableNum}
                onChange={(e) => setNewTableNum(e.target.value)}
                placeholder="T-51"
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white border border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Seating Pack Capacity</label>
              <input
                type="number"
                value={newTableCap}
                onChange={(e) => setNewTableCap(parseInt(e.target.value) || 2)}
                min={1}
                max={20}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white border border-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4 text-xs">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-2 hover:bg-gray-150 rounded-lg text-gray-500 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FFD84D] text-gray-950 rounded-lg font-black uppercase shadow-xs cursor-pointer"
            >
              Save Table
            </button>
          </div>
        </form>
      )}

      {/* Main double column split: Table Layout Matrix & Side manager panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left main: Table Grid Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Table status Filters */}
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-1.5 shrink-0">
              {(['all', 'Available', 'Occupied', 'Reserved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    filterType === f
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-amber-400'
                  }`}
                >
                  {f === 'all' ? (language === 'en' ? 'All Tables' : 'តុអាហារទាំងអស់') : f}
                </button>
              ))}
            </div>
            
            <div className="text-[10px] font-bold text-gray-400 flex gap-3 shrink-0">
              <span className="flex items-center gap-1">🟢 Available ({tables.filter(t => t.active && t.status === 'Available').length})</span>
              <span className="flex items-center gap-1">🔴 Occupied ({tables.filter(t => t.active && t.status === 'Occupied').length})</span>
              <span className="flex items-center gap-1">🟡 Reserved ({tables.filter(t => t.active && t.status === 'Reserved').length})</span>
            </div>
          </div>

          {/* Core Table Grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredTables.map((t) => {
              const theme = statusColors[t.status];
              const isSelected = selectedTable && selectedTable.id === t.id;
              const isLinkedToCart = activeTableId === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTable(t)}
                  className={`p-4 rounded-3xl border-2 cursor-pointer relative transition-all duration-150 select-none ${
                    isSelected 
                      ? 'border-primary bg-white dark:bg-gray-900 ring-2 ring-primary/20 scale-[1.015] shadow-md' 
                      : `${theme.border} bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-650 shadow-sm`
                  }`}
                >
                  {/* Status Indicator Stripe */}
                  <div className={`absolute top-0 right-0 h-2.5 w-6 rounded-bl-xl ${theme.bg}`} />

                  {/* Active Anchor linked indicator */}
                  {isLinkedToCart && (
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  )}

                  {/* Icon or emoji */}
                  <div className={`h-10 w-10 rounded-xl ${
                    t.status === 'Available' ? 'bg-green-50 text-green-500 dark:bg-green-950/20' : t.status === 'Occupied' ? 'bg-red-50 text-red-500 dark:bg-red-950/20' : 'bg-amber-50 text-amber-500 dark:bg-amber-950/20'
                  } flex items-center justify-center text-lg font-bold mb-3`}>
                    🍽️
                  </div>

                  {/* Text details */}
                  <h4 className="text-sm font-black text-gray-800 dark:text-white leading-none">Table {t.table_number}</h4>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-150 dark:border-gray-800 text-[11px] text-gray-400 font-semibold uppercase leading-none">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {t.capacity} pax
                    </span>
                    <span className={`font-black uppercase text-[9px] ${theme.text}`}>{t.status}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right side: Table Operations details (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[24px] shadow-sm transition h-full text-center">
          {!selectedTable ? (
            <div className="py-16 text-gray-400 flex flex-col items-center justify-center">
              <HelpCircle size={40} className="text-gray-300 dark:text-gray-700 stroke-1.5 animate-pulse mb-2" />
              <p className="text-xs font-bold leading-none">No table selected</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">Click any dine-in table card on the left panel grid to control status.</p>
            </div>
          ) : (
            <div className="space-y-5 text-left">
              
              {/* Header metadata */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#FFD84D] bg-[#FFD84D]/10 px-2.5 py-1 rounded-lg uppercase">
                      Selected Portion
                    </span>
                    <h3 className="text-lg font-black font-display text-gray-800 dark:text-white leading-tight mt-2.5">
                      Table {selectedTable.table_number}
                    </h3>
                  </div>
                  
                  {/* Delete Table button */}
                  <button
                    onClick={() => handleDeleteTable(selectedTable.id)}
                    className="p-1.5 text-gray-300 hover:text-primary hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
                    title="Remove Table"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-1">Dine-in floor configuration details and active check coupling.</p>
              </div>

              {/* Status details segment */}
              <div className="space-y-2 border-t border-b border-gray-50 dark:border-gray-800 py-4 font-sans text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Guest Capacity:</span>
                  <strong className="text-gray-700 dark:text-gray-200">{selectedTable.capacity} guests</strong>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Usage Status:</span>
                  <strong className="text-primary font-black uppercase text-[10px] tracking-wide">{selectedTable.status}</strong>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Linked Active POS Cart:</span>
                  <strong className="text-gray-700 dark:text-slate-100">
                    {activeTableId === selectedTable.id ? 'YES (Active)' : 'NO (Detached)'}
                  </strong>
                </div>
              </div>

              {/* Change status buttons control panel */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider mb-1.5">Change occupancy of table</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Available', 'Occupied', 'Reserved'] as const).map(st => {
                    const act = selectedTable.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedTable.id, st)}
                        className={`py-2 px-1 text-[10px] text-center font-bold uppercase rounded-xl transition-all cursor-pointer border ${
                          act
                            ? 'bg-primary border-primary text-white pointer-events-none'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action: Select for order and route to POS */}
              <div className="pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleSelectForOrder(selectedTable.id)}
                  className="w-full bg-[#FFD84D] hover:bg-[#FFD84D]/90 text-gray-950 font-black py-3 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-amber-200 transition"
                >
                  <MapPin size={13} />
                  Link & Order POS
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
