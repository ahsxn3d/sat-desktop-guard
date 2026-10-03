import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Coffee, 
  Trophy, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  X,
  FileText,
  Target,
  Layers,
  ArrowUpRight,
  Zap,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { DayPlan, TaskItem, DaySessionTiming, TaskTimingRecord } from '../types';
import { getDayLoadDifficulty, DayLoadDifficulty, DIFFICULTY_CONFIGS, cleanSkillLabel } from '../utils/difficulty';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface InteractiveCalendarProps {
  allDays: DayPlan[];
  completedTaskIds: Record<string, boolean>;
  onToggleTask: (dayId: string, taskId: string) => void;
  onLaunchTimer?: (dayTitle: string, dateStr?: string) => void;
  onSaveNotes: (dayId: string, notes: string) => void;
  dayNotes: Record<string, string>;
  sessionTimings?: Record<string, DaySessionTiming>;
  onDeleteSessionTiming?: (dateStr: string) => void;
  onSelectDay?: (dateStr: string) => void;
  taskTimings?: Record<string, TaskTimingRecord>;
  onOpenStruggleModal?: (day: DayPlan) => void;
  stuckConcepts?: import('../types').StuckConceptRecord[];
  onToggleBufferDay?: (dateStr: string) => void;
}

type CalendarMonth = 'all' | '2026-09' | '2026-10' | '2026-11';

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  allDays,
  completedTaskIds,
  onToggleTask,
  onLaunchTimer,
  onSaveNotes,
  dayNotes,
  sessionTimings = {},
  onDeleteSessionTiming,
  onSelectDay,
  taskTimings = {},
  onOpenStruggleModal,
  stuckConcepts = [],
  onToggleBufferDay,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<CalendarMonth>('2026-09');
  const [activeInspectDayId, setActiveInspectDayId] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DayLoadDifficulty>('all');

  // Days map by dateStr for quick lookup
  const daysByDate = useMemo(() => {
    const map = new Map<string, DayPlan>();
    allDays.forEach((d) => map.set(d.dateStr, d));
    return map;
  }, [allDays]);

  // Overall process completion stats
  const calendarStats = useMemo(() => {
    const totalDays = allDays.length;
    let completedDaysCount = 0;
    let inProgressDaysCount = 0;
    let totalTasksCount = 0;
    let completedTasksCount = 0;

    allDays.forEach((day) => {
      const dayTasks = day.tasks;
      totalTasksCount += dayTasks.length;
      const done = dayTasks.filter((t) => completedTaskIds[t.id]).length;
      completedTasksCount += done;

      if (dayTasks.length > 0 && done === dayTasks.length) {
        completedDaysCount++;
      } else if (done > 0) {
        inProgressDaysCount++;
      }
    });

    const percent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
    return {
      totalDays,
      completedDaysCount,
      inProgressDaysCount,
      totalTasksCount,
      completedTasksCount,
      percent,
    };
  }, [allDays, completedTaskIds]);

  // Active inspected day
  const inspectedDay = useMemo(() => {
    if (!activeInspectDayId) return null;
    return daysByDate.get(activeInspectDayId) || null;
  }, [activeInspectDayId, daysByDate]);

  // Lock background scroll when inspecting a day modal
  useModalScrollLock(!!inspectedDay);

  // Months configuration for the study window
  const monthsData = useMemo(() => {
    return [
      {
        key: '2026-09' as CalendarMonth,
        name: 'September 2026',
        subtitle: 'Kickoff & Problem Solving Foundations (Weeks 1–3)',
        year: 2026,
        month: 8, // 0-indexed: Sep is 8
        daysInMonth: 30,
        startDayOffset: 2, // Sep 1, 2026 is Tuesday (0=Sun, 1=Mon, 2=Tue)
      },
      {
        key: '2026-10' as CalendarMonth,
        name: 'October 2026',
        subtitle: 'Advanced Algebra, Geometry & Bluebook Arena Kickoff',
        year: 2026,
        month: 9, // Oct is 9
        daysInMonth: 31,
        startDayOffset: 4, // Oct 1, 2026 is Thursday
      },
      {
        key: '2026-11' as CalendarMonth,
        name: 'November 2026',
        subtitle: 'Peak Tapering & Saturday Nov 7 SAT Paper Exam Day',
        year: 2026,
        month: 10, // Nov is 10
        daysInMonth: 30,
        startDayOffset: 0, // Nov 1, 2026 is Sunday
      },
    ];
  }, []);

  const activeMonthConfig = useMemo(() => {
    return monthsData.find((m) => m.key === selectedMonth) || monthsData[0];
  }, [selectedMonth, monthsData]);

  // Generate calendar grid dates for the active month
  const gridCells = useMemo(() => {
    if (selectedMonth === 'all') return [];

    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
    const { year, month, daysInMonth, startDayOffset } = activeMonthConfig;

    // Days from previous month for padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startDayOffset - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, prevDay);
      const dateStr = prevDate.toISOString().split('T')[0];
      cells.push({ dateStr, dayNum: prevDay, isCurrentMonth: false });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      // Format as YYYY-MM-DD
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Trailing days to fill the 7-day row
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const nextDate = new Date(year, month + 1, d);
        const dateStr = nextDate.toISOString().split('T')[0];
        cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
      }
    }

    return cells;
  }, [selectedMonth, activeMonthConfig]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.section 
      id="section-calendar" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl shadow-grave hover:shadow-grave-hover p-4 sm:p-7 space-y-6 transition-all duration-300"
    >
      
      {/* Calendar Header with Live Progress Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#bfd5bb] pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs hover:scale-105 transition-transform duration-200 cursor-default">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Full Study Calendar</span>
            </span>
            <span className="text-xs font-['JetBrains_Mono'] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
              57-Day Anti-Burnout Roadmap
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs hover:scale-105 transition-transform duration-200 cursor-default">
              <Target className="w-3.5 h-3.5 text-amber-200" />
              <span>D-Day: Nov 7 Exam</span>
            </span>
          </div>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950 font-luxury">
            Master Progress Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl mt-1 leading-relaxed">
            Click any day to inspect lessons, review study windows, and toggle tasks directly. Every day calculates and shows exact process completion.
          </p>
        </div>

        {/* Real Tracker Completion Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2.5 bg-[#254928] text-white p-3 rounded-2xl border border-[#407444] shadow-grave-card hover:shadow-grave-card-hover transition-all duration-200 shrink-0">
          <div className="text-center px-2">
            <div className="text-[10px] font-bold uppercase text-emerald-200/80 font-['JetBrains_Mono']">
              Overall Done
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-300 font-['JetBrains_Mono']">
              {calendarStats.percent}%
            </div>
            <div className="text-[10px] text-emerald-200/70 font-semibold font-['JetBrains_Mono']">
              {calendarStats.completedTasksCount}/{calendarStats.totalTasksCount}
            </div>
          </div>

          <div className="text-center px-2 border-x border-[#407444]">
            <div className="text-[10px] font-bold uppercase text-emerald-200/80 font-['JetBrains_Mono']">
              Days 100%
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-300 font-['JetBrains_Mono']">
              {calendarStats.completedDaysCount}
            </div>
            <div className="text-[10px] text-emerald-200/70 font-semibold font-['JetBrains_Mono']">
              of {calendarStats.totalDays} Days
            </div>
          </div>

          <div className="text-center px-2">
            <div className="text-[10px] font-bold uppercase text-amber-300 font-['JetBrains_Mono'] flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Exam Date</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-400 font-['JetBrains_Mono']">
              NOV 7
            </div>
            <div className="text-[9px] text-amber-200 font-bold uppercase">
              Paper Day
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigation Tabs & View Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-matcha-sub p-2.5 rounded-2xl border border-[#a6c4a1]/70 shadow-xs">
        
        {/* Month Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {monthsData.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 hover:shadow-xs active:scale-[0.98] cursor-pointer ${
                selectedMonth === m.key
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-matcha-input text-slate-800 hover:text-slate-950 hover:bg-matcha-sub border border-[#a6c4a1]/60'
              }`}
            >
              <span>{m.name.split(' ')[0]}</span>
              {m.key === '2026-11' && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shadow-xs">
                  SAT Nov 7
                </span>
              )}
            </button>
          ))}

          <button
            onClick={() => setSelectedMonth('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 hover:shadow-xs active:scale-[0.98] cursor-pointer ${
              selectedMonth === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-matcha-input text-slate-800 hover:text-slate-950 hover:bg-matcha-sub border border-[#a6c4a1]/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full 57-Day View</span>
          </button>
        </div>

        {/* Quick Jump Shortcuts */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setSelectedMonth('2026-09');
              setActiveInspectDayId('2026-09-14');
            }}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:shadow-xs px-3 py-1.5 rounded-xl border border-indigo-200 transition-all duration-150 flex items-center gap-1 cursor-pointer active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Day 1 (Sep 14)</span>
          </button>

          <button
            onClick={() => {
              setSelectedMonth('2026-11');
              setActiveInspectDayId('2026-11-07');
            }}
            className="text-xs font-black text-rose-900 bg-amber-100 hover:bg-amber-200 hover:shadow-xs px-3 py-1.5 rounded-xl border border-amber-300 transition-all duration-150 flex items-center gap-1 cursor-pointer active:scale-[0.98]"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Nov 7 Exam</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MONTH GRID VIEW                                              */}
      {/* ============================================================ */}
      {selectedMonth !== 'all' ? (
        <div className="space-y-3">
          {/* Active Month Title banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-1">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-luxury flex items-center gap-2">
                <span>{activeMonthConfig.name}</span>
                {selectedMonth === '2026-11' && (
                  <span className="text-xs font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Official Exam Month
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {activeMonthConfig.subtitle}
              </p>
            </div>

            {/* Interactive Color Difficulty Filter Bar (Khan Academy Tiers) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase text-slate-500 font-['JetBrains_Mono'] mr-1">
                Tier:
              </span>
              <button
                onClick={() => setDifficultyFilter(difficultyFilter === 'foundations' ? 'all' : 'foundations')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-['JetBrains_Mono'] border transition-all cursor-pointer flex items-center gap-1 ${
                  difficultyFilter === 'foundations'
                    ? 'bg-emerald-300 text-emerald-950 border-emerald-500 shadow-xs ring-2 ring-emerald-400/50'
                    : 'bg-emerald-100/90 text-emerald-950 border-emerald-300 hover:bg-emerald-200'
                }`}
                title="Filter for Foundations Tier (Math U2–U5 & R&W U2–U4)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>🌱 Foundations</span>
              </button>
              <button
                onClick={() => setDifficultyFilter(difficultyFilter === 'medium' ? 'all' : 'medium')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-['JetBrains_Mono'] border transition-all cursor-pointer flex items-center gap-1 ${
                  difficultyFilter === 'medium'
                    ? 'bg-amber-300 text-amber-950 border-amber-500 shadow-xs ring-2 ring-amber-400/50'
                    : 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200'
                }`}
                title="Filter for Medium Tier (Math U6–U9 & R&W U5–U10, U12)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                <span>🎯 Medium</span>
              </button>
              <button
                onClick={() => setDifficultyFilter(difficultyFilter === 'challenge' ? 'all' : 'challenge')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-['JetBrains_Mono'] border transition-all cursor-pointer flex items-center gap-1 ${
                  difficultyFilter === 'challenge'
                    ? 'bg-purple-300 text-purple-950 border-purple-500 shadow-xs ring-2 ring-purple-400/50'
                    : 'bg-purple-100/90 text-purple-950 border-purple-300 hover:bg-purple-200'
                }`}
                title="Filter for Challenge Unit (R&W Unit 11)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                <span>⚡ Challenge</span>
              </button>
              <button
                onClick={() => setDifficultyFilter(difficultyFilter === 'advanced' ? 'all' : 'advanced')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-['JetBrains_Mono'] border transition-all cursor-pointer flex items-center gap-1 ${
                  difficultyFilter === 'advanced'
                    ? 'bg-rose-300 text-rose-950 border-rose-500 shadow-xs ring-2 ring-rose-400/50'
                    : 'bg-rose-100/90 text-rose-950 border-rose-300 hover:bg-rose-200'
                }`}
                title="Filter for Advanced / Hard Tier (Math U10–U13)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>🔥 Advanced</span>
              </button>
              <button
                onClick={() => setDifficultyFilter(difficultyFilter === 'test' ? 'all' : 'test')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-['JetBrains_Mono'] border transition-all cursor-pointer flex items-center gap-1 ${
                  difficultyFilter === 'test'
                    ? 'bg-sky-300 text-sky-950 border-sky-500 shadow-xs ring-2 ring-sky-400/50'
                    : 'bg-sky-100/90 text-sky-950 border-sky-300 hover:bg-sky-200'
                }`}
                title="Filter for Bluebook Practice Tests"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                <span>📝 Mock Exam</span>
              </button>
              <button
                onClick={() => setDifficultyFilter(difficultyFilter === 'rest' ? 'all' : 'rest')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-['JetBrains_Mono'] border transition-all cursor-pointer flex items-center gap-1 ${
                  difficultyFilter === 'rest'
                    ? 'bg-slate-300 text-slate-950 border-slate-500 shadow-xs ring-2 ring-slate-400/50'
                    : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
                title="Filter for Rest days"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>🌴 Rest</span>
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={`py-2 text-xs font-black uppercase font-['JetBrains_Mono'] tracking-wider rounded-xl ${
                  idx === 0
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' // Sunday
                    : idx === 6
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' // Saturday
                    : 'bg-matcha-sub text-slate-800 border border-[#a6c4a1]/60'
                }`}
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Grid of Calendar Days */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {gridCells.map((cell, idx) => {
              const dayPlan = daysByDate.get(cell.dateStr);
              const isExamDay = cell.dateStr === '2026-11-07';
              const isKickoffDay = cell.dateStr === '2026-09-12';
              const isTodayOrKickoff = isKickoffDay;

              if (!cell.isCurrentMonth) {
                // Out-of-month cell (e.g. Aug 30, Aug 31) - crisp and clearly legible
                const isAug = cell.dateStr.startsWith('2026-08');
                return (
                  <div
                    key={`${cell.dateStr}-${idx}`}
                    className="min-h-[82px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl bg-matcha-sub/60 border border-[#a6c4a1]/50 select-none flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black font-['JetBrains_Mono'] text-slate-500">
                        {isAug ? `Aug ${cell.dayNum}` : cell.dayNum}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase font-['JetBrains_Mono'] text-slate-400">
                        Prior Mo
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 font-['JetBrains_Mono']">
                      Off-Plan
                    </div>
                  </div>
                );
              }

              if (!dayPlan) {
                // Pre-kickoff days in September (Sep 1 to Sep 11) - clear, crisp, non-blurry
                const isKickoffEve = cell.dayNum === 11;
                return (
                  <div
                    key={cell.dateStr}
                    className={`min-h-[82px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border flex flex-col justify-between select-none shadow-2xs group calendar-date-neon-hover cursor-pointer transition-all duration-300 ease-out ${
                      isKickoffEve
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200/60'
                        : 'bg-matcha-input border-[#a6c4a1]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-sm sm:text-base font-black font-['JetBrains_Mono'] text-slate-800">
                        {cell.dayNum}
                      </span>
                      {isKickoffEve ? (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-300 text-amber-950 font-['JetBrains_Mono'] shadow-2xs">
                          Kickoff Eve
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-matcha-sub text-slate-700 border border-[#a6c4a1]/60 font-['JetBrains_Mono']">
                          Prep
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-slate-600 truncate">
                        {isKickoffEve ? 'Final device check' : 'Orientation warmup'}
                      </div>
                      <div className="text-[9px] font-black text-indigo-700 font-['JetBrains_Mono']">
                        Kickoff: Sep 14
                      </div>
                    </div>
                  </div>
                );
              }

              // Calculate progress for this day
              const totalTasks = dayPlan.tasks.length;
              const completedTasks = dayPlan.tasks.filter((t) => completedTaskIds[t.id]).length;
              const isComplete = totalTasks > 0 && completedTasks === totalTasks;
              const hasStarted = completedTasks > 0 && !isComplete;
              const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              // Check subject composition
              const hasMath = dayPlan.tasks.some((t) => t.subject === 'math');
              const hasRW = dayPlan.tasks.some((t) => t.subject === 'rw');
              const hasDrill = dayPlan.tasks.some((t) => t.subject === 'drill');
              const hasReview = dayPlan.tasks.some((t) => t.subject === 'review');
              const hasLogistics = dayPlan.tasks.some((t) => t.subject === 'logistics');
              const cellTiming = sessionTimings[cell.dateStr];

              const diffConfig = getDayLoadDifficulty(dayPlan);
              const isDimmed = difficultyFilter !== 'all' && diffConfig.type !== difficultyFilter;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => {
                    if (onSelectDay) {
                      onSelectDay(cell.dateStr);
                    } else {
                      setActiveInspectDayId(cell.dateStr);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`group min-h-[82px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border cursor-pointer flex flex-col justify-between relative focus:outline-none focus:ring-2 calendar-date-neon-hover transition-all duration-300 ease-out ${
                    isDimmed ? 'opacity-30 scale-[0.97]' : ''
                  } ${
                    isExamDay
                      ? diffConfig.calendarCellClass
                      : isKickoffDay
                      ? `${diffConfig.calendarCellClass} ring-2 ring-emerald-500 shadow-md`
                      : isComplete
                      ? 'bg-emerald-50/75 border-emerald-400 hover:bg-emerald-100/70'
                      : diffConfig.calendarCellClass
                  }`}
                >
                  {/* Top: Day Number & Type Badges */}
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span
                        className={`text-sm sm:text-base font-black font-['JetBrains_Mono'] ${
                          isExamDay
                            ? 'text-white text-lg sm:text-xl drop-shadow-xs'
                            : isKickoffDay
                            ? 'text-emerald-950'
                            : 'text-slate-900'
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {/* Prominent Day 7 Paper Label */}
                      {isExamDay && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-300 text-slate-950 shadow-xs animate-pulse">
                          SAT EXAM
                        </span>
                      )}

                      {/* Day 1 Kickoff Label */}
                      {isKickoffDay && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-700 text-white shadow-xs">
                          Day 1
                        </span>
                      )}

                      {/* Khan Academy Difficulty Tier Badge (Foundations, Medium, Challenge, Advanced, Mock, Rest) */}
                      {!isExamDay && (
                        <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border font-['JetBrains_Mono'] ${diffConfig.badgeClass}`}>
                          {diffConfig.shortLabel}
                        </span>
                      )}
                    </div>

                    {/* Completion Fraction / Indicator */}
                    {!isExamDay && (
                      <div>
                        {isComplete ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-black font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{completedTasks}/{totalTasks}</span>
                          </span>
                        ) : hasStarted ? (
                          <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                            {completedTasks}/{totalTasks}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-matcha-sub text-slate-700 border border-[#a6c4a1]/60">
                            0/{totalTasks}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Middle: Subject / Exam indicators */}
                  <div className="my-1">
                    {isExamDay ? (
                      <div className="text-[11px] font-black leading-tight text-amber-100 space-y-0.5">
                        <div className="flex items-center gap-1 font-['Space_Grotesk'] text-white">
                          <Trophy className="w-3 h-3 text-amber-300" />
                          <span>CRESCENT MODEL</span>
                        </div>
                        <div className="text-[10px] text-amber-200 font-mono">
                          7:15 AM Gates Close
                        </div>
                      </div>
                    ) : dayPlan.isTestDay ? (
                      <div className="text-[10px] font-bold text-sky-900 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="truncate">{dayPlan.tasks[0]?.code || 'Mock Exam'}</span>
                      </div>
                    ) : hasReview ? (
                      <div className="text-[10px] font-bold text-rose-950 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-rose-600 shrink-0" />
                        <span className="truncate">{dayPlan.tasks[0]?.topic || 'Error-Log Review'}</span>
                      </div>
                    ) : hasDrill ? (
                      <div className="text-[10px] font-bold text-indigo-950 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span className="truncate">{dayPlan.tasks[0]?.topic || 'Targeted Drill'}</span>
                      </div>
                    ) : hasLogistics ? (
                      <div className="text-[10px] font-bold text-teal-950 flex items-center gap-1">
                        <Target className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="truncate">{dayPlan.tasks[0]?.topic || 'Prep / Packout'}</span>
                      </div>
                    ) : dayPlan.isBuffer ? (
                      <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <Coffee className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate hidden sm:inline">Buffer Rest Day</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 flex-wrap">
                        {hasMath && (
                          <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-200">
                            Math
                          </span>
                        )}
                        {hasRW && (
                          <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            RW
                          </span>
                        )}
                        {dayPlan.hasCarriedOverTasks && (
                          <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-950 border border-amber-300 font-['JetBrains_Mono'] flex items-center gap-0.5">
                            <RotateCcw className="w-2 h-2 text-amber-700" />
                            <span>+{dayPlan.carriedOverCount}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Logged Timer Pacing Badge on Calendar Cell */}
                    {cellTiming && (
                      <div 
                        className={`mt-1 text-[9px] font-black font-['JetBrains_Mono'] px-1.5 py-0.5 rounded-md flex items-center justify-between border shadow-2xs ${
                          cellTiming.math.rating === 'perfect'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : cellTiming.math.rating === 'too_fast'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                        title={`Math: ${cellTiming.math.actualMinutes}m / 45m (${cellTiming.math.ratingLabel})`}
                      >
                        <span className="flex items-center gap-0.5 truncate">
                          <Clock className="w-2.5 h-2.5 shrink-0 text-slate-700" />
                          <span>{cellTiming.math.actualMinutes}m</span>
                        </span>
                        <span className="shrink-0 uppercase font-extrabold text-[8px] tracking-tight">
                          {cellTiming.math.rating === 'perfect' ? '✓ Perfect' : cellTiming.math.rating === 'too_fast' ? '⚡ Fast' : '⚠️ Late'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Visual Mini Progress Bar */}
                  {!isExamDay && (
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isComplete
                            ? 'bg-emerald-500'
                            : hasStarted
                            ? 'bg-indigo-600'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}

                  {isExamDay && (
                    <div className="text-[9px] font-bold uppercase text-center bg-white/20 rounded py-0.5 text-white">
                      The Final Destination &rarr;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full 57-Day View in a Compact Responsive List */
        <div className="space-y-4">
          <div className="p-3 bg-matcha-sub rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Viewing all 55 days chronologically (Sep 14 &rarr; Nov 7)</span>
            <span className="text-slate-500">Click any row to inspect & toggle</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allDays.map((day) => {
              const isExamDay = day.dateStr === '2026-11-07';
              const isKickoff = day.dateStr === '2026-09-14';
              const totalTasks = day.tasks.length;
              const completedTasks = day.tasks.filter((t) => completedTaskIds[t.id]).length;
              const isComplete = totalTasks > 0 && completedTasks === totalTasks;
              const dayTiming = sessionTimings[day.dateStr];

              const diffConfig = getDayLoadDifficulty(day);

              return (
                <div
                  key={day.id}
                  onClick={() => {
                    if (onSelectDay) {
                      onSelectDay(day.dateStr);
                    } else {
                      setActiveInspectDayId(day.dateStr);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 shadow-grave-card hover:shadow-grave-card-hover smooth-card-hover transition-all duration-300 ease-out ${
                    isExamDay
                      ? 'bg-amber-100 border-amber-400 text-rose-950 ring-2 ring-amber-400 hover:border-rose-500'
                      : isKickoff
                      ? `${diffConfig.cardBgClass} ${diffConfig.cardBorderClass} ring-2 ring-emerald-500 hover:border-emerald-600`
                      : isComplete
                      ? 'bg-emerald-50 border-emerald-300 hover:border-emerald-500'
                      : `${diffConfig.cardBgClass} ${diffConfig.cardBorderClass} hover:border-emerald-500`
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black font-['JetBrains_Mono'] text-slate-900">
                        {day.formattedDate}
                      </span>
                      {isExamDay && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white shadow-xs">
                          SAT EXAM
                        </span>
                      )}
                      {isKickoff && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-700 text-white shadow-xs">
                          Day 1
                        </span>
                      )}
                      {!isExamDay && (
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border font-['JetBrains_Mono'] ${diffConfig.badgeClass}`}>
                          {diffConfig.shortLabel}
                        </span>
                      )}
                      {dayTiming && (
                        <span className={`text-[9px] font-black font-['JetBrains_Mono'] px-1.5 py-0.2 rounded flex items-center gap-1 border ${
                          dayTiming.math.rating === 'perfect'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : dayTiming.math.rating === 'too_fast'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                          <Clock className="w-2.5 h-2.5" />
                          <span>{dayTiming.math.actualMinutes}m Math &bull; {dayTiming.math.rating === 'perfect' ? 'Perfect' : dayTiming.math.rating === 'too_fast' ? 'Fast' : 'Late'}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 truncate">
                      {isExamDay
                        ? 'Crescent Model School Exam Day'
                        : day.tasks.map((t) => t.label).join(' • ')}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-black font-['JetBrains_Mono'] px-2 py-1 rounded-lg bg-matcha-sub text-slate-800 border border-[#a6c4a1]/60">
                      {completedTasks}/{totalTasks}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* INTERACTIVE DAY INSPECTOR MODAL / SLIDE-OVER                 */}
      {/* ============================================================ */}
      {inspectedDay && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto overscroll-contain"
          data-lenis-prevent="true"
        >
          <div 
            className="bg-matcha-input rounded-3xl border-2 border-slate-300 shadow-grave max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col overscroll-contain"
            data-lenis-prevent="true"
          >
            
            {/* Modal Header with Date and Exam Marker */}
            <div className={`p-5 sm:p-6 border-b flex items-start justify-between gap-3 ${
              inspectedDay.dateStr === '2026-11-07'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-400'
                : inspectedDay.isBuffer
                ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                : 'bg-[#254928] text-white border-[#407444]'
            }`}>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                    {inspectedDay.weekTitle}
                  </span>
                  {(() => {
                    const diff = getDayLoadDifficulty(inspectedDay);
                    return (
                      <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border shadow-xs font-['JetBrains_Mono'] ${diff.badgeClass}`}>
                        {diff.badgeText}
                      </span>
                    );
                  })()}
                </div>

                <h3 className="mt-1 text-2xl font-bold font-luxury">
                  {inspectedDay.formattedDate}
                </h3>
                <p className="text-xs opacity-90 mt-0.5 font-medium">
                  {getDayLoadDifficulty(inspectedDay).performanceDescription}
                </p>
              </div>

              <button
                onClick={() => setActiveInspectDayId(null)}
                className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Task Checklist & Timing Pacing Autopsy */}
            <div className="p-5 sm:p-6 space-y-5 flex-1">

              {/* ============================================================ */}
              {/* SESSION TIMING & PACING AUTOPSY (Exact User Requirement)     */}
              {/* ============================================================ */}
              {(() => {
                const inspectedTiming = sessionTimings[inspectedDay.dateStr];
                if (inspectedTiming) {
                  return (
                    <div className={`p-4 sm:p-5 rounded-2xl border-2 shadow-sm space-y-3.5 ${
                      inspectedTiming.math.rating === 'perfect'
                        ? 'bg-emerald-50/90 border-emerald-300'
                        : inspectedTiming.math.rating === 'too_fast'
                        ? 'bg-rose-50/90 border-rose-300'
                        : 'bg-amber-50/90 border-amber-300'
                    }`}>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-700" />
                          <span className="text-xs font-black uppercase tracking-wider font-['JetBrains_Mono'] text-slate-900">
                            90-Min Session Timing & Pacing Autopsy
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          Logged at {inspectedTiming.completedAt}
                        </span>
                      </div>

                      {/* Math Section Specific Performance Breakdown */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 font-['JetBrains_Mono']">
                              MATH SECTION DURATION:
                            </div>
                            <div className="text-2xl font-black font-['JetBrains_Mono'] text-slate-950">
                              {inspectedTiming.math.actualMinutes} mins taken
                              <span className="text-xs font-bold text-slate-600 ml-2">
                                (while you had <strong className="text-slate-900">45 mins</strong> to do it)
                              </span>
                            </div>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-['JetBrains_Mono'] shadow-xs ${
                            inspectedTiming.math.rating === 'perfect'
                              ? 'bg-emerald-600 text-white'
                              : inspectedTiming.math.rating === 'too_fast'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}>
                            {inspectedTiming.math.ratingLabel}
                          </span>
                        </div>

                        {/* 3 Explicit Ranges with visual scale */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-black font-['JetBrains_Mono'] text-slate-800">
                            <span className="text-rose-700">Range 1: 0–27m (Too Fast)</span>
                            <span className="text-emerald-800 font-black">Range 2: 28–45m (Fully Perfect)</span>
                            <span className="text-amber-800">Range 3: 46m+ (Too Late)</span>
                          </div>

                          {/* Visual segmented spectrum bar */}
                          <div className="relative h-6 rounded-full overflow-hidden flex shadow-inner bg-slate-200 border-2 border-slate-300">
                            {/* Range 1: Too Fast */}
                            <div className="w-[30%] bg-rose-400 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-wider">
                              Too Fast
                            </div>
                            {/* Range 2: Fully Perfect */}
                            <div className="w-[45%] bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
                              ★ Fully Perfect ★
                            </div>
                            {/* Range 3: Too Late */}
                            <div className="w-[25%] bg-amber-400 flex items-center justify-center text-[9px] font-black text-slate-950 uppercase tracking-wider">
                              Too Late
                            </div>
                          </div>

                          {/* Explanation box describing each specific range */}
                          <div className="bg-matcha-sub p-3.5 rounded-xl border border-[#a6c4a1]/70 text-xs text-slate-800 space-y-2 leading-relaxed shadow-sm">
                            <div className="font-black text-slate-950 flex items-center gap-1.5 text-xs">
                              <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                                inspectedTiming.math.rating === 'perfect' ? 'bg-emerald-500' : inspectedTiming.math.rating === 'too_fast' ? 'bg-rose-500' : 'bg-amber-500'
                              }`} />
                              <span>Pacing Diagnostic: You completed Math in {inspectedTiming.math.actualMinutes} mins (45 mins allocated)</span>
                            </div>
                            
                            <p className="font-semibold text-slate-700">
                              {inspectedTiming.math.ratingDescription}
                            </p>

                            <div className="pt-2 border-t border-[#a6c4a1]/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                              <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-200">
                                <span className="font-black text-rose-800 font-['JetBrains_Mono'] block">Range 1 (&lt; 28m):</span>
                                <span className="text-rose-900 font-medium">This specific range is <strong>too fast</strong>. Rushing invites sign errors, missed constraints, and skipped Desmos verification.</span>
                              </div>
                              <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-300 ring-1 ring-emerald-300">
                                <span className="font-black text-emerald-800 font-['JetBrains_Mono'] block">Range 2 (28–45m):</span>
                                <span className="text-emerald-950 font-medium">This specific range is <strong>fully perfect</strong>. Optimal pace: leaves ample time to verify answers without rushing!</span>
                              </div>
                              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200">
                                <span className="font-black text-amber-900 font-['JetBrains_Mono'] block">Range 3 (&gt; 45m):</span>
                                <span className="text-amber-950 font-medium">This specific range is <strong>too late</strong>. Causes cognitive burnout and test-day time exhaustion.</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Break & RW Summary Cards */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-matcha-sub border border-[#a6c4a1]/70">
                            <span className="text-[10px] font-black uppercase text-slate-600 font-['JetBrains_Mono'] flex items-center gap-1">
                              <Coffee className="w-3 h-3 text-sky-600" /> Break:
                            </span>
                            <div className="font-black text-slate-900 font-['JetBrains_Mono'] text-sm mt-0.5">
                              {inspectedTiming.breakTime ? `${inspectedTiming.breakTime.actualMinutes}m` : '10m'}
                              <span className="text-[10px] font-bold text-sky-700 ml-1.5">(10m cap)</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-matcha-sub border border-[#a6c4a1]/70">
                            <span className="text-[10px] font-black uppercase text-slate-600 font-['JetBrains_Mono'] flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-amber-600" /> RW Section:
                            </span>
                            <div className="font-black text-slate-900 font-['JetBrains_Mono'] text-sm mt-0.5">
                              {inspectedTiming.rw ? `${inspectedTiming.rw.actualMinutes}m` : '35m'}
                              <span className="text-[10px] font-bold text-amber-700 ml-1.5">(35m cap)</span>
                            </div>
                          </div>
                        </div>

                        {/* Reset button */}
                        {onDeleteSessionTiming && (
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-500 font-mono font-bold">
                              Total Study Time: {inspectedTiming.totalSessionMinutes} mins
                            </span>
                            <button
                              onClick={() => onDeleteSessionTiming(inspectedDay.dateStr)}
                              className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                            >
                              Clear this timing record
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else if (!inspectedDay.isBuffer && !inspectedDay.isTestDay && inspectedDay.dateStr !== '2026-11-07') {
                  return (
                    <div className="p-3.5 rounded-2xl bg-matcha-sub border border-[#a6c4a1]/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 font-['JetBrains_Mono']">
                          <Clock className="w-3.5 h-3.5 text-[#0d3b66]" />
                          <span>Daily Scheduled Routine &bull; {inspectedDay.totalTimeMinutes || 170}m Total Window</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-semibold">
                          {inspectedDay.studyTimeMinutes || 140}m Study Drills &bull; {inspectedDay.breakTimeMinutes || 30}m Screen-Free Rest Breaks
                        </p>
                      </div>
                      <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#0d3b66] bg-[#0d3b66]/10 px-3 py-1.5 rounded-xl border border-[#0d3b66]/20 shrink-0">
                        {inspectedDay.tasks.length} Modules Scheduled
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              {/* Progress Bar in Inspector */}
              <div className="p-3.5 bg-matcha-sub rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase text-slate-700 font-['JetBrains_Mono']">
                    Process Completion:
                  </span>
                  <span className="font-black text-indigo-700 font-['JetBrains_Mono']">
                    {inspectedDay.tasks.filter((t) => completedTaskIds[t.id]).length} of {inspectedDay.tasks.length} Done (
                    {inspectedDay.tasks.length > 0
                      ? Math.round(
                          (inspectedDay.tasks.filter((t) => completedTaskIds[t.id]).length /
                            inspectedDay.tasks.length) *
                            100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{
                      width: `${
                        inspectedDay.tasks.length > 0
                          ? (inspectedDay.tasks.filter((t) => completedTaskIds[t.id]).length /
                              inspectedDay.tasks.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Special instructions (if any) */}
              {inspectedDay.specialInstructions && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{inspectedDay.specialInstructions}</span>
                </div>
              )}

              {/* Carried-Over Backlog Banner in Inspected Day */}
              {inspectedDay.hasCarriedOverTasks && (
                <div className="p-3 rounded-xl bg-amber-500/15 border-2 border-amber-400 text-amber-950 flex items-center gap-2.5 text-xs font-semibold">
                  <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-black font-['JetBrains_Mono']">{inspectedDay.carriedOverCount} Incomplete Task{inspectedDay.carriedOverCount === 1 ? '' : 's'} Rolled Over:</span>{' '}
                    <span>Left uncompleted on previous day. Checking off here completes it on both days!</span>
                  </div>
                </div>
              )}

              {/* Interactive Tasks Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase text-slate-600 font-['JetBrains_Mono'] flex items-center justify-between">
                  <span>Assigned Lessons & Drills (Click to check off)</span>
                  <span className="text-[11px] text-slate-600 lowercase font-sans">updates calendar instantly</span>
                </div>

                {inspectedDay.tasks.map((task) => {
                  const isChecked = !!completedTaskIds[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(inspectedDay.id, task.id)}
                      className={`group task-check-card calendar-date-neon-hover p-3 rounded-xl border-2 flex items-center gap-3 select-none cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-slate-700'
                          : 'bg-matcha-input border-[#a6c4a1]/60 text-slate-900 shadow-xs'
                      }`}
                    >
                      <div className="shrink-0">
                        {isChecked ? (
                          <span className="task-check-dot">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          </span>
                        ) : (
                          <span className="task-check-dot">
                            <Circle className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {task.subject === 'math' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-['JetBrains_Mono'] shrink-0">
                              Math
                            </span>
                          )}
                          {task.subject === 'rw' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-['JetBrains_Mono'] shrink-0">
                              Reading & Writing
                            </span>
                          )}
                          {task.subject === 'buffer' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 font-['JetBrains_Mono'] shrink-0">
                              Rest
                            </span>
                          )}
                          {task.subject === 'test' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 font-['JetBrains_Mono'] shrink-0">
                              Exam
                            </span>
                          )}
                          {task.isCarriedOver && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-['JetBrains_Mono'] flex items-center gap-1 shadow-xs shrink-0">
                              <RotateCcw className="w-2.5 h-2.5 text-amber-700" />
                              <span>Rollover from {task.originalFormattedDate}</span>
                            </span>
                          )}

                          {/* Timing Badge in front of skill */}
                          {task.timeSlot ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0d3b66]/10 text-[#0d3b66] border border-[#0d3b66]/20 font-['JetBrains_Mono'] text-[11px] font-black shrink-0">
                              <Clock className="w-3 h-3 text-[#0d3b66] shrink-0" />
                              <span>{task.timeSlot}</span>
                              {task.durationMinutes && (
                                <span className="text-[10px] font-bold text-[#0d3b66]/80">({task.durationMinutes}m)</span>
                              )}
                            </span>
                          ) : task.durationMinutes ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-['JetBrains_Mono'] text-[11px] font-black shrink-0">
                              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{task.durationMinutes}m</span>
                            </span>
                          ) : null}

                          <span
                            className={`text-xs font-bold leading-tight ${
                              isChecked ? 'line-through text-slate-600' : 'text-slate-900'
                            }`}
                          >
                            {cleanSkillLabel(task.label)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stuck Concepts / Struggle Logger */}
              {onOpenStruggleModal && inspectedDay.tasks.length > 0 && (
                <div className="space-y-2 p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-800 uppercase font-['JetBrains_Mono'] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Stuck Concepts & Error Log Sync</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenStruggleModal(inspectedDay);
                      }}
                      className="px-2.5 py-1 text-2xs font-black uppercase tracking-wider rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs cursor-pointer"
                    >
                      + Log Struggle
                    </button>
                  </div>
                  {stuckConcepts.filter((s) => s.dateStr === inspectedDay.dateStr).length > 0 ? (
                    <div className="space-y-1 pt-1">
                      {stuckConcepts
                        .filter((s) => s.dateStr === inspectedDay.dateStr)
                        .map((sc) => (
                          <div
                            key={sc.id}
                            className="text-xs p-2.5 rounded-xl bg-matcha-input/90 backdrop-blur-md border border-[#a6c4a1] flex items-start justify-between gap-2 shadow-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{sc.conceptFormula}</div>
                              <div className="text-2xs text-rose-600 font-medium">
                                {sc.chapter} &bull; {sc.lessonTitle}
                              </div>
                              {sc.notes && <div className="text-2xs text-slate-600 mt-0.5">{sc.notes}</div>}
                            </div>
                            <span
                              className={`text-3xs font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                sc.resolved
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-700 border border-rose-300'
                              }`}
                            >
                              {sc.resolved ? 'Resolved' : 'Active'}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-2xs text-rose-700/80 font-medium">
                      Did you get stuck on any formula, rule, or question today? Log it to automatically bookmark in Core Info and Master Error Log.
                    </p>
                  )}
                </div>
              )}

              {/* Day Notes */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-matcha-sub/90 backdrop-blur-md border border-[#a6c4a1]">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-black uppercase text-[#122810] font-['JetBrains_Mono'] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Personal Notes & Reflections</span>
                  </label>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                    ⚡ Dual-syncs to Error Log
                  </span>
                </div>
                <textarea
                  value={dayNotes[inspectedDay.id] || ''}
                  onChange={(e) => onSaveNotes(inspectedDay.id, e.target.value)}
                  rows={3}
                  placeholder="Record missed traps, takeaways, or concepts for this day (auto-saves to Master Error Log)..."
                  className="w-full text-xs p-2.5 rounded-xl bg-matcha-input border border-[#a6c4a1] focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-[#122810] placeholder:text-[#3d5a39] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-matcha-sub rounded-b-3xl flex items-center justify-between gap-3">
              <div>
                {onToggleBufferDay && inspectedDay.dateStr !== '2026-11-07' && !inspectedDay.isTestDay && (
                  <button
                    onClick={() => {
                      onToggleBufferDay(inspectedDay.dateStr);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border shadow-2xs active:scale-95 ${
                      inspectedDay.isBuffer
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                    }`}
                  >
                    {inspectedDay.isBuffer ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                        <span>Restore Study Day</span>
                      </>
                    ) : (
                      <>
                        <Coffee className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Convert to Buffer Day</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <button
                onClick={() => setActiveInspectDayId(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-matcha-input hover:bg-[rgba(195,218,190,0.65)] border border-slate-300 transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};
