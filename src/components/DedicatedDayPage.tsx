import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Coffee, 
  BookOpen, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  ExternalLink, 
  AlertTriangle, 
  AlertCircle,
  FileText, 
  Save, 
  Check, 
  Trophy,
  Volume2,
  VolumeX,
  Target
} from 'lucide-react';
import { DayPlan, TaskItem, DaySessionTiming, PaceRating } from '../types';
import { cleanSkillLabel } from '../utils/difficulty';

interface DedicatedDayPageProps {
  day: DayPlan;
  completedTaskIds: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  sessionTiming?: DaySessionTiming;
  onSaveSessionTiming?: (timing: DaySessionTiming) => void;
  onDeleteSessionTiming?: (dateStr: string) => void;
  notes: string;
  onSaveNotes: (dateStr: string, text: string) => void;
  onBack: () => void;
  onNavigateDay: (targetDateStr: string) => void;
  allDays: DayPlan[];
  onOpenErrorLogModal: (preselectedDate?: string) => void;
  onOpenDesmosModal: () => void;
  onOpenPackingModal: () => void;
  taskTimings?: Record<string, import('../types').TaskTimingRecord>;
  onOpenStruggleModal?: (day: DayPlan) => void;
  stuckCount?: number;
  onToggleBufferDay?: (dateStr: string) => void;
}

