import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Trash2
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { formatDisplayDate, getExpiryStatus } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  const { products, deleteDocument } = useApp();

  if (!document) return null;

  const linkedProduct = document.associatedProductId
    ? products.find((p) => p.id === document.associatedProductId)
    : null;

  const expiryInfo = getExpiryStatus(document.expiryDate);

  const handleDownload = () => {
    // Generate a simple simulated download
    const blob = new Blob([`DocuMind Pro Archived Document\nTitle: ${document.title}\nCategory: ${document.category}\nDate: ${document.uploadDate}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      deleteDocument(document.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#15151F] rounded-3xl max-w-2xl w-full border border-[#272733] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20202B] bg-[#101018]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] truncate max-w-sm">
                {document.title}
              </h3>
              <p className="text-xs text-[#85859A]">
                {document.category} • {document.fileType} • {document.fileSize}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#85859A] hover:text-[#F8FAFC] hover:bg-[#12121B] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 space-y-6">
          {/* Document Simulated Viewer Area */}
          <div className="h-60 rounded-2xl bg-[#08080D] border border-[#272733] text-white p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#A78BFA]">
                DocuMind Pro Vault
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40">
                AES-256 Encrypted
              </span>
            </div>

            <div className="z-10 text-center py-4">
              <FileText className="w-12 h-12 mx-auto text-[#A78BFA] mb-2 opacity-90" />
              <h4 className="text-sm font-bold text-[#F8FAFC] tracking-wide">{document.title}</h4>
              <p className="text-xs text-[#85859A] mt-1">
                Archived on {formatDisplayDate(document.uploadDate)}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[#85859A] border-t border-[#20202B] pt-3 z-10">
              <span>Status: <strong className="text-[#F8FAFC]">{expiryInfo.status}</strong></span>
              <span>Ref: {document.id.slice(-6).toUpperCase()}</span>
            </div>

            {/* Subtle violet ambient glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#8B5CF6]/15 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#101018] p-3 rounded-xl border border-[#272733]">
              <span className="text-[#85859A] block mb-0.5">Category</span>
              <span className="font-bold text-[#F8FAFC]">{document.category}</span>
            </div>

            <div className="bg-[#101018] p-3 rounded-xl border border-[#272733]">
              <span className="text-[#85859A] block mb-0.5">Uploaded On</span>
              <span className="font-bold text-[#F8FAFC]">{formatDisplayDate(document.uploadDate)}</span>
            </div>

            <div className="bg-[#101018] p-3 rounded-xl border border-[#272733]">
              <span className="text-[#85859A] block mb-0.5">Expiry Date</span>
              <span className="font-bold text-[#F8FAFC]">
                {document.expiryDate ? formatDisplayDate(document.expiryDate) : 'No Expiry'}
              </span>
            </div>
          </div>

          {/* Linked Product Information */}
          {linkedProduct && (
            <div className="p-3.5 rounded-xl bg-[#101018] border border-[#272733] text-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#A78BFA] font-bold uppercase tracking-wider block">
                  Associated Product
                </span>
                <span className="font-bold text-[#F8FAFC] mt-0.5 block">
                  {linkedProduct.name} ({linkedProduct.brand})
                </span>
              </div>
              <span className="text-xs font-semibold text-[#A78BFA]">
                Warranty: {linkedProduct.warrantyExpiryDate ? formatDisplayDate(linkedProduct.warrantyExpiryDate) : 'N/A'}
              </span>
            </div>
          )}

          {/* Extracted Metadata or Notes */}
          {document.notes && (
            <div className="text-xs text-[#B8B8C8] bg-[#101018] p-3 rounded-xl border border-[#272733]">
              <span className="font-bold text-[#F8FAFC] block mb-1">Notes:</span>
              <p>{document.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-[#20202B]">
            <button
              onClick={handleDelete}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#F87171] hover:bg-[#EF4444]/15 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Document</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-105 border border-[#A78BFA]/30"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
