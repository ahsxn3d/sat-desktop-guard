'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Clock, 
  Calculator, 
  BookOpen, 
  Coffee, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Minus
} from 'lucide-react';
import { playChime } from '@/utils/audio';
import { DayPlan, DaySessionTiming, SectionPacingResult, TaskItem } from '@/types';
import { evaluatePacing } from '@/utils/pacing';
import { MatchaSelect } from '@/components/MatchaSelect';

interface StopwatchSectionProps {
  allDays: DayPlan[];
  selectedDateStr: string;
  selectedTaskId?: string;
  onSelectDateStr?: (dateStr: string) => void;
  onSelectTaskId?: (taskId: string) => void;
  onSaveTiming?: (timing: DaySessionTiming) => void;
  existingTiming?: DaySessionTiming;
  completedTaskIds?: Record<string, boolean>;
  onToggleTask?: (dayId: string, taskId: string) => void;
  taskTimings?: Record<string, import('@/types').TaskTimingRecord>;
  onSaveTaskTiming?: (taskId: string, seconds: number) => void;
}

type TimerMode = 'lesson' | 'break';

export const StopwatchSection: React.FC<StopwatchSectionProps> = ({
  allDays,
  selectedDateStr,
  selectedTaskId: initialSelectedTaskId,
  onSelectDateStr,
  onSelectTaskId,
  onSaveTiming,
  completedTaskIds = {},
  onToggleTask,
  taskTimings = {},
  onSaveTaskTiming,
}) => {
  const [currentDateStr, setCurrentDateStr] = useState<string>(selectedDateStr || '2026-09-12');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialSelectedTaskId || null);
  const [timerMode, setTimerMode] = useState<TimerMode>('lesson');
  const [breakDurationMinutes, setBreakDurationMinutes] = useState<number>(10);
  
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [stageTargetSeconds, setStageTargetSeconds] = useState<number>(20 * 60);
  const [stageElapsedSeconds, setStageElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync prop changes or URL query params
  useEffect(() => {
    if (selectedDateStr) {
      setCurrentDateStr(selectedDateStr);
    }
  }, [selectedDateStr]);

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlDate = params.get('date');
      const urlTaskId = params.get('taskId');
      if (urlDate) {
        setCurrentDateStr(urlDate);
      }
      if (urlTaskId) {
        setSelectedTaskId(urlTaskId);
      }
    }
  }, []);

  const activeDay = useMemo(() => {
    return allDays.find((d) => d.dateStr === currentDateStr) || allDays[0];
  }, [allDays, currentDateStr]);

  // Auto-select initial task for the active day if none selected
  useEffect(() => {
    if (!activeDay || activeDay.tasks.length === 0) return;
    
    // If selectedTaskId is valid for activeDay, keep it
    const exists = activeDay.tasks.some(t => t.id === selectedTaskId);
    if (!exists) {
      // Find first uncompleted task, or first task
      const firstUncompleted = activeDay.tasks.find(t => !completedTaskIds[t.id]);
      const target = firstUncompleted || activeDay.tasks[0];
      if (target) {
        setSelectedTaskId(target.id);
        const mins = target.durationMinutes || (target.subject === 'math' ? 25 : target.subject === 'rw' ? 20 : 20);
        setSecondsRemaining(mins * 60);
        setStageTargetSeconds(mins * 60);
        setStageElapsedSeconds(0);
        setIsRunning(false);
        setTimerMode('lesson');
      }
    }
  }, [activeDay, completedTaskIds]);

  const activeTask = useMemo(() => {
    if (!activeDay || timerMode === 'break') return null;
    return activeDay.tasks.find(t => t.id === selectedTaskId) || activeDay.tasks[0] || null;
  }, [activeDay, selectedTaskId, timerMode]);

  // Switch active lesson
  const handleSelectTask = (task: TaskItem) => {
    setIsRunning(false);
    setSelectedTaskId(task.id);
    setTimerMode('lesson');
    setIsFinished(false);
    const mins = task.durationMinutes || (task.subject === 'math' ? 25 : task.subject === 'rw' ? 20 : 20);
    setSecondsRemaining(mins * 60);
    setStageTargetSeconds(mins * 60);
    setStageElapsedSeconds(0);
    onSelectTaskId?.(task.id);
  };

  // Switch to Break Mode
  const handleSelectBreak = (mins: number) => {
    setIsRunning(false);
    setTimerMode('break');
    setBreakDurationMinutes(mins);
    setIsFinished(false);
    setSecondsRemaining(mins * 60);
    setStageTargetSeconds(mins * 60);
    setStageElapsedSeconds(0);
  };

  // Timer Tick Interval (Silent countdown, pleasant chime on complete)
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteTimer();
            return 0;
          }
          return prev - 1;
        });
        setStageElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, activeTask, timerMode]);

  const handleCompleteTimer = () => {
    setIsRunning(false);
    setIsFinished(true);

    if (soundEnabled) {
      if (timerMode === 'break') {
        playChime('phase');
      } else {
        playChime('done');
      }
    }

    // Mark task done if in lesson mode
    if (timerMode === 'lesson' && activeTask && onToggleTask) {
      if (!completedTaskIds[activeTask.id]) {
        onToggleTask(activeDay.id, activeTask.id);
      }
    }
  };

  // Advance to Next Lesson in Queue
  const handleNextLesson = () => {
    if (!activeDay || activeDay.tasks.length === 0) return;
    
    // If on a task, find its index
    const currentIndex = activeDay.tasks.findIndex(t => t.id === selectedTaskId);
    if (currentIndex >= 0 && currentIndex < activeDay.tasks.length - 1) {
      const nextTask = activeDay.tasks[currentIndex + 1];
      handleSelectTask(nextTask);
    } else if (currentIndex === activeDay.tasks.length - 1) {
      // Finished all tasks for today!
      setIsFinished(true);
      setIsRunning(false);
    } else {
      handleSelectTask(activeDay.tasks[0]);
    }
  };

  // Complete current lesson and advance to next
  const handleMarkCompleteAndAdvance = () => {
    if (activeTask) {
      if (onToggleTask && !completedTaskIds[activeTask.id]) {
        onToggleTask(activeDay.id, activeTask.id);
      }
      if (onSaveTaskTiming) {
        const elapsed = stageElapsedSeconds > 0 ? stageElapsedSeconds : stageTargetSeconds;
        onSaveTaskTiming(activeTask.id, elapsed);
      }
    }
    if (soundEnabled) playChime('done');
    handleNextLesson();
  };

  const handleResetStage = () => {
    setIsRunning(false);
    setIsFinished(false);
    setSecondsRemaining(stageTargetSeconds);
    setStageElapsedSeconds(0);
  };

  const handleAdjustMinutes = (delta: number) => {
    setSecondsRemaining((prev) => Math.max(60, prev + delta * 60));
    setStageTargetSeconds((prev) => Math.max(60, prev + delta * 60));
  };

  // Calculations for Chronograph Display
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const elapsedMins = Math.floor(stageElapsedSeconds / 60);
  const elapsedSecs = stageElapsedSeconds % 60;
  const formattedElapsed = `${String(elapsedMins).padStart(2, '0')}:${String(elapsedSecs).padStart(2, '0')}`;

  const totalSecs = Math.max(1, stageTargetSeconds);
  const stageProgressFraction = Math.min(1, stageElapsedSeconds / totalSecs);
  const stagePercentage = Math.round(stageProgressFraction * 100);
  const secondHandAngle = (stageElapsedSeconds % 60) * 6;

  // Active theme configuration
  const theme = useMemo(() => {
    if (timerMode === 'break') {
      return {
        name: `${breakDurationMinutes}-Min Screen-Off Break`,
        subjectBadge: 'RECOVERY',
        ringColor: '#f59e0b',
        ringGlow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]',
        icon: Coffee,
        title: 'Cognitive Recovery Break',
        timeSlot: 'Screen-Free Rest',
        rule: 'Look away from the screen, drink water, walk, and let your neurotransmitters recharge.',
      };
    }

    if (!activeTask) {
      return {
        name: 'Lesson Timer',
        subjectBadge: 'STUDY',
        ringColor: '#10b981',
        ringGlow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]',
        icon: Calculator,
        title: 'Select a Lesson Below',
        timeSlot: '',
        rule: 'Choose any scheduled unit to start its dedicated countdown.',
      };
    }

    if (activeTask.subject === 'math') {
      return {
        name: `${activeTask.code || 'Math'}: ${activeTask.topic || activeTask.label}`,
        subjectBadge: 'MATH',
        ringColor: '#10b981',
        ringGlow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]',
        icon: Calculator,
        title: activeTask.code ? `${activeTask.code} • ${activeTask.topic || activeTask.label}` : activeTask.label,
        timeSlot: activeTask.timeSlot || `${activeTask.durationMinutes || 20} min target`,
        rule: `Target: ${activeTask.durationMinutes || 20} mins. Use Desmos keyboard shortcuts aggressively for speed.`,
      };
    }

    if (activeTask.subject === 'rw') {
      return {
        name: `${activeTask.code || 'R&W'}: ${activeTask.topic || activeTask.label}`,
        subjectBadge: 'READING & WRITING',
        ringColor: '#6366f1',
        ringGlow: 'drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]',
        icon: BookOpen,
        title: activeTask.code ? `${activeTask.code} • ${activeTask.topic || activeTask.label}` : activeTask.label,
        timeSlot: activeTask.timeSlot || `${activeTask.durationMinutes || 20} min target`,
        rule: `Target: ${activeTask.durationMinutes || 20} mins. Read question stem first; test grammar boundaries.`,
      };
    }

    if (activeTask.subject === 'test') {
      return {
        name: activeTask.label,
        subjectBadge: 'FULL MOCK TEST',
        ringColor: '#f43f5e',
        ringGlow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]',
        icon: Sparkles,
        title: activeTask.label,
        timeSlot: activeTask.timeSlot || `${activeTask.durationMinutes || 144} min target`,
        rule: 'Full Bluebook exam simulation under official timed test conditions.',
      };
    }

    return {
      name: activeTask.label,
      subjectBadge: activeTask.subject.toUpperCase(),
      ringColor: '#14b8a6',
      ringGlow: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.5)]',
      icon: Clock,
      title: activeTask.label,
      timeSlot: activeTask.timeSlot || '',
      rule: 'Focus on disciplined execution without distractions.',
    };
  }, [timerMode, activeTask, breakDurationMinutes]);

  const StageIcon = theme.icon;
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stageProgressFraction * circumference);

  return (
    <motion.section 
      id="section-stopwatch"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="ios-glass-card rounded-3xl p-5 sm:p-7 shadow-grave space-y-5"
    >
      {/* Top Header with Day Switcher & Quick Utilities */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#a6c4a1]/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#264e22] text-[#f2f8f0] font-['JetBrains_Mono'] shadow-xs border border-[#3b6e35]">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Dedicated Lesson Chronograph</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#122810] font-['Space_Grotesk'] mt-1">
            {activeDay.dayNumber ? `Day ${activeDay.dayNumber} — ` : ''}{activeDay.formattedDate}
            {activeDay.studyTimeMinutes ? (
              <span className="text-sm font-bold text-emerald-800 font-['JetBrains_Mono'] ml-2">
                (Study Time: {activeDay.studyTimeMinutes} min)
              </span>
            ) : null}
          </h2>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Day Selector with custom Matcha UI */}
          <MatchaSelect
            value={currentDateStr}
            onChange={(newDate) => {
              setCurrentDateStr(newDate);
              onSelectDateStr?.(newDate);
            }}
            icon={<CalendarIcon className="w-3.5 h-3.5 text-[#264e22]" />}
            options={allDays.slice(0, 35).map((d) => ({
              value: d.dateStr,
              label: `${d.dayNumber ? `Day ${d.dayNumber} - ` : ''}${d.formattedDate}`,
              badge: d.isBuffer ? 'Rest' : undefined,
            }))}
            variant="matcha"
            size="sm"
          />

          {/* Break Quick-Launch Buttons */}
          <button
            onClick={() => handleSelectBreak(10)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
              timerMode === 'break' && breakDurationMinutes === 10
                ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400/40'
                : 'bg-white/80 hover:bg-white text-slate-800 border-[#a6c4a1]'
            }`}
            title="Start 10-Minute Screen-Off Break"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span>10m Break</span>
          </button>

          <button
            onClick={() => handleSelectBreak(15)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
              timerMode === 'break' && breakDurationMinutes === 15
                ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400/40'
                : 'bg-white/80 hover:bg-white text-slate-800 border-[#a6c4a1]'
            }`}
            title="Start 15-Minute Break"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span>15m Break</span>
          </button>

          {/* SAT Desmos Link */}
          <a
            href="https://www.desmos.com/testing/cb-digital-sat/graphing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-[#122810] bg-white/80 hover:bg-white border border-[#a6c4a1] transition shadow-xs cursor-pointer"
            title="Open Official SAT Bluebook Desmos Graphing Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Desmos</span>
            <ExternalLink className="w-3 h-3 text-[#264e22]" />
          </a>

          {/* Chime Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              soundEnabled 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-950' 
                : 'bg-white/80 border-[#a6c4a1] text-slate-400'
            }`}
            title={soundEnabled ? 'Chimes: ON' : 'Chimes: OFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>
        </div>
      </div>

      {/* SCHEDULED LESSONS QUEUE FOR CURRENT DAY */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-['JetBrains_Mono'] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Click Any Lesson to Set Exact Time Limit:</span>
          </span>
          <span className="text-[11px] font-bold text-slate-600 font-['JetBrains_Mono']">
            {activeDay.tasks.filter(t => completedTaskIds[t.id]).length} / {activeDay.tasks.length} Completed
          </span>
        </div>

        {/* Multi-Row Scheduled Lesson Cards Grid (Fits cleanly into 2 rows, never cropped) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pt-1">
          {activeDay.tasks.map((task, idx) => {
            const isSelected = timerMode === 'lesson' && activeTask?.id === task.id;
            const isDone = !!completedTaskIds[task.id];
            const taskMins = task.durationMinutes || (task.subject === 'math' ? 25 : 20);
            const recordedTiming = taskTimings[task.id];

            return (
              <button
                key={task.id}
                onClick={() => handleSelectTask(task)}
                className={`task-check-card calendar-date-neon-hover w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30 -translate-y-0.5'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-300/80 text-slate-700'
                    : 'bg-white/85 border-[#a6c4a1] hover:bg-white text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md font-['JetBrains_Mono'] ${
                      task.subject === 'math'
                        ? 'bg-emerald-100 text-emerald-900'
                        : task.subject === 'rw'
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {task.code || `Unit ${idx + 1}`} • {taskMins}m
                    </span>
                    
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <div className="font-bold text-xs text-slate-950 font-['Space_Grotesk'] line-clamp-2 mb-1">
                    {task.topic || task.label}
                  </div>
                </div>

                <div className="space-y-1 mt-2 pt-1 border-t border-slate-200/50">
                  {task.timeSlot && (
                    <div className="text-[10px] font-semibold text-slate-600 font-['JetBrains_Mono'] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{task.timeSlot}</span>
                    </div>
                  )}

                  {recordedTiming && (
                    <div className="text-[10px] font-black text-emerald-800 font-['JetBrains_Mono'] flex items-center gap-1 bg-emerald-100/90 border border-emerald-300/60 px-1.5 py-0.5 rounded shadow-2xs">
                      <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Exact Time: {recordedTiming.formatted}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Giant Chronograph Bezel & Stopwatch Center */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1c0b] text-white shadow-2xl flex flex-col items-center justify-center relative overflow-hidden border-2 border-[#203c1b]">
        {/* Subtle Ambient Glow Behind Clock */}
        <div 
          className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: theme.ringColor }}
        />

        {/* Stopwatch Bezel */}
        <div className="relative w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] rounded-full bg-[#11230f] border-4 border-[#1c3619] shadow-inner flex items-center justify-center p-4">
          {/* 60 Analog Ticks around perimeter */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => {
              const isMajor = i % 5 === 0;
              const angle = i * 6;
              return (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 -translate-x-1/2 origin-[50%_140px] sm:origin-[50%_165px]"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className={`w-[2px] rounded-full transition-colors ${
                      isMajor ? 'h-3 sm:h-3.5 bg-emerald-400' : 'h-1 sm:h-1.5 bg-emerald-900/60'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* SVG Circular Progress */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 330 330">
            <circle cx="165" cy="165" r={radius} stroke="#183015" strokeWidth="8" fill="none" />
            <circle
              cx="165"
              cy="165"
              r={radius}
              stroke={theme.ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>

          {/* Rotating Second Hand */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transform: `rotate(${secondHandAngle}deg)`, transition: 'transform 0.2s linear' }}
          >
            <div 
              className="w-[2px] h-28 sm:h-32 rounded-full -translate-y-14 sm:-translate-y-16 shadow-sm"
              style={{ backgroundColor: theme.ringColor }}
            />
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full absolute -translate-y-28 sm:-translate-y-32 border-2 border-slate-950"
              style={{ backgroundColor: theme.ringColor }}
            />
          </div>

          {/* Center Cap */}
          <div className="absolute w-3.5 h-3.5 rounded-full bg-[#183015] border-2 border-[#2e5d29] z-10 pointer-events-none" />

          {/* Center Information */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-[240px]">
            <div 
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-['JetBrains_Mono'] mb-1 border"
              style={{ 
                backgroundColor: `${theme.ringColor}20`,
                color: theme.ringColor,
                borderColor: `${theme.ringColor}40`
              }}
            >
              <StageIcon className="w-3 h-3" />
              <span>{theme.subjectBadge}</span>
            </div>

            <div className="text-4xl sm:text-5xl font-black font-['JetBrains_Mono'] tracking-tight text-white drop-shadow-md my-0.5">
              {isFinished ? 'DONE' : formattedTime}
            </div>

            <div className="text-[11px] font-bold text-slate-200 font-['Space_Grotesk'] line-clamp-1 mt-0.5">
              {theme.title}
            </div>

            {theme.timeSlot && (
              <div className="text-[10px] font-bold text-amber-300 font-['JetBrains_Mono'] mt-0.5">
                {theme.timeSlot}
              </div>
            )}

            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isRunning ? 'Timer Running' : isFinished ? 'Complete!' : 'Ready to Start'}</span>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-2.5 mt-6 flex-wrap justify-center">
          {/* Quick Minute Adjustments */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15">
            <button
              onClick={() => handleAdjustMinutes(-1)}
              disabled={secondsRemaining <= 60}
              className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-40 text-white transition active:scale-95 cursor-pointer"
              title="-1 minute"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-300 px-1 font-['JetBrains_Mono']">
              {Math.round(stageTargetSeconds / 60)}m
            </span>
            <button
              onClick={() => handleAdjustMinutes(5)}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition active:scale-95 cursor-pointer"
              title="+5 minutes"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleResetStage}
            disabled={stageElapsedSeconds === 0 && !isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 border border-white/15 text-xs font-black text-white transition active:scale-95 cursor-pointer"
            title="Reset timer for this lesson"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* MAIN START / PAUSE BUTTON */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all transform active:scale-95 shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-400/30'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 ring-2 ring-emerald-400/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>PAUSE TIMER</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {stageElapsedSeconds > 0 
                    ? 'RESUME TIMER' 
                    : timerMode === 'break' 
                    ? `START ${breakDurationMinutes}M BREAK`
                    : `START TIMER (${Math.round(stageTargetSeconds / 60)}M)`}
                </span>
              </>
            )}
          </button>

          {/* COMPLETE & NEXT BUTTON */}
          {timerMode === 'lesson' && activeTask && (
            <button
              onClick={handleMarkCompleteAndAdvance}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white transition active:scale-95 cursor-pointer shadow-md"
              title="Mark this lesson completed and advance to next lesson in queue"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done & Next &rarr;</span>
            </button>
          )}

          {timerMode === 'break' && (
            <button
              onClick={handleNextLesson}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-black text-white transition active:scale-95 cursor-pointer"
            >
              <span>Back to Lessons</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live SAT Protocol Sub-banner */}
        <div className="w-full max-w-xl rounded-xl bg-[#142911] border border-[#264e22] p-3 flex items-center gap-3 mt-4 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-200 font-['JetBrains_Mono']">
              Active Session: {theme.name}
            </div>
            <div className="text-[11px] text-slate-300 font-medium leading-tight">
              {theme.rule}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
