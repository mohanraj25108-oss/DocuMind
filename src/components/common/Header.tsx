import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNotificationsClick,
  onProfileClick,
}) => {
  return (
    <header className="flex items-center justify-between pb-6 border-b border-[#20202B] mb-6">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <Search className="w-4 h-4 text-[#85859A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products, warranties, or documents..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
        />
      </div>

      {/* Right User Bar */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Bell Button */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2.5 text-[#B8B8C8] hover:text-[#F8FAFC] bg-[#101018] hover:bg-[#15151F] rounded-xl transition-colors border border-[#272733] hover:border-[#514078]"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[#0D0D14]"></span>
        </button>

        {/* User Profile */}
        <button
          onClick={onProfileClick}
          className="flex items-center space-x-3 p-1.5 pl-2 pr-3 bg-[#101018] hover:bg-[#15151F] rounded-xl transition-colors border border-[#272733] hover:border-[#514078]"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Mohan Raj"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#272733]"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-[#F8FAFC] leading-tight">Mohan Raj</div>
            <div className="text-[11px] text-[#85859A] leading-tight">Pro Member</div>
          </div>
        </button>
      </div>
    </header>
  );
};
