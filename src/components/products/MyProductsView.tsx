import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { getExpiryStatus, formatDisplayDate } from '../../utils/dateUtils';

interface MyProductsViewProps {
  onAddProduct: () => void;
  onSelectProduct: (product: Product) => void;
}

export const MyProductsView: React.FC<MyProductsViewProps> = ({
  onAddProduct,
  onSelectProduct,
}) => {
  const { products } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'expiry' | 'purchase' | 'name'>('expiry');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All',
    'Smartphones',
    'Laptops & Computers',
    'Home Appliances',
    'Electronics',
    'Furniture',
    'Vehicles',
    'Other',
  ];

  const statuses = ['All', 'Active', 'Expiring Soon', 'Expired', 'No Expiry Date'];

  // Filtering & Sorting
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.brand.toLowerCase().includes(search.toLowerCase()) ||
      (prod.modelNumber && prod.modelNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;

    const exp = getExpiryStatus(prod.warrantyExpiryDate);
    const matchesStatus = selectedStatus === 'All' || exp.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'expiry') {
      if (!a.warrantyExpiryDate) return 1;
      if (!b.warrantyExpiryDate) return -1;
      return new Date(a.warrantyExpiryDate).getTime() - new Date(b.warrantyExpiryDate).getTime();
    }
    if (sortBy === 'purchase') {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            My Registered Products
          </h1>
          <p className="text-xs sm:text-sm text-[#85859A] mt-0.5">
            Manage your personal electronics, appliances, and valuables.
          </p>
        </div>

        <button
          onClick={onAddProduct}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_22px_rgba(139,92,246,0.45)] transition-all hover:scale-105 self-start sm:self-auto border border-[#A78BFA]/30"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#15151F] p-4 rounded-2xl border border-[#272733] shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#85859A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, brand or model..."
              className="w-full pl-10 pr-4 py-2 bg-[#101018] border border-[#272733] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#101018] border border-[#272733] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="All" className="bg-[#15151F] text-[#F8FAFC]">All Statuses</option>
              {statuses.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s} className="bg-[#15151F] text-[#F8FAFC]">
                  {s}
                </option>
              ))}
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#101018] border border-[#272733] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="expiry" className="bg-[#15151F] text-[#F8FAFC]">Sort by Nearest Expiry</option>
              <option value="purchase" className="bg-[#15151F] text-[#F8FAFC]">Sort by Purchase Date</option>
              <option value="name" className="bg-[#15151F] text-[#F8FAFC]">Sort by Name (A-Z)</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-[#101018] border border-[#272733] rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#15151F] text-[#A78BFA] border border-[#514078]' : 'text-[#85859A] hover:text-[#F8FAFC]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#15151F] text-[#A78BFA] border border-[#514078]' : 'text-[#85859A] hover:text-[#F8FAFC]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
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

      {/* Products Display */}
      {sortedProducts.length === 0 ? (
        <div className="bg-[#15151F] rounded-3xl border border-[#272733] p-12 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center mb-4">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            {products.length === 0 ? 'No products registered yet' : 'No matching products found'}
          </h3>
          <p className="text-xs text-[#85859A] mt-1 max-w-sm mx-auto">
            {products.length === 0
              ? 'Start by adding your smartphone, laptop, or home appliances to track their warranty coverage.'
              : 'Try clearing your search query or choosing a different category filter.'}
          </p>
          <button
            onClick={onAddProduct}
            className="mt-6 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-105 border border-[#A78BFA]/30"
          >
            + Register Your First Product
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((prod) => {
            const exp = getExpiryStatus(prod.warrantyExpiryDate);
            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="group bg-[#15151F] p-5 rounded-3xl border border-[#272733] hover:border-[#514078] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#08080D] border border-[#20202B] mb-4 relative">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0D0D14]/90 backdrop-blur-xs text-[#F8FAFC] border border-[#272733] shadow-xs">
                      {prod.category}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#85859A]">{prod.brand}</div>
                  <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors mt-0.5">
                    {prod.name}
                  </h3>

                  {prod.modelNumber && (
                    <p className="text-xs text-[#85859A] mt-1">
                      Model: <span className="font-semibold text-[#B8B8C8]">{prod.modelNumber}</span>
                    </p>
                  )}

                  <div className="text-xs text-[#85859A] mt-1">
                    Purchased: <span className="font-semibold text-[#B8B8C8]">{formatDisplayDate(prod.purchaseDate)}</span>
                  </div>
                  <div className="text-xs text-[#85859A]">
                    Warranty Expiry: <span className="font-semibold text-[#B8B8C8]">{formatDisplayDate(prod.warrantyExpiryDate)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#20202B] flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                      exp.color === 'emerald'
                        ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                        : exp.color === 'amber'
                        ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                        : 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                    }`}
                  >
                    {exp.label}
                  </span>
                  <span className="text-xs font-bold text-[#A78BFA] group-hover:text-[#C4B5FD] group-hover:translate-x-0.5 transition-all">
                    Inspect Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-[#15151F] rounded-3xl border border-[#272733] overflow-hidden shadow-md divide-y divide-[#20202B]">
          {sortedProducts.map((prod) => {
            const exp = getExpiryStatus(prod.warrantyExpiryDate);
            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="p-4 sm:p-5 hover:bg-[#12121B] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-[#08080D] overflow-hidden shrink-0 border border-[#272733]">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#85859A] uppercase tracking-wider block">
                      {prod.brand} • {prod.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">{prod.name}</h3>
                    <p className="text-xs text-[#85859A] mt-0.5">
                      Purchased: {formatDisplayDate(prod.purchaseDate)} • Expiry: {formatDisplayDate(prod.warrantyExpiryDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                      exp.color === 'emerald'
                        ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                        : exp.color === 'amber'
                        ? 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                        : 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                    }`}
                  >
                    {exp.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#85859A]" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
