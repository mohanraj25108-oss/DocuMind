import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { products, documents, userProfile, updateProfile, clearAllData, loadDemoData } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const backup = {
      userProfile,
      products,
      documents,
      exportTimestamp: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `DocuMind_Pro_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your account to a clean empty state? All products and documents will be cleared.')) {
      clearAllData();
      alert('Your vault has been reset to an empty state.');
    }
  };

  const handleLoadDemo = () => {
    loadDemoData();
    alert('Sample demo products and documents have been loaded for testing.');
  };

  return (
    <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-6 sm:p-10 shadow-md max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Account & Vault Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#85859A] mt-1">
          Manage your personal profile, alert preferences, and secure data backups.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6 pt-4 border-t border-[#20202B]">
        <h2 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Phone Number (Optional)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full max-w-sm px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
          />
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-[#10B981]/15 text-[#34D399] text-xs font-bold flex items-center space-x-2 border border-[#10B981]/30">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-105 border border-[#A78BFA]/30"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="pt-6 border-t border-[#20202B] space-y-4">
        <h2 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
          Vault & Data Management
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl border border-[#272733] bg-[#101018] hover:border-[#514078] transition-colors flex flex-col justify-between">
            <div>
              <Download className="w-5 h-5 text-[#A78BFA] mb-2" />
              <h4 className="text-xs font-bold text-[#F8FAFC]">Export Vault (JSON)</h4>
              <p className="text-[11px] text-[#85859A] mt-1">
                Download a complete, offline JSON archive of all your registered products, dates and documents.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="mt-4 w-full py-2 bg-[#15151F] hover:bg-[#12121B] text-[#A78BFA] text-xs font-bold rounded-xl border border-[#8B5CF6]/40 hover:border-[#8B5CF6] transition-colors"
            >
              Export JSON Backup
            </button>
          </div>

          {/* Load Sample Demo */}
          <div className="p-4 rounded-2xl border border-[#272733] bg-[#101018] hover:border-[#514078] transition-colors flex flex-col justify-between">
            <div>
              <Layers className="w-5 h-5 text-[#C084FC] mb-2" />
              <h4 className="text-xs font-bold text-[#F8FAFC]">Load Testing Samples</h4>
              <p className="text-[11px] text-[#85859A] mt-1">
                Populate your vault with 3 realistic sample products and 4 documents for presentation testing.
              </p>
            </div>
            <button
              onClick={handleLoadDemo}
              className="mt-4 w-full py-2 bg-[#15151F] hover:bg-[#12121B] text-[#C084FC] text-xs font-bold rounded-xl border border-[#A855F7]/40 hover:border-[#A855F7] transition-colors"
            >
              Load Demo Data
            </button>
          </div>

          {/* Reset Empty State */}
          <div className="p-4 rounded-2xl border border-[#EF4444]/30 bg-[#101018] hover:border-[#EF4444]/50 transition-colors flex flex-col justify-between">
            <div>
              <Trash2 className="w-5 h-5 text-[#F87171] mb-2" />
              <h4 className="text-xs font-bold text-[#F87171]">Reset to Empty State</h4>
              <p className="text-[11px] text-[#85859A] mt-1">
                Clear all products and documents to return your workspace to a clean, empty state.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 w-full py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#F87171] text-xs font-bold rounded-xl border border-[#EF4444]/30 transition-colors"
            >
              Reset to 0 Items
            </button>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="pt-4 border-t border-[#20202B] flex items-center space-x-3 text-xs text-[#85859A]">
        <Lock className="w-4 h-4 text-[#34D399] shrink-0" />
        <span>
          Your data is isolated to your browser storage and Supabase Row Level Security (RLS) encrypted vault.
        </span>
      </div>
    </div>
  );
};
