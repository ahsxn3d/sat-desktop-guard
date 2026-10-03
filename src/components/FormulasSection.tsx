'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Zap, 
  BookOpen, 
  Layers, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight
} from 'lucide-react';
import { 
  SAT_FORMULAS_DATA, 
  FORMULA_DOMAINS, 
  FormulaDomain, 
  FormulaDifficulty, 
  SATFormulaItem 
} from '../data/satFormulas';

export const FormulasSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<FormulaDomain | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FormulaDifficulty | 'all'>('all');
  const [hideFormulasMode, setHideFormulasMode] = useState(false);
  const [revealedFormulaIds, setRevealedFormulaIds] = useState<Record<string, boolean>>({});
  const [expandedExampleIds, setExpandedExampleIds] = useState<Record<string, boolean>>({});
  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);

  // Filter formulas based on search, domain, and difficulty
  const filteredFormulas = useMemo(() => {
    return SAT_FORMULAS_DATA.filter((item) => {
      // Domain filter
      if (selectedDomain !== 'all' && item.domain !== selectedDomain) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesFormula = item.formula.toLowerCase().includes(query);
        const matchesMeaning = item.meaning.toLowerCase().includes(query);
        const matchesDomain = item.domainTitle.toLowerCase().includes(query);
        const matchesUnits = item.units.toLowerCase().includes(query);
        return matchesName || matchesFormula || matchesMeaning || matchesDomain || matchesUnits;
      }

      return true;
    });
  }, [searchQuery, selectedDomain, selectedDifficulty]);

  // Handle copy to clipboard
  const handleCopyFormula = (id: string, formulaText: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormulaId(id);
    setTimeout(() => {
      setCopiedFormulaId(null);
    }, 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedFormulaIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExample = (id: string) => {
    setExpandedExampleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Harmonious Matcha-adapted Difficulty Styles
  const getDifficultyBadge = (diff: FormulaDifficulty) => {
    switch (diff) {
      case 'foundations':
        return {
          label: 'Foundations (Tier 1)',
          pillClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          dotClass: 'bg-emerald-600',
          cardBg: 'bg-[#edf6eb]/95 hover:bg-[#e4f1e1]',
          borderColor: 'border-[#8ec284]',
          headerTag: 'bg-emerald-200/70 text-emerald-950 border-emerald-300',
        };
      case 'medium':
        return {
          label: 'Medium (Tier 2)',
          pillClass: 'bg-amber-100 text-amber-950 border-amber-300',
          dotClass: 'bg-amber-600',
          cardBg: 'bg-[#fef9ee]/95 hover:bg-[#fcf3df]',
          borderColor: 'border-[#f2cb77]',
          headerTag: 'bg-amber-200/70 text-amber-950 border-amber-300',
        };
      case 'advanced':
        return {
          label: 'Advanced (Tier 3)',
          pillClass: 'bg-rose-100 text-rose-950 border-rose-300',
          dotClass: 'bg-rose-600',
          cardBg: 'bg-[#fef2f4]/95 hover:bg-[#fae4e8]',
          borderColor: 'border-[#f5a3b2]',
          headerTag: 'bg-rose-200/70 text-rose-950 border-rose-300',
        };
    }
  };

  return (
    <div className="space-y-6 text-[#122810]">
      {/* HERO BANNER: The Golden Rule of SAT Formulas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06243f] via-[#0b3b64] to-[#02446d] border-2 border-sky-400/40 p-6 sm:p-8 shadow-grave backdrop-blur-xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-sky-400/25 text-sky-200 border border-sky-300/40 font-['JetBrains_Mono']">
              Official SAT Math Master Sheet
            </span>
            <span className="text-xs font-bold text-amber-300 font-['JetBrains_Mono'] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Universal Across Foundations &bull; Medium &bull; Advanced</span>
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-luxury flex items-center gap-3">
                <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                <span>The SAT Formula Vault</span>
              </h1>
              <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed font-medium">
                <strong className="text-white font-bold">The Golden Rule:</strong> The formulas do <span className="underline decoration-amber-400 decoration-2 font-bold text-white">not</span> change between easy and hard questions. The slope formula is the exact same formula whether the problem is simple or brutal. What changes is <strong className="text-amber-300">how many steps you need, how variables are disguised, and what traps are set</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowTierModal(!showTierModal)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap self-start lg:self-center"
            >
              <HelpCircle className="w-4 h-4 text-slate-950" />
              <span>{showTierModal ? 'Hide Tier Breakdown' : 'How Tiers Differ Guide'}</span>
            </button>
          </div>

          {/* EXPLANATION ACCORDION: Why Formulas Don't Change, But Problems Do */}
          <AnimatePresence>
            {showTierModal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#041a2e]/90 border border-sky-400/30 text-xs sm:text-sm shadow-inner">
                  {/* Tier 1 */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="font-extrabold text-emerald-300 font-['JetBrains_Mono']">
                        Tier 1: Foundations
                      </span>
                    </div>
                    <p className="text-emerald-100/90 text-xs leading-relaxed font-medium">
                      <strong>Direct 1-Step Calculation:</strong> Given points (2, 3) and (6, 11), find the slope. Plug straight into the formula. Takes 15 seconds.
                    </p>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="font-extrabold text-amber-300 font-['JetBrains_Mono']">
                        Tier 2: Medium
                      </span>
                    </div>
                    <p className="text-amber-100/90 text-xs leading-relaxed font-medium">
                      <strong>2-Step & Reverse Solving:</strong> Given slope is 2 through (3, k) and (7, 15), solve backwards for k. Or word problems requiring you to identify coordinates first.
                    </p>
                  </div>

                  {/* Tier 3 */}
                  <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                      <span className="font-extrabold text-rose-300 font-['JetBrains_Mono']">
                        Tier 3: Advanced
                      </span>
                    </div>
                    <p className="text-rose-100/90 text-xs leading-relaxed font-medium">
                      <strong>Parametric Constants & Traps:</strong> Line is perpendicular to ax + by = c, or "infinite solutions" where ratios must match, or completing the square on a circle.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR - HARMONIOUS MATCHA THEME */}
      <div className="ios-glass-card p-4 sm:p-5 rounded-3xl border-2 border-[#a6c4a1] space-y-4 shadow-grave-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas by name, symbol, or topic (e.g. slope, vertex, arc, circle)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-matcha-input border-2 border-[#a6c4a1] text-sm text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#1a3717] focus:border-[#1a3717] transition shadow-xs"
            />
          </div>

          {/* Flashcard / Recall Mode Toggle */}
          <button
            onClick={() => setHideFormulasMode(!hideFormulasMode)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs ${
              hideFormulasMode
                ? 'bg-purple-700 text-white border-purple-500 shadow-md ring-2 ring-purple-300'
                : 'bg-matcha-input text-slate-900 border-[#a6c4a1] hover:bg-matcha-sub'
            }`}
          >
            {hideFormulasMode ? (
              <>
                <EyeOff className="w-4 h-4 text-purple-200" />
                <span>Recall Quiz Mode ON</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-indigo-700" />
                <span>Test Memory (Hide Formulas)</span>
              </>
            )}
          </button>
        </div>

        {/* Chapter / Domain Tabs */}
        <div className="space-y-2 pt-1 border-t border-[#a6c4a1]/50">
          <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['JetBrains_Mono']">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Chapter Domain:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-[#2b542d] text-white shadow-xs'
                  : 'bg-matcha-input text-slate-800 hover:bg-matcha-sub border border-[#a6c4a1]'
              }`}
            >
              All 4 Chapters ({SAT_FORMULAS_DATA.length})
            </button>
            {FORMULA_DOMAINS.map((domain) => {
              const count = SAT_FORMULAS_DATA.filter((f) => f.domain === domain.id).length;
              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedDomain === domain.id
                      ? 'bg-[#2b542d] text-white shadow-xs'
                      : 'bg-matcha-input text-slate-800 hover:bg-matcha-sub border border-[#a6c4a1]'
                  }`}
                >
                  {domain.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Tier Tabs (Color Coded with Matcha Harmony) */}
        <div className="space-y-2 pt-1 border-t border-[#a6c4a1]/50">
          <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['JetBrains_Mono']">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Difficulty Tier Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedDifficulty === 'all'
                  ? 'bg-[#2b542d] text-white shadow-xs'
                  : 'bg-matcha-input text-slate-800 hover:bg-matcha-sub border border-[#a6c4a1]'
              }`}
            >
              All Tiers ({SAT_FORMULAS_DATA.length})
            </button>
            <button
              onClick={() => setSelectedDifficulty('foundations')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border-2 ${
                selectedDifficulty === 'foundations'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-emerald-100/90 text-emerald-950 hover:bg-emerald-200 border-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Foundations (Tier 1)</span>
            </button>
            <button
              onClick={() => setSelectedDifficulty('medium')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border-2 ${
                selectedDifficulty === 'medium'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-amber-100/90 text-amber-950 hover:bg-amber-200 border-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Medium (Tier 2)</span>
            </button>
            <button
              onClick={() => setSelectedDifficulty('advanced')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border-2 ${
                selectedDifficulty === 'advanced'
                  ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                  : 'bg-rose-100/90 text-rose-950 hover:bg-rose-200 border-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Advanced (Tier 3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* FORMULA GRID - CLEAN MATCHA LIVING DESIGN */}
      {filteredFormulas.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-matcha-sub border-2 border-dashed border-[#a6c4a1] space-y-2">
          <Calculator className="w-8 h-8 text-slate-500 mx-auto opacity-70" />
          <p className="text-sm font-bold text-slate-800">No formulas match your search or filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('all');
              setSelectedDifficulty('all');
            }}
            className="text-xs font-black text-indigo-700 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredFormulas.map((item) => {
            const diffStyle = getDifficultyBadge(item.difficulty);
            const isHidden = hideFormulasMode && !revealedFormulaIds[item.id];
            const isExampleExpanded = !!expandedExampleIds[item.id];
            const isCopied = copiedFormulaId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`rounded-3xl border-2 ${diffStyle.borderColor} ${diffStyle.cardBg} p-5 sm:p-6 shadow-grave-card hover:shadow-grave-hover transition-all space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#a6c4a1]/50 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border font-['JetBrains_Mono'] ${diffStyle.headerTag}`}>
                          {item.domainTitle}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-['JetBrains_Mono'] ${diffStyle.pillClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dotClass}`}></span>
                          <span>{diffStyle.label}</span>
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-luxury">
                        {item.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopyFormula(item.id, item.formula)}
                      title="Copy formula"
                      className="p-2.5 rounded-xl bg-matcha-input hover:bg-matcha-sub border border-[#a6c4a1] text-slate-700 hover:text-[#122810] transition active:scale-95 cursor-pointer shrink-0 shadow-xs"
                    >
                      {isCopied ? (
                        <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 font-['JetBrains_Mono']">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Copied!</span>
                        </span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* FORMULA DISPLAY BOX - HIGH CONTRAST & CRISP */}
                  <div className="relative overflow-hidden rounded-2xl bg-matcha-sub/90 backdrop-blur-md border-2 border-[#a6c4a1] p-4 text-center shadow-grave-card">
                    {isHidden ? (
                      <div className="py-2.5 space-y-2">
                        <p className="text-xs font-black text-purple-900 font-['JetBrains_Mono']">
                          Formula Hidden (Active Recall Mode)
                        </p>
                        <button
                          onClick={() => toggleReveal(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs shadow-xs cursor-pointer transition"
                        >
                          Reveal Formula
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="font-['JetBrains_Mono'] text-lg sm:text-xl font-black text-[#122810] tracking-wide select-all">
                          {item.formula}
                        </div>
                        <p className="text-xs text-slate-700 font-bold">
                          {item.meaning}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* WHY DIFFICULTY DIFFERS (THE CORE EXPLANATION) */}
                  <div className="p-3.5 rounded-2xl bg-matcha-sub/80 backdrop-blur-md border border-[#a6c4a1] space-y-2 text-xs">
                    <div className="font-black text-slate-900 flex items-center gap-1.5 font-['JetBrains_Mono']">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>How Question Complexity Scales:</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-800">
                      <div className="flex items-start gap-1.5">
                        <span className="font-black text-emerald-800 shrink-0 font-['JetBrains_Mono']">[Tier 1]:</span>
                        <span className="font-medium text-emerald-950">{item.tierBreakdown.foundations}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-black text-amber-800 shrink-0 font-['JetBrains_Mono']">[Tier 2]:</span>
                        <span className="font-medium text-amber-950">{item.tierBreakdown.medium}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-black text-rose-800 shrink-0 font-['JetBrains_Mono']">[Tier 3]:</span>
                        <span className="font-medium text-rose-950">{item.tierBreakdown.advanced}</span>
                      </div>
                    </div>
                  </div>

                  {/* DESMOS SHORTCUT & TRAP WARNING BADGES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-indigo-50/95 border-2 border-indigo-200/80 flex items-start gap-2 shadow-xs">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-indigo-900 text-[10px] uppercase tracking-wider block font-['JetBrains_Mono']">
                          Desmos Hack:
                        </span>
                        <p className="text-xs text-indigo-950 font-semibold leading-snug mt-0.5">
                          {item.desmosShortcut}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50/95 border-2 border-rose-200/80 flex items-start gap-2 shadow-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-rose-900 text-[10px] uppercase tracking-wider block font-['JetBrains_Mono']">
                          Exam Trap:
                        </span>
                        <p className="text-xs text-rose-950 font-semibold leading-snug mt-0.5">
                          {item.trapWarning}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACCORDION: SAT EXAM QUESTION & EXPLANATION */}
                <div className="pt-3 border-t border-[#a6c4a1]/60">
                  <button
                    onClick={() => toggleExample(item.id)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-matcha-input/90 hover:bg-matcha-sub text-xs font-black text-[#122810] transition cursor-pointer border border-[#a6c4a1] shadow-xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isExampleExpanded ? 'Hide SAT Practice Problem' : 'View SAT Practice Problem'}</span>
                    </span>
                    {isExampleExpanded ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
                  </button>

                  <AnimatePresence>
                    {isExampleExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pt-2.5 space-y-2 text-xs"
                      >
                        <div className="p-3.5 rounded-2xl bg-matcha-sub/90 backdrop-blur-md border-2 border-[#a6c4a1] space-y-2 shadow-grave-card">
                          <p className="font-medium text-slate-900 leading-relaxed">
                            <strong className="text-[#1a3717] font-black font-['JetBrains_Mono'] block mb-1">📝 SAT Problem:</strong>
                            {item.satExample.question}
                          </p>
                          <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-semibold">
                            <strong className="text-emerald-900 font-black font-['JetBrains_Mono'] block">✅ Solution:</strong>
                            {item.satExample.answer}
                          </div>
                          <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>10-Second Pro Tip:</strong> {item.satExample.proTip}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
