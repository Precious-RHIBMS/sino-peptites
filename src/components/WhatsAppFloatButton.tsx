import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

/**
 * Floating bottom-right WhatsApp quick-chat launcher.
 * Replaces the simulated live chat button to avoid corner collisions.
 */
export function WhatsAppFloatButton() {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <a
        href={buildGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-[#050B14] text-xs font-bold shadow-xl shadow-black/40 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <WhatsAppIcon className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
