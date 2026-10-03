'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Luggage, 
  Laptop, 
  IdCard, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Coffee, 
  Moon, 
  Zap, 
  Printer, 
  Check,
  CreditCard,
  Calendar as CalendarIcon,
  Sun,
  Flame,
  MousePointer,
  TrendingDown,
  Compass,
  AlertOctagon,
  Target,
  RotateCcw
} from 'lucide-react';
import { PackingItem } from '@/types';
import { mergePackingListWithDefaults } from '@/data/studyPlan';
import { MatchaSelect } from './MatchaSelect';

interface ExamPrepSectionProps {
  items: PackingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (itemText: string, category?: string, rank?: number) => void;
  onDeleteItem?: (id: string) => void;
  onMarkAll?: (packed: boolean) => void;
  onResetDefault?: () => void;
}

type FilterRank = 'all' | 1 | 2 | 3 | 4 | 5;

export const ExamPrepSection: React.FC<ExamPrepSectionProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetDefault,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('essential');
  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [activeRankFilter, setActiveRankFilter] = useState<FilterRank>('all');
  const [activeTimelineTab, setActiveTimelineTab] = useState<'48h' | '24h'>('48h');

  // Intelligent merge ensures all 5 Ranks and 16 canonical items are ALWAYS present
  const canonicalItems = useMemo(() => {
    return mergePackingListWithDefaults(items);
  }, [items]);

  // Completed items count & percentage from guaranteed complete list
  const packedCount = canonicalItems.filter((i) => i.packed).length;
  const totalCount = canonicalItems.length;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim(), selectedCategory, selectedRank);
    setNewItemText('');
  };

  const filteredItems = useMemo(() => {
    if (activeRankFilter === 'all') return canonicalItems;
    return canonicalItems.filter((item) => item.rank === activeRankFilter);
  }, [canonicalItems, activeRankFilter]);

  // Group items by Rank for structured rendering when viewing 'all'
  const rankGroups = useMemo(() => {
    const groups: Record<number, { title: string; subtitle: string; icon: any; color: string; badgeColor: string; items: PackingItem[] }> = {
      1: {
        title: 'Rank 1: Gatekeeper Essentials (Life or Death)',
        subtitle: 'If you fail any of these, Crescent Model will turn you away at the gate, and your preparation becomes worthless.',
        icon: AlertOctagon,
        color: 'border-rose-300/80 bg-rose-50/40',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
        items: []
      },
      2: {
        title: 'Rank 2: Core Score Drivers (The 80/20 Rule)',
        subtitle: 'These three habits dictate 80% of your final score out of 1600. Non-negotiable daily execution.',
        icon: Target,
        color: 'border-indigo-300/80 bg-indigo-50/40',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        items: []
      },
      3: {
        title: 'Rank 3: Tactical Multipliers (Speed & Accuracy)',
        subtitle: 'These tools give you a decisive unfair edge on pacing, Desmos shortcuts, and question navigation.',
        icon: Zap,
        color: 'border-amber-300/80 bg-amber-50/40',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        items: []
      },
      4: {
        title: 'Rank 4: Biological Optimization (Test-Day Fuel)',
        subtitle: 'Neuro-fuel, deep REM sleep alignment, and physical stamina for peak cognitive firing speed.',
        icon: Coffee,
        color: 'border-emerald-300/80 bg-emerald-50/40',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        items: []
      },
      5: {
        title: 'Rank 5: Lowest Priority (Things Students Waste Time On)',
        subtitle: 'Energy drains and low-yield distractions. Avoid these so your stamina stays on real score gains.',
        icon: TrendingDown,
        color: 'border-slate-300/80 bg-slate-100/40',
        badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
        items: []
      }
    };

    canonicalItems.forEach((item) => {
      const r = item.rank || 1;
      if (groups[r]) {
        groups[r].items.push(item);
      } else {
        groups[1].items.push(item);
      }
    });

    return groups;
  }, [canonicalItems]);

  const getRankBadge = (rank?: number) => {
    switch (rank) {
      case 1:
        return {
          label: 'Rank 1: Gatekeeper',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: AlertOctagon
        };
      case 2:
        return {
          label: 'Rank 2: Core Driver',
          color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          icon: Target
        };
      case 3:
        return {
          label: 'Rank 3: Multiplier',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Zap
        };
      case 4:
        return {
          label: 'Rank 4: Bio-Fuel',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: Coffee
        };
      case 5:
        return {
          label: 'Rank 5: Wasteful/Avoid',
          color: 'bg-slate-200 text-slate-800 border-slate-300',
          icon: TrendingDown
        };
      default:
        return {
          label: 'Custom Item',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: Sparkles
        };
    }
  };

  return (
    <motion.section
      id="section-exam-prep"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl p-5 sm:p-7 shadow-grave hover:shadow-grave-hover space-y-7 transition-all duration-300"
    >
      {/* Top Banner: 48h & 24h Countdown & Packing Readiness Radial */}
      <div className="bg-gradient-to-r from-[#183615] via-[#21491d] to-[#122b10] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-[#a6c4a1]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 font-['JetBrains_Mono'] flex items-center gap-1.5 shadow-xs">
                <Luggage className="w-3.5 h-3.5 text-slate-950" />
                <span>Ranked SAT Exam Readiness Station</span>
              </span>
              <span className="text-xs font-bold text-emerald-300 font-['JetBrains_Mono'] bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                T-48h &bull; Thursday Nov 5 &amp; T-24h &bull; Friday Nov 6
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] tracking-tight text-white">
              Exam Prep &amp; Ranked Readiness Checklist
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Organized strictly from <strong>Rank 1 (Life-or-Death Gatekeeper Essentials)</strong> down to <strong>Rank 5 (Distractions to Avoid)</strong>. 
              Complete your physical packout 48 hours before (Thursday Nov 5) so Friday remains a 100% guilt-free buffer day.
            </p>
          </div>

          {/* Radial Packing Completion Counter */}
          <div className="flex items-center gap-4 sm:gap-5 bg-black/40 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shrink-0 shadow-inner self-start lg:self-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-black tracking-wider text-emerald-300 font-['JetBrains_Mono']">
                Checklist Complete
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-['JetBrains_Mono'] mt-0.5">
                {packedCount} / {totalCount}
              </div>
              <div className="text-[11px] font-bold text-amber-300">
                {percentage === 100 ? '✅ 100% Ready for Test Day' : `${totalCount - packedCount} items remaining`}
              </div>
            </div>

            {/* SVG Circular Progress Meter */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    percentage >= 100 
                      ? 'text-emerald-400' 
                      : percentage >= 60 
                      ? 'text-amber-400' 
                      : 'text-rose-400'
                  } transition-all duration-700 ease-out`}
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-['JetBrains_Mono'] font-black text-xs sm:text-sm text-white">
                {percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="mt-4 w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
          <div
            className={`h-full transition-all duration-500 ${
              percentage === 100
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                : 'bg-gradient-to-r from-amber-400 to-emerald-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Two Protocols: 48 Hours Before vs 24 Hours Before Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#a6c4a1]/50 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTimelineTab('48h')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTimelineTab === '48h'
                  ? 'bg-[#183615] text-white shadow-md'
                  : 'bg-[#d2e4cd]/70 text-[#183615] hover:bg-[#c2d7bd]'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>48 Hours Before (Thursday Nov 5): Packout</span>
            </button>
            <button
              onClick={() => setActiveTimelineTab('24h')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTimelineTab === '24h'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#d2e4cd]/70 text-[#183615] hover:bg-[#c2d7bd]'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>24 Hours Before (Friday Nov 6): Zero Study</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-600 font-['JetBrains_Mono']">
            Follow strictly to prevent test-day panic
          </span>
        </div>

        {/* Tab 1: 48 Hours (Thursday Nov 5) Protocol */}
        {activeTimelineTab === '48h' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="task-check-card calendar-date-neon-hover p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 shadow-2xs space-y-2 cursor-default">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase font-['JetBrains_Mono']">
                <Laptop className="w-4 h-4 text-indigo-700" />
                <span>1. Bluebook &amp; Device Setup</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Open Bluebook app. Complete <strong>Exam Setup</strong> to download your digital test ticket. Confirm battery charges to 100%. Disable OS auto-updates.
              </p>
              <div className="text-[10px] font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded border border-indigo-200 inline-block">
                Must be done on test device
              </div>
            </div>

            <div className="task-check-card calendar-date-neon-hover p-4 rounded-2xl bg-rose-50/80 border border-rose-200 shadow-2xs space-y-2 cursor-default">
              <div className="flex items-center gap-2 text-rose-900 font-black text-xs uppercase font-['JetBrains_Mono']">
                <Printer className="w-4 h-4 text-rose-700" />
                <span>2. Print 2 Copies of Admission Ticket</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Log into College Board portal. Print <strong>two paper physical copies</strong> of your Admission Ticket. Ensure your name matches your original Passport/Smart CNIC letter-by-letter.
              </p>
              <div className="text-[10px] font-bold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-200 inline-block">
                Digital phone tickets NOT accepted
              </div>
            </div>

            <div className="task-check-card calendar-date-neon-hover p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs space-y-2 cursor-default">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-xs uppercase font-['JetBrains_Mono']">
                <Luggage className="w-4 h-4 text-emerald-700" />
                <span>3. Pack Bag by 8:00 PM Thursday</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Place charger, mouse, mousepad, water bottle, ID, and admission ticket inside your backpack. Zip the bag and place it directly by the front entrance door.
              </p>
              <div className="text-[10px] font-bold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                Ready 36 hours in advance
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 24 Hours (Friday Nov 6) Zero-Study Protocol */}
        {activeTimelineTab === '24h' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="task-check-card calendar-date-neon-hover p-4 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-2xs space-y-2 cursor-default">
              <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase font-['JetBrains_Mono']">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>1. Zero Study Rule (Absolute Buffer)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Do NOT take practice tests, do not grind vocabulary, do not do late math sets. Research proves last-day cramming induces cognitive fatigue and elevates cortisol.
              </p>
              <div className="text-[10px] font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 inline-block">
                Protect working memory
              </div>
            </div>

            <div className="task-check-card calendar-date-neon-hover p-4 rounded-2xl bg-sky-50/80 border border-sky-200 shadow-2xs space-y-2 cursor-default">
              <div className="flex items-center gap-2 text-sky-950 font-black text-xs uppercase font-['JetBrains_Mono']">
                <Sun className="w-4 h-4 text-sky-700" />
                <span>2. Clean Fuel &amp; Hydration</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Hydrate consistently throughout Friday. Avoid excess caffeine or energy drinks after 2:00 PM. Have a balanced, low-glycemic dinner that settles easily.
              </p>
              <div className="text-[10px] font-bold text-sky-900 bg-sky-100/70 px-2 py-0.5 rounded border border-sky-200 inline-block">
                Avoid heavy or spicy meals
              </div>
            </div>

            <div className="task-check-card calendar-date-neon-hover p-4 rounded-2xl bg-purple-50/80 border border-purple-200 shadow-2xs space-y-2 cursor-default">
              <div className="flex items-center gap-2 text-purple-950 font-black text-xs uppercase font-['JetBrains_Mono']">
                <Moon className="w-4 h-4 text-purple-700" />
                <span>3. 10:00 PM Sleep Curfew</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Set two physical alarms for 6:15 AM Saturday morning. Put your phone outside arm&apos;s reach. Be in bed with lights out strictly by 10:00 PM for 8+ hours of REM sleep.
              </p>
              <div className="text-[10px] font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200 inline-block">
                REM sleep cements memory
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Ranked Prep Checklist */}
      <div className="space-y-5 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#d2e4cd]/60 p-4 rounded-2xl border border-[#a6c4a1]">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#122810] font-['Space_Grotesk'] flex items-center gap-2">
              <Luggage className="w-4 h-4 text-emerald-700" />
              <span>Official SAT Readiness &amp; Priority Checklist</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Ranked from life-or-death entry requirements down to time-wasters. Check off as you prepare.
            </p>
          </div>

          {/* Filter Rank Pills & Action Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveRankFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeRankFilter === 'all'
                  ? 'bg-[#183615] text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              All ({canonicalItems.length})
            </button>
            <button
              onClick={() => setActiveRankFilter(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeRankFilter === 1
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              Rank 1 ({rankGroups[1]?.items.length || 0})
            </button>
            <button
              onClick={() => setActiveRankFilter(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeRankFilter === 2
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              Rank 2 ({rankGroups[2]?.items.length || 0})
            </button>
            <button
              onClick={() => setActiveRankFilter(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeRankFilter === 3
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              Rank 3 ({rankGroups[3]?.items.length || 0})
            </button>
            <button
              onClick={() => setActiveRankFilter(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeRankFilter === 4
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              Rank 4 ({rankGroups[4]?.items.length || 0})
            </button>
            <button
              onClick={() => setActiveRankFilter(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeRankFilter === 5
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              Rank 5 ({rankGroups[5]?.items.length || 0})
            </button>

            {onResetDefault && (
              <button
                type="button"
                onClick={onResetDefault}
                title="Reset all checklist items to pristine 16 official items"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white/80 hover:bg-white hover:text-slate-950 border border-[#a6c4a1] transition cursor-pointer shadow-2xs ml-auto sm:ml-1"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset Defaults</span>
              </button>
            )}
          </div>
        </div>

        {/* Structured Sections by Rank */}
        {(activeRankFilter === 'all' ? [1, 2, 3, 4, 5] : [activeRankFilter]).map((rankNum) => {
          const group = rankGroups[rankNum as number];
          if (!group || group.items.length === 0) return null;
          const GroupIcon = group.icon;

          return (
            <div key={rankNum} className="space-y-3 pt-1">
              {/* Rank Group Header */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border-2 ${group.color} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-2xs`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/90 border border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                    <GroupIcon className="w-4 h-4 text-slate-800" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 font-['Space_Grotesk']">
                      {group.title}
                    </h4>
                    <p className="text-xs text-slate-700 font-medium">
                      {group.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border font-['JetBrains_Mono'] ${group.badgeColor}`}>
                    {group.items.filter(i => i.packed).length} / {group.items.length} Ready
                  </span>
                </div>
              </div>

              {/* Items in this Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.items.map((item) => {
                  const badge = getRankBadge(item.rank);
                  const BadgeIcon = badge.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`task-check-card calendar-date-neon-hover p-4 rounded-2xl border-2 cursor-pointer flex items-start justify-between gap-3 group select-none ${
                        item.packed
                          ? 'bg-emerald-100/70 border-emerald-400/80 shadow-2xs'
                          : 'bg-white/90 border-[#a6c4a1]/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={`task-check-dot w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            item.packed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border-2 border-slate-400 group-hover:border-emerald-600 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border font-['JetBrains_Mono'] ${badge.color}`}>
                              <BadgeIcon className="w-3 h-3" />
                              <span>{badge.label}</span>
                            </span>

                            {item.required && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-rose-800 bg-rose-100/80 border border-rose-300 px-1.5 py-0.5 rounded font-['JetBrains_Mono']">
                                Strictly Required
                              </span>
                            )}
                          </div>

                          <div
                            className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                              item.packed
                                ? 'line-through text-slate-500 font-medium'
                                : 'text-slate-900 group-hover:text-slate-950 font-bold'
                            }`}
                          >
                            {item.item}
                          </div>

                          {item.description && (
                            <p className={`text-xs leading-relaxed font-medium transition-colors ${
                              item.packed ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delete button if item is custom */}
                      {(item.id.startsWith('custom-') || item.id.startsWith('pack-custom-')) && onDeleteItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Add Custom Item Input Card */}
        <div className="p-4 rounded-2xl bg-matcha-sub border border-[#a6c4a1]/80 shadow-2xs">
          <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add personal checklist item (e.g. Eyeglass cleaning cloth, backup battery)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#a6c4a1] text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
            />

            <MatchaSelect
              value={selectedRank}
              onChange={(val) => setSelectedRank(Number(val))}
              options={[
                { value: 1, label: 'Rank 1: Gatekeeper', badge: 'Life/Death' },
                { value: 2, label: 'Rank 2: Core Driver', badge: '80/20' },
                { value: 3, label: 'Rank 3: Tactical', badge: 'Defense' },
                { value: 4, label: 'Rank 4: Bio-Fuel', badge: 'Energy' },
                { value: 5, label: 'Rank 5: Lowest Priority', badge: 'Low' },
              ]}
              variant="white"
              size="md"
            />

            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#183615] hover:bg-[#254f21] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black text-white transition cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
