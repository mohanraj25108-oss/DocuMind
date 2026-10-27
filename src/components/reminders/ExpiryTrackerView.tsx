import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  Calendar, 
  ChevronRight,
  Package,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getExpiryStatus, formatDisplayDate } from '../../utils/dateUtils';
import { Product, DocumentItem, ExpiryStatus } from '../../types';

interface ExpiryTrackerViewProps {
  onSelectProduct: (product: Product) => void;
  onViewDocument: (doc: DocumentItem) => void;
  onAddProduct: () => void;
}

export const ExpiryTrackerView: React.FC<ExpiryTrackerViewProps> = ({
  onSelectProduct,
  onViewDocument,
  onAddProduct,
}) => {
  const { products, documents, userProfile, updateProfile } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<'All' | ExpiryStatus>('All');

  // Build unified item list
  const unifiedItems: {
    id: string;
    title: string;
    subtitle: string;
    type: 'product' | 'document';
    date?: string;
    daysRemaining: number | null;
    status: ExpiryStatus;
    badgeLabel: string;
    color: 'emerald' | 'amber' | 'rose' | 'slate';
    productRef?: Product;
    documentRef?: DocumentItem;
  }[] = [];

  products.forEach((p) => {
    const exp = getExpiryStatus(p.warrantyExpiryDate);
    unifiedItems.push({
      id: `p-${p.id}`,
      title: p.name,
      subtitle: `${p.brand} (${p.category})`,
      type: 'product',
      date: p.warrantyExpiryDate,
      daysRemaining: exp.daysRemaining,
      status: exp.status,
      badgeLabel: exp.label,
      color: exp.color,
      productRef: p,
    });
  });

  documents.forEach((d) => {
    const exp = getExpiryStatus(d.expiryDate);
    unifiedItems.push({
      id: `d-${d.id}`,
      title: d.title,
      subtitle: d.category,
      type: 'document',
      date: d.expiryDate,
      daysRemaining: exp.daysRemaining,
      status: exp.status,
      badgeLabel: exp.label,
      color: exp.color,
      documentRef: d,
    });
  });

  // Filter items
  const filteredItems = unifiedItems.filter((item) => {
    if (selectedGroup === 'All') return true;
    return item.status === selectedGroup;
  });

  // Sort: expiring soon first, then active, then expired, then no expiry
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.daysRemaining === null) return 1;
    if (b.daysRemaining === null) return -1;
    return a.daysRemaining - b.daysRemaining;
  });

  // Counts
  const expiringSoonCount = unifiedItems.filter((i) => i.status === 'Expiring Soon').length;
  const expiredCount = unifiedItems.filter((i) => i.status === 'Expired').length;
  const activeCount = unifiedItems.filter((i) => i.status === 'Active').length;
  const noExpiryCount = unifiedItems.filter((i) => i.status === 'No Expiry Date').length;

  const toggleReminderDay = (day: number) => {
    const current = userProfile.notificationDays || [30, 7, 1];
    const exists = current.includes(day);
    const updated = exists ? current.filter((d: number) => d !== day) : [...current, day].sort((a, b) => b - a);
    updateProfile({ notificationDays: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Expiry Tracker & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-[#85859A] mt-0.5">
            Monitor warranties, voucher expirations, and insurance deadlines before it's too late.
          </p>
        </div>
      </div>

      {/* Reminder Preferences Bar */}
      <div className="bg-[#15151F] p-5 rounded-3xl border border-[#272733] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">Configured Reminder Windows</h4>
            <p className="text-[11px] text-[#85859A]">
              Select when DocuMind Pro should alert you before any item expires:
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {[30, 14, 7, 1].map((day) => {
            const isSelected = (userProfile.notificationDays || [30, 7, 1]).includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleReminderDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-[#F8FAFC] border-[#A78BFA]/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'bg-[#101018] text-[#B8B8C8] hover:text-[#F8FAFC] border-[#272733] hover:border-[#514078]'
                }`}
              >
                {day} Days Before
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Group Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'All', label: 'All Items', count: unifiedItems.length },
          { id: 'Expiring Soon', label: 'Expiring Soon (< 30d)', count: expiringSoonCount, highlight: true },
          { id: 'Active', label: 'Active Coverage', count: activeCount },
          { id: 'Expired', label: 'Expired', count: expiredCount },
          { id: 'No Expiry Date', label: 'No Expiry Date', count: noExpiryCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedGroup(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedGroup === tab.id
                ? 'bg-[#8B5CF6] text-[#F8FAFC] border-[#A78BFA]/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : tab.highlight && tab.count > 0
                ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                : 'bg-[#15151F] text-[#B8B8C8] border-[#272733] hover:border-[#514078] hover:text-[#F8FAFC]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedGroup === tab.id ? 'bg-white/20 text-[#F8FAFC]' : 'bg-[#101018] text-[#85859A] border border-[#272733]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Items List */}
      {sortedItems.length === 0 ? (
        <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-12 text-center max-w-lg mx-auto shadow-xl">
          <Clock className="w-12 h-12 text-[#85859A] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#F8FAFC]">No items in this group</h3>
          <p className="text-xs text-[#85859A] mt-1">
            Add products with warranty dates or upload receipts to begin tracking expirations.
          </p>
          <button
            onClick={onAddProduct}
            className="mt-5 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-[#A78BFA]/30"
          >
            + Add Product with Warranty
          </button>
        </div>
      ) : (
        <div className="bg-[#15151F] rounded-3xl border border-[#272733] overflow-hidden shadow-md divide-y divide-[#20202B]">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.productRef) onSelectProduct(item.productRef);
                else if (item.documentRef) onViewDocument(item.documentRef);
              }}
              className="p-4 sm:p-5 hover:bg-[#12121B] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.type === 'product'
                      ? 'bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30'
                      : 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/30'
                  }`}
                >
                  {item.type === 'product' ? (
                    <Package className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC] leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-[#85859A] mt-0.5">
                    <span>{item.subtitle}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date ? formatDisplayDate(item.date) : 'No Date'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    item.color === 'emerald'
                      ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                      : item.color === 'amber'
                      ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                      : item.color === 'rose'
                      ? 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                      : 'bg-[#101018] text-[#85859A] border-[#272733]'
                  }`}
                >
                  {item.badgeLabel}
                </span>
                <ChevronRight className="w-4 h-4 text-[#85859A]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
