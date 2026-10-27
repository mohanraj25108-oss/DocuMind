import React from 'react';
import { 
  Package, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Plus, 
  Upload, 
  ChevronRight, 
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getExpiryStatus, formatDisplayDate } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';
import { Product } from '../../types';

interface DashboardViewProps {
  onAddProduct: () => void;
  onUploadDocument: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onAddProduct,
  onUploadDocument,
  onSelectProduct,
  onNavigateTab,
}) => {
  const { products, documents, userProfile, isDemoMode, loadDemoData } = useApp();

  // If user has zero products and zero documents, show the beautiful empty state
  const isEmpty = products.length === 0 && documents.length === 0;

  // Real calculations
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let activeWarrantiesCount = 0;

  // All items with expiries (products + documents)
  const expiryItems: {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    daysRemaining: number | null;
    status: string;
    badgeLabel: string;
    color: 'emerald' | 'amber' | 'rose' | 'slate';
    productRef?: Product;
  }[] = [];

  products.forEach((prod) => {
    if (prod.warrantyExpiryDate) {
      const exp = getExpiryStatus(prod.warrantyExpiryDate);
      if (exp.status === 'Expiring Soon') expiringSoonCount++;
      else if (exp.status === 'Expired') expiredCount++;
      else if (exp.status === 'Active') activeWarrantiesCount++;

      expiryItems.push({
        id: prod.id,
        title: prod.name,
        subtitle: `${prod.brand} Warranty`,
        date: prod.warrantyExpiryDate,
        daysRemaining: exp.daysRemaining,
        status: exp.status,
        badgeLabel: exp.label,
        color: exp.color,
        productRef: prod,
      });
    }
  });

  documents.forEach((doc) => {
    if (doc.expiryDate) {
      const exp = getExpiryStatus(doc.expiryDate);
      if (exp.status === 'Expiring Soon') expiringSoonCount++;
      else if (exp.status === 'Expired') expiredCount++;

      expiryItems.push({
        id: doc.id,
        title: doc.title,
        subtitle: doc.category,
        date: doc.expiryDate,
        daysRemaining: exp.daysRemaining,
        status: exp.status,
        badgeLabel: exp.label,
        color: exp.color,
      });
    }
  });

  // Sort upcoming expiries: nearest non-negative expiry first
  const sortedExpiries = [...expiryItems].sort((a, b) => {
    if (a.daysRemaining === null) return 1;
    if (b.daysRemaining === null) return -1;
    return a.daysRemaining - b.daysRemaining;
  });

  // Group products by category
  const categoryCounts: { [cat: string]: number } = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Good day, {userProfile.name.split(' ')[0]}! 👋
            </h1>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#B8B8C8] mt-1">
            {isEmpty
              ? 'Here is an overview of your personal document and warranty vault.'
              : `Managing ${products.length} registered products and ${documents.length} secure documents.`}
          </p>
        </div>

        {/* Quick Add Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onUploadDocument}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-[#101018] hover:bg-[#15151F] text-[#F8FAFC] text-xs sm:text-sm font-semibold rounded-xl border border-[#272733] hover:border-[#514078] shadow-xs transition-all"
          >
            <Upload className="w-4 h-4 text-[#A78BFA]" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={onAddProduct}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_22px_rgba(139,92,246,0.45)] transition-all hover:scale-105 border border-[#A78BFA]/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#15151F] p-5 rounded-2xl border border-[#272733] hover:border-[#514078] shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.12)] transition-all cursor-pointer flex items-start justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-[#85859A]">Total Products</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1.5">
              {products.length}
            </h3>
            <p className="text-[11px] text-[#A78BFA] font-medium mt-1">
              {products.length > 0 ? `${products.length} registered in vault` : '0 items registered'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#15151F] p-5 rounded-2xl border border-[#272733] hover:border-[#514078] shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all cursor-pointer flex items-start justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-[#85859A]">Active Warranties</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1.5">
              {activeWarrantiesCount}
            </h3>
            <p className="text-[11px] text-[#34D399] font-medium mt-1">
              {activeWarrantiesCount > 0 ? 'Under active coverage' : 'None active'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('reminders')}
          className="bg-[#15151F] p-5 rounded-2xl border border-[#272733] hover:border-[#514078] shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] transition-all cursor-pointer flex items-start justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-[#85859A]">Expiring Soon</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1.5">
              {expiringSoonCount}
            </h3>
            <p className="text-[11px] text-[#FBBF24] font-medium mt-1">
              {expiringSoonCount > 0 ? 'Within 30 days' : '0 expiring within 30d'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('documents')}
          className="bg-[#15151F] p-5 rounded-2xl border border-[#272733] hover:border-[#514078] shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.12)] transition-all cursor-pointer flex items-start justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-[#85859A]">Total Documents</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1.5">
              {documents.length}
            </h3>
            <p className="text-[11px] text-[#B8B8C8] font-medium mt-1">
              {documents.length > 0 ? `${documents.length} files secured` : 'No files uploaded'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* When Empty: Render the Gorgeous Empty State */}
      {isEmpty ? (
        <EmptyState
          onAddProduct={onAddProduct}
          onUploadDocument={onUploadDocument}
          onLoadDemo={loadDemoData}
        />
      ) : (
        /* When Populated: Render Real Dynamic Content */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column: Your Products (8 cols) */}
          <div className="lg:col-span-8 bg-[#15151F] p-6 rounded-3xl border border-[#272733] shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#F8FAFC]">My Registered Products</h2>
                <p className="text-xs text-[#85859A]">Click any product to inspect details and warranty terms</p>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-bold text-[#A78BFA] hover:text-[#C4B5FD] hover:underline flex items-center gap-1 transition-colors"
              >
                <span>View All ({products.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((prod) => {
                const exp = getExpiryStatus(prod.warrantyExpiryDate);
                return (
                  <div
                    key={prod.id}
                    onClick={() => onSelectProduct(prod)}
                    className="group p-4 rounded-2xl border border-[#272733] hover:border-[#514078] bg-[#101018] hover:bg-[#12121B] shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-28 mb-3 rounded-xl overflow-hidden bg-[#08080D] border border-[#20202B] flex items-center justify-center">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-[#85859A]">{prod.brand}</div>
                      <h3 className="text-sm font-bold text-[#F8FAFC] truncate mt-0.5" title={prod.name}>
                        {prod.name}
                      </h3>
                      <div className="text-[11px] text-[#85859A] mt-1">
                        Expires: <strong className="text-[#B8B8C8]">{formatDisplayDate(prod.warrantyExpiryDate)}</strong>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#20202B] flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                          exp.color === 'emerald'
                            ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                            : exp.color === 'amber'
                            ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                            : 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                        }`}
                      >
                        {exp.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#85859A] group-hover:text-[#A78BFA] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Assistant Quick Callout */}
            <div className="p-4 rounded-2xl bg-[#101018] border border-[#514078]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.35)] shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">
                    Ask DocuMind AI about your {products.length} products
                  </h4>
                  <p className="text-[11px] text-[#85859A]">
                    Check if accidental cracks, battery drop, or liquid damage is covered.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('ai')}
                className="px-3.5 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all self-start sm:self-auto border border-[#A78BFA]/30"
              >
                Open Assistant →
              </button>
            </div>
          </div>

          {/* Right Column: Upcoming Expiries & Category Chart (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Expiries Card */}
            <div className="bg-[#15151F] p-6 rounded-3xl border border-[#272733] shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Upcoming Expiries</h3>
                <button
                  onClick={() => onNavigateTab('reminders')}
                  className="text-xs font-bold text-[#A78BFA] hover:text-[#C4B5FD] hover:underline transition-colors"
                >
                  View All
                </button>
              </div>

              {sortedExpiries.length > 0 ? (
                <div className="space-y-3">
                  {sortedExpiries.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.productRef) {
                          onSelectProduct(item.productRef);
                        } else {
                          onNavigateTab('documents');
                        }
                      }}
                      className="p-3 rounded-xl border border-[#20202B] hover:border-[#514078] bg-[#101018] hover:bg-[#12121B] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-[#F8FAFC] truncate">{item.title}</h4>
                        <p className="text-[10px] text-[#85859A] mt-0.5">{formatDisplayDate(item.date)}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          item.color === 'emerald'
                            ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                            : item.color === 'amber'
                            ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                            : 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                        }`}
                      >
                        {item.badgeLabel}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-[#85859A] text-xs">
                  No expiry dates recorded.
                </div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-[#15151F] p-6 rounded-3xl border border-[#272733] shadow-md">
              <h3 className="text-sm font-bold text-[#F8FAFC] mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = Math.round((count / products.length) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#B8B8C8]">{cat}</span>
                        <span className="text-[#85859A] font-medium">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#101018] border border-[#272733] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
