'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Flame,
  CheckSquare,
  Compass,
  Layers,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import {
  OFFICIAL_MATH_DOMAINS,
  ALL_37_OFFICIAL_MATH_LESSONS,
  OfficialMathLesson,
  MathFormulaItem
} from '../data/mathCurriculumUpgrade';
import { StuckConceptRecord } from '../types';

interface MathInfoSectionProps {
  stuckConcepts?: StuckConceptRecord[];
  onLogStruggle?: (lessonTitle: string, conceptName?: string) => void;
  struggleCountByLesson?: Record<string, number>;
}

export const MathInfoSection: React.FC<MathInfoSectionProps> = ({
  stuckConcepts = [],
  onLogStruggle,
  struggleCountByLesson = {}
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Initialize all 37 lessons as expanded for immediate study accessibility
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ALL_37_OFFICIAL_MATH_LESSONS.forEach((lesson) => {
      initial[lesson.id] = true;
    });
    return initial;
  });

  const toggleLesson = (id: string) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter lessons based on selected domain and search query
  const filteredDomains = useMemo(() => {
    return OFFICIAL_MATH_DOMAINS.map((domain) => {
      if (selectedDomainId !== 'all' && domain.domainId !== selectedDomainId) {
        return null;
      }

      const matchingLessons = domain.lessons.filter((l) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchTitle = l.lessonTitle.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q);
        const matchFormulas = l.formulasAndRules.some(
          (f) => f.label.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q) || f.explanation.toLowerCase().includes(q)
        );
        const matchMethod = l.solvingMethod.toLowerCase().includes(q);
        const matchDiff =
          l.difficultyEscalation.foundations.description.toLowerCase().includes(q) ||
          l.difficultyEscalation.medium.description.toLowerCase().includes(q) ||
          l.difficultyEscalation.hard.description.toLowerCase().includes(q) ||
          (l.difficultyEscalation.foundations.example && l.difficultyEscalation.foundations.example.toLowerCase().includes(q)) ||
          (l.difficultyEscalation.medium.example && l.difficultyEscalation.medium.example.toLowerCase().includes(q)) ||
          (l.difficultyEscalation.hard.example && l.difficultyEscalation.hard.example.toLowerCase().includes(q));
        const matchDesmos = l.desmosHack && l.desmosHack.toLowerCase().includes(q);
        const matchConcepts = l.conceptsForLogging.some((c) => c.toLowerCase().includes(q));

        return matchTitle || matchFormulas || matchMethod || matchDiff || matchDesmos || matchConcepts;
      });

      if (matchingLessons.length === 0) return null;

      return {
        ...domain,
        lessons: matchingLessons
      };
    }).filter(Boolean) as typeof OFFICIAL_MATH_DOMAINS;
  }, [selectedDomainId, searchQuery]);

  const totalVisibleLessons = useMemo(() => {
    return filteredDomains.reduce((acc, d) => acc + d.lessons.length, 0);
  }, [filteredDomains]);

  return (
    <div className="space-y-7">
      {/* TOP HERO BANNER: 4 CORE DOMAINS & 3-TIER DIFFICULTY ARCHITECTURE */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#10240e] via-[#163313] to-[#20471b] rounded-3xl border-2 border-[#a6c4a1] shadow-grave text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/40 font-['JetBrains_Mono'] flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Official Khan Academy Digital SAT Math Blueprint</span>
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-['JetBrains_Mono']">
              ALL 4 DOMAINS &bull; 37 LESSONS COMPLETE
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-luxury flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-emerald-300" />
            <span>Complete Curriculum with 3-Tier Difficulty Scaling</span>
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed font-medium">
            Every official domain progresses through 3 difficulty tiers: <strong>Foundations</strong> (Units 2–5), repeated with increased complexity in <strong>Medium</strong> (Units 6–9), and synthesized into <strong>Advanced / Hard</strong> (Units 10–13). Every lesson includes formulas, solving methods, difficulty comparisons, and Desmos bypass shortcuts.
          </p>

          {/* 4 Domains Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-emerald-300 font-['JetBrains_Mono']">Domain 1: Algebra</div>
              <div className="text-sm font-black text-white">8 Lessons (Units 2, 6, 10)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-emerald-300 font-['JetBrains_Mono']">Domain 2: Data Analysis</div>
              <div className="text-sm font-black text-white">10 Lessons (Units 3, 7, 11)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-emerald-300 font-['JetBrains_Mono']">Domain 3: Advanced Math</div>
              <div className="text-sm font-black text-white">13 Lessons (Units 4, 8, 12)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-amber-300 font-['JetBrains_Mono']">Domain 4: Geometry &amp; Trig</div>
              <div className="text-sm font-black text-amber-200">6 Lessons (Units 5, 9, 13)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SEPARATE PROMINENT SEARCH BAR (POSITIONED FULLY ABOVE FILTER PILLS) */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800 pointer-events-none" />
        <input
          type="text"
          placeholder="Search all 37 lessons, formulas, solving methods, difficulty examples, Desmos hacks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-12 py-3 bg-white/95 border-2 border-[#a6c4a1] rounded-2xl text-xs sm:text-sm text-[#122810] placeholder:text-[#3d5a39]/70 font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none transition shadow-sm font-['JetBrains_Mono']"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-black font-mono cursor-pointer bg-slate-100 px-2 py-0.5 rounded-md"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. DEDICATED FULL-WIDTH DOMAIN NAVIGATION PILLS (ZERO CROPPING) */}
      <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 bg-matcha-sub/90 backdrop-blur-md rounded-2xl border-2 border-[#a6c4a1] shadow-grave-card w-full">
        <button
          type="button"
          onClick={() => setSelectedDomainId('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] ${
            selectedDomainId === 'all'
              ? 'bg-[#1a3717] text-white shadow-xs'
              : 'bg-white/90 text-[#122810] hover:bg-white border border-[#a6c4a1]'
          }`}
        >
          All 37 Lessons
        </button>

        {OFFICIAL_MATH_DOMAINS.map((dom) => (
          <button
            key={dom.domainId}
            type="button"
            onClick={() => setSelectedDomainId(dom.domainId)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] flex items-center gap-1.5 ${
              selectedDomainId === dom.domainId
                ? 'bg-[#1a3717] text-white shadow-xs'
                : 'bg-white/90 text-[#122810] hover:bg-white border border-[#a6c4a1]'
            }`}
          >
            <span>{dom.domainTitle.replace('Domain ', 'D')}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                selectedDomainId === dom.domainId ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {dom.lessons.length}
            </span>
          </button>
        ))}

        <div className="ml-auto text-xs font-bold text-[#2a5025] font-['JetBrains_Mono'] hidden md:block">
          Showing {totalVisibleLessons} of 37 Lessons
        </div>
      </div>

      {/* 3. LESSON ACCORDIONS BY DOMAIN */}
      <div className="space-y-8">
        {filteredDomains.map((domain) => (
          <div key={domain.domainId} className="space-y-4">
            {/* Domain Header Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#173815] to-[#255221] text-white rounded-2xl border-2 border-[#a6c4a1] shadow-grave flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600 font-['JetBrains_Mono']">
                    {domain.domainTitle}
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono">
                    Foundations: Unit {domain.foundationsUnit} &bull; Medium: Unit {domain.mediumUnit} &bull; Hard: Unit {domain.advancedUnit}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1 font-medium leading-relaxed">
                  {domain.description}
                </p>
              </div>
              <div className="text-[11px] font-bold px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 font-['JetBrains_Mono'] shrink-0">
                {domain.lessons.length} Lesson{domain.lessons.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Lessons Stream */}
            <div className="space-y-4">
              {domain.lessons.map((lesson) => {
                const isExpanded = expandedLessons[lesson.id] ?? true;
                const struggles = struggleCountByLesson[lesson.lessonTitle.toLowerCase()] || 0;

                return (
                  <div
                    key={lesson.id}
                    className="rounded-3xl border-2 border-[#a6c4a1] bg-white shadow-grave-card overflow-hidden transition-all duration-200"
                  >
                    {/* Lesson Header Accordion Toggle */}
                    <div
                      onClick={() => toggleLesson(lesson.id)}
                      className="p-4 sm:p-5 bg-[#f8faf7] hover:bg-[#f0f6ef] cursor-pointer transition flex items-center justify-between gap-3 border-b border-[#a6c4a1]/50 select-none"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="p-2 rounded-xl bg-[#1a3717] text-white font-mono text-xs font-black shadow-xs shrink-0">
                          {lesson.domainNumber}.{lesson.lessonNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base sm:text-lg font-black text-[#122810] font-luxury">
                              Lesson {lesson.lessonNumber} of {lesson.totalLessonsInDomain}: {lesson.lessonTitle}
                            </h4>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                              {lesson.badge}
                            </span>
                            {struggles > 0 && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 font-['JetBrains_Mono'] flex items-center gap-1">
                                <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
                                {struggles} logged struggle{struggles !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#2a5025] font-medium mt-0.5">
                            {lesson.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onLogStruggle && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLogStruggle(lesson.lessonTitle);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-900 border border-amber-400 hover:bg-amber-500 hover:text-white transition cursor-pointer font-['JetBrains_Mono'] hidden sm:inline-block"
                          >
                            + Log Struggle
                          </button>
                        )}
                        <button
                          type="button"
                          className="p-1.5 rounded-xl bg-white border border-[#a6c4a1] text-[#122810] hover:bg-[#e4ede1]"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Lesson Body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 sm:p-6 space-y-5"
                        >
                          {/* 1. Formulas & Rules Grid */}
                          <div className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono'] block">
                              Formulas &amp; Governing Rules
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {lesson.formulasAndRules.map((f, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="p-3.5 rounded-2xl bg-[#0f1f0e]/95 border border-emerald-500/30 space-y-2 shadow-xs"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-black uppercase text-emerald-300 font-['JetBrains_Mono']">
                                      {f.label}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(f.formula)}
                                      title="Copy formula"
                                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-[10px] font-mono"
                                    >
                                      {copiedText === f.formula ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-400" />
                                          <span className="text-emerald-400 font-bold">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 text-emerald-300" />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="p-2 rounded-xl bg-black/50 border border-emerald-400/20 font-['JetBrains_Mono'] text-xs sm:text-sm text-amber-200 font-bold overflow-x-auto">
                                    <code>{f.formula}</code>
                                  </div>
                                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-medium">
                                    {f.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Official Solving Method */}
                          <div className="p-4 rounded-2xl bg-[#f0f6ef] border-2 border-[#a6c4a1] space-y-1.5">
                            <span className="text-xs font-black uppercase text-[#122810] font-['JetBrains_Mono'] flex items-center gap-1.5">
                              <CheckSquare className="w-4 h-4 text-emerald-700" />
                              <span>Official Solving Method</span>
                            </span>
                            <p className="text-xs text-[#1e3c1a] font-medium leading-relaxed">
                              {lesson.solvingMethod}
                            </p>
                          </div>

                          {/* 3. 3-TIER DIFFICULTY ESCALATION BOX (FOUNDATIONS vs. MEDIUM vs. HARD) */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono'] flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-amber-600" />
                                <span>How This Question Scales Across Difficulty Tiers</span>
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Foundations ➔ Medium ➔ Advanced
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Foundations Tier */}
                              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-2 flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-['JetBrains_Mono']">
                                      {lesson.difficultyEscalation.foundations.unitLabel}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-800 font-mono">1-Step</span>
                                  </div>
                                  <p className="text-xs text-[#20401b] font-medium leading-relaxed">
                                    {lesson.difficultyEscalation.foundations.description}
                                  </p>
                                </div>
                                {lesson.difficultyEscalation.foundations.example && (
                                  <div className="p-2 rounded-xl bg-white border border-emerald-200 text-[11px] font-mono text-emerald-950 font-bold">
                                    💡 {lesson.difficultyEscalation.foundations.example}
                                  </div>
                                )}
                              </div>

                              {/* Medium Tier */}
                              <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-2 flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-['JetBrains_Mono']">
                                      {lesson.difficultyEscalation.medium.unitLabel}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-800 font-mono">2-Step</span>
                                  </div>
                                  <p className="text-xs text-[#3a2f0f] font-medium leading-relaxed">
                                    {lesson.difficultyEscalation.medium.description}
                                  </p>
                                </div>
                                {lesson.difficultyEscalation.medium.example && (
                                  <div className="p-2 rounded-xl bg-white border border-amber-200 text-[11px] font-mono text-amber-950 font-bold">
                                    💡 {lesson.difficultyEscalation.medium.example}
                                  </div>
                                )}
                              </div>

                              {/* Hard / Advanced Tier */}
                              <div className="p-3.5 rounded-2xl bg-rose-50/80 border-2 border-rose-300 space-y-2 flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 font-['JetBrains_Mono']">
                                      {lesson.difficultyEscalation.hard.unitLabel}
                                    </span>
                                    <span className="text-[10px] font-bold text-rose-800 font-mono">750+ Filter</span>
                                  </div>
                                  <p className="text-xs text-[#3d1318] font-medium leading-relaxed">
                                    {lesson.difficultyEscalation.hard.description}
                                  </p>
                                </div>
                                {lesson.difficultyEscalation.hard.example && (
                                  <div className="p-2 rounded-xl bg-white border border-rose-200 text-[11px] font-mono text-rose-950 font-bold">
                                    💡 {lesson.difficultyEscalation.hard.example}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 4. Desmos Hack Callout (Where Applicable) */}
                          {lesson.desmosHack && (
                            <div className="p-3.5 rounded-2xl bg-blue-50/90 border-2 border-blue-300 space-y-1.5 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase text-blue-900 font-['JetBrains_Mono'] flex items-center gap-1.5">
                                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                  <span>Desmos Speed Cheat (Bypass Long Algebra)</span>
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-mono">
                                  Calculator Hack
                                </span>
                              </div>
                              <p className="text-xs text-[#0f2d4a] font-medium leading-relaxed">
                                {lesson.desmosHack}
                              </p>
                            </div>
                          )}

                          {/* 5. Loggable Sub-Concepts Badge */}
                          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#345c2f] font-mono border-t border-[#a6c4a1]/40">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{lesson.conceptsForLogging.length} Loggable Sub-Concepts Connected to Calendar Struggle Tracker</span>
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {lesson.conceptsForLogging.slice(0, 3).map((concept, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#f0f6ef] border border-[#a6c4a1] text-[#122810]"
                                >
                                  {concept}
                                </span>
                              ))}
                              {lesson.conceptsForLogging.length > 3 && (
                                <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                                  +{lesson.conceptsForLogging.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
