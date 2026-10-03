'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Zap, 
  BookOpen, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  ArrowUpRight,
  Filter,
  Coffee,
  CheckCheck,
  AlertCircle,
  Target,
  Flame
} from 'lucide-react';
import { WeekPlan } from '../types';
import { ScoreCalculatorSection, MockTestScoreRecord } from './ScoreCalculatorSection';

interface Phase2DaySchedule {
  dateStr: string;
  displayDate: string;
  dayOfWeek: string;
  taskTitle: string;
  whatItMeans: string;
  category: 'test' | 'review' | 'drill' | 'buffer' | 'rest' | 'taper' | 'exam';
  taskId: string;
  dayId: string;
}

const PHASE_2_SCHEDULE: Phase2DaySchedule[] = [
  {
    dateStr: '2026-10-25',
    displayDate: 'Sun Oct 25',
    dayOfWeek: 'Sun',
    taskTitle: 'REST DAY -- Phase 1 Complete! Full Cognitive Recharge',
    whatItMeans: 'Full day off, no studying. Phase 1 curriculum completed across 29 study days! Guaranteed mental reset before Bluebook Mocks.',
    category: 'rest',
    taskId: 'p2-oct25-rest',
    dayId: '2026-10-25',
  },
  {
    dateStr: '2026-10-26',
    displayDate: 'Mon Oct 26',
    dayOfWeek: 'Mon',
    taskTitle: 'TEST #1 (full Bluebook Practice Test, real conditions)',
    whatItMeans: '8:00 AM - 10:24 AM: Full timed Bluebook Practice Test #1 under real conditions',
    category: 'test',
    taskId: 'p2-test-1',
    dayId: '2026-10-26',
  },
  {
    dateStr: '2026-10-27',
    displayDate: 'Tue Oct 27',
    dayOfWeek: 'Tue',
    taskTitle: 'Error-log review of Test #1 + Math/Desmos drills on weak areas (75 min)',
    whatItMeans: '6:30 PM - 7:45 PM: Dissect every wrong question on Test #1 in Error Notebook + Math/Desmos drills on weak areas',
    category: 'review',
    taskId: 'p2-oct27-review',
    dayId: '2026-10-27',
  },
  {
    dateStr: '2026-10-28',
    displayDate: 'Wed Oct 28',
    dayOfWeek: 'Wed',
    taskTitle: 'Targeted R&W drills, punctuation/grammar review (60 min)',
    whatItMeans: '6:30 PM - 7:30 PM: Targeted R&W drills, punctuation and grammar rule consolidation',
    category: 'drill',
    taskId: 'p2-oct28-rw',
    dayId: '2026-10-28',
  },
  {
    dateStr: '2026-10-29',
    displayDate: 'Thu Oct 29',
    dayOfWeek: 'Thu',
    taskTitle: 'Light targeted practice on remaining weak spots (45 min)',
    whatItMeans: '6:30 PM - 7:15 PM: Light targeted practice on remaining weak spots',
    category: 'drill',
    taskId: 'p2-oct29-light',
    dayId: '2026-10-29',
  },
  {
    dateStr: '2026-10-30',
    displayDate: 'Fri Oct 30',
    dayOfWeek: 'Fri',
    taskTitle: 'TEST #2 (full Bluebook Practice Test)',
    whatItMeans: '8:00 AM - 10:24 AM: Full timed Bluebook Practice Test #2 under real conditions',
    category: 'test',
    taskId: 'p2-test-2',
    dayId: '2026-10-30',
  },
  {
    dateStr: '2026-10-31',
    displayDate: 'Sat Oct 31',
    dayOfWeek: 'Sat',
    taskTitle: 'Error-log review of Test #2 + targeted drills (75 min)',
    whatItMeans: '6:30 PM - 7:45 PM: Dissect every wrong question on Test #2 and redo missed problems on weak areas',
    category: 'review',
    taskId: 'p2-oct31-review',
    dayId: '2026-10-31',
  },
  {
    dateStr: '2026-11-01',
    displayDate: 'Sun Nov 1',
    dayOfWeek: 'Sun',
    taskTitle: 'REST DAY',
    whatItMeans: 'Full day off, no studying. Guaranteed mental reset before final week',
    category: 'rest',
    taskId: 'p2-nov01-rest',
    dayId: '2026-11-01',
  },
  {
    dateStr: '2026-11-02',
    displayDate: 'Mon Nov 2',
    dayOfWeek: 'Mon',
    taskTitle: 'Deep review, punctuation & transitions traps + Math cleanup (60 min)',
    whatItMeans: '6:30 PM - 7:30 PM: Grammar traps, transitions, and Math formula cleanup before final full test',
    category: 'review',
    taskId: 'p2-nov02-review',
    dayId: '2026-11-02',
  },
  {
    dateStr: '2026-11-03',
    displayDate: 'Tue Nov 3',
    dayOfWeek: 'Tue',
    taskTitle: 'TEST #3 (final full test, timed)',
    whatItMeans: '8:00 AM - 10:24 AM: Final official Bluebook Practice Test #3 under full timed conditions',
    category: 'test',
    taskId: 'p2-test-3',
    dayId: '2026-11-03',
  },
  {
    dateStr: '2026-11-04',
    displayDate: 'Wed Nov 4',
    dayOfWeek: 'Wed',
    taskTitle: 'Error-log review of Test #3 + simulate exact test-day timing (45 min)',
    whatItMeans: '6:30 PM - 7:15 PM: Dissect every wrong question on Test #3, root-cause autopsy across both Math and R&W',
    category: 'review',
    taskId: 'p2-nov04-review',
    dayId: '2026-11-04',
  },
  {
    dateStr: '2026-11-05',
    displayDate: 'Thu Nov 5',
    dayOfWeek: 'Thu',
    taskTitle: 'Verify Bluebook app/ID/admission ticket + pack your bag (30 min)',
    whatItMeans: '6:30 PM - 7:00 PM: Complete device testing, verify admission ticket, pack approved calculator and ID',
    category: 'drill',
    taskId: 'p2-nov05-pack',
    dayId: '2026-11-05',
  },
  {
    dateStr: '2026-11-06',
    displayDate: 'Fri Nov 6',
    dayOfWeek: 'Fri',
    taskTitle: 'FULL REST. No studying. Sleep early.',
    whatItMeans: 'Zero studying. Eat well, hydrate, relax and sleep early for exam day',
    category: 'rest',
    taskId: 'p2-nov06-rest',
    dayId: '2026-11-06',
  },
  {
    dateStr: '2026-11-07',
    displayDate: 'Sat Nov 7',
    dayOfWeek: 'Sat',
    taskTitle: 'OFFICIAL SAT EXAM DAY',
    whatItMeans: 'Arrive at Crescent Model School, Shadman Lahore by 7:15 AM sharp (gates lock at 7:45 AM). Bring original physical ID, printed ticket, and laptop.',
    category: 'exam',
    taskId: 'sat-exam-day',
    dayId: '2026-11-07',
  },
];

