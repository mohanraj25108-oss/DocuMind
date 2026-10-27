import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Check, 
  Sparkles
} from 'lucide-react';
import { DocumentCategory, DocumentItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (doc: DocumentItem) => void;
  defaultProductId?: string;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultProductId,
}) => {
  const { products, addDocument } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Purchase Receipt');
  const [associatedProductId, setAssociatedProductId] = useState<string>(defaultProductId || '');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<{ name: string; size: string; type: 'PDF' | 'PNG' | 'JPG' } | null>(null);

  // OCR Extraction simulation
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedReview, setExtractedReview] = useState<{
    vendor?: string;
    amount?: number;
    serialMatch?: string;
  } | null>(null);

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories: DocumentCategory[] = [
    'Purchase Receipt',
    'Warranty Card',
    'Invoice',
    'Insurance Policy',
    'Gift Card / Voucher',
    'Product Manual',
    'Other',
  ];

  const handleSimulateFileDrop = (fileName = 'Invoice_Scan_2026.pdf') => {
    setFile({
      name: fileName,
      size: '2.1 MB',
      type: 'PDF',
    });

    if (!title) {
      setTitle(fileName.replace('.pdf', '').replace(/_/g, ' '));
    }

    // Simulate smart OCR extraction
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedReview({
        vendor: 'Authorized Retailer',
        amount: 249.99,
        serialMatch: 'Detected via OCR barcode',
      });
      if (!purchaseDate) {
        setPurchaseDate(new Date().toISOString().split('T')[0]);
      }
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Document title is required');
      return;
    }

    const createdDoc = addDocument({
      title: title.trim(),
      category,
      fileType: file?.type || 'PDF',
      fileSize: file?.size || '1.2 MB',
      associatedProductId: associatedProductId || undefined,
      purchaseDate: purchaseDate || undefined,
      expiryDate: expiryDate || undefined,
      notes: notes.trim() || undefined,
      extractedMetadata: extractedReview || undefined,
    });

    onSuccess(createdDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#15151F] rounded-3xl max-w-xl w-full border border-[#272733] shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#20202B] bg-[#101018]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Upload Document</h3>
              <p className="text-xs text-[#85859A]">
                Attach a receipt, warranty card, policy or voucher to your vault.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1.5">
              Select or Drop File
            </label>
            <div
              onClick={() => handleSimulateFileDrop('Document_Scan_Official.pdf')}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                file
                  ? 'border-[#10B981]/40 bg-[#10B981]/10'
                  : 'border-[#272733] hover:border-[#514078] bg-[#101018]'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center shrink-0 border border-[#10B981]/30">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#F8FAFC] block">{file.name}</span>
                      <span className="text-[11px] text-[#34D399]">
                        {file.type} • {file.size} • Ready to save
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#A78BFA] font-semibold hover:text-[#C4B5FD] hover:underline">
                    Change file
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="w-6 h-6 text-[#85859A] mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-[#F8FAFC]">
                    Click to browse or drag file here
                  </p>
                  <p className="text-[10px] text-[#85859A] mt-0.5">Supports PDF, PNG, JPG up to 25MB</p>
                </div>
              )}
            </div>
          </div>

          {/* OCR review simulation banner */}
          {isExtracting && (
            <div className="p-3 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs text-[#A78BFA] flex items-center space-x-2 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Scanning document text & detecting key fields...</span>
            </div>
          )}

          {extractedReview && (
            <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Text Extracted Successfully (Review below)</span>
              </div>
              <p className="text-[11px] text-[#34D399]/90">
                Vendor: <strong className="text-[#F8FAFC]">{extractedReview.vendor}</strong> | Amount: <strong className="text-[#F8FAFC]">${extractedReview.amount}</strong>
              </p>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Document Title <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Official Warranty Card"
                className={`w-full px-3.5 py-2.5 bg-[#101018] border rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 ${
                  error ? 'border-[#EF4444] bg-[#EF4444]/10' : 'border-[#272733] focus:border-[#8B5CF6]'
                }`}
              />
              {error && <p className="text-[11px] text-[#F87171] mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#15151F] text-[#F8FAFC]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Associated Product (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
              Link to Existing Product <span className="text-[#85859A] font-normal">(Optional)</span>
            </label>
            <select
              value={associatedProductId}
              onChange={(e) => setAssociatedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
            >
              <option value="" className="bg-[#15151F] text-[#F8FAFC]">No linked product (Standalone Document)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#15151F] text-[#F8FAFC]">
                  {p.name} ({p.brand})
                </option>
              ))}
            </select>
          </div>

          {/* Dates: Purchase Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Issue / Purchase Date <span className="text-[#85859A] font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Expiry Date <span className="text-[#85859A] font-normal">(If applicable)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
              Notes <span className="text-[#85859A] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Voucher code: AMZ-2026-X. Must present in original format."
              className="w-full px-3.5 py-2 bg-[#101018] border border-[#272733] rounded-xl text-xs text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
            />
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#20202B] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#85859A] hover:text-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center space-x-1.5 border border-[#A78BFA]/30"
            >
              <Check className="w-4 h-4" />
              <span>Save Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
