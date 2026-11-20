import { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, FileText, Microscope, X } from 'lucide-react';
import { Certificate } from '../types';

interface StoryAndCertificatesProps {
  certificates: Certificate[];
}

/**
 * Combines Our Story and Batch Certificates verification into a cohesive,
 * scannable two-part section with clickable Certificate of Analysis inspection.
 */
export function StoryAndCertificates({ certificates }: StoryAndCertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedCert) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCert]);

  return (
    <section
      id="our-story"
      className="py-16 lg:py-20 bg-[#050B14] border-b border-white/10"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Our Story Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
              Our Story &amp; Standards
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight [text-wrap:balance]">
              Small-Batch Peptides Backed by Analytical Proof
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              Founded in Portland by analytical chemists, our laboratory bridges precision
              peptide synthesis and independent verification. Every synthesis lot is quarantined
              until third-party laboratories confirm &gt;99% HPLC purity, exact mass identity, and
              endotoxin clearance.
            </p>

            <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Microscope className="h-5 w-5 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Vacuum-Sealed Lyophilized Preservation
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Freeze-dried under nitrogen in Type I borosilicate vials to preserve peptide
                    sequence stability across transit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Included Lot Documentation
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Every parcel ships with a printed, lot-matched Certificate of Analysis signed by
                    our quality assurance lead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates Grid Column */}
          <div id="certificates" className="lg:col-span-7 scroll-mt-24">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
                  Certificates of Analysis
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                  Independent Lab Verification
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Click any report to inspect metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="text-left bg-[#0A1220] border border-white/10 rounded-xl p-5 hover:border-[#1E90FF]/50 hover:-translate-y-0.5 transition-all shadow-md shadow-black/25 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[#1E90FF] font-medium">{cert.batchCode}</span>
                      <span className="text-slate-400 font-mono">{cert.testedDate}</span>
                    </div>
                    <h4 className="mt-2 font-serif text-lg font-bold text-white">{cert.title}</h4>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {cert.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {cert.result}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E90FF]">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      Inspect
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Inspection Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCert(null);
          }}
        >
          <div className="w-full max-w-lg bg-[#0A1220] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#1E90FF] font-semibold">
                  {selectedCert.id} · {selectedCert.batchCode}
                </span>
                <h3
                  id="cert-modal-title"
                  className="mt-1 font-serif text-2xl font-bold text-white"
                >
                  {selectedCert.title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Close certificate"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span>{selectedCert.standard}</span>
              <span aria-hidden="true">·</span>
              <span>Tested {selectedCert.testedDate}</span>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">{selectedCert.summary}</p>

            <div className="mt-5 bg-[#050B14] border border-white/10 rounded-xl p-4 space-y-3">
              {selectedCert.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between gap-4 text-xs border-b border-white/5 pb-2.5 last:border-b-0 last:pb-0"
                >
                  <span className="text-slate-300">{metric.label}</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {selectedCert.result}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs font-semibold transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