export function DedicatedDayPage({
  day,
  completedTaskIds,
  onToggleTask,
  sessionTiming,
  onSaveSessionTiming,
  onDeleteSessionTiming,
  notes,
  onSaveNotes,
  onBack,
  onNavigateDay,
  allDays,
  onOpenErrorLogModal,
  onOpenDesmosModal,
  onOpenPackingModal,
  taskTimings = {},
  onOpenStruggleModal,
  stuckCount = 0,
  onToggleBufferDay,
}: DedicatedDayPageProps) {
  // Local notes editing state
  const [currentNotes, setCurrentNotes] = useState(notes || '');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // Synchronize when day changes
  useEffect(() => {
    setCurrentNotes(notes || '');
    setNotesSavedAlert(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [day.dateStr, notes]);

  // Handle ESC key to return to calendar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Tasks categorized
  const mathTasks = useMemo(() => day.tasks.filter((t) => t.subject === 'math'), [day.tasks]);
  const rwTasks = useMemo(() => day.tasks.filter((t) => t.subject === 'rw'), [day.tasks]);
  const otherTasks = useMemo(() => day.tasks.filter((t) => t.subject !== 'math' && t.subject !== 'rw'), [day.tasks]);

  const totalTasks = day.tasks.length;
  const completedTasks = day.tasks.filter((t) => completedTaskIds[t.id]).length;
  const isAllComplete = totalTasks > 0 && completedTasks === totalTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Find previous and next days in the full plan
  const currentIndex = useMemo(() => {
    return allDays.findIndex((d) => d.dateStr === day.dateStr);
  }, [allDays, day.dateStr]);

  const prevDay = currentIndex > 0 ? allDays[currentIndex - 1] : null;
  const nextDay = currentIndex >= 0 && currentIndex < allDays.length - 1 ? allDays[currentIndex + 1] : null;

  const isExamDay = day.dateStr === '2026-11-07';
  const isKickoffDay = day.dateStr === '2026-09-12';

  // Manual pacing calculator quick inputs
  const [manualMathMinutes, setManualMathMinutes] = useState(35);
  const [isManualLogging, setIsManualLogging] = useState(false);

  const handleSaveManualTiming = () => {
    const mins = Math.max(1, Math.min(120, manualMathMinutes));
    let rating: PaceRating = 'perfect';
    let ratingLabel = 'Fully Perfect Pace';
    let ratingDescription = `You finished Math in ${mins}m while having 45m allocated. This specific range (28–45 mins) is fully perfect—allowing deep focus, question verification, and Desmos plotting without rushing or falling behind.`;
    let badgeBg = 'bg-emerald-100';
    let badgeText = 'text-emerald-900';
    let badgeBorder = 'border-emerald-300';

    if (mins < 28) {
      rating = 'too_fast';
      ratingLabel = 'Too Fast (< 28 mins)';
      ratingDescription = `You completed Math in ${mins}m (under 28 mins). This specific range is too fast. Rushing invites sign errors, missed constraints, and skipped Desmos verification. Use your full 45m buffer to double-check!`;
      badgeBg = 'bg-rose-100';
      badgeText = 'text-rose-900';
      badgeBorder = 'border-rose-300';
    } else if (mins > 45) {
      rating = 'too_late';
      ratingLabel = 'Too Late (> 45 mins)';
      ratingDescription = `You took ${mins}m on Math (exceeded the 45m cap). This specific range causes cognitive burnout and test-day time exhaustion. Triage harder questions faster.`;
      badgeBg = 'bg-amber-100';
      badgeText = 'text-amber-900';
      badgeBorder = 'border-amber-300';
    }

    const timingRecord: DaySessionTiming = {
      dateStr: day.dateStr,
      dayTitle: `${day.formattedDate} - ${day.weekTitle}`,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      math: {
        allocatedMinutes: 45,
        actualMinutes: mins,
        actualSeconds: mins * 60,
        rating,
        ratingLabel,
        ratingDescription,
        badgeBg,
        badgeText,
        badgeBorder,
      },
      breakTime: {
        allocatedMinutes: 10,
        actualMinutes: 10,
        actualSeconds: 600,
        rating: 'perfect',
        ratingLabel: 'Fully Perfect Rest',
        ratingDescription: '10-minute eye relaxation break away from screens.',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-900',
        badgeBorder: 'border-emerald-300',
      },
      rw: {
        allocatedMinutes: 35,
        actualMinutes: 35,
        actualSeconds: 2100,
        rating: 'perfect',
        ratingLabel: 'Fully Perfect Pace',
        ratingDescription: 'Reading & Writing section completed on target within 35 mins.',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-900',
        badgeBorder: 'border-emerald-300',
      },
      totalSessionMinutes: mins + 10 + 35,
      overallRating: rating,
    };

    onSaveSessionTiming(timingRecord);
    setIsManualLogging(false);
  };

  const handleNotesBlur = () => {
    onSaveNotes(day.dateStr, currentNotes);
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#d7e5d2] text-slate-900 selection:bg-indigo-500 selection:text-white pb-24">
      {/* Top Floating Navigation Bar with Room to Breathe */}
      <header className="sticky top-0 z-30 ios-glass-header transition-all">
        <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black font-['Space_Grotesk'] text-slate-800 bg-matcha-sub hover:bg-matcha-input border-2 border-[#a6c4a1]/70 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Return to Master Calendar (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to Calendar</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-matcha-input border border-[#a6c4a1]/60 rounded text-slate-500">
                ESC
              </kbd>
            </button>

            <span className="hidden md:inline-block text-xs font-semibold text-slate-500">
              /
            </span>
            <span className="hidden md:inline-block text-xs font-bold text-slate-700 font-['JetBrains_Mono'] truncate">
              {day.weekTitle}
            </span>
          </div>

          {/* Quick Traverse: Previous & Next Day Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => prevDay && onNavigateDay(prevDay.dateStr)}
              disabled={!prevDay}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border ${
                prevDay
                  ? 'bg-matcha-input hover:bg-matcha-sub text-slate-800 border-[#a6c4a1]/70 shadow-2xs hover:scale-105 cursor-pointer'
                  : 'bg-matcha-sub/40 text-slate-400 border-[#a6c4a1]/40 cursor-not-allowed opacity-50'
              } transition-all`}
              title={prevDay ? `Go to ${prevDay.formattedDate}` : 'Beginning of schedule'}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{prevDay ? prevDay.formattedDate : 'Start'}</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <span className="text-xs font-black font-['JetBrains_Mono'] px-2 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200">
              {day.formattedDate}
            </span>

            <button
              onClick={() => nextDay && onNavigateDay(nextDay.dateStr)}
              disabled={!nextDay}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border ${
                nextDay
                  ? 'bg-matcha-input hover:bg-matcha-sub text-slate-800 border-[#a6c4a1]/70 shadow-2xs hover:scale-105 cursor-pointer'
                  : 'bg-matcha-sub/40 text-slate-400 border-[#a6c4a1]/40 cursor-not-allowed opacity-50'
              } transition-all`}
              title={nextDay ? `Go to ${nextDay.formattedDate}` : 'End of schedule'}
            >
              <span className="hidden sm:inline">{nextDay ? nextDay.formattedDate : 'End'}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onToggleBufferDay && day.dateStr !== '2026-11-07' && !day.isTestDay && (
              <button
                onClick={() => onToggleBufferDay(day.dateStr)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  day.isBuffer
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                }`}
                title={day.isBuffer ? 'Restore as a normal study day' : 'Too exhausted? Convert into a Buffer Day'}
              >
                {day.isBuffer ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                    <span>Restore Study Day</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Take Buffer Day</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Spacious Dedicated Content Canvas */}
      <main className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-8 sm:space-y-10">
        
        {/* ============================================================ */}
        {/* HERO DAY MISSION HEADER (Room to Breathe & Clear Visuals)    */}
        {/* ============================================================ */}
        <section className={`p-6 sm:p-9 rounded-3xl border-2 shadow-grave transition-all ${
          isExamDay
            ? 'bg-gradient-to-br from-amber-500 via-rose-600 to-slate-900 text-white border-amber-300 ring-4 ring-amber-300/60'
            : day.isBuffer
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : isKickoffDay
            ? 'bg-matcha-input border-indigo-400'
            : 'bg-matcha-input border-slate-300'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-['JetBrains_Mono'] shadow-xs ${
                  isExamDay
                    ? 'bg-amber-300 text-slate-950 font-extrabold'
                    : isKickoffDay
                    ? 'bg-indigo-600 text-white'
                    : day.isBuffer
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}>
                  <Target className="w-3.5 h-3.5" />
                  <span>
                    {isExamDay
                      ? 'D-DAY SAT PAPER EXAM'
                      : isKickoffDay
                      ? 'DAY 1 KICKOFF'
                      : day.isBuffer
                      ? 'BUFFER RECOVERY'
                      : `WEEK ${day.weekNumber} • DAY`}
                  </span>
                </span>

                <span className="text-xs font-['JetBrains_Mono'] font-extrabold uppercase px-2.5 py-1 rounded-full bg-matcha-sub text-slate-800 border border-[#a6c4a1]/70">
                  {day.phase} Phase
                </span>

                <span className={`text-xs font-['JetBrains_Mono'] font-black px-2.5 py-1 rounded-full border ${
                  isAllComplete
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-matcha-sub text-slate-700 border border-[#a6c4a1]/60'
                }`}>
                  {progressPercent}% Tasks Completed ({completedTasks}/{totalTasks})
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] tracking-tight leading-tight">
                {day.formattedDate}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                {isExamDay
                  ? 'Bring original Smart CNIC / Passport, fully charged device with updated Bluebook app, and admission ticket.'
                  : day.isBuffer
                  ? 'Guaranteed anti-burnout buffer day. Rest, disconnect from screens, and let neural connections consolidate.'
                  : day.specialInstructions ||
                    'Focus deeply for 90 minutes. 45m Math (pacing: 28-45m), 10m restorative rest, and 35m Reading & Writing.'}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => onOpenErrorLogModal(day.dateStr)}
                className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-black font-['Space_Grotesk'] text-slate-800 bg-matcha-sub hover:bg-matcha-input border-2 border-[#a6c4a1] shadow-grave-card hover:shadow-grave-card-hover hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Log Mistake to Error Log</span>
              </button>
            </div>
          </div>

          {/* Progress Bar for this Day */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-black font-['JetBrains_Mono'] text-slate-700">
              <span>Day Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isAllComplete
                    ? 'bg-emerald-500'
                    : progressPercent > 0
                    ? 'bg-indigo-600'
                    : 'bg-transparent'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DAILY SKILL SCHEDULE & PACING ALLOCATION OVERVIEW             */}
        {/* ============================================================ */}
        <section className="bg-matcha-input rounded-3xl border-2 border-slate-300 shadow-grave p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0d3b66]/10 text-[#0d3b66] border border-[#0d3b66]/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-slate-900">
                  Daily Skill Schedule & Pacing Allocation
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {day.specialInstructions || 'Strict door-to-door schedule with dedicated rest breaks.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] font-bold text-slate-700 bg-matcha-sub px-3 py-1.5 rounded-xl border border-[#a6c4a1]/70">
              <span>{day.tasks.length} Modules Scheduled</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-matcha-sub border border-[#a6c4a1]/70 shadow-xs">
              <div className="text-[10px] font-black uppercase text-slate-600 font-['JetBrains_Mono']">
                Active Study
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['JetBrains_Mono'] text-slate-900 mt-1">
                {day.studyTimeMinutes || day.tasks.filter(t => t.subject !== 'buffer').reduce((acc, t) => acc + (t.durationMinutes || 20), 0)}m
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Math + R&W drills
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-matcha-sub border border-[#a6c4a1]/70 shadow-xs">
              <div className="text-[10px] font-black uppercase text-emerald-800 font-['JetBrains_Mono']">
                Rest & Breaks
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['JetBrains_Mono'] text-emerald-700 mt-1">
                {day.breakTimeMinutes || day.tasks.filter(t => t.subject === 'buffer').reduce((acc, t) => acc + (t.durationMinutes || 15), 0)}m
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Screen-free rest
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-matcha-sub border border-[#a6c4a1]/70 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0d3b66] font-['JetBrains_Mono']">
                Total Window
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['JetBrains_Mono'] text-[#0d3b66] mt-1">
                {day.totalTimeMinutes || 170}m
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Door-to-door window
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-matcha-sub border border-[#a6c4a1]/70 shadow-xs">
              <div className="text-[10px] font-black uppercase text-indigo-800 font-['JetBrains_Mono']">
                Completion
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['JetBrains_Mono'] text-indigo-700 mt-1">
                {progressPercent}%
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {completedTasks}/{totalTasks} modules done
              </div>
            </div>
          </div>
        </section>

        {/* Carried-Over Backlog Banner if uncompleted tasks rolled over */}
        {day.hasCarriedOverTasks && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/15 border-2 border-amber-400/80 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black font-['Space_Grotesk'] text-slate-950">
                    {day.carriedOverCount} Incomplete Task{day.carriedOverCount === 1 ? '' : 's'} Carried Over
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-400 font-['JetBrains_Mono']">
                    Dynamic Rollover Active
                  </span>
                </div>
                <p className="text-xs text-amber-900 font-medium mt-0.5">
                  These tasks were left uncompleted on previous days. Checking them off here will automatically mark them as completed on both today and their original assigned date!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* BOTH SUBJECTS & COMPLETE TASKS PROCESS                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Math Section (45 Mins Allocation) */}
          <section className="bg-matcha-input rounded-3xl border-2 border-slate-300 shadow-grave p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Space_Grotesk'] text-slate-900">
                    Math Section
                  </h3>
                  <p className="text-[11px] font-bold text-indigo-700 font-['JetBrains_Mono']">
                    45 Mins Target &bull; Desmos Graphing Ready
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenDesmosModal}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-['JetBrains_Mono'] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer"
                title="View Desmos 800-Level Keyboard Cheatsheet"
              >
                Desmos Guide &rarr;
              </button>
            </div>

            {mathTasks.length > 0 ? (
              <div className="space-y-2.5">
                {mathTasks.map((task) => {
                  const isDone = !!completedTaskIds[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      role="button"
                      tabIndex={0}
                      className={`task-check-card calendar-date-neon-hover p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer select-none ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-matcha-sub border-[#a6c4a1]/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(task.id);
                        }}
                        className="task-check-dot mt-0.5 text-indigo-600 transition shrink-0 cursor-pointer"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                        )}
                      </button>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {task.code && !task.label.toLowerCase().includes(task.code.toLowerCase().replace(/[\[\]]/g, '')) && (
                            <span className="text-[10px] font-black font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 shrink-0">
                              {task.code}
                            </span>
                          )}
                          {/* Timing Badge in front of skill */}
                          {task.timeSlot ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d3b66]/10 text-[#0d3b66] border border-[#0d3b66]/20 font-['JetBrains_Mono'] text-xs font-black shrink-0 shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-[#0d3b66] shrink-0" />
                              <span>{task.timeSlot}</span>
                              {task.durationMinutes && (
                                <span className="text-[10px] bg-[#0d3b66]/15 text-[#0d3b66] px-1.5 py-0.5 rounded font-black">
                                  ({task.durationMinutes}m)
                                </span>
                              )}
                            </span>
                          ) : task.durationMinutes ? (
                            <span className="text-[10px] font-black font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 shrink-0">
                              {task.durationMinutes}m
                            </span>
                          ) : null}
                          {task.isCarriedOver && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-['JetBrains_Mono'] flex items-center gap-1 shadow-xs">
                              <RotateCcw className="w-2.5 h-2.5 text-amber-700" />
                              <span>Rollover from {task.originalFormattedDate}</span>
                            </span>
                          )}
                          {taskTimings && taskTimings[task.id] && (
                            <span className="text-[10px] font-black font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                              <span>⏱️ Exact Time: {taskTimings[task.id].formatted}</span>
                            </span>
                          )}
                          <span className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {cleanSkillLabel(task.label)}
                          </span>
                        </div>
                        {task.topic && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            Unit Topic: <span className="font-semibold text-slate-700">{task.topic}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-matcha-sub border border-dashed border-slate-200 text-center text-xs text-slate-500 font-medium">
                {day.isBuffer ? 'Buffer Rest Day — No Math assignments assigned!' : 'No Math modules scheduled for today.'}
              </div>
            )}
          </section>

          {/* Reading & Writing Section (35 Mins Allocation) */}
          <section className="bg-matcha-input rounded-3xl border-2 border-slate-300 shadow-grave p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Space_Grotesk'] text-slate-900">
                    Reading & Writing Section
                  </h3>
                  <p className="text-[11px] font-bold text-amber-700 font-['JetBrains_Mono']">
                    35 Mins Target &bull; Context Clues & Boundaries
                  </p>
                </div>
              </div>
            </div>

            {rwTasks.length > 0 ? (
              <div className="space-y-2.5">
                {rwTasks.map((task) => {
                  const isDone = !!completedTaskIds[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      role="button"
                      tabIndex={0}
                      className={`task-check-card calendar-date-neon-hover p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer select-none ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-matcha-sub border-[#a6c4a1]/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(task.id);
                        }}
                        className="task-check-dot mt-0.5 text-amber-600 transition shrink-0 cursor-pointer"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-amber-600" />
                        )}
                      </button>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {task.code && !task.label.toLowerCase().includes(task.code.toLowerCase().replace(/[\[\]]/g, '')) && (
                            <span className="text-[10px] font-black font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                              {task.code}
                            </span>
                          )}
                          {/* Timing Badge in front of skill */}
                          {task.timeSlot ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-['JetBrains_Mono'] text-xs font-black shrink-0 shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{task.timeSlot}</span>
                              {task.durationMinutes && (
                                <span className="text-[10px] bg-amber-200/80 text-amber-950 px-1.5 py-0.5 rounded font-black">
                                  ({task.durationMinutes}m)
                                </span>
                              )}
                            </span>
                          ) : task.durationMinutes ? (
                            <span className="text-[10px] font-black font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-950 border border-indigo-300 shrink-0">
                              {task.durationMinutes}m
                            </span>
                          ) : null}
                          {task.isCarriedOver && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-['JetBrains_Mono'] flex items-center gap-1 shadow-xs">
                              <RotateCcw className="w-2.5 h-2.5 text-amber-700" />
                              <span>Rollover from {task.originalFormattedDate}</span>
                            </span>
                          )}
                          {taskTimings && taskTimings[task.id] && (
                            <span className="text-[10px] font-black font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                              <span>⏱️ Exact Time: {taskTimings[task.id].formatted}</span>
                            </span>
                          )}
                          <span className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {cleanSkillLabel(task.label)}
                          </span>
                        </div>
                        {task.topic && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            Passage Focus: <span className="font-semibold text-slate-700">{task.topic}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-matcha-sub border border-dashed border-slate-200 text-center text-xs text-slate-500 font-medium">
                {day.isBuffer ? 'Buffer Rest Day — No Reading & Writing assignments assigned!' : 'No Reading & Writing modules scheduled for today.'}
              </div>
            )}
          </section>
        </div>

        {/* Other / Buffer Tasks (if any) */}
        {otherTasks.length > 0 && (
          <section className="bg-matcha-input rounded-3xl border-2 border-slate-300 shadow-grave p-6 space-y-4">
            <h3 className="text-lg font-black font-['Space_Grotesk'] text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>General & Rest Activities</span>
            </h3>
            <div className="space-y-2.5">
              {otherTasks.map((task) => {
                const isDone = !!completedTaskIds[task.id];
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    role="button"
                    tabIndex={0}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer select-none ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-matcha-sub hover:bg-[rgba(195,218,190,0.65)] border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className="mt-0.5 text-emerald-600 shrink-0 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                      )}
                    </button>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.timeSlot ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 font-['JetBrains_Mono'] text-xs font-black shrink-0 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{task.timeSlot}</span>
                            {task.durationMinutes && (
                              <span className="text-[10px] bg-emerald-200/80 text-emerald-950 px-1.5 py-0.5 rounded font-black">
                                ({task.durationMinutes}m)
                              </span>
                            )}
                          </span>
                        ) : task.durationMinutes ? (
                          <span className="text-[10px] font-black font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 shrink-0">
                            {task.durationMinutes}m
                          </span>
                        ) : null}
                        <span className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {cleanSkillLabel(task.label)}
                        </span>
                      </div>
                      {task.topic && (
                        <p className="text-[11px] text-slate-500 font-medium">{task.topic}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* DAILY NOTES & MISTAKE REFLECTION (Room for Breathing)        */}
        {/* ============================================================ */}
        <section className="ios-glass-card rounded-3xl border-2 border-[#a6c4a1] shadow-grave p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#a6c4a1]/50 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-black font-['Space_Grotesk'] text-[#122810]">
                Daily Reflection & Error Log
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                ⚡ Dual-syncs to Master Error Log
              </span>
              {notesSavedAlert && (
                <span className="text-xs font-black font-['JetBrains_Mono'] text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#274624] font-medium">
            Record tricky traps, missed formulas, or vocabulary encountered during this session. Auto-saves directly to today's schedule and the Master Error Log when you click away.
          </p>

          <textarea
            value={currentNotes}
            onChange={(e) => setCurrentNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder={`Jot down formulas or mistakes for ${day.formattedDate}... (e.g. Remember to check discriminant b² - 4ac before solving quadratic, Desmos regression syntax y1 ~ mx1 + b)`}
            rows={4}
            className="w-full p-4 rounded-2xl border-2 border-[#a6c4a1] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30 text-xs sm:text-sm text-[#122810] font-medium leading-relaxed bg-matcha-sub/90 shadow-inner focus:outline-none transition"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {onOpenStruggleModal && day.tasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenStruggleModal(day)}
                  className="px-3.5 py-2 rounded-xl text-xs font-black font-['Space_Grotesk'] text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 shadow-2xs hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Stuck Concept / Struggle {stuckCount > 0 ? `(${stuckCount})` : ''}</span>
                </button>
              )}
              <button
                onClick={() => onOpenErrorLogModal(day.dateStr)}
                className="text-xs font-black font-['JetBrains_Mono'] text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Add formal question autopsy to Master Error Log</span>
              </button>
            </div>

            <button
              onClick={handleNotesBlur}
              className="px-4 py-2 rounded-xl text-xs font-black font-['Space_Grotesk'] text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-2xs hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              Save Notes
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
