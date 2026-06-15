import React, { useState } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { 
  Settings as SettingIcon, Moon, Sun, Languages, WifiOff, QrCode, ScrollText, Smartphone, Download, Barcode, HelpCircle 
} from 'lucide-react';

export default function Settings() {
  const { 
    darkMode, 
    toggleDarkMode, 
    language, 
    setLanguage, 
    products, 
    addToCart, 
    refreshFromDB 
  } = usePOSStore();

  // Settings mock states
  const [offlineMode, setOfflineMode] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(true);
  const [qrOrderEnabled, setQrOrderEnabled] = useState(true);
  
  // Barcode scanner simulation
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Download simulation helpers
  const handleExportCSV = () => {
    const rawOrders = db.getOrders();
    const headers = ['Order Number', 'Date', 'Total (€)', 'Payment Method', 'Status'].join(',');
    const rows = rawOrders.map(o => 
      [o.order_number, new Date(o.created_at).toLocaleDateString(), o.total, o.payment_method || 'Cash', o.status].join(',')
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `POS_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleScanBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanResult(null);

    const code = barcodeInput.trim();
    if (!code) return;

    // lookup product
    const matched = products.find(p => p.id === code || p.name.toLowerCase().includes(code.toLowerCase()));
    if (matched) {
      // Add small size to cart immediately
      addToCart(matched, 'Small', 1, [], 'Barcode Scanned Item');
      setScanResult(`Success! Scanned & added '${matched.name}' (Small) to cart basket.`);
      setBarcodeInput('');
    } else {
      setScanResult('Unrecognized barcode key. Try using codes like "prod-1", "prod-2" or "prod-3".');
    }

    // Auto clear results
    setTimeout(() => setScanResult(null), 5000);
  };

  return (
    <div id="page-settings" className="p-4 md:p-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <SettingIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'System Settings & Sandbox' : 'ការកំណត់ប្រព័ន្ធនិងសេនបុក'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-sans">Configure local device layouts, translation toggles, and simulate barcode integrations</p>
          </div>
        </div>
      </div>

      {/* Bento Layout Grid settings blocks */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left pane: Aesthetics & Operational parameters (7 cols) */}
        <div className="md:col-span-7 space-y-5 text-sm">
          
          {/* Aesthetic Toggle Cards */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-sm transition space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Device & UI Controls</h3>
            
            {/* Dark mode switch */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-850">
              <div>
                <strong className="text-gray-800 dark:text-gray-200 block text-xs">High Contrast Mode</strong>
                <span className="text-[10px] text-gray-400 font-semibold block leading-tight">Switch between Slate Light and Charcoal Dark themes</span>
              </div>
              
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  darkMode 
                    ? 'border-amber-400 bg-amber-400/5 text-amber-400' 
                    : 'border-slate-300 bg-slate-50 text-gray-600'
                }`}
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>

            {/* Offline simulation switch */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-850">
              <div>
                <strong className="text-gray-800 dark:text-gray-200 block text-xs">Local SQLite Offline Simulation</strong>
                <span className="text-[10px] text-gray-400 font-semibold block leading-tight">Store all sales registers inside browser storage</span>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={offlineMode} 
                  onChange={(e) => setOfflineMode(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-250 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
              </label>
            </div>

            {/* PWA asset simulation */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-850">
              <div>
                <strong className="text-gray-800 dark:text-gray-200 block text-xs">PWA Standalone Shell</strong>
                <span className="text-[10px] text-gray-400 font-semibold block leading-tight">Tablet-friendly launch directly from homescreen</span>
              </div>
              
              <span className="bg-green-50/25 text-green-500 text-[10px] font-black px-2.5 py-1 rounded-xl">
                INSTALLED
              </span>
            </div>

            {/* QR ordering switch */}
            <div className="flex justify-between items-center py-2">
              <div>
                <strong className="text-gray-800 dark:text-gray-200 block text-xs">QR Diner Tabletop Ordering</strong>
                <span className="text-[10px] text-gray-400 font-semibold block leading-tight font-sans">Enables customers to scan and place self-checkouts</span>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={qrOrderEnabled} 
                  onChange={(e) => setQrOrderEnabled(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-250 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
              </label>
            </div>

          </div>

          {/* Excel & PDF Spreadsheet Downloader reports block */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-sm transition space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Reports & Data Backups</h3>
              <p className="text-[10px] text-gray-400 mt-1">Export sales journals and receipts lists for tax compliance audits.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleExportCSV}
                className="bg-primary hover:bg-primary-hover text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
              >
                <Download size={13} />
                Export Sales CSV
              </button>

              <button
                onClick={() => alert('PDF Sales Journals formatted compiled successfully and sent to printed queue!')}
                className="bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Download size={13} />
                Export PDF Ledger
              </button>
            </div>
          </div>

        </div>

        {/* Right pane: Barcode Scanner sandbox simulation (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-sm transition space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Barcode className="text-primary" size={18} />
              <h3 className="text-xs font-black uppercase text-gray-800 dark:text-white tracking-wider leading-none">Barcode Scanner Sandbox</h3>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 max-w-sm leading-relaxed">
              Scan product keys dynamically. Enter codes like **"prod-1"**, **"prod-2"**, or **"prod-3"** to simulate checking out. Click submit to append instantly to the POS cart!
            </p>
          </div>

          <form onSubmit={handleScanBarcodeSubmit} className="space-y-3">
            <div className="flex gap-2 text-xs">
              <input
                id="barcode-scanner-sandbox-input"
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Type 'prod-1' or 'Margherita'..."
                className="flex-1 font-bold px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-transparent focus:border-primary text-gray-805 dark:text-white outline-none text-center tracking-widest uppercase"
              />
              <button
                type="submit"
                className="bg-[#FFD84D] hover:bg-[#FFD84D]/90 text-gray-950 px-4 rounded-xl text-xs font-black uppercase shadow-xs cursor-pointer"
              >
                Scan Code
              </button>
            </div>

            {/* Results indicator toast */}
            {scanResult && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-300 text-xs font-bold rounded-xl border border-sky-100 dark:border-sky-900/30">
                ⭐ {scanResult}
              </div>
            )}
          </form>

          {/* Quick instructions list of sandbox keys */}
          <div className="p-3 bg-gray-50 dark:bg-gray-850/60 rounded-xl border border-gray-100 dark:border-slate-800 text-[10px] space-y-1.5 text-gray-500">
            <span className="font-extrabold uppercase text-gray-400 block mb-1">Testing Codes Index:</span>
            <div className="flex justify-between">
              <span>prod-1</span>
              <strong className="text-gray-700 dark:text-gray-300">Capricciosa Pizza</strong>
            </div>
            <div className="flex justify-between">
              <span>prod-2</span>
              <strong className="text-gray-700 dark:text-gray-300">Margherita Dream</strong>
            </div>
            <div className="flex justify-between">
              <span>prod-3</span>
              <strong className="text-gray-700 dark:text-gray-300">Double Pepperoni</strong>
            </div>
            <div className="flex justify-between">
              <span>prod-8</span>
              <strong className="text-gray-700 dark:text-gray-300">Espresso Tiramisu</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
