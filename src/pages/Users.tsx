import React from 'react';
import { usePOSStore } from '../store/posStore';
import { KeyRound, ShieldAlert, BadgeCheck, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { UserRole } from '../types';

export default function Users() {
  const { users, currentUserRole, setCurrentUserRole, language } = usePOSStore();

  const rolePrivileges: Record<UserRole, string[]> = {
    Admin: ['Full Access', 'Database CRUD', 'System Preferences', 'Reprint Invoices', 'Change Table Layouts'],
    Manager: ['Access All Dashboards', 'Modify Menu Pricing', 'Process Refunds', 'Inspect Staff Audit Logs'],
    Cashier: ['Create Sales Checks', 'Process Payout Tenders', 'Claim Loyalty Coupons', 'Reprint Thermal Receipts'],
    Kitchen: ['Fulfill active tickets', 'Manage cooking states (KDS)', 'View specials notes instructions'],
    Waiter: ['Inspect table layout states', 'Seat guests', 'Link dine-in table checks']
  };

  const roleIcons: Record<UserRole, string> = {
    Admin: '👑',
    Manager: '🎩',
    Cashier: '💵',
    Kitchen: '🍳',
    Waiter: '💁'
  };

  return (
    <div id="page-users" className="p-4 md:p-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl transition">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <KeyRound size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-gray-800 dark:text-white uppercase tracking-tight">
              {language === 'en' ? 'Employee Profiles & Privileges' : 'សិទ្ធិនិងគណនីបុគ្គលិក'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Audit team security permissions and switch active roles for testing workspace features</p>
          </div>
        </div>

        <span className="bg-[#FFD84D] text-gray-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          {users.length} ACTIVE PROFILES
        </span>
      </div>

      {/* Warning callout */}
      <div className="bg-amber-50/50 dark:bg-amber-955/15 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wide">Interactive Development Simulator Controls</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">
            Since this POS app runs in premium tablet preview environments, you can **click "Activate Profile"** below to instantly hot-swap your staff identity. Changing roles alters access permissions on the POS side panel!
          </p>
        </div>
      </div>

      {/* Users Matrix Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {users.map((u) => {
          const isAct = currentUserRole === u.role;
          const privileges = rolePrivileges[u.role] || [];

          return (
            <div
              key={u.id}
              className={`bg-white dark:bg-gray-900 border p-5 rounded-[22px] flex flex-col justify-between shadow-sm relative transition-all duration-150 ${
                isAct 
                  ? 'border-primary ring-2 ring-primary/10 scale-[1.015]' 
                  : 'border-gray-150 dark:border-gray-800'
              }`}
            >
              
              {/* Header profile */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl">{roleIcons[u.role]}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                    isAct ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {isAct ? 'ACTIVE SEED' : 'STANDBY'}
                  </span>
                </div>

                <h4 className="text-xs font-black text-gray-850 dark:text-gray-150 font-display mt-3 leading-tight">{u.name}</h4>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{u.role}</p>

                {/* Privileges checked bullet lists */}
                <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-850 space-y-2">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Assigned Security:</span>
                  {privileges.map((p, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-tight">
                      <BadgeCheck size={11} className="text-secondary tracking-widest text-[#FFD84D] shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activation button drawer */}
              <div className="mt-5 pt-3.5 border-t border-dashed border-gray-150 dark:border-gray-800/85">
                {isAct ? (
                  <div className="text-[10px] font-black text-primary text-center flex items-center justify-center gap-1.5 bg-primary/5 py-1.5 rounded-lg">
                    ✓ CURRENT WORKER PROFILE
                  </div>
                ) : (
                  <button
                    onClick={() => setCurrentUserRole(u.role)}
                    className="w-full text-center bg-gray-50 hover:bg-primary hover:text-white dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-300 py-1.5 rounded-lg font-black uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Activate Profile
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
