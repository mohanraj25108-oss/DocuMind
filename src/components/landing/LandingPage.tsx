import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Bell, 
  Bot, 
  Search, 
  Lock, 
  ChevronDown, 
  Package, 
  Check, 
  Clock, 
  Menu, 
  X 
} from 'lucide-react';
import { AnimatedSection } from '../../hooks/useScrollAnimation';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreHowItWorks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic preview tab for the Hero product showcase
  const [previewTab, setPreviewTab] = useState<'vault' | 'expiry' | 'ai'>('vault');

  const faqs = [
    {
      q: 'What types of documents and items can I organize in DocuMind Pro?',
      a: 'You can register any personal item—smartphones, laptops, home appliances, vehicles, and furniture—and attach original warranty cards, retail invoices, insurance certificates, gift cards, and product manuals.',
    },
    {
      q: 'How does DocuMind calculate warranty expiration dates?',
      a: 'You can either enter the exact expiry date directly, or provide the purchase date along with the warranty period (e.g. 1 Year, 2 Years). DocuMind automatically calculates the exact expiration date and counts down remaining days in real time.',
    },
    {
      q: 'Will my account have sample products pre-loaded?',
      a: 'No. Every new user begins with their own clean, personal vault. You add your own actual products and upload your genuine receipts. If you ever want to test the system with sample data, a toggle is available in your vault settings.',
    },
    {
      q: 'How does DocuMind AI answer questions about my coverage?',
      a: 'DocuMind AI uses authorized document grounding (RAG). It inspects only the receipts, warranty cards, and manuals in your account to answer whether specific parts, screen cracks, or water spills are covered or excluded.',
    },
    {
      q: 'Are my private documents and invoices secure?',
      a: 'Yes. All files are protected with AES-256 encryption and isolated via Supabase Row Level Security (RLS). Only your authenticated account can decrypt and view your personal documents.',
    },
  ];

  const features = [
    {
      icon: FileText,
      color: 'bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30',
      title: 'Personal Document Vault',
      desc: 'Centralize invoices, warranty slips, and digital vouchers with instant file previews and categorization.',
    },
    {
      icon: Package,
      color: 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/30',
      title: 'Add & Manage Your Own Products',
      desc: 'Track smartphones, computers, appliances, and valuables with brand, model, serial numbers, and purchase price.',
    },
    {
      icon: Clock,
      color: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30',
      title: 'Warranty & Expiry Tracking',
      desc: 'Automatic countdown alerts for expiring warranties, so you never miss a claim deadline or voucher expiration.',
    },
    {
      icon: Bot,
      color: 'bg-[#8B5CF6]/20 text-[#A78BFA] border-[#8B5CF6]/40',
      title: 'AI-Powered Document Questions',
      desc: 'Ask complex coverage questions in plain English. Get grounded answers citing the exact terms in your documents.',
    },
    {
      icon: Search,
      color: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
      title: 'Universal Smart Search',
      desc: 'Locate serial numbers, retailers, purchase dates, and store receipts in milliseconds across all your devices.',
    },
    {
      icon: Bell,
      color: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30',
      title: 'Configurable Timely Reminders',
      desc: 'Receive alerts 30 days, 7 days, and 1 day prior to warranty expiration or store voucher cutoff.',
    },
  ];

  const benefits = [
    {
      title: 'Never Forfeit Expired Vouchers',
      desc: 'Gift cards and promotional vouchers expire quietly. DocuMind Pro flags expiring balances well before the deadline.',
    },
    {
      title: 'Zero Paper Receipts to Lose',
      desc: 'Thermal store receipts fade into illegibility within months. High-resolution digital archiving preserves your purchase proof forever.',
    },
    {
      title: 'Instant Claim Proof for Repairs',
      desc: 'Walk into any service technician or repair center with serial numbers, model details, and proof of purchase right on your phone.',
    },
    {
      title: 'Complete Ownership History',
      desc: 'Easily track the purchase value, remaining coverage, and attached manuals across all household devices in one clean view.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080D] text-[#F8FAFC] flex flex-col selection:bg-[#8B5CF6]/30 selection:text-[#F8FAFC]">
      {/* Sticky Top Header */}
      <nav className="sticky top-0 z-50 bg-[#08080D]/90 backdrop-blur-md border-b border-[#20202B] px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-shadow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#F8FAFC] block leading-tight">
                  DocuMind
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40 uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-[#85859A] font-medium leading-none block mt-0.5">
                Your Smart Document Companion
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-xs font-bold text-[#B8B8C8]">
            <a href="#features" className="hover:text-[#A78BFA] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#A78BFA] transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#A78BFA] transition-colors">
              Benefits
            </a>
            <a href="#faq" className="hover:text-[#A78BFA] transition-colors">
              FAQ
            </a>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onSignIn}
              className="text-xs font-bold text-[#B8B8C8] hover:text-[#F8FAFC] px-3.5 py-2 rounded-xl hover:bg-[#15151F] border border-transparent hover:border-[#272733] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_22px_rgba(139,92,246,0.45)] transition-all hover:scale-105 active:scale-95 border border-[#A78BFA]/30"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#85859A] hover:text-[#F8FAFC]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-[#20202B] space-y-2 text-sm font-semibold text-[#B8B8C8]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#15151F] hover:text-[#F8FAFC]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#15151F] hover:text-[#F8FAFC]"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#15151F] hover:text-[#F8FAFC]"
            >
              Benefits
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#15151F] hover:text-[#F8FAFC]"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
                className="w-full py-2.5 text-center font-bold text-[#F8FAFC] border border-[#272733] bg-[#101018] rounded-xl hover:bg-[#15151F]"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full py-2.5 text-center font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 md:pb-24 px-4 md:px-8">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#8B5CF6]/15 via-[#6D28D9]/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <AnimatedSection>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#15151F] border border-[#272733] text-[#A78BFA] text-xs font-bold mb-6 shadow-md shadow-black/40">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Smart Document & Product Vault</span>
            </div>
          </AnimatedSection>

          {/* Core Headline */}
          <AnimatedSection delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#F8FAFC] tracking-tight leading-[1.12]">
              Every Product. Every Document.{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#8B5CF6]">
                One Smart Place.
              </span>
            </h1>
          </AnimatedSection>

          {/* Supporting Text */}
          <AnimatedSection delay={200}>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-[#B8B8C8] max-w-2xl mx-auto leading-relaxed">
              Keep your warranties, receipts, insurance policies and vouchers organized. Track expiry dates and get answers from your documents with DocuMind Pro AI.
            </p>
          </AnimatedSection>

          {/* CTAs */}
          <AnimatedSection delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-white font-bold text-sm sm:text-base rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 border border-[#A78BFA]/30"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#15151F] hover:bg-[#1C1C28] text-[#F8FAFC] font-bold text-sm sm:text-base rounded-2xl border border-[#272733] hover:border-[#514078] shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore How It Works</span>
              </a>
            </div>
          </AnimatedSection>

          {/* Hero Custom-Built Product Preview Illustration */}
          <AnimatedSection delay={400} className="mt-14 max-w-5xl mx-auto">
            <div className="bg-[#15151F] rounded-3xl border border-[#272733] shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-6 text-left relative overflow-hidden group">
              {/* Fake App Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#20202B] mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-bold text-[#85859A] pl-3">DocuMind Pro Vault</span>
                </div>

                {/* Preview Switcher */}
                <div className="flex items-center space-x-1 bg-[#101018] p-1 rounded-xl text-xs font-bold border border-[#272733]">
                  <button
                    onClick={() => setPreviewTab('vault')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'vault' ? 'bg-[#8B5CF6] text-white shadow-xs' : 'text-[#85859A] hover:text-[#F8FAFC]'
                    }`}
                  >
                    Product Vault
                  </button>
                  <button
                    onClick={() => setPreviewTab('expiry')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'expiry' ? 'bg-[#8B5CF6] text-white shadow-xs' : 'text-[#85859A] hover:text-[#F8FAFC]'
                    }`}
                  >
                    Expiry Tracker
                  </button>
                  <button
                    onClick={() => setPreviewTab('ai')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'ai' ? 'bg-[#8B5CF6] text-white shadow-xs' : 'text-[#85859A] hover:text-[#F8FAFC]'
                    }`}
                  >
                    DocuMind AI
                  </button>
                </div>
              </div>

              {/* Dynamic Preview Canvas */}
              {previewTab === 'vault' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#101018] rounded-2xl border border-[#272733]">
                      <span className="text-[11px] text-[#85859A] block font-semibold">Registered Products</span>
                      <span className="text-xl font-extrabold text-[#F8FAFC]">Your Products</span>
                    </div>
                    <div className="p-3 bg-[#101018] rounded-2xl border border-[#272733]">
                      <span className="text-[11px] text-[#85859A] block font-semibold">Active Warranties</span>
                      <span className="text-xl font-extrabold text-[#34D399]">Smart Countdown</span>
                    </div>
                    <div className="p-3 bg-[#101018] rounded-2xl border border-[#272733]">
                      <span className="text-[11px] text-[#85859A] block font-semibold">Expiring Within 30d</span>
                      <span className="text-xl font-extrabold text-[#FBBF24]">Proactive Alerts</span>
                    </div>
                    <div className="p-3 bg-[#101018] rounded-2xl border border-[#272733]">
                      <span className="text-[11px] text-[#85859A] block font-semibold">Archived Invoices</span>
                      <span className="text-xl font-extrabold text-[#A78BFA]">Encrypted Vault</span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#101018] rounded-2xl border border-[#514078]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#F8FAFC]">Ready to register your personal devices?</h4>
                        <p className="text-xs text-[#85859A] mt-0.5">
                          Every user controls their own records. Add your devices and attach official receipts.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onGetStarted}
                      className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-transform self-start sm:self-auto border border-[#A78BFA]/30"
                    >
                      Open Your Vault →
                    </button>
                  </div>
                </div>
              )}

              {previewTab === 'expiry' && (
                <div className="p-6 bg-[#101018] rounded-2xl border border-[#272733] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F8FAFC]">Automated Expiry Timeline</span>
                    <span className="text-[10px] text-[#34D399] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
                      Real-Time Date Math
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-[#15151F] rounded-xl border border-[#272733] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F8FAFC]">30 Days Before Expiry</span>
                      <span className="px-2.5 py-0.5 bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 font-bold rounded-md">Urgent Alert Triggered</span>
                    </div>
                    <div className="p-3 bg-[#15151F] rounded-xl border border-[#272733] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F8FAFC]">7 Days Before Cutoff</span>
                      <span className="px-2.5 py-0.5 bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40 font-bold rounded-md">Voucher Final Notice</span>
                    </div>
                    <div className="p-3 bg-[#15151F] rounded-xl border border-[#272733] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F8FAFC]">Under Active Manufacturer Term</span>
                      <span className="px-2.5 py-0.5 bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-bold rounded-md">Safe & Protected</span>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'ai' && (
                <div className="p-6 bg-[#101018] text-[#F8FAFC] rounded-2xl border border-[#272733] space-y-4">
                  <div className="flex items-center space-x-2 text-xs text-[#A78BFA] font-bold">
                    <Bot className="w-4 h-4" />
                    <span>DocuMind Grounded Intelligence</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#15151F] text-xs text-[#B8B8C8] leading-relaxed border border-[#272733]">
                    "My laptop screen cracked spontaneously. Does my warranty policy cover display replacement?"
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#8B5CF6]/15 text-xs text-[#F8FAFC] leading-relaxed border border-[#8B5CF6]/30">
                    "DocuMind searches your verified documents and cites applicable clauses without guaranteeing approval or replacing the technician's official diagnostic."
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/15 px-3 py-1 rounded-md border border-[#8B5CF6]/30">
              Complete Feature Set
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-3 tracking-tight">
              Designed for Personal Products & Important Papers
            </h2>
            <p className="text-sm sm:text-base text-[#85859A] mt-2">
              From laptops and kitchen appliances to gift vouchers and insurance binders.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <AnimatedSection key={idx} delay={idx * 80}>
                <div className="bg-[#15151F] p-8 rounded-3xl border border-[#272733] hover:border-[#514078] shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.12)] transition-all group hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border mb-5 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#85859A] mt-2.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 md:px-8 bg-[#0D0D14] border-y border-[#20202B] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/15 px-3 py-1 rounded-md border border-[#8B5CF6]/30">
                Simple 3-Step Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-3 tracking-tight">
                How DocuMind Pro Works
              </h2>
              <p className="text-sm sm:text-base text-[#85859A] mt-2">
                Effortless product registration and smart automated reminders.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <AnimatedSection delay={100}>
              <div className="bg-[#15151F] border border-[#272733] hover:border-[#514078] rounded-3xl p-8 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(139,92,246,0.35)] mb-6 border border-[#A78BFA]/30">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                  Add Your Products & Documents
                </h3>
                <p className="text-xs sm:text-sm text-[#85859A] leading-relaxed">
                  Enter your device name, purchase date, and retailer. Drag and drop your receipt or warranty card into your private vault.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection delay={200}>
              <div className="bg-[#15151F] border border-[#272733] hover:border-[#514078] rounded-3xl p-8 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#A855F7] text-white flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(168,85,247,0.35)] mb-6 border border-[#C084FC]/30">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                  Let DocuMind Organize Information
                </h3>
                <p className="text-xs sm:text-sm text-[#85859A] leading-relaxed">
                  DocuMind computes remaining warranty duration, indexes serial numbers, and prepares automated reminder schedules.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection delay={300}>
              <div className="bg-[#15151F] border border-[#272733] hover:border-[#514078] rounded-3xl p-8 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.35)] mb-6 border border-[#34D399]/30">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                  Track Expiries & Ask Questions
                </h3>
                <p className="text-xs sm:text-sm text-[#85859A] leading-relaxed">
                  Receive 30-day, 7-day, and 1-day alerts before policies expire, and ask DocuMind AI to check coverage clauses anytime.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Product Benefits Section */}
      <section id="benefits" className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/15 px-3 py-1 rounded-md border border-[#8B5CF6]/30">
              Why DocuMind Pro
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-3 tracking-tight">
              Real Peace of Mind for Everyday Purchases
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b, idx) => (
            <AnimatedSection key={idx} delay={idx * 100}>
              <div className="bg-[#15151F] p-7 rounded-3xl border border-[#272733] hover:border-[#514078] shadow-md flex items-start space-x-4 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center shrink-0 mt-0.5 border border-[#10B981]/30">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F8FAFC]">{b.title}</h4>
                  <p className="text-xs sm:text-sm text-[#85859A] mt-1.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Privacy and Security Section */}
      <section className="py-16 px-4 md:px-8 bg-[#0D0D14] border-y border-[#20202B]">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 text-[#A78BFA] flex items-center justify-center mx-auto mb-4 border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Strictly Private. Completely Yours.
            </h2>
            <p className="text-xs sm:text-sm text-[#85859A] mt-2 max-w-xl mx-auto leading-relaxed">
              We never monetize your receipts, share purchase behavior with advertisers, or use your private invoices to train third-party models. Your vault uses private storage buckets and Row Level Security.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 md:py-28 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/15 px-3 py-1 rounded-md border border-[#8B5CF6]/30">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <AnimatedSection key={idx} delay={idx * 70}>
                <div className="bg-[#15151F] rounded-2xl border border-[#272733] hover:border-[#514078] overflow-hidden shadow-md transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-[#F8FAFC] text-sm sm:text-base hover:text-[#A78BFA] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#85859A] transition-transform duration-300 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-[#A78BFA]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#85859A] leading-relaxed border-t border-[#20202B] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <AnimatedSection>
          <div className="rounded-3xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] text-white p-8 md:p-14 text-center shadow-[0_0_35px_rgba(139,92,246,0.35)] relative overflow-hidden border border-[#A78BFA]/30">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Start Building Your Document Space
              </h2>
              <p className="mt-4 text-xs sm:text-base text-violet-100 leading-relaxed">
                Take two minutes to record your first product. Never forfeit an expired voucher or scramble for a faded paper receipt again.
              </p>
              <button
                onClick={onGetStarted}
                className="mt-8 px-8 py-3.5 bg-[#08080D] text-[#F8FAFC] hover:bg-[#12121B] font-bold text-xs sm:text-base rounded-2xl shadow-xl transition-all hover:scale-105 inline-flex items-center space-x-2 border border-[#272733] hover:border-[#A78BFA]"
              >
                <span>Create Your Free Vault</span>
                <ArrowRight className="w-4 h-4 text-[#A78BFA]" />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-[#08080D] border-t border-[#20202B] py-10 px-4 md:px-8 text-xs text-[#85859A] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] text-white flex items-center justify-center font-bold shadow-[0_0_8px_rgba(139,92,246,0.4)]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#F8FAFC] text-sm">DocuMind Pro</span>
            <span>— Your Smart Document Companion</span>
          </div>

          <div className="flex items-center space-x-6 font-semibold">
            <a href="#features" className="hover:text-[#F8FAFC] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#F8FAFC] transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-[#F8FAFC] transition-colors">Benefits</a>
            <a href="#faq" className="hover:text-[#F8FAFC] transition-colors">FAQ</a>
            <button onClick={onGetStarted} className="text-[#A78BFA] hover:text-[#C4B5FD] hover:underline font-bold">
              Open App
            </button>
          </div>

          <p>© {new Date().getFullYear()} DocuMind Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
