import { FormEvent, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface Message {
  id: number;
  sender: 'support' | 'user';
  text: string;
}

const QUICK_TOPICS = [
  'Batch Certificate lookup',
  'Shipping rates & transit time',
  'Mobile Money / Bank Transfer help',
];

/**
 * Floating bottom-right Live Chat widget providing instant product and order guidance.
 */
export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'support',
      text: 'Welcome to Valence Botanicals Specialist Desk. Ask about batch certificates, formulations, or shipping.',
    },
  ]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text: trimmed };
    let replyText =
      'Thank you for reaching out. Our formulation specialists are available Mon–Fri 08:00–18:00 PST, or email care@valencebotanicals.com for lot-specific documentation.';

    const lower = trimmed.toLowerCase();
    if (lower.includes('certificate') || lower.includes('batch') || lower.includes('coa')) {
      replyText =
        'Every parcel includes a printed lot Certificate of Analysis. You can also inspect sample GC-MS and ICP-MS reports directly in the Certificates section above.';
    } else if (lower.includes('ship') || lower.includes('delivery') || lower.includes('transit')) {
      replyText =
        'Standard tracked shipping is $12.00 flat-rate, or complimentary on orders over $150.00. Dispatch takes 24–48 business hours.';
    } else if (lower.includes('payment') || lower.includes('bank') || lower.includes('mobile')) {
      replyText =
        'At checkout you can pay via Visa/Mastercard, Direct Bank Transfer (ACH/Wire), or Mobile Money (M-Pesa, MTN MoMo, Airtel Money).';
    }

    const supportMsg: Message = { id: Date.now() + 1, sender: 'support', text: replyText };
    setMessages((prev) => [...prev, userMsg, supportMsg]);
    setInput('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen && (
        <div
          className="mb-3 w-80 sm:w-96 bg-[#0A1220] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          role="dialog"
          aria-label="Live customer support chat"
        >
          <div className="px-4 py-3.5 bg-[#050B14] border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-white">Specialist Support</h3>
              <p className="text-[11px] text-slate-400">Formulations &amp; Order Assistance</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close live chat"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1E90FF] text-white'
                      : 'bg-[#050B14] border border-white/10 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => sendMessage(topic)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#050B14] border border-white/10 text-[#1E90FF] hover:border-[#1E90FF] transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#050B14] border-t border-white/10 flex items-center gap-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              Type a message
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-xs bg-[#0A1220] text-white placeholder:text-slate-500 rounded-lg border border-white/10 focus:outline-none focus:border-[#1E90FF]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="p-2 rounded-lg bg-[#1E90FF] hover:bg-[#197FE6] text-white transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close live chat' : 'Open live chat'}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#1E90FF] hover:bg-[#197FE6] text-white text-xs font-semibold shadow-xl shadow-[#1E90FF]/30 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span>Live Chat</span>
      </button>
    </div>
  );
}
