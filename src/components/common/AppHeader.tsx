import React, { useState } from 'react';
import { Search, Bell, Sparkles, LogOut, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getExpiryStatus } from '../../utils/dateUtils';

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateTab: (tab: string) => void;
  onSelectProductById?: (id: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateTab,
}) => {
  const { userProfile, products, isDemoMode } = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Compute urgent alerts
  const urgentCount = products.filter((p) => {
    if (!p.warrantyExpiryDate) return false;
    return getExpiryStatus(p.warrantyExpiryDate).status === 'Expiring Soon';
  }).length;

  const initials = userProfile.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between pb-6 border-b border-[#20202B] mb-6">
      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <Search className="w-4 h-4 text-[#85859A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products, brands, serial numbers, or invoices..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#101018] border border-[#272733] rounded-2xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
        />
      </div>

      {/* Right User Bar */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Demo Indicator */}
        {isDemoMode && (
          <button
            onClick={() => onNavigateTab('settings')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/25 transition-colors"
            title="Click to manage demo data in settings"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Demo Mode</span>
          </button>
        )}

        {/* Bell Button */}
        <button
          onClick={() => onNavigateTab('reminders')}
          className="relative p-2.5 text-[#B8B8C8] hover:text-[#F8FAFC] bg-[#101018] hover:bg-[#15151F] rounded-2xl border border-[#272733] hover:border-[#514078] transition-all"
          title="Expiry Alerts"
        >
          <Bell className="w-5 h-5" />
          {urgentCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-[#0D0D14]"></span>
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2.5 p-1 pl-1.5 pr-2.5 bg-[#101018] hover:bg-[#15151F] rounded-2xl border border-[#272733] hover:border-[#514078] transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              {initials || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-[#F8FAFC] leading-tight block truncate max-w-[120px]">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-[#85859A] block leading-tight">Vault Owner</span>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-[#15151F] rounded-2xl shadow-2xl border border-[#272733] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-[#20202B]">
                <span className="text-xs font-bold text-[#F8FAFC] block truncate">{userProfile.name}</span>
                <span className="text-[10px] text-[#85859A] block truncate">{userProfile.email}</span>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('settings');
                  setShowUserDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#B8B8C8] hover:text-[#F8FAFC] hover:bg-[#12121B] flex items-center space-x-2 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#85859A]" />
                <span>Account Settings</span>
              </button>
              <button
                onClick={() => {
                  onNavigateTab('auth');
                  setShowUserDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/15 flex items-center space-x-2 border-t border-[#20202B] mt-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
