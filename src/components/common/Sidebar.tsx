import React from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Bell, 
  Bot, 
  Settings, 
  ShieldCheck,
  Globe,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getExpiryStatus } from '../../utils/dateUtils';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onBackToLanding: () => void;
  onQuickAddProduct: () => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onBackToLanding,
  onQuickAddProduct,
  collapsed = false,
}) => {
  const { products, documents } = useApp();

  const expiringCount = products.filter((p) => {
    if (!p.warrantyExpiryDate) return false;
    return getExpiryStatus(p.warrantyExpiryDate).status === 'Expiring Soon';
  }).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'My Products', icon: Package, badge: products.length > 0 ? products.length : undefined },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documents.length > 0 ? documents.length : undefined },
    { 
      id: 'reminders', 
      label: 'Expiry Tracker', 
      icon: Bell, 
      alertBadge: expiringCount > 0 ? expiringCount : undefined 
    },
    { id: 'ai', label: 'DocuMind AI', icon: Bot, isAi: true },
  ];

  return (
    <aside
      className={`bg-[#0D0D14] text-[#F8FAFC] flex flex-col justify-between p-4 shrink-0 transition-all duration-200 ${
        collapsed ? 'w-20' : 'w-64'
      } min-h-full rounded-3xl shadow-2xl border border-[#272733]`}
    >
      <div>
        {/* Brand Header */}
        <div
          onClick={onBackToLanding}
          className="flex items-center space-x-3 px-2 py-3 mb-5 cursor-pointer hover:opacity-90 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] shrink-0 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-shadow">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base text-[#F8FAFC] tracking-tight block leading-tight">
                  DocuMind
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40 uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-[#85859A] font-medium uppercase tracking-wider block mt-0.5">
                Personal Vault
              </span>
            </div>
          )}
        </div>

        {/* Quick Add Product Button */}
        {!collapsed && (
          <button
            onClick={onQuickAddProduct}
            className="w-full mb-6 py-2.5 px-3 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_22px_rgba(139,92,246,0.45)] transition-all flex items-center justify-center space-x-2 border border-[#A78BFA]/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                  isActive
                    ? 'bg-[#15151F] text-[#F8FAFC] border-[#514078] shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'text-[#B8B8C8] hover:text-[#F8FAFC] hover:bg-[#15151F]/70 border-transparent hover:border-[#272733]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#A78BFA]' : 'text-[#85859A]'
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && (
                  <div>
                    {item.alertBadge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                        {item.alertBadge}
                      </span>
                    )}
                    {item.badge !== undefined && !item.alertBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#12121B] text-[#B8B8C8] border border-[#272733]">
                        {item.badge}
                      </span>
                    )}
                    {item.isAi && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40">
                        AI
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Nav */}
      <div className="pt-4 border-t border-[#20202B] space-y-1.5">
        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left border ${
            currentTab === 'settings'
              ? 'bg-[#15151F] text-[#F8FAFC] border-[#514078]'
              : 'text-[#B8B8C8] hover:text-[#F8FAFC] hover:bg-[#15151F]/70 border-transparent hover:border-[#272733]'
          }`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className={`w-4 h-4 ${currentTab === 'settings' ? 'text-[#A78BFA]' : 'text-[#85859A]'}`} />
          {!collapsed && <span>Settings & Backup</span>}
        </button>

        <button
          onClick={onBackToLanding}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#85859A] hover:text-[#A78BFA] hover:bg-[#15151F]/70 border border-transparent hover:border-[#272733] transition-colors text-left"
          title={collapsed ? 'Website Home' : undefined}
        >
          <Globe className="w-4 h-4 text-[#85859A]" />
          {!collapsed && <span>Back to Website</span>}
        </button>
      </div>
    </aside>
  );
};
