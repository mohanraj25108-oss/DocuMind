import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Plus, 
  Trash2, 
  Bot
} from 'lucide-react';
import { Product, DocumentItem } from '../../types';
import { getExpiryStatus, formatDisplayDate } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

interface ProductDetailsViewProps {
  product: Product;
  onBack: () => void;
  onAttachDocument: (productId: string) => void;
  onAskAI: (initialQuery?: string) => void;
  onViewDocument: (doc: DocumentItem) => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  onBack,
  onAttachDocument,
  onAskAI,
  onViewDocument,
}) => {
  const { documents, deleteProduct } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'warranty' | 'documents'>('overview');

  // Find all documents attached to this product
  const attachedDocs = documents.filter((d) => d.associatedProductId === product.id);

  const exp = getExpiryStatus(product.warrantyExpiryDate);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-[#85859A] hover:text-[#F8FAFC] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Back to Products</span>
      </button>

      {/* Main Hero Card */}
      <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#08080D] overflow-hidden shrink-0 border border-[#272733]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
                  {product.category}
                </span>
                <span className="text-xs font-semibold text-[#85859A]">• {product.brand}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#85859A] mt-2">
                {product.modelNumber && (
                  <span>Model: <strong className="text-[#B8B8C8]">{product.modelNumber}</strong></span>
                )}
                {product.serialNumber && (
                  <span>Serial: <strong className="text-[#B8B8C8]">{product.serialNumber}</strong></span>
                )}
                {product.retailer && (
                  <span>Store: <strong className="text-[#B8B8C8]">{product.retailer}</strong></span>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                    exp.color === 'emerald'
                      ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                      : exp.color === 'amber'
                      ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                      : 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{exp.status}</span>
                </span>
                <span className="text-xs text-[#85859A] font-medium">• {exp.label}</span>
              </div>
            </div>
          </div>

          {/* Quick Header CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => onAskAI(`What is the warranty coverage for my ${product.name}?`)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 transition-all border border-[#A78BFA]/30"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Ask AI About This</span>
            </button>

            <button
              onClick={() => onAttachDocument(product.id)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#101018] hover:bg-[#12121B] text-[#F8FAFC] text-xs font-bold rounded-xl border border-[#272733] hover:border-[#514078] shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-[#A78BFA]" />
              <span>Add Document</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-4 border-b border-[#20202B] mt-8 text-xs font-bold">
          {[
            { id: 'overview', label: 'Overview & Specs' },
            { id: 'warranty', label: 'Warranty & Dates' },
            { id: 'documents', label: `Attached Documents (${attachedDocs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition-colors relative ${
                activeTab === tab.id ? 'text-[#A78BFA]' : 'text-[#85859A] hover:text-[#F8FAFC]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Active Tab Detail */}
        <div className="lg:col-span-8 bg-[#15151F] rounded-3xl border border-[#272733] p-6 sm:p-8 shadow-md">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                Product Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Brand</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">{product.brand}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Category</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">{product.category}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Purchase Date</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">{formatDisplayDate(product.purchaseDate)}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Purchase Price</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">
                    {product.purchasePrice ? `$${product.purchasePrice.toLocaleString()}` : 'Not provided'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Model Number</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">{product.modelNumber || 'N/A'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Serial Number</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">{product.serialNumber || 'N/A'}</span>
                </div>
              </div>

              {product.notes && (
                <div className="pt-4 border-t border-[#20202B]">
                  <span className="text-xs font-bold text-[#F8FAFC] block mb-1">User Notes</span>
                  <p className="text-xs text-[#B8B8C8] bg-[#101018] p-4 rounded-2xl border border-[#272733] leading-relaxed">
                    {product.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                Warranty Terms & Dates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Warranty Start</span>
                  <span className="font-bold text-[#F8FAFC] text-sm">{formatDisplayDate(product.warrantyStartDate || product.purchaseDate)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#101018] border border-[#272733]">
                  <span className="text-[#85859A] block mb-0.5">Warranty Expiry</span>
                  <span className="font-bold text-[#A78BFA] text-sm">{formatDisplayDate(product.warrantyExpiryDate)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#101018] border border-[#272733] text-xs text-[#B8B8C8] space-y-2">
                <span className="font-bold text-[#F8FAFC] block">Smart Expiry Calculation</span>
                <p>
                  Current status is <strong className="text-[#F8FAFC]">{exp.status}</strong> with <strong className="text-[#A78BFA]">{exp.label}</strong> remaining. DocuMind Pro will automatically prompt reminder alerts 30 days, 7 days, and 1 day prior to this date.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Attached Documents</h3>
                <button
                  onClick={() => onAttachDocument(product.id)}
                  className="text-xs font-bold text-[#A78BFA] hover:text-[#C4B5FD] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Document</span>
                </button>
              </div>

              {attachedDocs.length > 0 ? (
                <div className="space-y-2.5">
                  {attachedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => onViewDocument(doc)}
                      className="p-3.5 rounded-2xl border border-[#272733] hover:border-[#514078] bg-[#101018] hover:bg-[#12121B] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#F8FAFC]">{doc.title}</h4>
                          <span className="text-[11px] text-[#85859A]">
                            {doc.category} • {doc.fileType} ({doc.fileSize})
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#A78BFA] hover:text-[#C4B5FD]">
                        View File →
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#85859A] text-xs">
                  <FileText className="w-8 h-8 mx-auto text-[#85859A] mb-2" />
                  <p>No receipts or warranty cards attached yet.</p>
                  <button
                    onClick={() => onAttachDocument(product.id)}
                    className="mt-3 px-4 py-2 bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 font-bold rounded-xl hover:bg-[#8B5CF6]/25 transition-colors"
                  >
                    + Attach Receipt / Warranty
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Actions & Danger Zone */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Management Actions</h3>
            <button
              onClick={() => onAttachDocument(product.id)}
              className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border border-[#272733] hover:border-[#514078] bg-[#101018] hover:bg-[#12121B] text-xs font-bold text-[#F8FAFC] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#A78BFA]" />
              <span>Attach Proof / Invoice</span>
            </button>

            <button
              onClick={() => onAskAI(`What are the exclusions in my warranty for ${product.name}?`)}
              className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border border-[#272733] hover:border-[#514078] bg-[#101018] hover:bg-[#12121B] text-xs font-bold text-[#F8FAFC] transition-colors"
            >
              <Bot className="w-4 h-4 text-[#A855F7]" />
              <span>Check Exclusions with AI</span>
            </button>

            <div className="pt-3 border-t border-[#20202B]">
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#F87171] hover:bg-[#EF4444]/20 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
