import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import { formatDisplayDate, getExpiryStatus } from '../../utils/dateUtils';

interface DocumentsViewProps {
  onUploadDocument: () => void;
  onViewDocument: (doc: DocumentItem) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  onUploadDocument,
  onViewDocument,
}) => {
  const { documents, products, deleteDocument } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Purchase Receipt',
    'Warranty Card',
    'Invoice',
    'Insurance Policy',
    'Gift Card / Voucher',
    'Product Manual',
    'Other',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.notes && doc.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      deleteDocument(doc.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#85859A] mt-0.5">
            Store, search and inspect your receipts, warranty cards, policies, and vouchers.
          </p>
        </div>

        <button
          onClick={onUploadDocument}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_22px_rgba(139,92,246,0.45)] transition-all hover:scale-105 self-start sm:self-auto border border-[#A78BFA]/30"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#15151F] p-4 rounded-2xl border border-[#272733] shadow-md space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#85859A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, vendor, or notes..."
            className="w-full pl-10 pr-4 py-2 bg-[#101018] border border-[#272733] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-[#20202B]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#8B5CF6] text-[#F8FAFC] border-[#A78BFA]/30 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-[#101018] text-[#B8B8C8] hover:text-[#F8FAFC] border-[#272733] hover:border-[#514078]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-12 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            {documents.length === 0 ? 'Your Document Vault is Empty' : 'No Matching Documents'}
          </h3>
          <p className="text-xs text-[#85859A] mt-1 max-w-sm mx-auto">
            {documents.length === 0
              ? 'Upload your first invoice, warranty slip, or voucher to protect your purchases.'
              : 'Try searching with different terms or selecting "All" categories.'}
          </p>
          <button
            onClick={onUploadDocument}
            className="mt-6 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-105 border border-[#A78BFA]/30"
          >
            + Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const exp = getExpiryStatus(doc.expiryDate);
            const linkedProduct = doc.associatedProductId
              ? products.find((p) => p.id === doc.associatedProductId)
              : null;

            return (
              <div
                key={doc.id}
                onClick={() => onViewDocument(doc)}
                className="group bg-[#15151F] p-5 rounded-3xl border border-[#272733] hover:border-[#514078] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#101018] text-[#B8B8C8] border border-[#272733]">
                      {doc.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors line-clamp-1">
                    {doc.title}
                  </h3>

                  <p className="text-[11px] text-[#85859A] mt-0.5">
                    {doc.fileType} • {doc.fileSize} • Uploaded {formatDisplayDate(doc.uploadDate)}
                  </p>

                  {linkedProduct && (
                    <div className="mt-3 p-2 rounded-xl bg-[#101018] border border-[#272733] text-[11px] text-[#B8B8C8] flex items-center justify-between">
                      <span className="truncate">Product: <strong className="text-[#F8FAFC]">{linkedProduct.name}</strong></span>
                    </div>
                  )}

                  {doc.expiryDate && (
                    <div className="mt-2 text-[11px] text-[#85859A]">
                      Expires: <strong className="text-[#B8B8C8]">{formatDisplayDate(doc.expiryDate)}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#20202B] flex items-center justify-between">
                  {doc.expiryDate ? (
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
                  ) : (
                    <span className="text-[11px] text-[#85859A] font-medium">No Expiry</span>
                  )}

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleDelete(doc, e)}
                      className="p-1.5 text-[#85859A] hover:text-[#F87171] hover:bg-[#EF4444]/15 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
