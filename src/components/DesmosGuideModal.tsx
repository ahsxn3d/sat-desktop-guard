import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Zap, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Search, 
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DesmosGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'desmos' | 'rw-grammar' | 'rw-strategies';
}

import { CheatCodeItem, CHEAT_CODES } from '../data/cheatCodes';
import { useModalScrollLock } from '../hooks/useModalScrollLock';
export type { CheatCodeItem };
export { CHEAT_CODES };


export const DesmosGuideModal: React.FC<DesmosGuideModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'desmos'
}) => {
  useModalScrollLock(isOpen);
  const [activeTab, setActiveTab] = useState<'all' | 'desmos' | 'rw-grammar' | 'rw-strategies'>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCodes = useMemo(() => {
    return CHEAT_CODES.filter((item) => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      if (!matchesTab) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.ruleSummary.toLowerCase().includes(q) ||
        item.detailedGuidance.toLowerCase().includes(q) ||
        (item.recommendedSyntax && item.recommendedSyntax.toLowerCase().includes(q))
      );
    });
  }, [activeTab, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
    >
      <div 
        className="w-full max-w-3xl max-h-[92vh] bg-matcha-input rounded-3xl shadow-grave border-2 border-slate-300 overflow-hidden flex flex-col overscroll-contain"
        data-lenis-prevent="true"
      >
        
        {/* Header */}
        <div className="bg-slate-900 px-5 sm:px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white font-['Space_Grotesk']">
                  SAT Tactical Cheat Codes & Shortcuts
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-600 text-white font-['JetBrains_Mono']">
                  Bluebook Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Desmos 10x speed shortcuts &bull; R&W grammar rules memorized cold &bull; Strategy blueprints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Search Bar */}
        <div className="p-4 sm:px-6 bg-matcha-sub border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-matcha-input text-slate-700 hover:bg-white/80 border border-[#a6c4a1]/70'
                }`}
              >
                All Codes ({CHEAT_CODES.length})
              </button>
              <button
                onClick={() => setActiveTab('desmos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'desmos'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Desmos Math (8)</span>
              </button>
              <button
                onClick={() => setActiveTab('rw-grammar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'rw-grammar'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>R&W Grammar (6)</span>
              </button>
              <button
                onClick={() => setActiveTab('rw-strategies')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'rw-strategies'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>R&W Strategies (5)</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative sm:w-60 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cheat codes..."
                className="w-full pl-8 pr-3 py-1.5 bg-matcha-input border border-[#a6c4a1] rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Body: Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-medium">
              No cheat codes match &ldquo;{searchQuery}&rdquo;. Try another keyword.
            </div>
          ) : (
            filteredCodes.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-matcha-sub/90 border border-[#a6c4a1]/70 shadow-2xs hover:shadow-xs transition-all duration-200 space-y-3"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black font-['JetBrains_Mono']">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 font-luxury">
                      {item.title}
                    </h4>
                  </div>

                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border font-['JetBrains_Mono'] self-start sm:self-auto ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Core Rule Callout */}
                <div className="p-3 rounded-xl bg-matcha-input border border-[#a6c4a1]/60">
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {item.ruleSummary}
                  </p>
                </div>

                {/* Detailed Guidance */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {item.detailedGuidance}
                </p>

                {/* Recommended Syntax / Code Box (For Desmos) */}
                {item.recommendedSyntax && (
                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 flex items-start justify-between gap-2">
                    <div className="whitespace-pre-line leading-relaxed">
                      {item.recommendedSyntax}
                    </div>
                    <button
                      onClick={() => handleCopy(item.recommendedSyntax || '', item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0 cursor-pointer"
                      title="Copy code snippet"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Example Snippet */}
                {item.exampleSnippet && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-900 font-['JetBrains_Mono']">
                      Worked Example / Blueprint:
                    </span>
                    <div className="text-xs text-indigo-950 font-medium whitespace-pre-line leading-relaxed">
                      {item.exampleSnippet}
                    </div>
                  </div>
                )}

                {/* Trap Alert */}
                {item.trapAlert && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-900 font-bold font-['JetBrains_Mono'] text-[10px] uppercase">College Board Trap Alert: </strong>
                      <span>{item.trapAlert}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-matcha-sub px-5 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Built into Bluebook App &bull; Verified on Digital SAT 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer self-end sm:self-auto"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
