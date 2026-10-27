import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthView } from './components/auth/AuthView';
import { Sidebar } from './components/common/Sidebar';
import { AppHeader } from './components/common/AppHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { MyProductsView } from './components/products/MyProductsView';
import { ProductDetailsView } from './components/products/ProductDetailsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ExpiryTrackerView } from './components/reminders/ExpiryTrackerView';
import { DocuMindAIView } from './components/ai/DocuMindAIView';
import { SettingsView } from './components/settings/SettingsView';
import { AddProductModal } from './components/products/AddProductModal';
import { AddDocumentModal } from './components/documents/AddDocumentModal';
import { DocumentPreviewModal } from './components/documents/DocumentPreviewModal';
import { Product, DocumentItem } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'vault'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
  
  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [addDocDefaultProductId, setAddDocDefaultProductId] = useState<string | undefined>(undefined);
  
  // AI initial query pass-through
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile sidebar toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Landing Page view
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentView('vault')}
        onSignIn={() => setCurrentView('auth')}
        onExploreHowItWorks={() => {
          const el = document.getElementById('how-it-works');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            setCurrentView('vault');
          }
        }}
      />
    );
  }

  // Auth view
  if (currentView === 'auth') {
    return (
      <AuthView
        onSuccess={() => setCurrentView('vault')}
        onBackToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // Handle opening Product Details
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-details');
  };

  // Handle Tab navigation
  const handleTabChange = (tab: string) => {
    if (tab === 'auth') {
      setCurrentView('auth');
      return;
    }
    if (tab === 'landing') {
      setCurrentView('landing');
      return;
    }
    setCurrentTab(tab);
    if (tab !== 'product-details') {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#08080D] text-[#F8FAFC] overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="p-3 sm:p-4 flex shrink-0 h-full">
        <Sidebar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onBackToLanding={() => setCurrentView('landing')}
          onQuickAddProduct={() => setIsAddProductOpen(true)}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-3 sm:p-4 sm:pl-0">
        <div className="bg-[#0D0D14] border border-[#272733] rounded-3xl h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Top Header */}
          <AppHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateTab={handleTabChange}
            onSelectProductById={(id) => {
              // Could navigate directly if needed
            }}
          />

          {/* View Container */}
          <div className="flex-1">
            {currentTab === 'dashboard' && (
              <DashboardView
                onAddProduct={() => setIsAddProductOpen(true)}
                onUploadDocument={() => {
                  setAddDocDefaultProductId(undefined);
                  setIsAddDocOpen(true);
                }}
                onSelectProduct={handleSelectProduct}
                onNavigateTab={handleTabChange}
              />
            )}

            {currentTab === 'products' && (
              <MyProductsView
                onAddProduct={() => setIsAddProductOpen(true)}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentTab === 'product-details' && selectedProduct && (
              <ProductDetailsView
                product={selectedProduct}
                onBack={() => handleTabChange('products')}
                onAttachDocument={(productId) => {
                  setAddDocDefaultProductId(productId);
                  setIsAddDocOpen(true);
                }}
                onAskAI={(initialQuery) => {
                  setAiInitialPrompt(initialQuery || `What are the warranty coverage terms for ${selectedProduct.name}?`);
                  setCurrentTab('ai');
                }}
                onViewDocument={(doc) => setPreviewDocument(doc)}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsView
                onUploadDocument={() => {
                  setAddDocDefaultProductId(undefined);
                  setIsAddDocOpen(true);
                }}
                onViewDocument={(doc) => setPreviewDocument(doc)}
              />
            )}

            {currentTab === 'reminders' && (
              <ExpiryTrackerView
                onSelectProduct={handleSelectProduct}
                onViewDocument={(doc) => setPreviewDocument(doc)}
                onAddProduct={() => setIsAddProductOpen(true)}
              />
            )}

            {currentTab === 'ai' && (
              <DocuMindAIView
                initialPrompt={aiInitialPrompt}
                onAddProduct={() => setIsAddProductOpen(true)}
                onUploadDocument={() => {
                  setAddDocDefaultProductId(undefined);
                  setIsAddDocOpen(true);
                }}
              />
            )}

            {currentTab === 'settings' && <SettingsView />}
          </div>
        </div>
      </main>

      {/* Global Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={(newProduct) => {
          setIsAddProductOpen(false);
          handleSelectProduct(newProduct);
        }}
      />

      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() => {
          setIsAddDocOpen(false);
          setAddDocDefaultProductId(undefined);
        }}
        onSuccess={() => {
          setIsAddDocOpen(false);
          setAddDocDefaultProductId(undefined);
        }}
        defaultProductId={addDocDefaultProductId}
      />

      <DocumentPreviewModal
        document={previewDocument}
        onClose={() => setPreviewDocument(null)}
      />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
