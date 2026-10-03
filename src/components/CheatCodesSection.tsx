import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Calculator, 
  BookOpen, 
  Sparkles, 
  Search, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { CheatCodeItem, CHEAT_CODES } from '../data/cheatCodes';

interface CheatCodesSectionProps {
  onOpenModal?: (tab?: 'desmos' | 'rw-grammar' | 'rw-strategies') => void;
}

export const CheatCodesSection: React.FC<CheatCodesSectionProps> = ({ onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'desmos' | 'rw-grammar' | 'rw-strategies'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

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

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.section 
      id="section-cheat-codes"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl shadow-grave hover:shadow-grave-hover p-5 sm:p-7 space-y-6 transition-all duration-300"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#a6c4a1]/50 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#264e22] text-[#f2f8f0] shadow-xs font-['JetBrains_Mono']">
              ⚡ Bluebook Secret Weapons
            </span>
            <span className="text-xs text-[#2b4c27] font-extrabold font-['JetBrains_Mono']">
              8 Desmos Shortcuts &bull; 6 Core Grammar Rules &bull; 5 Question-Type Strategies
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#122810] font-luxury flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-amber-500 fill-amber-400" />
            <span>Tactical Cheat Codes & Shortcuts</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#274624] max-w-3xl leading-relaxed font-medium">
            Aggressively exploit the built-in Desmos graphing engine to skip substitution/elimination, backsolve rational equations, and auto-fit regressions. Master the exact 6 grammar patterns tested over and over, plus eliminate traps with predictive R&W reading blueprints.
          </p>
        </div>

        {onOpenModal && (
          <button
            onClick={() => onOpenModal(activeTab === 'all' ? 'desmos' : activeTab)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#315d34] hover:bg-[#254928] hover:shadow-md active:scale-[0.98] transition-all duration-150 shadow-xs flex items-center gap-2 min-h-[44px] cursor-pointer shrink-0 self-start lg:self-auto"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Studio Modal</span>
          </button>
        )}
      </div>

      {/* Control Bar: Category Tabs & Real-Time Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-matcha-sub p-3 sm:p-4 rounded-2xl border border-[#a6c4a1]/70">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#2b542d] text-white shadow-xs'
                : 'bg-matcha-input text-slate-800 hover:bg-white/80 border border-[#a6c4a1]'
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
        <div className="relative sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syntax, traps, rules..."
            className="w-full pl-8 pr-3 py-1.5 bg-matcha-input border border-[#a6c4a1] rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#264e22]"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCodes.length === 0 ? (
        <div className="text-center py-12 text-slate-600 text-xs font-medium bg-matcha-sub/50 rounded-2xl border border-dashed border-[#a6c4a1]">
          No cheat codes match &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;Desmos&rdquo;, &ldquo;Semicolon&rdquo;, or &ldquo;Transitions&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCodes.map((item, idx) => {
            const isExpanded = !!expandedCards[item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-matcha-sub/80 border border-[#a6c4a1] shadow-grave-card hover:shadow-grave-card-hover smooth-card-hover flex flex-col justify-between space-y-3 cursor-default"
              >
                <div className="space-y-3">
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#a6c4a1]/50 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-[#1a3717] text-white flex items-center justify-center text-xs font-black font-['JetBrains_Mono']">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#122810] font-luxury leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border font-['JetBrains_Mono'] shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Core Rule Callout */}
                  <div className="p-3 rounded-xl bg-matcha-input border border-[#a6c4a1]/70">
                    <p className="text-xs font-bold text-[#1a3717] leading-relaxed">
                      {item.ruleSummary}
                    </p>
                  </div>

                  {/* Detailed Guidance */}
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {item.detailedGuidance}
                  </p>

                  {/* Recommended Syntax / Code Box (For Desmos) */}
                  {item.recommendedSyntax && (
                    <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 flex items-start justify-between gap-2 shadow-xs">
                      <div className="whitespace-pre-line leading-relaxed">
                        {item.recommendedSyntax}
                      </div>
                      <button
                        onClick={() => handleCopy(item.recommendedSyntax || '', item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0 cursor-pointer"
                        title="Copy syntax to clipboard"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {/* Worked Example */}
                  {item.exampleSnippet && (
                    <div className="p-3 rounded-xl bg-indigo-50/90 border border-indigo-200/90 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-indigo-900 font-['JetBrains_Mono'] flex items-center gap-1">
                        <Info className="w-3 h-3 text-indigo-700" />
                        <span>Worked Example / Blueprint:</span>
                      </span>
                      <div className="text-xs text-indigo-950 font-medium whitespace-pre-line leading-relaxed">
                        {item.exampleSnippet}
                      </div>
                    </div>
                  )}

                  {/* Trap Alert */}
                  {item.trapAlert && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-950 text-xs font-medium">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-900 font-bold font-['JetBrains_Mono'] text-[10px] uppercase">College Board Trap Alert: </strong>
                        <span>{item.trapAlert}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer status line */}
                <div className="pt-2 border-t border-[#a6c4a1]/40 flex items-center justify-between text-[10px] text-slate-600 font-['JetBrains_Mono']">
                  <span>Built for Bluebook 2026</span>
                  <span className="text-[#264e22] font-bold">Tested Strategy</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="bg-[#254928] border border-[#407444] text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-grave">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-100 font-medium leading-relaxed">
            <strong>The Golden Anti-Crutch Rule:</strong> Don&rsquo;t graph everything. If mental math takes 3 seconds, do it mentally. Desmos is your powerhouse for systems, roots, regressions, and unknown sliders!
          </p>
        </div>
        {onOpenModal && (
          <button
            onClick={() => onOpenModal('desmos')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-amber-400 text-slate-950 hover:bg-amber-300 transition cursor-pointer whitespace-nowrap self-end sm:self-auto"
          >
            Launch Full Modal Guide
          </button>
        )}
      </div>
    </motion.section>
  );
};
