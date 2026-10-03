'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Clock,
  Target,
  Brain,
  Zap,
  Coffee,
  Palette,
  Bot,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Compass,
  BookOpen,
  Calculator,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { DiagnosticProfile, DEFAULT_DIAGNOSTIC_PROFILE } from '../lib/roadmapGenerator';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface DiagnosticOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRoadmap: (profile: DiagnosticProfile) => void;
  initialProfile?: DiagnosticProfile;
  isAdmin?: boolean;
  onResetToAdminBlueprint?: () => void;
}

export const DiagnosticOnboardingModal: React.FC<DiagnosticOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveRoadmap,
  initialProfile = DEFAULT_DIAGNOSTIC_PROFILE,
  isAdmin = false,
  onResetToAdminBlueprint
}) => {
  useModalScrollLock(isOpen);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<DiagnosticProfile>({ ...initialProfile });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onSaveRoadmap(profile);
      setIsGenerating(false);
      onClose();
    }, 1200);
  };

  const toggleMathWeakness = (domain: string) => {
    setProfile((prev) => {
      const exists = prev.mathWeaknesses.includes(domain);
      const updated = exists ? prev.mathWeaknesses.filter((d) => d !== domain) : [...prev.mathWeaknesses, domain];
      return { ...prev, mathWeaknesses: updated };
    });
  };

  const toggleRWWeakness = (domain: string) => {
    setProfile((prev) => {
      const exists = prev.rwWeaknesses.includes(domain);
      const updated = exists ? prev.rwWeaknesses.filter((d) => d !== domain) : [...prev.rwWeaknesses, domain];
      return { ...prev, rwWeaknesses: updated };
    });
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#122810]/50 backdrop-blur-md overflow-y-auto overscroll-contain"
        onClick={onClose}
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="ios-glass-card rounded-3xl border-2 border-[#a6c4a1] bg-[#f4faf2]/95 text-[#122810] shadow-2xl max-w-2xl w-full overflow-hidden relative select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#20441d] to-[#142d12] text-[#f2f8f0] p-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#325f2d] text-amber-300 border border-[#488240] font-['JetBrains_Mono']">
                <Sparkles className="w-3 h-3 text-amber-300" />
                AI Roadmap Engine
              </span>
              <span className="text-xs text-[#a9cca4] font-['JetBrains_Mono']">
                Step {step} of {totalSteps}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Space_Grotesk'] leading-tight">
              Personalized SAT Study Map Setup
            </h3>
            <p className="mt-1 text-xs text-[#d2e4cd] leading-relaxed">
              Configure your exam timeline, weakness audit, rest days, and study velocity for a custom Phase 1 & 2 roadmap.
            </p>

            {/* Step Progress Bar */}
            <div className="w-full bg-[#173315] h-1.5 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[68vh] overflow-y-auto overscroll-contain">
            {/* STEP 1: Exam Date & Score Targets */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Target Digital SAT Exam Date
                  </label>
                  <input
                    type="date"
                    value={profile.targetExamDate}
                    onChange={(e) => setProfile({ ...profile, targetExamDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#a6c4a1] bg-white font-['JetBrains_Mono'] text-sm text-[#122810] focus:ring-2 focus:ring-[#3b6e35] focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { label: 'Nov 07, 2026', date: '2026-11-07' },
                      { label: 'Dec 05, 2026', date: '2026-12-05' },
                      { label: 'Mar 13, 2027', date: '2027-03-13' },
                      { label: 'May 01, 2027', date: '2027-05-01' }
                    ].map((preset) => (
                      <button
                        key={preset.date}
                        type="button"
                        onClick={() => setProfile({ ...profile, targetExamDate: preset.date })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-['JetBrains_Mono'] cursor-pointer transition-all ${
                          profile.targetExamDate === preset.date
                            ? 'bg-[#264e22] text-amber-300 border-[#264e22] font-bold shadow-xs'
                            : 'bg-white/80 text-[#264e22] border-[#a6c4a1] hover:bg-[#e2efe0]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#a6c4a1] shadow-xs">
                    <label className="text-xs font-black uppercase text-[#264e22] block mb-1 font-['JetBrains_Mono'] flex items-center justify-between">
                      <span>Baseline Score</span>
                      <span className="text-sm font-bold text-[#122810]">{profile.currentScore}</span>
                    </label>
                    <input
                      type="range"
                      min={600}
                      max={1500}
                      step={10}
                      value={profile.currentScore}
                      onChange={(e) => setProfile({ ...profile, currentScore: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#264e22] cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Your current score or diagnostic baseline.</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#a6c4a1] shadow-xs">
                    <label className="text-xs font-black uppercase text-[#264e22] block mb-1 font-['JetBrains_Mono'] flex items-center justify-between">
                      <span>Target Score</span>
                      <span className="text-sm font-bold text-amber-600">{profile.targetScore}+</span>
                    </label>
                    <input
                      type="range"
                      min={1200}
                      max={1600}
                      step={10}
                      value={profile.targetScore}
                      onChange={(e) => setProfile({ ...profile, targetScore: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Goal score for competitive university entry.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Time Capacity & Sprint Style */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Daily Study Commitment
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { min: 60, label: '60 Min', desc: 'Light / Express' },
                      { min: 90, label: '90 Min', desc: 'Balanced Pacing' },
                      { min: 120, label: '120 Min', desc: 'Recommended (Optimal)' },
                      { min: 150, label: '150+ Min', desc: 'Intensive Sprint' }
                    ].map((slot) => (
                      <button
                        key={slot.min}
                        type="button"
                        onClick={() => setProfile({ ...profile, dailyMinutes: slot.min })}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          profile.dailyMinutes === slot.min
                            ? 'bg-[#264e22] text-white border-[#264e22] shadow-sm'
                            : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                        }`}
                      >
                        <div className="font-bold text-sm">{slot.label}</div>
                        <div className={`text-[10px] ${profile.dailyMinutes === slot.min ? 'text-[#c2dfbd]' : 'text-gray-500'}`}>
                          {slot.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Lesson Sprint Architecture
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, sprintDuration: 'sprint_25' })}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        profile.sprintDuration === 'sprint_25'
                          ? 'bg-[#264e22] text-white border-[#264e22] shadow-sm'
                          : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-400" />
                        25-Min Sprints + 15-Min Breaks
                      </div>
                      <div className={`text-xs mt-1 leading-relaxed ${profile.sprintDuration === 'sprint_25' ? 'text-[#d0e6cc]' : 'text-gray-600'}`}>
                        Authentic Anti-Burnout Rulebook style. Rapid high-intensity bursts with mandatory screen-free breaks.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, sprintDuration: 'deep_45' })}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        profile.sprintDuration === 'deep_45'
                          ? 'bg-[#264e22] text-white border-[#264e22] shadow-sm'
                          : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-purple-400" />
                        45-Min Deep Dive Blocks
                      </div>
                      <div className={`text-xs mt-1 leading-relaxed ${profile.sprintDuration === 'deep_45' ? 'text-[#d0e6cc]' : 'text-gray-600'}`}>
                        Longer continuous focus sessions with fewer breaks, ideal for complex advanced problem solving.
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Daily Study Start Anchor Time
                  </label>
                  <input
                    type="time"
                    value={profile.anchorTime}
                    onChange={(e) => setProfile({ ...profile, anchorTime: e.target.value })}
                    className="p-3 rounded-xl border border-[#a6c4a1] bg-white font-['JetBrains_Mono'] text-sm text-[#122810] focus:ring-2 focus:ring-[#3b6e35] focus:outline-none"
                  />
                  <span className="text-xs text-gray-500 ml-3">E.g., 18:30 (6:30 PM)</span>
                </div>
              </div>
            )}

            {/* STEP 3: Designated Rest / Buffer Day */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-500" />
                    Designated Weekly Rest & Recovery Day
                  </label>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    Zero study load is assigned on this day to prevent cognitive burnout and ensure neurological memory consolidation.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { day: 0, label: 'Sunday', sub: 'Standard Rest' },
                      { day: 5, label: 'Friday', sub: 'Jummah / Weekend' },
                      { day: 6, label: 'Saturday', sub: 'Weekend Rest' },
                      { day: 1, label: 'Monday', sub: 'Weekday Reset' }
                    ].map((b) => (
                      <button
                        key={b.day}
                        type="button"
                        onClick={() => setProfile({ ...profile, bufferDayOfWeek: b.day })}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          profile.bufferDayOfWeek === b.day
                            ? 'bg-[#264e22] text-white border-[#264e22] shadow-sm'
                            : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                        }`}
                      >
                        <div className="font-bold text-sm">{b.label}</div>
                        <div className={`text-[10px] ${profile.bufferDayOfWeek === b.day ? 'text-[#c2dfbd]' : 'text-gray-500'}`}>
                          {b.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#e3efe0] border border-[#a6c4a1]/70 text-xs text-[#1e3f1b] leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#264e22] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">The Rule of Buffer Days:</span> Unfinished tasks from previous days can dynamically roll over to your buffer day without derailing the rest of your study plan.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Math Domain Weaknesses */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-1 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-blue-600" />
                    Select Your Math Struggle Areas
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Selected domains will be prioritized and assigned extra review drills in your Phase 1 plan.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'algebra',
                        title: 'Algebra (Units 2, 6, 10)',
                        desc: 'Linear equations, inequalities, systems of equations, and constraint word problems.'
                      },
                      {
                        id: 'advanced_math',
                        title: 'Advanced Math (Units 4, 8, 12)',
                        desc: 'Quadratics, polynomials, rational exponents, factoring, and nonlinear functions.'
                      },
                      {
                        id: 'problem_solving',
                        title: 'Problem Solving & Data Analysis (Units 3, 7, 11)',
                        desc: 'Percentages, ratios, unit conversion, scatterplots, distributions, and probability.'
                      },
                      {
                        id: 'geometry_trig',
                        title: 'Geometry & Trigonometry (Units 5, 9, 13)',
                        desc: 'Area, volume, triangle similarity, circle equations, and right triangle trigonometry.'
                      }
                    ].map((item) => {
                      const isSelected = profile.mathWeaknesses.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleMathWeakness(item.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-[#264e22] text-white border-[#264e22] shadow-xs'
                              : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-400 border-amber-300 text-[#122810]' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{item.title}</div>
                            <div className={`text-xs mt-0.5 ${isSelected ? 'text-[#d0e6cc]' : 'text-gray-500'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Reading & Writing Weaknesses */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-1 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Select Your Reading & Writing Struggle Areas
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Targeted passage dissecting drills and grammar checklists will be generated for these areas.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'information_ideas',
                        title: 'Information and Ideas (Units 2, 5, 8)',
                        desc: 'Central ideas, scientific inferences, textual evidence, and quantitative data charts.'
                      },
                      {
                        id: 'craft_structure',
                        title: 'Craft and Structure (Units 3, 6, 9)',
                        desc: 'Words in context, paragraph rhetorical purpose, and dual-passage cross-text connections.'
                      },
                      {
                        id: 'conventions',
                        title: 'Standard English Conventions (Units 11, 12)',
                        desc: 'Clause boundaries, comma splices, semicolons, subject-verb agreement, and dangling modifiers.'
                      },
                      {
                        id: 'expression_ideas',
                        title: 'Expression of Ideas (Units 4, 7, 10)',
                        desc: 'Logical transitions and goal-driven rhetorical synthesis notes.'
                      }
                    ].map((item) => {
                      const isSelected = profile.rwWeaknesses.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleRWWeakness(item.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-[#264e22] text-white border-[#264e22] shadow-xs'
                              : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-400 border-amber-300 text-[#122810]' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{item.title}</div>
                            <div className={`text-xs mt-0.5 ${isSelected ? 'text-[#d0e6cc]' : 'text-gray-500'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: AI Models & Theme Personalization */}
            {step === 6 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-500" />
                    AI Tutor Model Engine
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'gemini', title: 'Gemini 1.5 (Built-in)', desc: 'Fast, native explanations & Desmos hacks.' },
                      { id: 'openai', title: 'OpenAI / ChatGPT', desc: 'Custom Bring-Your-Own API Key support.' },
                      { id: 'custom_models', title: 'Custom 3 Models', desc: 'Specialized Math, R&W & Error fine-tuned models.' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, aiProvider: m.id as any })}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          profile.aiProvider === m.id
                            ? 'bg-[#264e22] text-white border-[#264e22] shadow-xs'
                            : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                        }`}
                      >
                        <div className="font-bold text-xs">{m.title}</div>
                        <div className={`text-[10px] mt-1 ${profile.aiProvider === m.id ? 'text-[#c2dfbd]' : 'text-gray-500'}`}>
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#264e22] block mb-2 font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Theme & Typography
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'matcha', label: 'Forest Matcha' },
                      { id: 'dark', label: 'OLED Obsidian' },
                      { id: 'midnight', label: 'Midnight Slate' }
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, theme: th.id })}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                          profile.theme === th.id
                            ? 'bg-[#264e22] text-amber-300 border-[#264e22]'
                            : 'bg-white text-[#122810] border-[#a6c4a1] hover:bg-[#e2efe0]'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

                {isAdmin && onResetToAdminBlueprint && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold">Admin Privileges Active:</span> You can switch back to the Master 57-Day Blueprint anytime.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onResetToAdminBlueprint();
                        onClose();
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Reset to Master Blueprint
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 bg-white/70 border-t border-[#a6c4a1]/50 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#a6c4a1] text-xs font-bold text-[#264e22] hover:bg-[#e2efe0] cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#264e22] to-[#183915] text-amber-300 font-bold text-xs uppercase tracking-wider font-['JetBrains_Mono'] hover:brightness-110 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  Generating Roadmap...
                </>
              ) : step === totalSteps ? (
                <>
                  <Award className="w-4 h-4 text-amber-300" />
                  Generate My Study Map
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
