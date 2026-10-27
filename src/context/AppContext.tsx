import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, DocumentItem, UserProfile } from '../types';

interface AppContextType {
  products: Product[];
  documents: DocumentItem[];
  userProfile: UserProfile;
  isDemoMode: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => DocumentItem;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-prod-1',
    name: 'MacBook Air M2',
    category: 'Laptops & Computers',
    brand: 'Apple',
    modelNumber: 'A2681',
    serialNumber: 'C02G9981MD6R',
    purchaseDate: '2025-06-15',
    purchasePrice: 114900,
    retailer: 'Apple Store Covent Garden',
    warrantyStartDate: '2025-06-15',
    warrantyDuration: '2 Years',
    warrantyExpiryDate: '2027-06-15',
    notes: 'Includes AppleCare+ with limited accidental damage coverage.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    attachedDocumentIds: ['demo-doc-1', 'demo-doc-2'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-prod-2',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Electronics',
    brand: 'Sony',
    modelNumber: 'WH1000XM5/B',
    serialNumber: 'S01-9923841-K',
    purchaseDate: '2025-11-20',
    purchasePrice: 28990,
    retailer: 'Amazon Electronics',
    warrantyStartDate: '2025-11-20',
    warrantyDuration: '1 Year',
    warrantyExpiryDate: '2026-11-20',
    notes: 'Standard manufacturer warranty for audio driver defects.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    attachedDocumentIds: ['demo-doc-3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-prod-3',
    name: 'Dyson V12 Detect Slim Vacuum',
    category: 'Home Appliances',
    brand: 'Dyson',
    modelNumber: 'SV20',
    serialNumber: 'DY-9812-441',
    purchaseDate: '2024-11-05',
    purchasePrice: 45900,
    retailer: 'Dyson Direct',
    warrantyStartDate: '2024-11-05',
    warrantyDuration: '2 Years',
    warrantyExpiryDate: '2026-11-05',
    notes: 'Covers motor, battery and motorized cleaner head.',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
    attachedDocumentIds: [],
    createdAt: new Date().toISOString(),
  },
];

const DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'demo-doc-1',
    title: 'Apple Tax Invoice - MacBook Air',
    category: 'Invoice',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadDate: '2025-06-15',
    purchaseDate: '2025-06-15',
    associatedProductId: 'demo-prod-1',
    notes: 'Official GST invoice issued by Apple Retail.',
    extractedMetadata: {
      vendor: 'Apple Retail UK',
      amount: 114900,
      serialMatch: 'C02G9981MD6R',
      coverageClauses: ['Limited hardware warranty', '2 incidents of accidental damage per 12 months'],
    },
  },
  {
    id: 'demo-doc-2',
    title: 'AppleCare+ Proof of Coverage',
    category: 'Warranty Card',
    fileType: 'PDF',
    fileSize: '840 KB',
    uploadDate: '2025-06-15',
    expiryDate: '2027-06-15',
    associatedProductId: 'demo-prod-1',
    notes: 'Certificate valid through June 2027.',
  },
  {
    id: 'demo-doc-3',
    title: 'Sony Electronics Warranty Slip',
    category: 'Warranty Card',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadDate: '2025-11-20',
    expiryDate: '2026-11-20',
    associatedProductId: 'demo-prod-2',
    notes: 'Keep with original bill for service center claims.',
  },
  {
    id: 'demo-doc-4',
    title: 'Amazon E-Voucher Gift Card',
    category: 'Gift Card / Voucher',
    fileType: 'PDF',
    fileSize: '320 KB',
    uploadDate: '2026-09-01',
    expiryDate: '2026-11-30',
    notes: 'Promotional gift voucher expiring end of November.',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with empty array by default unless stored in localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('documind_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('documind_documents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('documind_is_demo') === 'true';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('documind_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Jordan Smith',
        email: 'jordan.smith@example.com',
        phone: '+1 (555) 234-5678',
        notificationDays: [30, 7, 1],
        emailAlerts: true,
        appAlerts: true,
      };
    } catch {
      return {
        name: 'Jordan Smith',
        email: 'jordan.smith@example.com',
        phone: '+1 (555) 234-5678',
        notificationDays: [30, 7, 1],
        emailAlerts: true,
        appAlerts: true,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('documind_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('documind_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('documind_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('documind_is_demo', isDemoMode.toString());
  }, [isDemoMode]);

  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Disassociate product from documents
    setDocuments((prev) =>
      prev.map((d) => (d.associatedProductId === id ? { ...d, associatedProductId: undefined } : d))
    );
  };

  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>): DocumentItem => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);

    // If associated with a product, update product attachedDocumentIds
    if (newDoc.associatedProductId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === newDoc.associatedProductId
            ? { ...p, attachedDocumentIds: [...p.attachedDocumentIds, newDoc.id] }
            : p
        )
      );
    }

    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    // Remove from attachedDocumentIds in products
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        attachedDocumentIds: p.attachedDocumentIds.filter((docId: string) => docId !== id),
      }))
    );
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev: UserProfile) => ({ ...prev, ...profile }));
  };

  const loadDemoData = () => {
    setProducts(DEMO_PRODUCTS);
    setDocuments(DEMO_DOCUMENTS);
    setIsDemoMode(true);
  };

  const clearAllData = () => {
    setProducts([]);
    setDocuments([]);
    setIsDemoMode(false);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        documents,
        userProfile,
        isDemoMode,
        addProduct,
        updateProduct,
        deleteProduct,
        addDocument,
        updateDocument,
        deleteDocument,
        updateProfile,
        loadDemoData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
