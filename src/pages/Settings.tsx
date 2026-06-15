import React, { useState, useEffect } from 'react';
import { usePOSStore } from '../store/posStore';
import { db } from '../supabase/supabaseMock';
import { ENGLISH_FONTS, KHMER_FONTS, injectGoogleFont } from '../utils/fonts';
import { 
  Settings as SettingIcon, 
  Moon, 
  Sun, 
  Download, 
  Barcode, 
  Coins, 
  Type, 
  Percent, 
  Trophy, 
  Megaphone, 
  Save, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

export default function Settings() {
  const { 
    darkMode, 
    toggleDarkMode, 
    language, 
    setLanguage, 
    products, 
    addToCart, 
    refreshFromDB,
    systemSettings,
    updateSystemSettings
  } = usePOSStore();

  // Settings form states
  const [currency, setCurrency] = useState(systemSettings?.currency || '€');
  const [fontSize, setFontSize] = useState(systemSettings?.fontSize || 'medium');
  const [fontFamily, setFontFamily] = useState(systemSettings?.fontFamily || 'Inter');
  const [taxPercent, setTaxPercent] = useState(systemSettings?.taxPercent ?? 10);
  const [pointsPerSpent, setPointsPerSpent] = useState(systemSettings?.pointsPerSpent ?? 1);
  const [promoTitleEnglish, setPromoTitleEnglish] = useState(systemSettings?.promoTitleEnglish || 'Capricciosa Pizza - 15% Off!');
  const [promoTitleKhmer, setPromoTitleKhmer] = useState(systemSettings?.promoTitleKhmer || 'ភីហ្សា Capricciosa បញ្ចុះតម្លៃ ១៥%!');
  const [promoDescEnglish, setPromoDescEnglish] = useState(systemSettings?.promoDescEnglish || 'Delicious artisanal classic loaded with ham, mushrooms, black olives, and premium mozzarella.');
  const [promoDescKhmer, setPromoDescKhmer] = useState(systemSettings?.promoDescKhmer || 'រសជាតិឆ្ងាញ់ពិតៗ ជាមួយគ្រឿងផ្សំពិសេសជាច្រើនមុខ។ ផ្តល់ជូនសម្រាប់ការបញ្ជាទិញនៅថ្ងៃនេះទាំងអស់។');

  // Sandbox simulation states
  const [offlineMode, setOfflineMode] = useState(false);
  const [qrOrderEnabled, setQrOrderEnabled] = useState(true);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Sync settings when they update asynchronously from mock database
  useEffect(() => {
    if (systemSettings) {
      setCurrency(systemSettings.currency);
      setFontSize(systemSettings.fontSize);
      setFontFamily(systemSettings.fontFamily);
      setTaxPercent(systemSettings.taxPercent);
      setPointsPerSpent(systemSettings.pointsPerSpent);
      setPromoTitleEnglish(systemSettings.promoTitleEnglish);
      setPromoTitleKhmer(systemSettings.promoTitleKhmer);
      setPromoDescEnglish(systemSettings.promoDescEnglish);
      setPromoDescKhmer(systemSettings.promoDescKhmer);
    }
  }, [systemSettings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      currency,
      fontSize: fontSize as 'small' | 'medium' | 'large' | 'xl',
      fontFamily,
      taxPercent: Number(taxPercent),
      pointsPerSpent: Number(pointsPerSpent),
      promoTitleEnglish,
      promoTitleKhmer,
      promoDescEnglish,
      promoDescKhmer
    });
  };

  const handleResetDefaults = () => {
    if (confirm(language === 'en' ? 'Reset system parameters to default values?' : 'កំណត់ប៉ារ៉ាម៉ែត្រប្រព័ន្ធឡើងវិញទៅតម្លៃដើម?')) {
      const defaultSettings = {
        currency: '€',
        fontSize: 'medium' as const,
        fontFamily: 'Inter',
        taxPercent: 10,
        pointsPerSpent: 1,
        promoTitleEnglish: 'Capricciosa Pizza - 15% Off!',
        promoTitleKhmer: 'ភីហ្សា Capricciosa បញ្ចុះតម្លៃ ១៥%!',
        promoDescEnglish: 'Delicious artisanal classic loaded with ham, mushrooms, black olives, and premium mozzarella. Valid for all digital table-side checkouts today.',
        promoDescKhmer: 'រសជាតិឆ្ងាញ់ពិតៗ ជាមួយគ្រឿងផ្សំពិសេសជាច្រើនមុខ។ ផ្តល់ជូនសម្រាប់ការបញ្ជាទិញនៅថ្ងៃនេះទាំងអស់។'
      };
      
      setCurrency('€');
      setFontSize('medium');
      setFontFamily('Inter');
      setTaxPercent(10);
      setPointsPerSpent(1);
      setPromoTitleEnglish(defaultSettings.promoTitleEnglish);
      setPromoTitleKhmer(defaultSettings.promoTitleKhmer);
      setPromoDescEnglish(defaultSettings.promoDescEnglish);
      setPromoDescKhmer(defaultSettings.promoDescKhmer);

      updateSystemSettings(defaultSettings);
    }
  };

  // Download simulation helpers
  const handleExportCSV = () => {
    const rawOrders = db.getOrders();
    const headers = ['Order Number', 'Date', 'Total', 'Payment Method', 'Status'].join(',');
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
      setScanResult(
        language === 'en' 
          ? `Success! Scanned & added '${matched.name}' to checkout cart.` 
          : `ជោគជ័យ! បានស្កេន និងបញ្ចូល '${matched.name}' ទៅក្នុងកន្ត្រក។`
      );
      setBarcodeInput('');
    } else {
      setScanResult(
        language === 'en'
          ? 'Unrecognized barcode key. Try using codes like "prod-1", "prod-2" or "prod-3".'
          : 'មិនស្គាល់កូដស្កេនទេ។ សាកល្បងប្រើកូដដូចជា "prod-1", "prod-2" ឬ "prod-3"។'
      );
    }

    // Auto clear results
    setTimeout(() => setScanResult(null), 5000);
  };

  return (
    <div id="page-settings" className="p-4 md:p-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4.5 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <SettingIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'System Properties & Configuration' : 'ការកំណត់ប្រព័ន្ធ និងទម្រង់ចាត់ចែង'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-sans">
              {language === 'en' 
                ? 'Configure billing currency, custom font families, dynamic layouts, VAT, and marketing promos' 
                : 'កំណត់រូបិយប័ណ្ណ ទំហំអក្សរ ហ្វុនអក្សរភាសាខ្មែរ/អង់គ្លេស អត្រាภาษី និងការផ្សព្វផ្សាយពាណិជ្ជកម្ម'}
            </p>
          </div>
        </div>

        {/* Language & Contrast quick toggles */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'kh' : 'en')}
            className="p-2.5 rounded-xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-black flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-850"
          >
            🌐 {language === 'en' ? 'Khmer' : 'English'}
          </button>
          
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
              darkMode 
                ? 'border-amber-400 bg-amber-400/5 text-amber-400' 
                : 'border-slate-350 bg-slate-50 text-gray-650 hover:bg-slate-100'
            }`}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Main Bento Bento grid workspace layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Aesthetics, fonts and size (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Aesthetics & Typography Config */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-850 pb-3">
                <Type className="text-primary" size={18} />
                <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
                  {language === 'en' ? 'Typography & Visual Scale' : 'ការកំណត់ហ្វុន និងទំហំអក្សរសរុប'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Font selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider">
                    {language === 'en' ? 'Active System Font' : 'ហ្វុនអក្សរប្រព័ន្ធសកម្ម'}
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => {
                      const newFont = e.target.value;
                      setFontFamily(newFont);
                      injectGoogleFont(newFont);
                    }}
                    className="w-full text-xs font-bold px-3.5 py-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white outline-none cursor-pointer focus:border-primary"
                  >
                    <optgroup label="English Professional Google Fonts (20)" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-150">
                      {ENGLISH_FONTS.map(f => (
                        <option key={f.value} value={f.value} className="bg-white dark:bg-gray-850 text-gray-800 dark:text-gray-155">{f.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Khmer Beautiful Google Fonts (20)" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-150">
                      {KHMER_FONTS.map(f => (
                        <option key={f.value} value={f.value} className="bg-white dark:bg-gray-850 text-gray-800 dark:text-gray-155">{f.label}</option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="text-[10px] text-gray-400 italic leading-tight">
                    {language === 'en' ? 'Automatically linked & imported from Google Web Fonts API.' : 'ហ្វុនទាំងអស់នឹងត្រូវបានទាញយកដោយស្វ័យប្រវត្តពី Google Web Fonts។'}
                  </p>
                </div>

                {/* Font Size Profile */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider">
                    {language === 'en' ? 'System Layout Scale' : 'ទំហំក្រឡាប្លង់ប្រព័ន្ធ'}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    {(['small', 'medium', 'large', 'xl'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setFontSize(sz);
                          const szMap = { small: '13px', medium: '15px', large: '17px', xl: '19px' };
                          document.documentElement.style.fontSize = szMap[sz];
                        }}
                        className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase border transition-all ${
                          fontSize === sz
                            ? 'bg-primary border-primary text-white shadow-xs'
                            : 'bg-gray-50 dark:bg-gray-850 border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {language === 'en' ? 'Adjusts root rem scaling factor instantly across entire tablet.' : 'កែសម្រួលទំហំអក្សរ និងធាតុក្រាហ្វិកទាំងអស់តាមរយៈ root rem scaling។'}
                  </p>
                </div>

              </div>

              {/* Currency configuration */}
              <div className="pt-3 border-t border-gray-50 dark:border-gray-850 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <strong className="text-gray-700 dark:text-gray-200 text-xs block">
                      {language === 'en' ? 'Regional Currency Symbol' : 'កូដរូបិយប័ណ្ណតំបន់'}
                    </strong>
                    <span className="text-[10px] text-gray-400 block font-sans">
                      {language === 'en' ? 'Determines pricing symbol displays' : 'កំណត់និមិត្តសញ្ញារូបិយប័ណ្ណលើបញ្ជីតម្លៃលក់'}
                    </span>
                  </div>

                  <div className="flex gap-1.5 self-stretch sm:self-auto">
                    {['€', '$', '៛', '£', '¥'].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setCurrency(sym)}
                        className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-black border transition-all ${
                          currency === sym
                            ? 'bg-primary border-primary text-white'
                            : 'bg-gray-50 dark:bg-gray-850 border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-450 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme preference toggle row */}
              <div className="pt-3 border-t border-gray-50 dark:border-gray-850 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <strong className="text-gray-700 dark:text-gray-200 text-xs block">
                      {language === 'en' ? 'Application Color Theme' : 'រូបរាងប្លង់ពណ៌ប្រព័ន្ធ'}
                    </strong>
                    <span className="text-[10px] text-gray-400 block font-sans">
                      {language === 'en' ? 'Switch between clean light theme or dark eye-safe theme' : 'ផ្លាស់ប្តូររូបរាងភ្លឺ ឬស្បែកងងឹតបន្ថែមផាសុកភាពភ្នែក'}
                    </span>
                  </div>

                  <div className="flex gap-2 self-stretch sm:self-auto">
                    <button
                      type="button"
                      onClick={() => { if (darkMode) toggleDarkMode(); }}
                      className={`px-3.5 py-2 flex items-center gap-1.5 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${
                        !darkMode
                          ? 'bg-primary border-primary text-white shadow-xs'
                          : 'bg-gray-50 dark:bg-gray-850 border-gray-150 dark:border-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Sun size={12} />
                      <span>{language === 'en' ? 'Light Scheme' : 'ស្បែកភ្នែកភ្លឺ'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (!darkMode) toggleDarkMode(); }}
                      className={`px-3.5 py-2 flex items-center gap-1.5 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${
                        darkMode
                          ? 'bg-primary border-primary text-white shadow-xs'
                          : 'bg-gray-50 dark:bg-gray-850 border-gray-150 dark:border-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Moon size={12} />
                      <span>{language === 'en' ? 'Dark Scheme' : 'ស្បែកភ្នែកងងឹត'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Financials & Loyalty configurations */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-850 pb-3">
                <Coins className="text-primary" size={18} />
                <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
                  {language === 'en' ? 'Billing Operations & CRM Rewards' : 'កិច្ចប្រតិបត្តិការទូទាត់ និងពិន្ទុរង្វាន់'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Standard VAT */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Percent size={12} /> {language === 'en' ? 'Standard VAT/Tax' : 'អត្រាពន្ធសរុប (%)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                      className="w-full text-xs font-extrabold px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white outline-none focus:border-primary pr-8"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block leading-tight">
                    {language === 'en' ? 'Applied automatically to all subtotal invoices.' : 'អនុវត្តលើទឹកប្រាក់ទូទាត់មុនពេលបញ្ចុះតម្លៃ និងពន្ធ។'}
                  </span>
                </div>

                {/* Loyalty multiplier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Trophy size={12} /> {language === 'en' ? 'Loyalty point converter' : 'មេគុណពិន្ទុសមាជិកភាព'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={pointsPerSpent}
                      onChange={(e) => setPointsPerSpent(Math.max(1, Number(e.target.value)))}
                      className="w-full text-xs font-extrabold px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white outline-none focus:border-primary pr-20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-gray-400 tracking-wider">Pts / {currency}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block leading-tight">
                    {language === 'en' ? `Points awarded to member databases for every spent.` : `ពិន្ទុដែលអតិថិជនទទួលបានរាល់ការចំណាយ។`}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT: Promo config & Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo Banner Settings */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-850 pb-3">
                <Megaphone className="text-primary" size={18} />
                <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
                  {language === 'en' ? 'Live Marketing Promo Banner' : 'ផ្ទាំងផ្សាយពាណិជ្ជកម្ម Live'}
                </h3>
              </div>

              {/* English values */}
              <div className="space-y-3">
                <span className="text-[10px] font-black bg-amber-400/10 text-amber-500 px-2.5 py-0.5 rounded-full uppercase">English Promo Text</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={promoTitleEnglish}
                    onChange={(e) => setPromoTitleEnglish(e.target.value)}
                    placeholder="E.g. Margherita Dream 20% OFF!"
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 border border-transparent focus:border-primary text-gray-800 dark:text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    value={promoDescEnglish}
                    onChange={(e) => setPromoDescEnglish(e.target.value)}
                    placeholder="Promo secondary desc line..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 border border-transparent focus:border-primary text-gray-600 dark:text-gray-300 outline-none"
                  />
                </div>
              </div>

              {/* Khmer values */}
              <div className="space-y-3 pt-3 border-t border-gray-50 dark:border-gray-850">
                <span className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-2.5 py-0.5 rounded-full uppercase"> Khmer Promo Text</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={promoTitleKhmer}
                    onChange={(e) => setPromoTitleKhmer(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ ការបញ្ចុះតម្លៃពីហ្សាក្លាស៊ីក ២០%!"
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 border border-transparent focus:border-primary text-gray-800 dark:text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    value={promoDescKhmer}
                    onChange={(e) => setPromoDescKhmer(e.target.value)}
                    placeholder="អត្ថបទរៀបរាប់លម្អិត..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 border border-transparent focus:border-primary text-gray-600 dark:text-gray-300 outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-gray-850/60 rounded-2xl border border-gray-100 dark:border-gray-800/80 flex gap-2.5 items-start">
                <Info size={14} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                  {language === 'en' 
                    ? 'Updating these text fields will dynamically reconstruct the primary promotional red ribbon ribbon across client tablets.' 
                    : 'ការកែសម្រួលប៉ារ៉ាម៉ែត្រទាំងនេះ នឹងកែប្រែផ្ទាំងប៉ាណូពណ៌ក្រហមផ្សព្វផ្សាយនៅលើទំព័រលក់រាយភ្លាមៗ។'}
                </p>
              </div>

            </div>

            {/* Sandbox simulations */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-[22px] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Barcode className="text-primary" size={18} />
                <h3 className="text-xs font-black uppercase text-gray-800 dark:text-white tracking-wider leading-none">Barcode Sandbox Simulator</h3>
              </div>

              <div className="flex gap-2 text-xs">
                <input
                  id="barcode-scanner-sandbox-input"
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Type 'prod-1' or 'prod-3'..."
                  className="flex-1 font-bold px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-transparent focus:border-primary text-gray-800 dark:text-white outline-none uppercase tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={handleScanBarcodeSubmit}
                  className="bg-[#FFD84D] hover:bg-[#FFD84D]/90 text-gray-950 px-4 rounded-xl text-xs font-black uppercase cursor-pointer transition shadow-xs"
                >
                  {language === 'en' ? 'Scan' : 'ស្កេន'}
                </button>
              </div>

              {scanResult && (
                <div className="p-3 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-300 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-900/30">
                  ⭐ {scanResult}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Centralized Save Action bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300 font-extrabold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition"
          >
            <RefreshCw size={13} />
            {language === 'en' ? 'Reset to Defaults' : 'កំណត់ឡើងវិញទម្រង់ដើម'}
          </button>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-150 font-extrabold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition"
            >
              <Download size={13} />
              {language === 'en' ? 'Export CSV Ledger' : 'ទាញយករបាយការណ៍ CSV'}
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition shadow-md shadow-primary/10"
            >
              <Save size={13} />
              {language === 'en' ? 'Apply & Save Config' : 'រក្សាទុក & ដាក់ដំណើរការ'}
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}
