import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Calendar, 
  Upload, 
  Check, 
  FileText
} from 'lucide-react';
import { ProductCategory, Product } from '../../types';
import { calculateExpiryFromPeriod } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProduct: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addProduct, addDocument } = useApp();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Smartphones');
  const [customCategory, setCustomCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [retailer, setRetailer] = useState('');
  
  // Warranty logic: direct date vs duration
  const [warrantyMode, setWarrantyMode] = useState<'duration' | 'date'>('duration');
  const [warrantyDuration, setWarrantyDuration] = useState('1 Year');
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState(() => {
    return calculateExpiryFromPeriod(new Date().toISOString().split('T')[0], '1 Year');
  });
  
  const [notes, setNotes] = useState('');
  const [imageUrl] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // Validation & Loading
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories: ProductCategory[] = [
    'Smartphones',
    'Laptops & Computers',
    'Home Appliances',
    'Electronics',
    'Furniture',
    'Vehicles',
    'Other',
  ];

  const handlePurchaseDateChange = (date: string) => {
    setPurchaseDate(date);
    if (warrantyMode === 'duration') {
      setWarrantyExpiryDate(calculateExpiryFromPeriod(date, warrantyDuration));
    }
  };

  const handleDurationChange = (duration: string) => {
    setWarrantyDuration(duration);
    setWarrantyExpiryDate(calculateExpiryFromPeriod(purchaseDate, duration));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!brand.trim()) errs.brand = 'Brand or manufacturer is required';
    if (category === 'Other' && !customCategory.trim()) {
      errs.customCategory = 'Please specify your custom category';
    }
    if (!purchaseDate) errs.purchaseDate = 'Purchase date is required';
    if (warrantyExpiryDate && purchaseDate && new Date(warrantyExpiryDate) < new Date(purchaseDate)) {
      errs.warrantyExpiryDate = 'Expiry date cannot be earlier than purchase date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Default image if none provided
      let finalImg = imageUrl.trim();
      if (!finalImg) {
        if (category === 'Smartphones') finalImg = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80';
        else if (category === 'Laptops & Computers') finalImg = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
        else if (category === 'Home Appliances') finalImg = 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80';
        else finalImg = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
      }

      const createdProduct = addProduct({
        name: name.trim(),
        category,
        customCategory: category === 'Other' ? customCategory.trim() : undefined,
        brand: brand.trim(),
        modelNumber: modelNumber.trim() || undefined,
        serialNumber: serialNumber.trim() || undefined,
        purchaseDate,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        retailer: retailer.trim() || undefined,
        warrantyStartDate: purchaseDate,
        warrantyDuration: warrantyMode === 'duration' ? warrantyDuration : undefined,
        warrantyExpiryDate: warrantyExpiryDate || undefined,
        notes: notes.trim() || undefined,
        imageUrl: finalImg,
        attachedDocumentIds: [],
      });

      // If document was attached during product creation
      if (attachedFileName) {
        addDocument({
          title: `${createdProduct.name} - Receipt & Warranty`,
          category: 'Purchase Receipt',
          fileType: 'PDF',
          fileSize: '1.4 MB',
          purchaseDate: createdProduct.purchaseDate,
          expiryDate: createdProduct.warrantyExpiryDate,
          associatedProductId: createdProduct.id,
          notes: 'Uploaded during product registration',
        });
      }

      setIsSubmitting(false);
      onSuccess(createdProduct);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#15151F] rounded-3xl max-w-2xl w-full border border-[#272733] shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#20202B] bg-[#101018]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Add New Product</h3>
              <p className="text-xs text-[#85859A]">Register your device or item to start tracking warranty coverage.</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Product Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Product Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. iPhone 16 Pro, Sony Bravia 55"'
                className={`w-full px-3.5 py-2.5 bg-[#101018] border rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 ${
                  errors.name ? 'border-[#EF4444] bg-[#EF4444]/10' : 'border-[#272733] focus:border-[#8B5CF6]'
                }`}
              />
              {errors.name && <p className="text-[11px] text-[#F87171] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Brand / Manufacturer <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Samsung, Dell, Sony"
                className={`w-full px-3.5 py-2.5 bg-[#101018] border rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 ${
                  errors.brand ? 'border-[#EF4444] bg-[#EF4444]/10' : 'border-[#272733] focus:border-[#8B5CF6]'
                }`}
              />
              {errors.brand && <p className="text-[11px] text-[#F87171] mt-1">{errors.brand}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#15151F] text-[#F8FAFC]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {category === 'Other' && (
              <div>
                <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                  Custom Category Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Power Tools, Musical Instruments"
                  className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                />
                {errors.customCategory && (
                  <p className="text-[11px] text-[#F87171] mt-1">{errors.customCategory}</p>
                )}
              </div>
            )}

            {category !== 'Other' && (
              <div>
                <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                  Model Number <span className="text-[#85859A] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. A2890, SM-S928B"
                  className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                />
              </div>
            )}
          </div>

          {/* Serial Number & Retailer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Serial Number <span className="text-[#85859A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. F2LZ99A80MD6"
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Retailer / Store <span className="text-[#85859A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={retailer}
                onChange={(e) => setRetailer(e.target.value)}
                placeholder="e.g. Best Buy, Amazon, Official Store"
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Purchase Date & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Purchase Date <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => handlePurchaseDateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              />
              {errors.purchaseDate && (
                <p className="text-[11px] text-[#F87171] mt-1">{errors.purchaseDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
                Purchase Price <span className="text-[#85859A] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85859A] font-semibold text-xs">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                />
              </div>
            </div>
          </div>

          {/* Warranty Calculation Section */}
          <div className="bg-[#101018] p-4 rounded-2xl border border-[#272733] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#A78BFA]" />
                <span>Warranty Coverage & Expiry</span>
              </span>

              {/* Mode Switcher */}
              <div className="flex items-center bg-[#0D0D14] border border-[#272733] rounded-lg p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setWarrantyMode('duration');
                    setWarrantyExpiryDate(calculateExpiryFromPeriod(purchaseDate, warrantyDuration));
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    warrantyMode === 'duration' ? 'bg-[#8B5CF6] text-white shadow-xs' : 'text-[#85859A]'
                  }`}
                >
                  By Duration
                </button>
                <button
                  type="button"
                  onClick={() => setWarrantyMode('date')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    warrantyMode === 'date' ? 'bg-[#8B5CF6] text-white shadow-xs' : 'text-[#85859A]'
                  }`}
                >
                  Exact Date
                </button>
              </div>
            </div>

            {warrantyMode === 'duration' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#85859A] mb-1">
                    Warranty Duration
                  </label>
                  <select
                    value={warrantyDuration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#15151F] border border-[#272733] rounded-xl text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="6 Months" className="bg-[#15151F] text-[#F8FAFC]">6 Months</option>
                    <option value="1 Year" className="bg-[#15151F] text-[#F8FAFC]">1 Year (Standard)</option>
                    <option value="2 Years" className="bg-[#15151F] text-[#F8FAFC]">2 Years</option>
                    <option value="3 Years" className="bg-[#15151F] text-[#F8FAFC]">3 Years</option>
                    <option value="5 Years" className="bg-[#15151F] text-[#F8FAFC]">5 Years</option>
                    <option value="Lifetime" className="bg-[#15151F] text-[#F8FAFC]">Lifetime Coverage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#85859A] mb-1">
                    Calculated Expiry Date
                  </label>
                  <div className="px-3 py-2 bg-[#15151F] border border-[#272733] rounded-xl text-xs font-bold text-[#A78BFA]">
                    {warrantyExpiryDate || 'Not applicable'}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-[#85859A] mb-1">
                  Specify Warranty Expiry Date
                </label>
                <input
                  type="date"
                  value={warrantyExpiryDate}
                  onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#15151F] border border-[#272733] rounded-xl text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                />
                {errors.warrantyExpiryDate && (
                  <p className="text-[11px] text-[#F87171] mt-1">{errors.warrantyExpiryDate}</p>
                )}
              </div>
            )}
          </div>

          {/* Document Attachment Zone */}
          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1.5">
              Attach Proof of Purchase / Warranty Document{' '}
              <span className="text-[#85859A] font-normal">(Optional)</span>
            </label>
            <div
              onClick={() => setAttachedFileName('Purchase_Invoice_Scan.pdf')}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                attachedFileName
                  ? 'border-[#10B981]/40 bg-[#10B981]/10'
                  : 'border-[#272733] hover:border-[#514078] bg-[#101018]'
              }`}
            >
              {attachedFileName ? (
                <div className="flex items-center justify-between text-left px-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#34D399]" />
                    <div>
                      <span className="text-xs font-bold text-[#34D399] block">
                        {attachedFileName}
                      </span>
                      <span className="text-[10px] text-[#34D399]/80">Attached • PDF (1.4 MB)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachedFileName(null);
                    }}
                    className="text-xs text-[#F87171] font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <Upload className="w-5 h-5 text-[#85859A] mx-auto mb-1" />
                  <p className="text-xs font-semibold text-[#F8FAFC]">
                    Click to attach receipt or warranty card
                  </p>
                  <p className="text-[10px] text-[#85859A]">PDF, PNG, JPG up to 15MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1">
              Notes & Coverage Terms <span className="text-[#85859A] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Includes screen protection plan. Keep box for claims."
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
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-[#F8FAFC] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center space-x-1.5 border border-[#A78BFA]/30"
            >
              {isSubmitting ? (
                <span>Saving Product...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
