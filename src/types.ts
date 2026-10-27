export type ProductCategory = 
  | 'Smartphones'
  | 'Laptops & Computers'
  | 'Home Appliances'
  | 'Electronics'
  | 'Furniture'
  | 'Vehicles'
  | 'Other';

export type DocumentCategory = 
  | 'Warranty Card'
  | 'Purchase Receipt'
  | 'Invoice'
  | 'Insurance Policy'
  | 'Gift Card / Voucher'
  | 'Product Manual'
  | 'Other';

export type ExpiryStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'No Expiry Date';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  customCategory?: string;
  brand: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseDate: string; // YYYY-MM-DD
  purchasePrice?: number;
  retailer?: string;
  warrantyStartDate?: string;
  warrantyDuration?: string; // e.g. "1 Year", "2 Years"
  warrantyExpiryDate?: string; // YYYY-MM-DD
  notes?: string;
  imageUrl?: string;
  attachedDocumentIds: string[];
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  fileType: 'PDF' | 'PNG' | 'JPG' | 'DOC';
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  purchaseDate?: string;
  associatedProductId?: string;
  storageUrl?: string;
  notes?: string;
  extractedText?: string;
  extractedMetadata?: {
    vendor?: string;
    amount?: number;
    serialMatch?: string;
    coverageClauses?: string[];
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  notificationDays: number[];
  emailAlerts: boolean;
  appAlerts: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedQuestions?: string[];
}
