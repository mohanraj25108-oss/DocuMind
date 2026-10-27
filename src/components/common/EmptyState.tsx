import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Upload, 
  Sparkles, 
  Package, 
  Bell, 
  Layers 
} from 'lucide-react';

interface EmptyStateProps {
  onAddProduct: () => void;
  onUploadDocument: () => void;
  onLoadDemo?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddProduct,
  onUploadDocument,
  onLoadDemo,
}) => {
  return (
    <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Subtle background violet glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Decorative Icon Cluster */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-[#8B5CF6]/15 rounded-3xl rotate-6 animate-pulse border border-[#8B5CF6]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] rounded-3xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(139,92,246,0.4)]">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#101018] border border-[#272733] shadow-md flex items-center justify-center text-[#A78BFA]">
          <Sparkles className="w-5 h-5 text-[#A78BFA]" />
        </div>
      </div>

      {/* Main Copy */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
        Welcome to your personal document space.
      </h2>
      <p className="text-sm sm:text-base text-[#B8B8C8] mt-2.5 max-w-xl mx-auto leading-relaxed">
        Start by adding your first product or uploading an important document. DocuMind Pro will help you keep everything organized, calculate remaining warranty time, and track expiry alerts.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
        <button
          onClick={onAddProduct}
          className="w-full sm:w-auto px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] transition-all hover:scale-105 flex items-center justify-center space-x-2 border border-[#A78BFA]/30"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Your First Product</span>
        </button>

        <button
          onClick={onUploadDocument}
          className="w-full sm:w-auto px-6 py-3 bg-[#101018] hover:bg-[#12121B] text-[#F8FAFC] font-bold text-sm rounded-xl border border-[#272733] hover:border-[#514078] shadow-sm transition-all hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Upload className="w-4 h-4 text-[#A78BFA]" />
          <span>Upload a Document</span>
        </button>
      </div>

      {/* 3 Quick Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-left pt-10 border-t border-[#20202B]">
        <div className="p-4 rounded-2xl bg-[#101018] border border-[#272733] hover:border-[#514078] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center mb-3">
            <Package className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#F8FAFC]">1. Register Devices & Valuables</h4>
          <p className="text-[11px] text-[#85859A] mt-1 leading-relaxed">
            Record smartphones, laptops, electronics, and appliances with purchase date and serial numbers.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#101018] border border-[#272733] hover:border-[#514078] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 flex items-center justify-center mb-3">
            <Bell className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#F8FAFC]">2. Automated Expiry Countdown</h4>
          <p className="text-[11px] text-[#85859A] mt-1 leading-relaxed">
            Never forfeit expired vouchers or miss warranty repair windows with proactive 30-day alerts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#101018] border border-[#272733] hover:border-[#514078] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#F8FAFC]">3. Document-Grounded AI</h4>
          <p className="text-[11px] text-[#85859A] mt-1 leading-relaxed">
            Ask questions like "Is accidental damage covered?" and get grounded answers citing your clauses.
          </p>
        </div>
      </div>

      {/* Demo helper */}
      {onLoadDemo && (
        <div className="mt-8 pt-6 border-t border-[#20202B] text-xs text-[#85859A] flex items-center justify-center space-x-2">
          <span>Exploring or testing the system?</span>
          <button
            onClick={onLoadDemo}
            className="text-[#A78BFA] hover:text-[#C4B5FD] font-semibold hover:underline flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Load Sample Data for Testing</span>
          </button>
        </div>
      )}
    </div>
  );
};
