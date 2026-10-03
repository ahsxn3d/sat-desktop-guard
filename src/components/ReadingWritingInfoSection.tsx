'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Zap,
  ArrowRight,
  Code,
  Scissors,
  CheckSquare,
  Compass,
  Layers,
  FileText,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import {
  READING_WRITING_UNITS,
  TRANSITION_CATEGORIES,
  BARE_BONES_STRATEGY,
  DIFFICULTY_SCALING_MATRIX,
  RWLesson,
  RWUnit
} from '../data/readingWritingCurriculum';

export const ReadingWritingInfoSection: React.FC = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpecialView, setActiveSpecialView] = useState<'all' | 'bare-bones' | 'transitions' | 'difficulty'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Expanded state for lessons
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    'rw-u2-l1-textual-evidence': true,
    'rw-u2-l2-quantitative-evidence': true,
    'rw-u2-l3-central-ideas': true,
    'rw-u2-l4-inferences': true,
    'rw-u3-l1-words-in-context': true,
    'rw-u3-l2-text-structure-purpose': true,
    'rw-u3-l3-cross-text-connections': true,
    'rw-u4-l1-transitions': true,
    'rw-u4-l2-rhetorical-synthesis': true,
    'rw-u4-l3-boundaries-grammar': true
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

  // Filter units and lessons based on selection and search
  const filteredUnits = useMemo(() => {
    return READING_WRITING_UNITS.map((unit) => {
      if (selectedUnitId !== 'all' && unit.id !== selectedUnitId) {
        return null;
      }

      const matchingLessons = unit.lessons.filter((l) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesTitle = l.lessonTitle.toLowerCase().includes(q);
        const matchesCategory = l.category.toLowerCase().includes(q);
        const matchesSteps = l.officialSteps.some(
          (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || (s.example && s.example.toLowerCase().includes(q))
        );
        const matchesTips = l.topTips.some((t) => t.title.toLowerCase().includes(q) || t.tip.toLowerCase().includes(q));
        const matchesTraps = l.trapsAndWarnings && l.trapsAndWarnings.some((tr) => tr.trapName.toLowerCase().includes(q) || tr.description.toLowerCase().includes(q));

        return matchesTitle || matchesCategory || matchesSteps || matchesTips || matchesTraps;
      });

      if (matchingLessons.length === 0) return null;

      return {
        ...unit,
        lessons: matchingLessons
      };
    }).filter(Boolean) as RWUnit[];
  }, [selectedUnitId, searchQuery]);

  return (
    <div className="space-y-7">
      {/* Top Banner & Overview */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#122810] via-[#1a3717] to-[#254f21] rounded-3xl border-2 border-[#a6c4a1] shadow-grave text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/40 font-['JetBrains_Mono'] flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>SAT Reading &amp; Writing (English) Knowledge Base</span>
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-['JetBrains_Mono']">
              UNITS 2, 3 &amp; 4 COMPLETE BLUEPRINT
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-luxury flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <span>Information &amp; Ideas, Craft &amp; Structure, Expression &amp; Conventions</span>
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed font-medium">
            Authoritative, official step-by-step methodologies, trap anatomies (False vs. True statement lures), transition categories, the Period = Semicolon rule, and the universal "Bare-Bones" protocol for non-native English speakers.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-emerald-300 font-['JetBrains_Mono']">Unit 2: Info &amp; Ideas</div>
              <div className="text-sm font-black text-white">4 Core Lessons</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-emerald-300 font-['JetBrains_Mono']">Unit 3: Craft &amp; Structure</div>
              <div className="text-sm font-black text-white">3 Core Lessons</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-emerald-300 font-['JetBrains_Mono']">Unit 4: Expression &amp; Rules</div>
              <div className="text-sm font-black text-white">3 Core Lessons</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] uppercase font-bold text-amber-300 font-['JetBrains_Mono']">Special Strategy</div>
              <div className="text-sm font-black text-amber-200">Bare-Bones Method</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SEPARATE PROMINENT SEARCH BAR (PLACED FULLY ABOVE FILTER PILLS) */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800 pointer-events-none" />
        <input
          type="text"
          placeholder="Search Reading & Writing lessons, official steps, top tips, trap warnings, grammar rules..."
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

      {/* 2. DEDICATED FULL-WIDTH NAVIGATION PILLS (FULL SPACE FOR NAMES - ZERO CROPPING) */}
      <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 bg-matcha-sub/90 backdrop-blur-md rounded-2xl border-2 border-[#a6c4a1] shadow-grave-card w-full">
        <button
          type="button"
          onClick={() => {
            setSelectedUnitId('all');
            setActiveSpecialView('all');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] ${
            selectedUnitId === 'all' && activeSpecialView === 'all'
              ? 'bg-[#1a3717] text-white shadow-xs'
              : 'bg-white/90 text-[#122810] hover:bg-white border border-[#a6c4a1]'
          }`}
        >
          All English Units (10 Lessons)
        </button>

        {READING_WRITING_UNITS.map((unit) => (
          <button
            key={unit.id}
            type="button"
            onClick={() => {
              setSelectedUnitId(unit.id);
              setActiveSpecialView('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] ${
              selectedUnitId === unit.id && activeSpecialView === 'all'
                ? 'bg-[#1a3717] text-white shadow-xs'
                : 'bg-white/90 text-[#122810] hover:bg-white border border-[#a6c4a1]'
            }`}
          >
            Unit {unit.unitNumber}: {unit.title.split('&')[0].trim()}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setActiveSpecialView('bare-bones');
            setSelectedUnitId('all');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] flex items-center gap-1.5 ${
            activeSpecialView === 'bare-bones'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Bare-Bones Method</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSpecialView('transitions');
            setSelectedUnitId('all');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] flex items-center gap-1.5 ${
            activeSpecialView === 'transitions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 text-indigo-950 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>5 Transition Types</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSpecialView('difficulty');
            setSelectedUnitId('all');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer font-['JetBrains_Mono'] flex items-center gap-1.5 ${
            activeSpecialView === 'difficulty'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-teal-50 text-teal-950 hover:bg-teal-100 border border-teal-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Difficulty Matrix</span>
        </button>
      </div>

      {/* SPECIAL FEATURE 1: UNIVERSAL NON-NATIVE SPEAKER STRATEGY ("BARE-BONES" METHOD) */}
      {(activeSpecialView === 'all' || activeSpecialView === 'bare-bones') && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#f4faf2] border-2 border-amber-300/80 shadow-grave space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs">
                <Zap className="w-5 h-5 fill-slate-950" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 font-['JetBrains_Mono'] block">
                  Universal Non-Native Speaker Strategy
                </span>
                <h4 className="text-lg font-black text-[#122810] font-luxury">
                  The "Bare-Bones" Method for Dense SAT Texts
                </h4>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-['JetBrains_Mono'] self-start sm:self-auto">
              Guaranteed Time Saver
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#274624] font-medium leading-relaxed">
            {BARE_BONES_STRATEGY.tagline}
          </p>

          {/* Bare-Bones Visual Logic Box */}
          <div className="p-4 rounded-2xl bg-[#122810] text-emerald-300 border border-emerald-500/40 font-mono text-xs shadow-inner overflow-x-auto">
            <div className="text-[10px] text-emerald-400/80 uppercase font-black tracking-wider mb-1">Core Sentence Engine Flow:</div>
            <pre className="text-xs sm:text-sm leading-relaxed whitespace-pre font-['JetBrains_Mono']">
{BARE_BONES_STRATEGY.codeFlow}
            </pre>
          </div>

          {/* 4 Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {BARE_BONES_STRATEGY.rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-2xl bg-white border-2 border-[#a6c4a1] shadow-xs space-y-2 hover:border-emerald-600 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center font-['JetBrains_Mono']">
                    {rule.number}
                  </span>
                  <h5 className="text-xs font-black text-[#122810] font-luxury">
                    {rule.title}
                  </h5>
                </div>
                <p className="text-xs text-[#274624] font-medium leading-relaxed">
                  {rule.action}
                </p>
                <div className="p-2.5 rounded-xl bg-[#f0f7ee] border border-[#a6c4a1]/60 text-[11px] font-bold text-[#1a3717] font-['JetBrains_Mono']">
                  💡 {rule.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPECIAL FEATURE 2: THE FIVE PRIMARY TRANSITION CATEGORIES */}
      {(activeSpecialView === 'all' || activeSpecialView === 'transitions') && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-indigo-200 shadow-grave space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-600 text-white font-black shadow-xs">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 font-['JetBrains_Mono'] block">
                  Unit 4 Mastery Tool
                </span>
                <h4 className="text-lg font-black text-[#122810] font-luxury">
                  The Five Primary Transition Categories
                </h4>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-900 font-['JetBrains_Mono']">
              ⚠️ Golden Rule: Eliminate Copycats Immediately!
            </div>
          </div>

          <p className="text-xs text-[#274624] font-medium leading-relaxed">
            If two answer choices belong to the exact same category (e.g. <em>Furthermore</em> and <em>Moreover</em>), both are automatically incorrect because neither can be uniquely right.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRANSITION_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl bg-[#f8faf8] border-2 border-[#a6c4a1] shadow-xs flex flex-col justify-between space-y-2 hover:border-emerald-600 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-[#122810] font-luxury">{cat.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                      {cat.words.length} words
                    </span>
                  </div>
                  <p className="text-[11px] text-[#345c2f] font-medium leading-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#a6c4a1]/50">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.words.map((word) => (
                      <span
                        key={word}
                        onClick={() => handleCopy(word)}
                        title="Click to copy word"
                        className="px-2 py-0.5 rounded-lg bg-white border border-[#a6c4a1] text-[#122810] text-[11px] font-bold font-['JetBrains_Mono'] hover:bg-emerald-100 hover:border-emerald-600 cursor-pointer active:scale-95 transition"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPECIAL FEATURE 3: DIFFICULTY SCALING MATRIX */}
      {(activeSpecialView === 'all' || activeSpecialView === 'difficulty') && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-teal-200 shadow-grave space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-teal-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-700 text-white font-black shadow-xs">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 font-['JetBrains_Mono'] block">
                  Adaptive SAT Digital Engine
                </span>
                <h4 className="text-lg font-black text-[#122810] font-luxury">
                  How Questions Scale Across Difficulty Levels
                </h4>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-300 font-['JetBrains_Mono']">
              Module 1 vs. Hard Module 2
            </span>
          </div>

          {/* Scaling Table */}
          <div className="overflow-x-auto rounded-2xl border-2 border-[#a6c4a1] shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#122810] text-white font-['JetBrains_Mono']">
                  <th className="p-3.5 font-black uppercase text-[11px] border-r border-emerald-900/60 min-w-[150px]">Question Type</th>
                  <th className="p-3.5 font-bold text-emerald-300 min-w-[200px] border-r border-emerald-900/60">Foundations Level</th>
                  <th className="p-3.5 font-bold text-amber-300 min-w-[220px] border-r border-emerald-900/60">Medium Level</th>
                  <th className="p-3.5 font-bold text-rose-300 min-w-[240px]">Advanced / Challenging Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#a6c4a1]/50 bg-white">
                {DIFFICULTY_SCALING_MATRIX.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f7fbf6]'}>
                    <td className="p-3.5 font-black text-[#122810] font-luxury border-r border-[#a6c4a1]/40">
                      {row.questionType}
                    </td>
                    <td className="p-3.5 text-[#274624] font-medium border-r border-[#a6c4a1]/40 leading-relaxed">
                      {row.foundationsLevel}
                    </td>
                    <td className="p-3.5 text-[#1a3717] font-medium border-r border-[#a6c4a1]/40 leading-relaxed">
                      {row.mediumLevel}
                    </td>
                    <td className="p-3.5 text-[#122810] font-bold leading-relaxed bg-rose-50/40">
                      {row.advancedLevel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LESSON STREAM BY UNITS */}
      {activeSpecialView === 'all' && (
        <div className="space-y-8">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="space-y-4">
              {/* Unit Banner */}
              <div className="p-4 sm:p-5 bg-matcha-sub-dark/70 backdrop-blur-md rounded-2xl border-2 border-[#a6c4a1] shadow-grave-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-['JetBrains_Mono'] shadow-xs">
                      Unit {unit.unitNumber}: {unit.badge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#122810] font-luxury">
                      {unit.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#274624] font-medium mt-1 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-[#355f30] font-['JetBrains_Mono'] shrink-0 bg-white/70 px-3 py-1 rounded-xl border border-[#a6c4a1]">
                  {unit.lessons.length} Lesson{unit.lessons.length !== 1 ? 's' : ''} in Unit
                </div>
              </div>

              {/* Lessons in this Unit */}
              <div className="grid grid-cols-1 gap-4">
                {unit.lessons.map((lesson) => {
                  const isExpanded = !!expandedLessons[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      className="ios-glass-card rounded-2xl border-2 border-[#a6c4a1] shadow-grave-card hover:shadow-grave-card-hover overflow-hidden transition-all duration-200"
                    >
                      {/* Lesson Header Accordion Toggle */}
                      <div
                        onClick={() => toggleLesson(lesson.id)}
                        className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer hover:bg-matcha-sub/70 transition select-none"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-300 font-['JetBrains_Mono']">
                              Unit {lesson.unitNumber} &bull; Lesson {lesson.lessonNumber}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-[#274624] border border-[#a6c4a1] font-['JetBrains_Mono']">
                              {lesson.category}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-[#122810] font-luxury">
                            {lesson.lessonTitle}
                          </h4>

                          {/* Quick summary line */}
                          {typeof lesson.whatTheSatTests === 'string' ? (
                            <p className="text-xs text-[#274624] font-medium mt-1 leading-relaxed">
                              <strong className="text-[#122810]">What the SAT Tests:</strong> {lesson.whatTheSatTests}
                            </p>
                          ) : (
                            <p className="text-xs text-[#274624] font-medium mt-1 leading-relaxed">
                              <strong className="text-[#122810]">What the SAT Tests:</strong> {lesson.whatTheSatTests.mainIdea || lesson.whatTheSatTests.purpose || 'Synthesizing core concepts and evaluating authorial craft.'}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0 text-[#3d5a39] pt-1">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 pt-0 border-t border-[#a6c4a1]/50 space-y-4 bg-matcha-sub/40 backdrop-blur-md">
                          {/* Traps & Warnings Box (If Present) */}
                          {lesson.trapsAndWarnings && lesson.trapsAndWarnings.length > 0 && (
                            <div className="p-4 rounded-xl bg-rose-50/90 border-2 border-rose-300 shadow-xs space-y-2 mt-3">
                              <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 uppercase font-['JetBrains_Mono']">
                                <AlertTriangle className="w-4 h-4 text-rose-600" />
                                <span>The Anatomy of Answer Traps</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {lesson.trapsAndWarnings.map((trap, tIdx) => (
                                  <div key={tIdx} className="p-2.5 rounded-lg bg-white border border-rose-200">
                                    <div className="text-xs font-black text-rose-900 font-luxury">{trap.trapName}</div>
                                    <div className="text-[11px] text-rose-800 font-medium mt-0.5 leading-relaxed">{trap.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Main Idea Rules Box (If Present) */}
                          {lesson.rules && lesson.rules.length > 0 && (
                            <div className="p-4 rounded-xl bg-amber-50/90 border-2 border-amber-300 shadow-xs space-y-2 mt-3">
                              <div className="text-xs font-black text-amber-950 uppercase font-['JetBrains_Mono'] flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4 text-amber-600" />
                                <span>Main Idea Rules</span>
                              </div>
                              {lesson.rules.map((rule, rIdx) => (
                                <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {rule.must && (
                                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                                      <span className="font-black text-emerald-950 block mb-1 font-['JetBrains_Mono']">✅ MUST:</span>
                                      <ul className="list-disc pl-4 space-y-0.5 text-emerald-900 font-medium">
                                        {rule.must.map((m, mIdx) => (
                                          <li key={mIdx}>{m}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {rule.mustNot && (
                                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                                      <span className="font-black text-rose-950 block mb-1 font-['JetBrains_Mono']">❌ MUST NOT:</span>
                                      <ul className="list-disc pl-4 space-y-0.5 text-rose-900 font-medium">
                                        {rule.mustNot.map((mn, mnIdx) => (
                                          <li key={mnIdx}>{mn}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Official Steps */}
                          {lesson.officialSteps && lesson.officialSteps.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono'] block">
                                Official Step-by-Step Method
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {lesson.officialSteps.map((step) => (
                                  <div
                                    key={step.stepNumber}
                                    className="p-3.5 bg-white/90 rounded-xl border border-[#a6c4a1] shadow-xs space-y-1.5"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full bg-[#1a3717] text-white text-[10px] font-black flex items-center justify-center font-['JetBrains_Mono']">
                                        {step.stepNumber}
                                      </span>
                                      <span className="text-xs font-black text-[#122810] font-luxury">
                                        {step.title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#274624] font-medium leading-relaxed">
                                      {step.description}
                                    </p>
                                    {step.example && (
                                      <div className="p-2 rounded-lg bg-[#f0f7ee] border border-[#a6c4a1]/50 text-[10px] text-[#1a3717] font-mono leading-tight">
                                        {step.example}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Special Section: Grammar & Boundaries Diff Callouts */}
                          {lesson.specialSection && lesson.specialSection.type === 'grammar-rules' && (
                            <div className="p-4 rounded-xl bg-white border-2 border-emerald-400 shadow-xs space-y-3">
                              <span className="text-xs font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono'] block">
                                Crucial Digital SAT Grammar Traps
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* The Period = Semicolon Rule */}
                                <div className="p-3.5 rounded-xl bg-[#f7fbf6] border border-[#a6c4a1] space-y-1.5">
                                  <span className="text-xs font-black text-[#122810] font-luxury block">
                                    The Period = Semicolon Rule
                                  </span>
                                  <p className="text-xs text-[#274624] font-medium leading-relaxed">
                                    On the digital SAT, a period (<strong>.</strong>) and a semicolon (<strong>;</strong>) perform the identical grammatical function of separating two independent clauses.
                                  </p>
                                  <div className="p-2 rounded-lg bg-rose-100 text-rose-950 font-bold text-[11px] font-['JetBrains_Mono']">
                                    ⚠️ If choices A and B are identical except that one uses a period and the other uses a semicolon, BOTH ARE INCORRECT. Cross them off immediately!
                                  </div>
                                </div>

                                {/* Dangling Modifiers */}
                                <div className="p-3.5 rounded-xl bg-[#f7fbf6] border border-[#a6c4a1] space-y-1.5">
                                  <span className="text-xs font-black text-[#122810] font-luxury block">
                                    Dangling Modifiers
                                  </span>
                                  <p className="text-xs text-[#274624] font-medium leading-relaxed">
                                    Any introductory modifying phrase must be immediately followed by the specific noun it describes.
                                  </p>
                                  <div className="space-y-1 text-xs">
                                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-medium">
                                      <span className="font-bold text-rose-950">❌ Incorrect:</span> Walking through the park, the flowers looked beautiful to Sarah.
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                                      <span className="font-bold text-emerald-950">✅ Correct:</span> Walking through the park, Sarah admired the beautiful flowers.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Top Tips from the Lesson */}
                          {lesson.topTips && lesson.topTips.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono'] block">
                                Top Tips from the Lesson
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {lesson.topTips.map((tip, tipIdx) => (
                                  <div
                                    key={tipIdx}
                                    className="p-3 rounded-xl bg-[#f0f7ee] border border-[#a6c4a1]/70 flex items-start gap-2"
                                  >
                                    <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-xs font-black text-[#122810] block">
                                        {tip.title}
                                      </span>
                                      <span className="text-[11px] text-[#274624] font-medium leading-normal">
                                        {tip.tip}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