interface BluebookArenaSectionProps {
  weeks: WeekPlan[];
  completedTaskIds: Record<string, boolean>;
  onToggleTask: (dayId: string, taskId: string) => void;
  onOpenDesmos: () => void;
  onOpenErrorLog: () => void;
}

export const BluebookArenaSection: React.FC<BluebookArenaSectionProps> = ({
  weeks,
  completedTaskIds,
  onToggleTask,
  onOpenDesmos,
  onOpenErrorLog,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'test' | 'drill' | 'rest'>('all');
  const [selectedMockForScore, setSelectedMockForScore] = useState<string>('bluebook-test-1');
  const [savedScores, setSavedScores] = useState<Record<string, MockTestScoreRecord>>({});

  const loadSavedScores = () => {
    try {
      const savedStr = localStorage.getItem('anti_burnout_mock_scores_v1');
      if (savedStr) {
        setSavedScores(JSON.parse(savedStr));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadSavedScores();
  }, []);

  const mockTests = [
    { name: 'Bluebook Practice Test #1', date: 'Mon Oct 26', time: '8:00 AM - 10:24 AM', dayId: '2026-10-26', taskId: 'p2-test-1', tag: 'Real Conditions' },
    { name: 'Bluebook Practice Test #2', date: 'Fri Oct 30', time: '8:00 AM - 10:24 AM', dayId: '2026-10-30', taskId: 'p2-test-2', tag: 'Timed Simulation' },
    { name: 'Bluebook Practice Test #3', date: 'Tue Nov 03', time: '8:00 AM - 10:24 AM', dayId: '2026-11-03', taskId: 'p2-test-3', tag: 'Final Full Test' },
  ];

  const completedTestsCount = mockTests.filter((m) => completedTaskIds[m.taskId]).length;
  const completedPhase2Count = PHASE_2_SCHEDULE.filter((item) => completedTaskIds[item.taskId]).length;

  const filteredSchedule = PHASE_2_SCHEDULE.filter((item) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'test') return item.category === 'test' || item.category === 'exam';
    if (filterCategory === 'drill') return item.category === 'drill' || item.category === 'review';
    if (filterCategory === 'rest') return item.category === 'rest' || item.category === 'buffer' || item.category === 'taper';
    return true;
  });

  const getCategoryBadge = (cat: Phase2DaySchedule['category']) => {
    switch (cat) {
      case 'test':
        return 'bg-purple-900/70 text-purple-200 border-purple-400/40';
      case 'exam':
        return 'bg-rose-600 text-white border-rose-300 font-extrabold animate-pulse';
      case 'review':
        return 'bg-indigo-900/70 text-indigo-200 border-indigo-400/40';
      case 'drill':
        return 'bg-sky-900/70 text-sky-200 border-sky-400/40';
      case 'buffer':
        return 'bg-emerald-900/60 text-emerald-200 border-emerald-400/30';
      case 'rest':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50';
      case 'taper':
        return 'bg-amber-900/60 text-amber-200 border-amber-400/40';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-600';
    }
  };

  return (
    <motion.section 
      id="section-bluebook"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-br from-[#06243f]/95 via-[#0b3b64]/90 to-[#026aa2]/85 text-white rounded-3xl border-2 border-sky-400/40 p-5 sm:p-7 shadow-grave hover:shadow-grave-hover space-y-6 transition-all duration-300 backdrop-blur-xl"
    >
      {/* Phase 2 Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-sky-500/30 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-sky-400/25 text-sky-200 border border-sky-300/40 font-['JetBrains_Mono'] shadow-2xs">
              Phase 2: Oct 25 – Nov 6 (13 Days) + Nov 7 Exam Day
            </span>
            <span className="text-xs text-amber-300 font-extrabold font-['JetBrains_Mono']">
              3 Full Mocks &bull; Error Autopsies &bull; 11 Buffer Days Integrated
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-luxury flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>The Bluebook Arena: Full Phase 2 Breakdown</span>
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed font-medium">
            Strict 13-day test-prep protocol transitioning from content learning into timed Bluebook mastery, targeted Khan repair, exact wake-up rehearsals, and zero-burnout taper.
          </p>

          {/* Adaptive Flow Notice */}
          <div className="mt-2 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Adaptive Flow Active:</strong> 11 Buffer Days absorbed (Sep 22–Oct 2). Phase 1 curriculum completed across 29 study days (Sep 14 – Oct 24) with 100% skill mastery. Phase 2 launches Mon Oct 26 with Test #1!
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('phase2-score-calculator');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 hover:shadow-md active:scale-[0.98] transition-all duration-150 shadow-xs flex items-center gap-1.5 min-h-[44px] cursor-pointer"
          >
            <Target className="w-4 h-4 text-slate-950" />
            <span>Score & Gap Calculator</span>
          </button>
          <button
            onClick={onOpenErrorLog}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-md active:scale-[0.98] transition-all duration-150 shadow-xs flex items-center gap-1.5 min-h-[44px] cursor-pointer border border-indigo-400/40"
          >
            <BookOpen className="w-4 h-4" />
            <span>Error Log</span>
          </button>
        </div>
      </div>

      {/* The Official Mock Tests Tracker */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-200 font-['JetBrains_Mono']">
            Core Bluebook Practice Tests & Dry Runs
          </h3>
          <span className="text-xs font-black font-['JetBrains_Mono'] text-sky-200 bg-[#072540]/90 px-3 py-1 rounded-xl border border-sky-400/35">
            {completedTestsCount} of {mockTests.length} Completed ({Math.round((completedTestsCount / mockTests.length) * 100)}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {mockTests.map((mock, idx) => {
            const isDone = !!completedTaskIds[mock.taskId];
            const testScore = savedScores[mock.taskId];
            const delta = testScore ? testScore.totalScore - testScore.targetTotal : 0;

            return (
              <motion.div
                key={mock.taskId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 shadow-grave-card hover:shadow-grave-card-hover smooth-card-hover cursor-default ${
                  isDone 
                    ? 'bg-[#051c33]/90 border-emerald-400/80 text-sky-100' 
                    : 'bg-[#082a4a]/70 border-sky-400/25 hover:border-sky-300 hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.35)] text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-200 font-['JetBrains_Mono'] border border-sky-400/30">
                      Step #{idx + 1}
                    </span>
                    <span className="text-xs text-amber-300 font-black font-['JetBrains_Mono']">{mock.date}</span>
                  </div>
                  <h4 className="mt-2.5 text-base font-bold text-white font-luxury">
                    {mock.name}
                  </h4>
                  <p className="mt-1 text-xs text-sky-200 font-semibold">
                    Timing: <span className="text-white font-extrabold">{mock.time}</span>
                  </p>

                  {/* Score & Gap pill if logged */}
                  {testScore ? (
                    <div className="mt-2 p-2 rounded-xl bg-slate-900/90 border border-sky-400/40 text-xs flex items-center justify-between font-['JetBrains_Mono']">
                      <span className="font-bold text-white">
                        Score: <strong className="text-amber-300">{testScore.totalScore} / 1600</strong> (Math: {testScore.mathScore} &bull; R&amp;W: {testScore.rwScore})
                      </span>
                      <span className={`font-black text-[10px] px-1.5 py-0.5 rounded ${
                        delta >= 0 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
                      }`}>
                        {delta >= 0 ? `+${delta}` : delta}
                      </span>
                    </div>
                  ) : (
                    <span className="mt-2.5 inline-block text-[10px] font-black text-sky-100 bg-[#061e36]/90 px-2.5 py-1 rounded-lg border border-sky-400/30 font-['JetBrains_Mono']">
                      {mock.tag}
                    </span>
                  )}
                </div>

                <div className="pt-2.5 border-t border-sky-500/25 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleTask(mock.dayId, mock.taskId)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-150 min-h-[44px] cursor-pointer hover:scale-[1.02] active:scale-95 ${
                      isDone 
                        ? 'bg-emerald-400 text-slate-950 shadow-xs' 
                        : 'bg-sky-600/80 hover:bg-sky-500 text-white border border-sky-400/40 hover:border-sky-200'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-sky-200" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>

                  {/* Score & Gap Button */}
                  <button
                    onClick={() => {
                      setSelectedMockForScore(mock.taskId);
                      const el = document.getElementById('phase2-score-calculator');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    title="Calculate Score & Gap Analysis"
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition border border-amber-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                  >
                    <Target className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onOpenErrorLog}
                    title="Log mistakes from this test"
                    className="p-2.5 rounded-xl bg-sky-900/70 hover:bg-sky-700/80 text-sky-200 hover:text-white transition border border-sky-500/40 hover:border-sky-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Test 4 & Mon Nov 2 Simulation Protocol Note */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-300/50 shadow-grave-card hover:shadow-grave-card-hover transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase font-['JetBrains_Mono']">
                <ShieldAlert className="w-4 h-4" />
                <span>Mon Nov 2 Simulation Protocol</span>
              </div>
              <h4 className="text-base font-bold text-amber-100 font-luxury">
                Exact Timing Dry Run
              </h4>
              <p className="text-xs text-sky-100 font-medium leading-relaxed">
                Wake at your real exam wake-up time (6:00–6:30 AM), eat your exact test-day breakfast, and execute a timed module at the exact hour your real SAT starts.
              </p>
            </div>
            <div className="text-[11px] text-amber-200 font-black pt-2 font-['JetBrains_Mono']">
              Eliminates test-day adrenaline shock and body-clock lag.
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULL 18-DAY INTERACTIVE PHASE 2 BREAKDOWN (Oct 20 – Nov 7)    */}
      {/* ============================================================ */}
      <div className="space-y-3.5 pt-4 border-t border-sky-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-luxury flex items-center gap-2">
              <span>Full Phase 2 Breakdown (Oct 28 – Nov 6, 10 days + Nov 7 Exam Day)</span>
            </h3>
            <p className="text-xs text-sky-200 font-medium mt-0.5">
              Every day has a defined purpose: test, autopsy, targeted Khan fix, or non-negotiable rest.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[#051c33] p-1 rounded-xl border border-sky-400/30 text-xs">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'all' ? 'bg-sky-500 text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                All (12d)
              </button>
              <button
                onClick={() => setFilterCategory('test')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'test' ? 'bg-purple-600 text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Mocks & Exam
              </button>
              <button
                onClick={() => setFilterCategory('drill')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'drill' ? 'bg-sky-600 text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Drills
              </button>
              <button
                onClick={() => setFilterCategory('rest')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'rest' ? 'bg-emerald-600 text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Rest & Taper
              </button>
            </div>

            <span className="text-xs font-mono font-bold text-amber-300 bg-[#061e36] px-2.5 py-1 rounded-lg border border-sky-400/30">
              {completedPhase2Count}/{PHASE_2_SCHEDULE.length} Done
            </span>
          </div>
        </div>

        {/* Breakdown Table / Card Grid */}
        <div className="overflow-hidden rounded-2xl border border-sky-400/30 bg-[#061d33]/85 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-500/30 bg-[#082a4a]/90 text-[11px] font-black uppercase text-sky-200 font-['JetBrains_Mono']">
                  <th className="py-3 px-3 sm:px-4 w-[130px]">Date</th>
                  <th className="py-3 px-3 sm:px-4 w-[280px]">Task</th>
                  <th className="py-3 px-3 sm:px-4">What this actually means</th>
                  <th className="py-3 px-3 sm:px-4 w-[100px] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-500/20 text-xs font-medium">
                {filteredSchedule.map((item) => {
                  const isDone = !!completedTaskIds[item.taskId];
                  const isExamDay = item.category === 'exam';

                  return (
                    <tr
                      key={item.dateStr}
                      onClick={() => onToggleTask(item.dayId, item.taskId)}
                      className={`transition-colors duration-150 cursor-pointer select-none ${
                        isExamDay
                          ? 'bg-rose-950/40 hover:bg-rose-900/50'
                          : isDone
                          ? 'bg-emerald-950/20 hover:bg-emerald-950/35'
                          : 'hover:bg-sky-900/30'
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-black ${isExamDay ? 'text-amber-300 font-bold' : 'text-sky-100'}`}>
                            {item.displayDate}
                          </span>
                        </div>
                      </td>

                      {/* Task */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border font-mono ${getCategoryBadge(item.category)}`}>
                              {item.category.toUpperCase()}
                            </span>
                            <span className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {item.taskTitle}
                            </span>
                          </div>
                          {/* Heading Score Numbering under the Bluebook Test Day */}
                          {savedScores[item.taskId] && (
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              <span className="text-[11px] font-bold text-amber-300 font-['JetBrains_Mono'] bg-[#07243e] px-2.5 py-0.5 rounded-md border border-sky-400/40">
                                Score: {savedScores[item.taskId].totalScore} / 1600 (Math: {savedScores[item.taskId].mathScore} &bull; R&amp;W: {savedScores[item.taskId].rwScore})
                              </span>
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-['JetBrains_Mono'] ${
                                savedScores[item.taskId].totalScore >= savedScores[item.taskId].targetTotal
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}>
                                {savedScores[item.taskId].totalScore >= savedScores[item.taskId].targetTotal
                                  ? `+${savedScores[item.taskId].totalScore - savedScores[item.taskId].targetTotal} vs 1500+ Goal`
                                  : `${savedScores[item.taskId].totalScore - savedScores[item.taskId].targetTotal} vs 1500+ Goal`}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* What this actually means */}
                      <td className="py-3 px-3 sm:px-4">
                        <span className={`leading-relaxed ${isDone ? 'text-slate-400' : 'text-sky-100/90 font-medium'}`}>
                          {item.whatItMeans}
                        </span>
                      </td>

                      {/* Status / Checkbox */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(item.dayId, item.taskId);
                          }}
                          className="inline-flex items-center justify-center cursor-pointer p-1 transition transform active:scale-90"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <Circle className="w-5 h-5 text-sky-400/60 hover:text-emerald-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Arena Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-sky-500/25">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 rounded-2xl bg-[#072642]/80 border border-sky-500/30 shadow-grave-card hover:shadow-grave-card-hover transition-all duration-200"
        >
          <div className="text-xs font-black text-sky-300 font-['JetBrains_Mono']">Tue Oct 27 & Wed Oct 28</div>
          <div className="text-base font-bold text-white mt-1 font-luxury">Targeted Drills & Desmos</div>
          <p className="text-xs text-sky-100/90 font-medium mt-1 leading-relaxed">
            Eliminate algebraic calculation for quadratic systems, intersections, and regressions. Redo Khan missed skills immediately after score reports.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 rounded-2xl bg-[#072642]/80 border border-sky-500/30 shadow-grave-card hover:shadow-grave-card-hover transition-all duration-200"
        >
          <div className="text-xs font-black text-emerald-300 font-['JetBrains_Mono']">Thu Nov 5 (Night Before)</div>
          <div className="text-base font-bold text-white mt-1 font-luxury">Pack Bag & Check CNIC</div>
          <p className="text-xs text-sky-100/90 font-medium mt-1 leading-relaxed">
            Original Passport/Smart CNIC, laptop, charger, snacks packed before dinner. No late night scrambling.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 rounded-2xl bg-[#072642]/80 border border-sky-500/30 shadow-grave-card hover:shadow-grave-card-hover transition-all duration-200"
        >
          <div className="text-xs font-black text-rose-300 font-['JetBrains_Mono']">Fri Nov 6 (Zero Studying)</div>
          <div className="text-base font-bold text-white mt-1 font-luxury">Non-Negotiable Full Rest</div>
          <p className="text-xs text-sky-100/90 font-medium mt-1 leading-relaxed">
            Strictly NO practice tests or heavy drills. Sleep early (before 9:30 PM). Prime your mind for 800-level execution tomorrow!
          </p>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* EMBEDDED INLINE SECTION: MOCK TEST SCORE & GAP CALCULATOR    */}
      {/* ============================================================ */}
      <div id="phase2-score-calculator" className="pt-6 border-t-2 border-sky-500/30">
        <ScoreCalculatorSection
          initialTestId={selectedMockForScore}
          onNavigateToErrorLog={onOpenErrorLog}
        />
      </div>
    </motion.section>
  );
};
