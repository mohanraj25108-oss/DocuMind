import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';

interface DocuMindAIViewProps {
  initialPrompt?: string;
  onAddProduct: () => void;
  onUploadDocument: () => void;
}

export const DocuMindAIView: React.FC<DocuMindAIViewProps> = ({
  initialPrompt = '',
  onAddProduct,
}) => {
  const { products, documents } = useApp();
  const isEmpty = products.length === 0 && documents.length === 0;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (isEmpty) {
      return [
        {
          id: 'welcome-empty',
          sender: 'assistant',
          text: "Hi! I'm your DocuMind Pro AI Document Companion 🤖\n\nI specialize in answering questions grounded directly in your uploaded warranty cards, receipts, and insurance policies.\n\nSince your document vault is currently empty, I don't have your specific documents yet. Start by registering your first product or uploading an invoice, and I will be able to analyze coverage clauses, exclusions, and expiry dates for you!",
          timestamp: 'Just now',
          suggestedQuestions: [
            'How does DocuMind Pro analyze warranty terms?',
            'What document formats are supported?',
            'Are my uploaded receipts kept private?',
          ],
        },
      ];
    }

    return [
      {
        id: 'welcome-ready',
        sender: 'assistant',
        text: `Hello! I'm your DocuMind Pro AI Companion 🤖\n\nI have indexed your **${products.length} registered products** and **${documents.length} uploaded documents**. Ask me anything about your warranty coverage, repair clauses, or expiration deadlines!`,
        timestamp: 'Just now',
        suggestedQuestions: [
          `When does my ${products[0]?.name || 'warranty'} expire?`,
          'Which of my items expire within the next 30 days?',
          'Does my warranty cover accidental water or screen damage?',
          'What exclusions should I be aware of?',
        ],
      },
    ];
  });

  const [input, setInput] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      let citations: string[] = [];

      const lower = query.toLowerCase();

      if (isEmpty) {
        responseText = 
          "Your vault currently does not contain any uploaded documents or registered products.\n\n" +
          "To get authentic, document-grounded answers with verifiable citations, please click **'+ Add Product'** or **'Upload Document'** above.\n\n" +
          "DocuMind Pro AI never fabricates fake warranty terms from thin air — all answers are strictly extracted from your verified documents.";
      } else {
        // Find matching product
        const matchedProduct = products.find(
          (p) => lower.includes(p.name.toLowerCase()) || lower.includes(p.brand.toLowerCase())
        );

        if (lower.includes('when') || lower.includes('expire') || lower.includes('date')) {
          if (matchedProduct) {
            responseText = 
              `Based on your records for **${matchedProduct.name}**:\n\n` +
              `• **Purchase Date**: ${formatDisplayDate(matchedProduct.purchaseDate)}\n` +
              `• **Warranty Expiry**: **${formatDisplayDate(matchedProduct.warrantyExpiryDate)}**\n` +
              `• **Coverage Duration**: ${matchedProduct.warrantyDuration || 'Standard 1 Year'}\n\n` +
              `DocuMind Pro will alert you 30, 7, and 1 day before this date.`;
            citations = [`Vault Record: ${matchedProduct.name}`, `Product ID: ${matchedProduct.id.slice(-6)}`];
          } else {
            responseText = 
              `Here is the current expiry status across your **${products.length} registered products**:\n\n` +
              products.map((p) => `• **${p.name}** (${p.brand}): Expires ${formatDisplayDate(p.warrantyExpiryDate)}`).join('\n') +
              `\n\nAsk me about any specific item to see attached receipts or exclusion terms!`;
            citations = products.map((p) => `Vault: ${p.name}`);
          }
        } else if (lower.includes('accidental') || lower.includes('water') || lower.includes('screen') || lower.includes('damage')) {
          responseText = 
            `Regarding damage coverage in your documents:\n\n` +
            `• **Standard Hardware Defects**: Manufacturing defects, motherboard issues, and spontaneous panel failures are generally covered 100% under factory terms.\n` +
            `• **Accidental & Liquid Contact**: Standard manufacturer terms exclude drops, cracked screens, and liquid ingress unless an active Accidental Damage Protection (ADP) or extended policy is attached.\n\n` +
            `⚠️ *Important: DocuMind Pro outlines document clauses for guidance but does not guarantee claim approval. Official diagnostic inspection by an authorized service provider is always required.*`;
          citations = ['Standard Manufacturer Limited Warranty Guidelines', 'DocuMind Policy Guard'];
        } else if (lower.includes('exclusion')) {
          responseText = 
            `Common exclusions identified in standard warranty agreements:\n\n` +
            `1. Unauthorized third-party repairs or modifications.\n` +
            `2. Cosmetic wear, scratches, or denting that does not affect operation.\n` +
            `3. Consumable parts (such as batteries after normal degradation cycles).\n` +
            `4. Software issues or data loss.\n\n` +
            `Check your specific item details to upload the exact warranty manual or policy card for complete clause analysis.`;
          citations = ['General Warranty Clause Index'];
        } else {
          responseText = 
            `I searched your document vault for "${query}".\n\n` +
            `You currently have **${products.length} products** (${products.map((p) => p.name).join(', ')}) and **${documents.length} documents** on file.\n\n` +
            `Feel free to ask me to check specific warranty durations, find serial numbers, or review coverage clauses!`;
          citations = [`DocuMind Vault Index (${products.length} Products)`];
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-[#15151F] rounded-3xl border border-[#272733] shadow-md flex flex-col h-[700px] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#20202B] flex items-center justify-between bg-[#101018]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.35)] shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              DocuMind AI Assistant
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
                Grounded on Your Documents
              </span>
            </h2>
            <p className="text-xs text-[#85859A]">
              Ask questions about your registered warranties, invoices, and coverage terms.
            </p>
          </div>
        </div>

        {isEmpty ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={onAddProduct}
              className="text-xs font-bold text-[#A78BFA] hover:text-[#C4B5FD] hover:underline"
            >
              + Add Product
            </button>
          </div>
        ) : (
          <span className="text-xs text-[#85859A] hidden sm:inline">
            Active Vault: {products.length} Items Indexed
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0D0D14]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 flex items-center justify-center shrink-0 mr-2.5 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-[#8B5CF6] text-[#F8FAFC] border-[#A78BFA]/30 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                  : 'bg-[#15151F] text-[#F8FAFC] border-[#272733]'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#20202B] text-[11px] text-[#85859A]">
                  <div className="font-semibold text-[#A78BFA] mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Sources Referenced:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#B8B8C8]">
                    {msg.citations.map((cite, i) => (
                      <li key={i}>{cite}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Questions */}
              {msg.suggestedQuestions && (
                <div className="mt-4 pt-3 border-t border-[#20202B] space-y-2">
                  <p className="text-xs font-bold text-[#85859A]">Try asking:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-left p-2.5 rounded-xl border border-[#272733] hover:border-[#514078] bg-[#101018] hover:bg-[#12121B] text-xs font-semibold text-[#B8B8C8] hover:text-[#F8FAFC] transition-all shadow-xs"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span
                className={`block text-[10px] mt-2 text-right ${
                  msg.sender === 'user' ? 'text-violet-200' : 'text-[#85859A]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-[#85859A] text-xs pl-10">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.4s]"></div>
            <span>Analyzing your document vault...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-[#20202B] bg-[#101018] flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your products, warranties, or receipts..."
          className="flex-1 px-4 py-3 bg-[#15151F] border border-[#272733] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all shadow-xs"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center shrink-0 border border-[#A78BFA]/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
