'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calculator, 
  Zap, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Flame,
  ArrowRight,
  Info,
  Compass,
  Lightbulb
} from 'lucide-react';
import { CHEAT_CODES } from '../data/cheatCodes';
import { FormulasSection } from './FormulasSection';
import { ReadingWritingInfoSection } from './ReadingWritingInfoSection';
import { MathInfoSection } from './MathInfoSection';
import { StuckConceptRecord } from '../types';

export type CoreInfoSubTab = 'important-info' | 'formulas' | 'cheat-codes';

interface CoreInfoSectionProps {
  stuckConcepts?: StuckConceptRecord[];
  initialSubTab?: 'important-info' | 'formulas' | 'cheat-codes' | 'curriculum' | 'blueprints';
  initialSubject?: 'math' | 'rw';
  onToggleResolveStruggle?: (id: string) => void;
  onDeleteStruggle?: (id: string) => void;
}

export const CoreInfoSection: React.FC<CoreInfoSectionProps> = ({
  stuckConcepts = [],
  initialSubTab = 'important-info',
  initialSubject,
  onToggleResolveStruggle,
  onDeleteStruggle
}) => {
  const normalizeTab = (tab?: string): CoreInfoSubTab => {
    if (tab === 'formulas') return 'formulas';
    if (tab === 'cheat-codes' || tab === 'blueprints') return 'cheat-codes';
    return 'important-info';
  };

  const [mainPageTab, setMainPageTab] = useState<CoreInfoSubTab>(() => normalizeTab(initialSubTab));
  const [importantInfoSubject, setImportantInfoSubject] = useState<'math' | 'rw'>(() => {
    if (initialSubject) return initialSubject;
    return 'math';
  });

  // Cheat Codes in-page filter and search state (zero modal popups)
  const [cheatCodeCategory, setCheatCodeCategory] = useState<'all' | 'desmos' | 'rw-grammar' | 'rw-strategies'>('all');
  const [cheatCodeSearch, setCheatCodeSearch] = useState<string>('');
  const [copiedCheatCodeId, setCopiedCheatCodeId] = useState<string | null>(null);

  const filteredCheatCodes = useMemo(() => {
    return CHEAT_CODES.filter((item) => {
      if (cheatCodeCategory !== 'all' && item.category !== cheatCodeCategory) return false;
      if (!cheatCodeSearch.trim()) return true;
      const q = cheatCodeSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.ruleSummary.toLowerCase().includes(q) ||
        item.detailedGuidance.toLowerCase().includes(q) ||
        (item.recommendedSyntax && item.recommendedSyntax.toLowerCase().includes(q)) ||
        (item.exampleSnippet && item.exampleSnippet.toLowerCase().includes(q))
      );
    });
  }, [cheatCodeCategory, cheatCodeSearch]);

  const handleCopyCheatCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCheatCodeId(id);
    setTimeout(() => setCopiedCheatCodeId(null), 2000);
  };

  // Sync tab and subject from URL if user visits /core-info?tab=formulas or /core-info?subject=rw etc.
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      const urlSubject = params.get('subject');
      if (urlTab) {
        setMainPageTab(normalizeTab(urlTab));
      }
      if (urlSubject === 'rw' || urlSubject === 'english' || urlSubject === 'reading-writing') {
        setImportantInfoSubject('rw');
      } else if (urlSubject === 'math') {
        setImportantInfoSubject('math');
      }
    }
  }, []);

  const handleSwitchTab = (tab: CoreInfoSubTab) => {
    setMainPageTab(tab);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSwitchSubject = (subj: 'math' | 'rw') => {
    setImportantInfoSubject(subj);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'important-info');
      url.searchParams.set('subject', subj);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Calculate struggle count per lesson
  const struggleCountByLesson = useMemo(() => {
    const map: Record<string, number> = {};
    stuckConcepts.forEach((sc) => {
      const key = sc.lessonTitle.toLowerCase();
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [stuckConcepts]);

  return (
    <motion.section
      id="section-core-info"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl shadow-grave hover:shadow-grave-hover p-5 sm:p-7 space-y-6 transition-all duration-300"
    >
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#a6c4a1]/50 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-800 text-white shadow-xs font-['JetBrains_Mono'] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Core Information & Blueprints</span>
            </span>
            <span className="text-xs text-emerald-950 font-black font-['JetBrains_Mono'] bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              HIGH PRIORITY &bull; MUST MASTER
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#122810] font-luxury flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-emerald-700" />
            <span>Core SAT Curriculum & Blueprints</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#274624] max-w-3xl leading-relaxed font-medium">
            Synchronized, lesson-by-lesson knowledge base covering all essential SAT Math concepts, formulas, dimensional analysis rules, factoring identities, volume reference sheet tips, extraneous radical warnings, and complete unit circle trigonometry.
          </p>
        </div>
      </div>

      {/* Main Sub-Page Switcher Tabs with Smooth Oval Pill Buttons (Zero Outline Clipping) */}
      <div className="flex items-center gap-3 border-b border-[#a6c4a1]/50 pb-4 pt-1.5 px-1.5 overflow-x-auto scrollbar-none">
        {/* 1. Important Info Button - Signature Forest Matcha Green */}
        <button
          type="button"
          onClick={() => handleSwitchTab('important-info')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer min-h-[44px] shrink-0 active:scale-95 ${
            mainPageTab === 'important-info'
              ? 'bg-[#122810] text-white border-2 border-emerald-500 shadow-md shadow-emerald-950/20'
              : 'bg-[#e5f0e1]/90 text-[#122810] border-2 border-[#a6c4a1] hover:bg-[#d7e5d2] hover:border-emerald-700'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${mainPageTab === 'important-info' ? 'text-emerald-400' : 'text-emerald-800'}`} />
          <span>Important Info</span>
        </button>

        {/* 2. Formulas Button - Bluish / Indigo Theme */}
        <button
          type="button"
          onClick={() => handleSwitchTab('formulas')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer min-h-[44px] shrink-0 active:scale-95 ${
            mainPageTab === 'formulas'
              ? 'bg-[#1e3a8a] text-white border-2 border-blue-400 shadow-md shadow-blue-950/20'
              : 'bg-blue-50/80 text-blue-950 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-400'
          }`}
        >
          <Calculator className={`w-4 h-4 ${mainPageTab === 'formulas' ? 'text-cyan-300' : 'text-blue-600'}`} />
          <span>Formulas</span>
        </button>

        {/* 3. Cheat Codes Button - Orangish / Amber / Yellowish Theme */}
        <button
          type="button"
          onClick={() => handleSwitchTab('cheat-codes')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer min-h-[44px] shrink-0 active:scale-95 ${
            mainPageTab === 'cheat-codes'
              ? 'bg-[#b45309] text-white border-2 border-amber-300 shadow-md shadow-amber-950/20'
              : 'bg-amber-50/80 text-amber-950 border-2 border-amber-200 hover:bg-amber-100 hover:border-amber-400'
          }`}
        >
          <Zap className={`w-4 h-4 ${mainPageTab === 'cheat-codes' ? 'text-amber-200 fill-amber-300' : 'text-amber-600 fill-amber-500'}`} />
          <span>Cheat Codes</span>
        </button>
      </div>

      {/* SUB-PAGE 1: IMPORTANT INFO (CORE CONCEPTS & LESSONS) */}
      {mainPageTab === 'important-info' && (
        <div className="space-y-6">
          {/* DUAL SUBJECT TAB SWITCHER (MATH VS READING & WRITING ENGLISH) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2 bg-[#f0f7ee] rounded-2xl border-2 border-[#a6c4a1] shadow-xs">
            <div className="flex items-center gap-2 p-1 bg-white/80 rounded-xl border border-[#a6c4a1] w-full sm:w-auto">
              {/* Tab 1: SAT Math */}
              <button
                type="button"
                onClick={() => handleSwitchSubject('math')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-black transition-all cursor-pointer font-['JetBrains_Mono'] ${
                  importantInfoSubject === 'math'
                    ? 'bg-[#1a3717] text-white shadow-sm border border-[#2b5825]'
                    : 'text-[#2a5025] hover:text-[#122810] hover:bg-[#d5e7d1]'
                }`}
              >
                <span>📐 SAT Math</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  importantInfoSubject === 'math' ? 'bg-[#2b5825] text-[#c9f6c2]' : 'bg-[#e2f0de] text-[#2a5025]'
                }`}>
                  4 Domains &bull; 37 Lessons
                </span>
              </button>

              {/* Tab 2: Reading & Writing (English) */}
              <button
                type="button"
                onClick={() => handleSwitchSubject('rw')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-black transition-all cursor-pointer font-['JetBrains_Mono'] ${
                  importantInfoSubject === 'rw'
                    ? 'bg-[#133b3e] text-white shadow-sm border border-[#22575c]'
                    : 'text-[#2a5025] hover:text-[#122810] hover:bg-[#d5e7d1]'
                }`}
              >
                <span>📖 Reading &amp; Writing (English)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  importantInfoSubject === 'rw' ? 'bg-[#22575c] text-[#cbf4f8]' : 'bg-[#e2f0de] text-[#2a5025]'
                }`}>
                  Units 2–4 &bull; Strategies
                </span>
              </button>
            </div>

            <div className="text-[11px] font-bold text-[#2d5528] flex items-center gap-1.5 px-2">
              <span className={`w-2 h-2 rounded-full ${importantInfoSubject === 'math' ? 'bg-emerald-600' : 'bg-teal-600'}`} />
              <span>
                {importantInfoSubject === 'math'
                  ? 'Showing core SAT Math curriculum, definitions, formulas & traps'
                  : 'Showing official Reading & Writing units, test steps, Bare-Bones method & traps'}
              </span>
            </div>
          </div>

          {/* MATH IMPORTANT INFO CONTENT */}
          {importantInfoSubject === 'math' && (
            <MathInfoSection
              stuckConcepts={stuckConcepts}
              struggleCountByLesson={struggleCountByLesson}
            />
          )}

        {/* READING & WRITING (ENGLISH) IMPORTANT INFO CONTENT */}
        {importantInfoSubject === 'rw' && (
          <ReadingWritingInfoSection />
        )}
      </div>
    )}

      {/* PAGE 2: FORMULA VAULT */}
      {mainPageTab === 'formulas' && (
        <div className="space-y-4">
          <FormulasSection />
        </div>
      )}

      {/* SUB-PAGE 3: CHEAT CODES (TACTICAL BLUEPRINTS) */}
      {mainPageTab === 'cheat-codes' && (
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="p-4 sm:p-5 bg-amber-500/10 backdrop-blur-md rounded-3xl border-2 border-amber-500/30 shadow-grave-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-black uppercase text-amber-950 font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full bg-amber-200/80 border border-amber-400">
                  ⚡ Bluebook Verified Shortcuts &amp; Tactics
                </span>
                <span className="text-xs font-bold text-amber-900 font-['JetBrains_Mono']">
                  {CHEAT_CODES.length} Tactics Memorized Cold
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#122810] font-luxury">
                Desmos 10× Speed Drills &amp; R&amp;W Blueprints
              </h3>
              <p className="text-xs text-[#274624] font-medium mt-0.5 max-w-2xl">
                Master the exact 8 Desmos regression shortcuts, 6 Reading &amp; Writing punctuation &amp; grammar rules, and 5 passage strategy blueprints. Everything is built directly on this page with zero popups.
              </p>
            </div>
          </div>

          {/* In-Page Filter Pills & Live Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-matcha-sub/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border-2 border-[#a6c4a1] shadow-grave-card">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <button
                type="button"
                onClick={() => setCheatCodeCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  cheatCodeCategory === 'all'
                    ? 'bg-[#122810] text-white shadow-xs'
                    : 'bg-matcha-input/80 text-[#122810] hover:bg-matcha-sub border border-[#a6c4a1]'
                }`}
              >
                All Codes ({CHEAT_CODES.length})
              </button>

              <button
                type="button"
                onClick={() => setCheatCodeCategory('desmos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  cheatCodeCategory === 'desmos'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100 border border-indigo-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
                <span>Desmos Math ({CHEAT_CODES.filter((c) => c.category === 'desmos').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setCheatCodeCategory('rw-grammar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  cheatCodeCategory === 'rw-grammar'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-amber-50/80 text-amber-950 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>R&amp;W Grammar ({CHEAT_CODES.filter((c) => c.category === 'rw-grammar').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setCheatCodeCategory('rw-strategies')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  cheatCodeCategory === 'rw-strategies'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-50/80 text-emerald-950 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strategies ({CHEAT_CODES.filter((c) => c.category === 'rw-strategies').length})</span>
              </button>
            </div>

            {/* Real-Time Live Search */}
            <div className="relative min-w-[200px] sm:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search shortcuts, syntax, rules..."
                value={cheatCodeSearch}
                onChange={(e) => setCheatCodeSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-matcha-input border border-[#a6c4a1] rounded-xl text-xs text-[#122810] placeholder:text-[#3d5a39] font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none backdrop-blur-md"
              />
            </div>
          </div>

          {/* Cards Grid */}
          {filteredCheatCodes.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-matcha-sub/80 border-2 border-dashed border-[#a6c4a1] text-xs font-bold text-[#274624]">
              No cheat codes match "{cheatCodeSearch}". Clear the search to view all {CHEAT_CODES.length} blueprints.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCheatCodes.map((item) => (
                <div
                  key={item.id}
                  className="p-5 ios-glass-card rounded-2xl border-2 border-[#a6c4a1] shadow-grave-card hover:shadow-grave-hover transition-all duration-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Category Pill & Title */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border font-['JetBrains_Mono'] ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-[#122810] font-luxury">
                      {item.title}
                    </h4>

                    {/* Summary Rule */}
                    <p className="text-xs text-[#122810] font-bold bg-matcha-sub/90 p-2.5 rounded-xl border border-[#a6c4a1]/70 leading-relaxed">
                      {item.ruleSummary}
                    </p>

                    {/* Detailed Guidance */}
                    <p className="text-xs text-[#274624] font-medium leading-relaxed">
                      {item.detailedGuidance}
                    </p>

                    {/* Recommended Syntax Block */}
                    {item.recommendedSyntax && (
                      <div className="relative group">
                        <pre className="text-xs p-3 bg-[#122810]/95 backdrop-blur-md text-emerald-300 rounded-xl font-mono border border-emerald-500/30 shadow-inner overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {item.recommendedSyntax}
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleCopyCheatCode(item.recommendedSyntax!, item.id)}
                          className="absolute right-2 top-2 p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer flex items-center gap-1 text-[10px] font-['JetBrains_Mono'] font-bold"
                          title="Copy syntax"
                        >
                          {copiedCheatCodeId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Worked Example / Blueprint */}
                    {item.exampleSnippet && (
                      <div className="p-3 rounded-xl bg-matcha-input/90 border-2 border-indigo-200/80 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-950 font-['JetBrains_Mono'] block">
                          Worked Example / Blueprint:
                        </span>
                        <p className="text-xs text-[#122810] font-medium leading-relaxed font-mono whitespace-pre-wrap">
                          {item.exampleSnippet}
                        </p>
                      </div>
                    )}

                    {/* College Board Trap Alert */}
                    {item.trapAlert && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-950 font-['JetBrains_Mono'] block">
                            College Board Trap Alert:
                          </span>
                          <p className="text-xs text-rose-950 font-semibold leading-snug">
                            {item.trapAlert}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
};
