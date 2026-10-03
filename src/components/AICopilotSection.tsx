'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  ArrowRight, 
  AlertCircle,
  MessageSquare,
  Zap,
  RotateCcw,
  Check,
  ChevronRight,
  CheckSquare,
  Square,
  Search,
  Filter,
  Layers,
  Undo2,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { AIMode, AIChatMessageItem, AIChatSessionItem, ErrorLogEntry } from '../types';
import { STUDY_PLAN_WEEKS } from '../data/studyPlan';
import { MatchaSelect } from './MatchaSelect';

interface AICopilotSectionProps {
  currentDateStr?: string;
  taskScheduleOverrides?: Record<string, string>;
  undoCount?: number;
  onUndo?: () => void;
  onTaskShifted?: (taskId: string, targetDate: string) => void;
  onBatchTaskShifted?: (batch: Record<string, string>) => void;
  onErrorLogged?: (error: ErrorLogEntry) => void;
  onNavigateToCalendar?: () => void;
  onNavigateToErrorLog?: () => void;
}

export interface SyllabusLesson {
  id: string;
  label: string;
  code: string;
  topic: string;
  subject: string;
  unitKey: string;
  durationMinutes: number;
  originalDayNumber: number;
  originalDateStr: string;
  originalFormattedDate: string;
}

export const UNIT_OPTIONS: {
  id: string;
  category: 'Math Chapters' | 'Reading & Writing Units' | 'All Lessons';
  label: string;
  shortTitle: string;
  badge?: string;
}[] = [
  // Math Chapters (All 11 Active Curriculum Chapters in Study Plan: Units 3 to 13)
  { id: 'MATH_U3', category: 'Math Chapters', label: 'Unit 3: Problem Solving & Data (Ratios & Percentages — 9 lessons)', shortTitle: 'Math Ch 3: Problem Solving', badge: '9 lessons' },
  { id: 'MATH_U4', category: 'Math Chapters', label: 'Unit 4: Advanced Math (Quadratics & Parabolas — 13 lessons)', shortTitle: 'Math Ch 4: Quadratics', badge: '13 lessons' },
  { id: 'MATH_U5', category: 'Math Chapters', label: 'Unit 5: Geometry & Trig (Area, Circles & Angles — 6 lessons)', shortTitle: 'Math Ch 5: Geometry & Trig', badge: '6 lessons' },
  { id: 'MATH_U6', category: 'Math Chapters', label: 'Unit 6: Algebra (Linear Equations & Systems — 8 lessons)', shortTitle: 'Math Ch 6: Linear Systems', badge: '8 lessons' },
  { id: 'MATH_U7', category: 'Math Chapters', label: 'Unit 7: Problem Solving (Rates, Ratios & Percentages — 10 lessons)', shortTitle: 'Math Ch 7: Scatterplots & Data', badge: '10 lessons' },
  { id: 'MATH_U8', category: 'Math Chapters', label: 'Unit 8: Advanced Math (Polynomials & Nonlinear Functions — 13 lessons)', shortTitle: 'Math Ch 8: Polynomials', badge: '13 lessons' },
  { id: 'MATH_U9', category: 'Math Chapters', label: 'Unit 9: Geometry & Trig (Right Triangles & Circles — 6 lessons)', shortTitle: 'Math Ch 9: Right Triangles', badge: '6 lessons' },
  { id: 'MATH_U10', category: 'Math Chapters', label: 'Unit 10: Algebra (Advanced Linear Modeling — 8 lessons)', shortTitle: 'Math Ch 10: Linear Modeling', badge: '8 lessons' },
  { id: 'MATH_U11', category: 'Math Chapters', label: 'Unit 11: Problem Solving (Statistics & Spread — 10 lessons)', shortTitle: 'Math Ch 11: Statistics', badge: '10 lessons' },
  { id: 'MATH_U12', category: 'Math Chapters', label: 'Unit 12: Advanced Math (Radicals & Rational Equations — 13 lessons)', shortTitle: 'Math Ch 12: Radicals & Rationals', badge: '13 lessons' },
  { id: 'MATH_U13', category: 'Math Chapters', label: 'Unit 13: Geometry & Trig (Circle Equations & Radians — 6 lessons)', shortTitle: 'Math Ch 13: Circle Eq & Radians', badge: '6 lessons' },
  { id: 'MATH_ALL', category: 'Math Chapters', label: 'All 11 Math Chapters (102 Total Lessons)', shortTitle: 'All Math Chapters', badge: '102 lessons' },
  
  // Reading & Writing Units (All 10 Active Curriculum Units in Study Plan: Units 3 to 12)
  { id: 'RW_U3', category: 'Reading & Writing Units', label: 'Unit 3: Standard English Conventions (3 lessons)', shortTitle: 'R&W Ch 3: Conventions', badge: '3 lessons' },
  { id: 'RW_U4', category: 'Reading & Writing Units', label: 'Unit 4: Form, Structure & Sense (4 lessons)', shortTitle: 'R&W Ch 4: Structure', badge: '4 lessons' },
  { id: 'RW_U5', category: 'Reading & Writing Units', label: 'Unit 5: Inferences & Command of Evidence (4 lessons)', shortTitle: 'R&W Ch 5: Inferences', badge: '4 lessons' },
  { id: 'RW_U6', category: 'Reading & Writing Units', label: 'Unit 6: Transitions & Rhetorical Synthesis (3 lessons)', shortTitle: 'R&W Ch 6: Transitions', badge: '3 lessons' },
  { id: 'RW_U7', category: 'Reading & Writing Units', label: 'Unit 7: Words in Context & Boundaries (4 lessons)', shortTitle: 'R&W Ch 7: Words in Context', badge: '4 lessons' },
  { id: 'RW_U8', category: 'Reading & Writing Units', label: 'Unit 8: Text Structure & Purpose (4 lessons)', shortTitle: 'R&W Ch 8: Text Structure', badge: '4 lessons' },
  { id: 'RW_U9', category: 'Reading & Writing Units', label: 'Unit 9: Cross-Text Connections (3 lessons)', shortTitle: 'R&W Ch 9: Cross-Text', badge: '3 lessons' },
  { id: 'RW_U10', category: 'Reading & Writing Units', label: 'Unit 10: Central Ideas & Details (4 lessons)', shortTitle: 'R&W Ch 10: Central Ideas', badge: '4 lessons' },
  { id: 'RW_U11', category: 'Reading & Writing Units', label: 'Unit 11: Quantitative Evidence (6 lessons)', shortTitle: 'R&W Ch 11: Quantitative Evidence', badge: '6 lessons' },
  { id: 'RW_U12', category: 'Reading & Writing Units', label: 'Unit 12: Complex Evidence & Arguments (8 lessons)', shortTitle: 'R&W Ch 12: Complex Evidence', badge: '8 lessons' },
  { id: 'RW_ALL', category: 'Reading & Writing Units', label: 'All 10 Reading & Writing Units (43 Total Lessons)', shortTitle: 'All R&W Units', badge: '43 lessons' },
];

export const DESTINATION_OPTIONS: {
  id: string;
  label: string;
  group: string;
}[] = [
  { id: 'today', label: 'Today (Current Tracker Date)', group: 'Relative Days' },
  { id: 'tomorrow', label: 'Tomorrow', group: 'Relative Days' },
  { id: 'yesterday', label: 'Yesterday', group: 'Relative Days' },
  { id: '2026-09-27', label: 'Sunday, Sep 27 (Week 2 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: '2026-10-04', label: 'Sunday, Oct 4 (Week 3 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: '2026-10-11', label: 'Sunday, Oct 11 (Week 4 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: '2026-10-18', label: 'Sunday, Oct 18 (Week 5 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: '2026-10-25', label: 'Sunday, Oct 25 (Week 6 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: '2026-10-27', label: 'Tuesday, Oct 27 (Day 30 • Phase 1 Complete)', group: 'Phase 1 Milestones' },
  { id: '2026-11-01', label: 'Sunday, Nov 1 (Week 7 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: '2026-09-20', label: 'Sunday, Sep 20 (Week 1 Buffer Day)', group: 'Sundays / Buffer Days' },
  { id: 'custom', label: '📅 Custom Date (Pick Any Specific Date)...', group: 'Custom' },
];

export function resolveDestinationDate(destId: string, refDateStr: string = '2026-09-22', customDate?: string): string {
  if (destId === 'custom' && customDate) return customDate;
  if (/^\d{4}-\d{2}-\d{2}$/.test(destId)) return destId;

  const [y, m, d] = refDateStr.split('-').map(Number);
  const ref = new Date(y, m - 1, d);

  if (destId === 'today') {
    return refDateStr;
  }
  if (destId === 'tomorrow') {
    const next = new Date(ref);
    next.setDate(next.getDate() + 1);
    const yr = next.getFullYear();
    const mo = String(next.getMonth() + 1).padStart(2, '0');
    const dy = String(next.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  }
  if (destId === 'yesterday') {
    const prev = new Date(ref);
    prev.setDate(prev.getDate() - 1);
    const yr = prev.getFullYear();
    const mo = String(prev.getMonth() + 1).padStart(2, '0');
    const dy = String(prev.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  }
  return destId;
}


const AI_MODES: {
  id: AIMode;
  title: string;
  badge: string;
  icon: any;
  colorClass: string;
  activeClass: string;
  description: string;
  quickPrompts: string[];
}[] = [
  {
    id: 'plan_modifier',
    title: 'Plan Modifier',
    badge: 'Schedule Shift Tools',
    icon: Calendar,
    colorClass: 'text-indigo-700 bg-indigo-100 border-indigo-300',
    activeClass: 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300',
    description: 'Tell the AI to move lessons or chapters from one day to another (e.g. shift Chapter 5 to Sunday).',
    quickPrompts: [
      'Shift Math Chapter 5 to this Sunday',
      'Move today\'s Reading & Writing lesson to tomorrow',
      'Postpone my geometry review to my next buffer day',
      'Move Day 22 math practice to Sunday, Sept 27'
    ]
  },
  {
    id: 'teacher',
    title: 'SAT Master Teacher',
    badge: '26 Formulas & Desmos',
    icon: BookOpen,
    colorClass: 'text-emerald-800 bg-emerald-100 border-emerald-300',
    activeClass: 'bg-[#1a3717] text-white shadow-md ring-2 ring-[#8ec284]',
    description: 'Ask any SAT Math or Reading/Writing concept question. Uses the 26 formulas & Desmos shortcuts.',
    quickPrompts: [
      'Explain vertex form: y = a(x - h)² + k and how to find axis of symmetry',
      'What is the quickest Desmos trick for systems of linear equations?',
      'How does College Board trap students on circle equations (x - h)² + (y - k)² = r²?',
      'Explain transition word questions on the Digital SAT Reading'
    ]
  },
  {
    id: 'coach',
    title: 'Anti-Burnout Coach',
    badge: '8:30 PM Anchor Defense',
    icon: ShieldAlert,
    colorClass: 'text-amber-900 bg-amber-100 border-amber-300',
    activeClass: 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 font-black',
    description: 'Pacing calibration, fatigue management, and keeping you grounded without exhausting yourself.',
    quickPrompts: [
      'I studied for 2 hours and feel exhausted, how do I recover?',
      'How do I protect my 8:30 PM anchor time when school homework piles up?',
      'Give me an anti-panic breathing protocol before starting Bluebook Test #2',
      'I feel guilty taking Sunday buffer days off, why is rest necessary?'
    ]
  },
  {
    id: 'error_worker',
    title: 'Error Log Worker',
    badge: 'Direct Database Logger',
    icon: Zap,
    colorClass: 'text-rose-900 bg-rose-100 border-rose-300',
    activeClass: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300',
    description: 'Tell the AI about any question you missed. It extracts root causes and saves it to your Error Log.',
    quickPrompts: [
      'Log an error for Bluebook Test 1 Module 2 Q14: missed due to negative sign error, takeaway is use parentheses',
      'Log mistake in Khan drill today: rushed through circle radius and used diameter instead of radius',
      'Log Reading question missed: didn\'t read the final sentence of the transition passage',
      'Log mistake: forgot that standard deviation measures spread around the mean'
    ]
  }
];

function parseYMD(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatShortDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || '';
  const dt = parseYMD(dateStr);
  const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = dt.toLocaleDateString('en-US', { month: 'short' });
  return `${dayName}, ${monthName} ${dt.getDate()}`;
}

export const AICopilotSection: React.FC<AICopilotSectionProps> = ({
  currentDateStr = '2026-09-22',

  taskScheduleOverrides = {},
  undoCount = 0,
  onUndo,
  onTaskShifted,
  onBatchTaskShifted,
  onErrorLogged,
  onNavigateToCalendar,
  onNavigateToErrorLog
}) => {
  const [activeMode, setActiveMode] = useState<AIMode>('plan_modifier');
  const [sessions, setSessions] = useState<AIChatSessionItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIChatMessageItem[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Manual Lesson & Chapter Shift Studio State
  // Subject Filter: 'math' or 'rw' - separate tabs so they never collide!
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'rw'>('math');
  // Clean initial state (NO dummy prefilled chapter)
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>('2026-09-27');
  const [customDestinationDate, setCustomDestinationDate] = useState<string>('2026-09-27');
  const [lessonSearchQuery, setLessonSearchQuery] = useState<string>('');
  const [feedbackNotice, setFeedbackNotice] = useState<{
    type: 'success' | 'reset' | 'error' | 'undo';
    message: string;
  } | null>(null);
  // Default to showing all lessons without truncation or cut-off
  const [expandAllLessons, setExpandAllLessons] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract all 145 curriculum lessons dynamically from STUDY_PLAN_WEEKS
  // Strict Subject Isolation: Math is ONLY MATH_U*, RW is ONLY RW_U*
  const allSyllabusLessons = useMemo(() => {
    const list: SyllabusLesson[] = [];
    STUDY_PLAN_WEEKS.forEach((week) => {
      week.days.forEach((day) => {
        day.tasks.forEach((t) => {
          if (t.subject === 'buffer' || t.subject === 'logistics' || t.id.startsWith('break-')) return;

          let unitKey = 'OTHER';
          const mathMatch = t.label.match(/\[MATH\s+U(\d+)/i) || (t.code && t.code.match(/Math\s+U(\d+)/i));
          const rwMatch = t.label.match(/\[(?:R&W|W)\s+U(\d+)/i) || (t.code && t.code.match(/(?:R&W|W)\s+U(\d+)/i));

          if (t.subject === 'math' && mathMatch) {
            unitKey = `MATH_U${mathMatch[1]}`;
          } else if (t.subject === 'rw' && rwMatch) {
            unitKey = `RW_U${rwMatch[1]}`;
          }

          list.push({
            id: t.id,
            label: t.label,
            code: t.code || '',
            topic: t.topic || t.label,
            subject: t.subject,
            unitKey,
            durationMinutes: t.durationMinutes || 20,
            originalDayNumber: day.dayNumber,
            originalDateStr: day.dateStr,
            originalFormattedDate: day.formattedDate,
          });
        });
      });
    });
    return list;
  }, []);

  // Available units filtered by active subject
  const availableUnits = useMemo(() => {
    if (selectedSubject === 'math') {
      return UNIT_OPTIONS.filter((u) => u.category === 'Math Chapters');
    } else {
      return UNIT_OPTIONS.filter((u) => u.category === 'Reading & Writing Units');
    }
  }, [selectedSubject]);

  // Options formatted for dark MatchaSelect dropdown
  const unitOptionsForSelect = useMemo(() => {
    return [
      {
        value: '',
        label: `— Select a ${selectedSubject === 'math' ? 'Math Chapter (Units 3–13)' : 'Reading & Writing Unit (Units 3–12)'} —`,
        badge: 'Required'
      },
      ...availableUnits.map((u) => ({
        value: u.id,
        label: u.label,
        badge: u.badge || u.shortTitle,
        sublabel: selectedSubject === 'math' ? 'SAT Math Chapter' : 'Reading & Writing Unit'
      }))
    ];
  }, [availableUnits, selectedSubject]);

  // Relative Dates: Today, Tomorrow, Yesterday
  const todayDateStr = currentDateStr;
  const tomorrowDateStr = useMemo(() => {
    const d = parseYMD(todayDateStr);
    d.setDate(d.getDate() + 1);
    return formatYMD(d);
  }, [todayDateStr]);
  const yesterdayDateStr = useMemo(() => {
    const d = parseYMD(todayDateStr);
    d.setDate(d.getDate() - 1);
    return formatYMD(d);
  }, [todayDateStr]);

  // Destination Options for Shift Selector
  // Features: Today, Tomorrow, Yesterday, Upcoming Sundays with exact name, day and dates, and Custom Date
  const destinationOptionsForSelect = useMemo(() => {
    const relativeOptions = [
      {
        value: 'today',
        label: `Today (${formatShortDate(todayDateStr)})`,
        badge: 'Today',
        sublabel: 'Current Active Tracker Day'
      },
      {
        value: 'tomorrow',
        label: `Tomorrow (${formatShortDate(tomorrowDateStr)})`,
        badge: 'Tomorrow',
        sublabel: 'Next Immediate Study Day'
      },
      {
        value: 'yesterday',
        label: `Yesterday (${formatShortDate(yesterdayDateStr)})`,
        badge: 'Yesterday',
        sublabel: 'Previous Study Day'
      }
    ];

    const sundayOptions: { value: string; label: string; badge: string; sublabel: string }[] = [];
    STUDY_PLAN_WEEKS.forEach((week) => {
      week.days.forEach((day) => {
        if (day.isBuffer || day.dayOfWeek === 'Sun') {
          const isPast = day.dateStr < todayDateStr;
          const weekLabel = week.title.split(':')[0].trim();
          sundayOptions.push({
            value: day.dateStr,
            label: `${day.formattedDate} • ${weekLabel} Buffer Recovery Window`,
            badge: isPast ? 'Past Buffer' : 'Sunday Buffer',
            sublabel: day.specialInstructions || 'Guaranteed recovery window • zero assigned study'
          });
        }
      });
    });

    const customOption = {
      value: 'custom',
      label: '📅 Custom Date (Pick Any Specific Date)...',
      badge: 'Custom',
      sublabel: 'Opens Matcha Date & Day Picker Sector'
    };

    return [...relativeOptions, ...sundayOptions, customOption];
  }, [todayDateStr, tomorrowDateStr, yesterdayDateStr]);

  // All 54 study plan days formatted for MatchaSelect in the custom date sector
  const allStudyDaysOptionsForSelect = useMemo(() => {
    const options: { value: string; label: string; badge: string; sublabel: string }[] = [];
    STUDY_PLAN_WEEKS.forEach((week) => {
      week.days.forEach((day) => {
        const isSun = day.isBuffer || day.dayOfWeek === 'Sun';
        options.push({
          value: day.dateStr,
          label: `${day.formattedDate} — ${isSun ? 'Sunday Buffer' : `Day ${day.dayNumber || 'Test'}: ${day.weekTitle.split(':')[0]}`}`,
          badge: isSun ? 'Buffer' : day.isTestDay ? 'Exam' : `Day ${day.dayNumber}`,
          sublabel: day.specialInstructions || day.weekTitle
        });
      });
    });
    return options;
  }, []);

  // Formatted preview of custom target date
  const customDateFormattedSummary = useMemo(() => {
    const allDays = STUDY_PLAN_WEEKS.flatMap((w) => w.days);
    const matchedDay = allDays.find((d) => d.dateStr === customDestinationDate);
    if (matchedDay) {
      const dayType = matchedDay.isBuffer
        ? 'Buffer Recovery Day'
        : matchedDay.isTestDay
        ? 'Exam Day'
        : `Day ${matchedDay.dayNumber}`;
      return `${matchedDay.formattedDate} (${dayType})`;
    }
    return formatShortDate(customDestinationDate);
  }, [customDestinationDate]);

  // Quick jump presets
  const quickDatePresets = useMemo(
    () => [
      { label: 'Today', date: todayDateStr },
      { label: 'Tomorrow', date: tomorrowDateStr },
      { label: 'Yesterday', date: yesterdayDateStr },
      { label: 'Sun Sep 27 (W2)', date: '2026-09-27' },
      { label: 'Sun Oct 4 (W3)', date: '2026-10-04' },
      { label: 'Sun Oct 11 (W4)', date: '2026-10-11' },
      { label: 'SAT Test (Nov 7)', date: '2026-11-07' }
    ],
    [todayDateStr, tomorrowDateStr, yesterdayDateStr]
  );

  // Filter lessons for selected unit and search query (supports ALL lessons)
  const filteredLessons = useMemo(() => {
    if (!selectedUnit) return [];
    return allSyllabusLessons.filter((lesson) => {
      if (selectedUnit === 'MATH_ALL') {
        if (lesson.subject !== 'math') return false;
      } else if (selectedUnit === 'RW_ALL') {
        if (lesson.subject !== 'rw') return false;
      } else if (lesson.unitKey !== selectedUnit) {
        return false;
      }
      if (!lessonSearchQuery.trim()) return true;
      const q = lessonSearchQuery.toLowerCase();
      return (
        lesson.label.toLowerCase().includes(q) ||
        lesson.code.toLowerCase().includes(q) ||
        lesson.topic.toLowerCase().includes(q) ||
        lesson.originalFormattedDate.toLowerCase().includes(q)
      );
    });
  }, [allSyllabusLessons, selectedUnit, lessonSearchQuery]);

  // Handle switching between Math and Reading & Writing
  const handleSubjectChange = (subj: 'math' | 'rw') => {
    setSelectedSubject(subj);
    setSelectedUnit('');
    setSelectedLessonIds([]);
    setLessonSearchQuery('');
    setFeedbackNotice(null);
  };

  // Handle selecting a unit / chapter
  const handleUnitChange = (unitId: string) => {
    setSelectedUnit(unitId);
    if (!unitId) {
      setSelectedLessonIds([]);
    } else if (unitId === 'MATH_ALL') {
      const unitLessons = allSyllabusLessons.filter((l) => l.subject === 'math');
      setSelectedLessonIds(unitLessons.map((l) => l.id));
    } else if (unitId === 'RW_ALL') {
      const unitLessons = allSyllabusLessons.filter((l) => l.subject === 'rw');
      setSelectedLessonIds(unitLessons.map((l) => l.id));
    } else {
      const unitLessons = allSyllabusLessons.filter((l) => l.unitKey === unitId);
      setSelectedLessonIds(unitLessons.map((l) => l.id));
    }
    setFeedbackNotice(null);
  };

  // Toggle single lesson checkbox
  const handleToggleLesson = (id: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Shift single lesson directly with 1 click
  const handleShiftSingleLesson = (lessonId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetDate = resolveDestinationDate(selectedDestination, currentDateStr, customDestinationDate);
    const destOption = destinationOptionsForSelect.find((d) => d.value === selectedDestination);
    const targetLabel = selectedDestination === 'custom'
      ? customDateFormattedSummary
      : destOption
      ? destOption.label.split('•')[0].trim()
      : targetDate;

    if (onBatchTaskShifted) {
      onBatchTaskShifted({ [lessonId]: targetDate });
    } else if (onTaskShifted) {
      onTaskShifted(lessonId, targetDate);
    }

    const lessonObj = allSyllabusLessons.find((l) => l.id === lessonId);
    const lessonTitle = lessonObj ? (lessonObj.code || lessonObj.label) : 'Lesson';

    setFeedbackNotice({
      type: 'success',
      message: `Shifted single lesson "${lessonTitle}" to ${targetLabel} (${targetDate})!`
    });
  };

  // Select / Deselect All
  const handleSelectAll = () => {
    setSelectedLessonIds(filteredLessons.map((l) => l.id));
  };
  const handleDeselectAll = () => {
    setSelectedLessonIds([]);
  };

  // Step-by-Step Undo Last Shift
  const handleUndoClick = () => {
    if (onUndo && undoCount > 0) {
      onUndo();
      setFeedbackNotice({
        type: 'undo',
        message: `↩ Successfully reverted your last shift action! (${undoCount - 1} undo step${undoCount - 1 !== 1 ? 's' : ''} remaining)`
      });
    }
  };

  // Instant Manual Batch Shift Execution (NO AI LATENCY)
  const handleApplyManualShift = () => {
    if (selectedLessonIds.length === 0) {
      setFeedbackNotice({
        type: 'error',
        message: 'Please select at least 1 lesson using the checkboxes below to shift.'
      });
      return;
    }

    const targetDate = resolveDestinationDate(selectedDestination, currentDateStr, customDestinationDate);
    const destOption = destinationOptionsForSelect.find((d) => d.value === selectedDestination);
    const targetLabel = selectedDestination === 'custom'
      ? customDateFormattedSummary
      : destOption
      ? destOption.label.split('•')[0].trim()
      : targetDate;

    const batch: Record<string, string> = {};
    selectedLessonIds.forEach((id) => {
      batch[id] = targetDate;
    });

    if (onBatchTaskShifted) {
      onBatchTaskShifted(batch);
    }

    const currentUnitObj = UNIT_OPTIONS.find((u) => u.id === selectedUnit);
    const unitTitle = currentUnitObj ? currentUnitObj.shortTitle : 'Selected Unit';

    setFeedbackNotice({
      type: 'success',
      message: `Successfully shifted ${selectedLessonIds.length} lesson${selectedLessonIds.length > 1 ? 's' : ''} from ${unitTitle} to ${targetLabel} (${targetDate})! Your Phase 1 schedule and Calendar are updated instantly.`
    });
  };


  // Reset Selected Lessons back to original days
  const handleResetSelected = () => {
    if (selectedLessonIds.length === 0) {
      setFeedbackNotice({
        type: 'error',
        message: 'Please select the lessons you wish to restore to their original schedule.'
      });
      return;
    }

    const batch: Record<string, string> = {};
    selectedLessonIds.forEach((id) => {
      batch[id] = '__RESET__';
    });

    if (onBatchTaskShifted) {
      onBatchTaskShifted(batch);
    }

    setFeedbackNotice({
      type: 'reset',
      message: `Restored ${selectedLessonIds.length} lesson${selectedLessonIds.length > 1 ? 's' : ''} back to their original scheduled days.`
    });
  };

  // Restore single lesson inline
  const handleRestoreSingleLesson = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTaskShifted) {
      onTaskShifted(id, '__RESET__');
    } else if (onBatchTaskShifted) {
      onBatchTaskShifted({ [id]: '__RESET__' });
    }
    setFeedbackNotice({
      type: 'reset',
      message: `Restored lesson back to its original day.`
    });
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 1. Fetch saved sessions on mount
  useEffect(() => {
    fetch('/api/ai/sessions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.sessions && data.sessions.length > 0) {
          setSessions(data.sessions);
          // Pick latest session
          const latest = data.sessions[0];
          setCurrentSessionId(latest.id);
          setActiveMode((latest.mode as AIMode) || 'plan_modifier');
          loadSessionMessages(latest.id);
        }
      })
      .catch((err) => console.warn('Could not load AI sessions:', err));
  }, []);

  // 2. Load messages for a session
  const loadSessionMessages = (id: string) => {
    fetch(`/api/ai/sessions/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.messages) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.warn('Could not load session messages:', err));
  };

  // 3. Start a new chat
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInputPrompt('');
    textareaRef.current?.focus();
  };

  // 4. Delete session
  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/ai/sessions/${id}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (currentSessionId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // 5. Send message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMessage: AIChatMessageItem = {
      id: 'msg-' + Date.now(),
      sessionId: currentSessionId || 'temp',
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          mode: activeMode,
          message: textToSend,
          currentDateStr
        })
      });

      const data = await res.json();

      if (res.ok && data.message) {
        const assistantMessage: AIChatMessageItem = {
          id: 'msg-asst-' + Date.now(),
          sessionId: data.sessionId || currentSessionId || 'temp',
          role: 'assistant',
          content: data.message,
          actionData: data.actionData,
          createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // If a new session was created on server
        if (data.sessionId && data.sessionId !== currentSessionId) {
          setCurrentSessionId(data.sessionId);
          setSessions((prev) => [
            {
              id: data.sessionId,
              mode: activeMode,
              title: data.sessionTitle || textToSend.slice(0, 36),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            ...prev
          ]);
        }

        // Trigger parent state updates for tools
        if (data.actionData) {
          if (data.actionData.action === 'shift_chapter' && onBatchTaskShifted && Array.isArray(data.actionData.tasks)) {
            const batch: Record<string, string> = {};
            for (const t of data.actionData.tasks) {
              batch[t.id] = data.actionData.to;
            }
            onBatchTaskShifted(batch);
          } else if (data.actionData.action === 'shift_lesson' && onTaskShifted) {
            onTaskShifted(data.actionData.taskId, data.actionData.to);
          } else if (data.actionData.action === 'log_error' && onErrorLogged) {
            onErrorLogged(data.actionData.errorLog);
          }
        }
      } else {
        const errMessage: AIChatMessageItem = {
          id: 'msg-err-' + Date.now(),
          sessionId: currentSessionId || 'temp',
          role: 'assistant',
          content: `⚠️ ${data.error || 'Unable to connect with Gemini model. Please check your API key.'}`,
          createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, errMessage]);
      }
    } catch (err: any) {
      const errMessage: AIChatMessageItem = {
        id: 'msg-err-' + Date.now(),
        sessionId: currentSessionId || 'temp',
        role: 'assistant',
        content: `⚠️ Network error: ${err.message || 'Failed to reach AI service.'}`,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentModeInfo = AI_MODES.find((m) => m.id === activeMode) || AI_MODES[0];

  return (
    <div className="w-full space-y-5">
      {/* TOP CO-PILOT BANNER */}
      <div className="ios-glass-card rounded-3xl p-5 sm:p-6 border-2 border-[#a6c4a1] shadow-grave-card relative overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1a3717] text-white flex items-center justify-center shadow-md border border-[#8ec284] shrink-0">
              <Bot className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-luxury tracking-tight">
                  Gemini AI Co-Pilot
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                  gemini-3.6-flash
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Live schedule adjustments, 26-formula SAT tutor, and automated error logging worker.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3.5 py-2 rounded-2xl bg-matcha-input hover:bg-matcha-sub border border-[#a6c4a1] text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Saved Chats ({sessions.length})</span>
            </button>
            <button
              onClick={handleNewChat}
              className="px-3.5 py-2 rounded-2xl bg-[#1a3717] hover:bg-[#23481f] text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>New Thread</span>
            </button>
          </div>
        </div>

        {/* 4 SPECIALIZED AI MODES SELECTOR PILLS */}
        <div className="pt-4 border-t border-[#a6c4a1]/50 mt-4 space-y-2">
          <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-['JetBrains_Mono']">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Specialized AI Mode:</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {AI_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 active:scale-98 ${
                    isActive
                      ? `${mode.activeClass} border-transparent`
                      : 'bg-white/80 hover:bg-white text-slate-900 border-[#a6c4a1] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                      <span className="text-xs font-black">{mode.title}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-white/90' : 'text-slate-600'}`}>
                    {mode.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* INTERACTIVE MANUAL LESSON & CHAPTER SHIFT STUDIO (PLAN MODIFIER EXCLUSIVE) */}
          <AnimatePresence>
            {activeMode === 'plan_modifier' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="pt-4 border-t border-[#a6c4a1]/60 mt-3 space-y-4 overflow-visible"
              >
                {/* Header title banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gradient-to-r from-[#e8f3e5] via-[#f2faf0] to-[#e4f1e1] border-2 border-[#a6c4a1] rounded-2xl p-3.5 sm:p-4 shadow-grave-card">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#1a3717] text-white flex items-center justify-center shadow-md border border-[#3c7835] shrink-0">
                      <Zap className="w-4 h-4 fill-emerald-300 text-emerald-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-[#122810] font-luxury">
                          Manual Lesson &amp; Chapter Shift Studio
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                          Instant Manual Sync
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2f552a] font-medium">
                        Choose a chapter, check single or multiple lessons, and shift them to any Sunday or buffer day with 1 click.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {undoCount > 0 ? (
                      <button
                        type="button"
                        onClick={handleUndoClick}
                        title={`Undo last shift (${undoCount} step${undoCount > 1 ? 's' : ''} stored in history)`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95 border border-amber-400 ring-2 ring-amber-300/60"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Undo ({undoCount})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="No shifts to undo in this session"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-not-allowed bg-[#dce9d8] text-[#6d8a69] border border-[#bfd7bc] opacity-60"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Undo</span>
                      </button>
                    )}

                    {selectedUnit && (
                      <span className="text-[11px] font-black font-['JetBrains_Mono'] text-[#1a3717] bg-white/90 px-2.5 py-1.5 rounded-xl border border-[#a6c4a1] shadow-xs">
                        {selectedLessonIds.length} of {filteredLessons.length} selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Control Bar: Subject Tabs + Quick Unit Pills + MatchaSelect Dropdowns */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#eef7ec]/95 border-2 border-[#a6c4a1] shadow-grave-card space-y-4 overflow-visible">
                  {/* SUBJECT SELECTION TABS: MATH (13 UNITS) VS READING & WRITING (12 UNITS) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-3 border-b border-[#a6c4a1]/50">
                    <div className="flex items-center gap-2 p-1.5 bg-[#dbe8d8] rounded-xl border border-[#a6c4a1]">
                      <button
                        type="button"
                        onClick={() => handleSubjectChange('math')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                          selectedSubject === 'math'
                            ? 'bg-[#1a3717] text-white shadow-sm border border-[#2b5825]'
                            : 'text-[#2a5025] hover:text-[#122810] hover:bg-[#cfe0cc]'
                        }`}
                      >
                        <span>📐 SAT Math Chapters</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-['JetBrains_Mono'] ${
                          selectedSubject === 'math' ? 'bg-[#2b5825] text-[#c9f6c2]' : 'bg-white/60 text-[#2a5025]'
                        }`}>
                          Units 3 – 13 (11 Chapters)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubjectChange('rw')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                          selectedSubject === 'rw'
                            ? 'bg-[#133b3e] text-white shadow-sm border border-[#22575c]'
                            : 'text-[#2a5025] hover:text-[#122810] hover:bg-[#cfe0cc]'
                        }`}
                      >
                        <span>📖 Reading &amp; Writing Units</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-['JetBrains_Mono'] ${
                          selectedSubject === 'rw' ? 'bg-[#22575c] text-[#cbf4f8]' : 'bg-white/60 text-[#2a5025]'
                        }`}>
                          Units 3 – 12 (10 Units)
                        </span>
                      </button>
                    </div>

                    <div className="text-[11px] font-bold text-[#2d5528] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${selectedSubject === 'math' ? 'bg-emerald-600' : 'bg-teal-600'}`} />
                      <span>{selectedSubject === 'math' ? 'Math Chapters strictly isolated (Never shifts English)' : 'Reading & Writing isolated (Never shifts Math)'}</span>
                    </div>
                  </div>

                  {/* QUICK UNIT SELECTION PILLS (SHOWS ALL UNITS VISIBLY AT ONCE) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#2d5528] tracking-wider font-['JetBrains_Mono']">
                      <span>Quick Chapter Selector ({selectedSubject === 'math' ? 'Units 3–13 & All Math' : 'Units 3–12 & All English'}):</span>
                      <span className="text-[#4f7847] font-semibold lowercase">click any unit to jump instantly</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {availableUnits.map((unit) => {
                        const isCurrent = selectedUnit === unit.id;
                        const isAll = unit.id === 'MATH_ALL' || unit.id === 'RW_ALL';
                        const shortName = isAll
                          ? (selectedSubject === 'math' ? 'All Math (102L)' : 'All English (43L)')
                          : `Unit ${unit.id.replace('MATH_U', '').replace('RW_U', '')}`;

                        return (
                          <button
                            key={unit.id}
                            type="button"
                            onClick={() => handleUnitChange(unit.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-['JetBrains_Mono'] transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#1a3717] text-white font-black shadow-xs ring-2 ring-emerald-500/50'
                                : 'bg-white/85 hover:bg-white text-[#122810] border border-[#a6c4a1] hover:border-emerald-600 shadow-2xs'
                            }`}
                            title={unit.label}
                          >
                            <span>{shortName}</span>
                            {!isAll && unit.badge ? (
                              <span className={`ml-1 text-[9px] px-1 py-0.2 rounded ${
                                isCurrent ? 'bg-emerald-800 text-emerald-200' : 'bg-[#e2f0de] text-[#1a3717]'
                              }`}>
                                {unit.badge.replace(' lessons', 'L')}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MATCHA THEMED DROPDOWN SELECTORS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end overflow-visible">
                    {/* Chapter / Unit Dropdown (MatchaSelect) */}
                    <div className="md:col-span-6 space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-[#2d5528] tracking-wider font-['JetBrains_Mono'] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Select {selectedSubject === 'math' ? 'Math Chapter (Units 3–13)' : 'Reading & Writing Unit (Units 3–12)'}:</span>
                      </label>
                      <MatchaSelect
                        value={selectedUnit}
                        onChange={(val) => handleUnitChange(String(val))}
                        options={unitOptionsForSelect}
                        placeholder={`— Select a ${selectedSubject === 'math' ? 'Math Chapter' : 'R&W Unit'} —`}
                        variant="matcha"
                        size="md"
                        fullWidth
                        icon={<BookOpen className="w-4 h-4 text-emerald-700" />}
                      />
                    </div>

                    {/* Destination Dropdown (MatchaSelect) */}
                    <div className="md:col-span-6 space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-[#2d5528] tracking-wider font-['JetBrains_Mono'] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Shift Destination (Buffer Day / Study Day):</span>
                      </label>
                      <MatchaSelect
                        value={selectedDestination}
                        onChange={(val) => setSelectedDestination(String(val))}
                        options={destinationOptionsForSelect}
                        placeholder="Select Shift Destination..."
                        variant="matcha"
                        size="md"
                        fullWidth
                        icon={<Calendar className="w-4 h-4 text-emerald-700" />}
                      />
                    </div>
                  </div>

                  {/* BEAUTIFUL MATCHA CUSTOM DATE SECTOR */}
                  <AnimatePresence>
                    {selectedDestination === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-visible"
                      >
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#e8f4e6] via-[#f1f9ef] to-[#def0dc] border-2 border-[#a6c4a1] shadow-grave-card space-y-3.5">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#a6c4a1]/60">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-[#1a3717] text-white flex items-center justify-center shadow-xs">
                                <Calendar className="w-4 h-4 text-emerald-300" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-[#122810] font-luxury flex items-center gap-1.5">
                                  <span>Selective Custom Date Sector</span>
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-['JetBrains_Mono']">
                                    Custom Target
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#2b5126] font-medium">
                                  Select any specific day from the study plan calendar or choose an exact custom date.
                                </p>
                              </div>
                            </div>

                            {/* Target confirmation badge */}
                            <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-[#a6c4a1] text-[#122810] text-[11px] font-bold font-['JetBrains_Mono'] flex items-center gap-1.5 shadow-2xs self-start sm:self-center">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Target: {customDateFormattedSummary}</span>
                            </div>
                          </div>

                          {/* Dual Selector Row: Study Plan Day Dropdown + Exact Date Input */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            {/* Option A: Select from Study Plan Days */}
                            <div className="md:col-span-7 space-y-1.5">
                              <label className="text-[10px] font-black uppercase text-[#2d5528] tracking-wider font-['JetBrains_Mono'] flex items-center gap-1">
                                <span>1. Select Directly From Study Plan Calendar:</span>
                              </label>
                              <MatchaSelect
                                value={customDestinationDate}
                                onChange={(val) => setCustomDestinationDate(String(val))}
                                options={allStudyDaysOptionsForSelect}
                                placeholder="Pick a study day from calendar..."
                                variant="matcha"
                                size="md"
                                fullWidth
                                icon={<Calendar className="w-4 h-4 text-emerald-700" />}
                              />
                            </div>

                            {/* Option B: Choose exact date via datepicker */}
                            <div className="md:col-span-5 space-y-1.5">
                              <label className="text-[10px] font-black uppercase text-[#2d5528] tracking-wider font-['JetBrains_Mono'] flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                                <span>2. Or Choose Exact Calendar Date:</span>
                              </label>
                              <input
                                type="date"
                                min="2026-09-14"
                                max="2026-11-08"
                                value={customDestinationDate}
                                onChange={(e) => setCustomDestinationDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#a6c4a1] text-xs font-bold text-[#122810] focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs cursor-pointer min-h-[44px]"
                              />
                            </div>
                          </div>

                          {/* Quick Date Jump Chips */}
                          <div className="pt-2 border-t border-[#a6c4a1]/40 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-[#2b5126] font-['JetBrains_Mono'] mr-1">
                              Quick Jump:
                            </span>
                            {quickDatePresets.map((preset) => (
                              <button
                                key={preset.date}
                                type="button"
                                onClick={() => setCustomDestinationDate(preset.date)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-['JetBrains_Mono'] transition-all cursor-pointer active:scale-95 ${
                                  customDestinationDate === preset.date
                                    ? 'bg-[#1a3717] text-white shadow-xs ring-2 ring-emerald-500/50'
                                    : 'bg-white/85 hover:bg-white text-[#122810] border border-[#a6c4a1] shadow-2xs'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>


                  {/* LESSONS DISPLAY: CLEAN EMPTY STATE OR MATCHA THEMED LIST */}
                  {!selectedUnit ? (
                    <div className="p-7 text-center rounded-2xl bg-white/70 border-2 border-dashed border-[#a6c4a1] space-y-2.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#e5f2e2] text-emerald-800 flex items-center justify-center mx-auto border border-[#a6c4a1] shadow-xs">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-black text-[#122810]">
                        No Chapter Selected (Zero Dummy Data)
                      </div>
                      <p className="text-xs text-[#355f30] max-w-md mx-auto">
                        Please choose a {selectedSubject === 'math' ? 'Math Chapter (Units 3–13)' : 'Reading & Writing Unit (Units 3–12)'} using the dropdown or quick unit buttons above to view and shift lessons.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Header for lessons list */}
                      <div className="pt-2 border-t border-[#a6c4a1]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-black text-[#122810] uppercase font-['JetBrains_Mono'] flex items-center gap-1">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Select Lessons to Shift ({filteredLessons.length} Total):</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="px-3 py-1.5 rounded-lg bg-[#1a3717] hover:bg-[#254f21] text-white border border-[#3b7235] text-[11px] font-black transition cursor-pointer active:scale-95 shadow-xs"
                          >
                            Select All ({filteredLessons.length})
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-[#122810] border border-[#a6c4a1] text-[11px] font-bold transition cursor-pointer active:scale-95 shadow-xs"
                          >
                            Deselect All
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandAllLessons(!expandAllLessons)}
                            className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#122810] border border-[#a6c4a1] text-[11px] font-bold transition cursor-pointer active:scale-95 shadow-xs flex items-center gap-1.5"
                            title={expandAllLessons ? 'Switch to compact scroll view' : 'Show all lessons without scrolling'}
                          >
                            {expandAllLessons ? (
                              <>
                                <Minimize2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Compact View</span>
                              </>
                            ) : (
                              <>
                                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Show All ({filteredLessons.length})</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Quick search input */}
                        <div className="relative min-w-[200px]">
                          <Search className="w-3.5 h-3.5 text-[#5e8257] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search within this chapter..."
                            value={lessonSearchQuery}
                            onChange={(e) => setLessonSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#a6c4a1] text-xs font-medium text-[#122810] placeholder:text-[#6e8a69] focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* LESSON CHECKBOX ITEMS CONTAINER (ENLARGED TO SHOW ALL LESSONS CLEARLY) */}
                      <div
                        data-lenis-prevent="true"
                        onWheel={(e) => e.stopPropagation()}
                        className={`${
                          expandAllLessons ? 'max-h-none overflow-visible' : 'max-h-[540px] overflow-y-auto visible-scrollbar'
                        } pr-1.5 space-y-2 rounded-2xl p-2.5 bg-[#f6fbf5]/90 border-2 border-[#a6c4a1]`}
                      >
                        {filteredLessons.length === 0 ? (
                          <div className="p-5 text-center text-xs text-[#527d4c] font-medium">
                            No lessons match your search criteria.
                          </div>
                        ) : (
                          <>
                            {filteredLessons.map((lesson, index) => {
                              const isSelected = selectedLessonIds.includes(lesson.id);
                              const currentOverride = taskScheduleOverrides[lesson.id];
                              const isShifted = !!currentOverride && currentOverride !== lesson.originalDateStr;

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleToggleLesson(lesson.id)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                                    isSelected
                                      ? 'bg-[#d8eed4] border-2 border-emerald-600 shadow-xs'
                                      : 'bg-white hover:bg-[#edf7ec] border border-[#bfd7bc]'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleLesson(lesson.id)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-4 h-4 text-emerald-700 rounded border-[#a6c4a1] focus:ring-emerald-600 cursor-pointer shrink-0 accent-emerald-700"
                                    />

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] font-black text-[#325a2e] font-['JetBrains_Mono']">
                                          #{index + 1} of {filteredLessons.length}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-['JetBrains_Mono'] ${
                                          lesson.subject === 'math'
                                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                            : 'bg-teal-100 text-teal-900 border border-teal-300'
                                        }`}>
                                          {lesson.code || lesson.subject}
                                        </span>
                                        <span className="text-xs font-black text-[#122810] truncate">
                                          {lesson.label.replace(/\[.*?\]/, '').trim() || lesson.label}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#426a3e]">
                                        <span className="font-semibold">
                                          Original: Day {lesson.originalDayNumber} ({lesson.originalFormattedDate})
                                        </span>
                                        <span>&bull;</span>
                                        <span>{lesson.durationMinutes} min</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status, Shift Single Button & Shifted Pill */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    {/* Quick Shift Just This Single Lesson */}
                                    <button
                                      type="button"
                                      onClick={(e) => handleShiftSingleLesson(lesson.id, e)}
                                      title="Shift this single lesson directly to target day"
                                      className="px-2.5 py-1 rounded-lg bg-[#1a3717] hover:bg-[#254f21] text-emerald-200 border border-[#3b7235] text-[10px] font-black transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
                                    >
                                      <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                                      <span className="hidden sm:inline">Shift Single</span>
                                    </button>

                                    {isShifted ? (
                                      <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-['JetBrains_Mono'] flex items-center gap-1">
                                          <span>Shifted: {currentOverride}</span>
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => handleRestoreSingleLesson(lesson.id, e)}
                                          title="Restore back to original scheduled day"
                                          className="p-1 rounded bg-[#f4faf2] hover:bg-[#e2f0de] text-amber-800 border border-amber-300 text-[10px] font-bold transition cursor-pointer"
                                        >
                                          <RotateCcw className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] font-bold text-[#55814e] hidden md:inline">
                                        Day {lesson.originalDayNumber}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            <div className="pt-2 pb-1 text-center text-[11px] font-bold text-[#355f30] flex items-center justify-center gap-2 border-t border-[#a6c4a1]/40">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                              <span>All {filteredLessons.length} lessons in this chapter are loaded and accessible ({selectedLessonIds.length} selected)</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* ACTION BUTTONS ROW */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={handleApplyManualShift}
                            disabled={selectedLessonIds.length === 0}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1a3717] to-[#254f21] hover:from-[#21471d] hover:to-[#2c5f28] text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-[#3b7235] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <span>
                              Shift Selected ({selectedLessonIds.length}) Lesson{selectedLessonIds.length !== 1 ? 's' : ''} Now (Instant)
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetSelected}
                            disabled={selectedLessonIds.length === 0}
                            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#f6fcf5] text-[#122810] text-xs font-bold transition cursor-pointer border-2 border-[#a6c4a1] active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#355f30]" />
                            <span>Reset Selected to Original</span>
                          </button>

                          {undoCount > 0 && (
                            <button
                              type="button"
                              onClick={handleUndoClick}
                              className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer border border-amber-400 active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Undo2 className="w-3.5 h-3.5 text-slate-950" />
                              <span>Undo Last Shift ({undoCount})</span>
                            </button>
                          )}
                        </div>

                        <div className="text-[11px] text-[#355f30] font-medium text-right hidden sm:block">
                          Instant update &bull; Syncs with Phase 1 &amp; Calendar
                        </div>
                      </div>
                    </>
                  )}

                  {/* FEEDBACK NOTICE BANNER (MATCHA THEMED) */}
                  <AnimatePresence>
                    {feedbackNotice && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 text-xs font-bold ${
                          feedbackNotice.type === 'success'
                            ? 'bg-[#e7f7e4] text-[#11380e] border-[#74b86a] shadow-xs'
                            : feedbackNotice.type === 'undo'
                            ? 'bg-[#fffbeb] text-[#78350f] border-[#fcd34d] shadow-xs'
                            : feedbackNotice.type === 'reset'
                            ? 'bg-[#e0f7fa] text-[#006064] border-[#80deea]'
                            : 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {feedbackNotice.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : feedbackNotice.type === 'undo' ? (
                            <Undo2 className="w-4 h-4 text-amber-700 shrink-0" />
                          ) : feedbackNotice.type === 'reset' ? (
                            <RotateCcw className="w-4 h-4 text-teal-700 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                          )}
                          <span className="leading-tight">{feedbackNotice.message}</span>
                        </div>

                        {onNavigateToCalendar && feedbackNotice.type === 'success' && (
                          <button
                            onClick={onNavigateToCalendar}
                            className="px-2.5 py-1 rounded-lg bg-[#1a3717] hover:bg-[#254f21] text-white font-black text-[11px] shrink-0 transition flex items-center gap-1 cursor-pointer border border-[#3b7235] shadow-xs"
                          >
                            <span>View in Calendar</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MAIN CHAT & SIDEBAR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SIDEBAR: SAVED SESSIONS (DESKTOP & MOBILE COLLAPSIBLE) */}
        {(sidebarOpen || true) && (
          <div className={`lg:col-span-4 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="ios-glass-card rounded-3xl p-4 border-2 border-[#a6c4a1] space-y-3 shadow-grave-card">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-['JetBrains_Mono'] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chat Threads</span>
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  {sessions.length} saved
                </span>
              </div>

              {sessions.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-matcha-sub/70 border border-dashed border-[#a6c4a1] text-xs text-slate-600 font-medium">
                  No saved conversations yet. Ask the AI your first question!
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {sessions.map((s) => {
                    const isSelected = currentSessionId === s.id;
                    const modeObj = AI_MODES.find((m) => m.id === s.mode) || AI_MODES[0];

                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setCurrentSessionId(s.id);
                          setActiveMode((s.mode as AIMode) || 'plan_modifier');
                          loadSessionMessages(s.id);
                        }}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-2 group ${
                          isSelected
                            ? 'bg-[#1a3717] text-white border-[#1a3717] shadow-sm'
                            : 'bg-white/70 hover:bg-white text-slate-800 border-[#a6c4a1]/70'
                        }`}
                      >
                        <div className="truncate space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full font-['JetBrains_Mono'] ${
                              isSelected ? 'bg-emerald-900 text-emerald-200' : modeObj.colorClass
                            }`}>
                              {modeObj.title}
                            </span>
                          </div>
                          <p className="text-xs font-bold truncate">
                            {s.title}
                          </p>
                        </div>

                        <button
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          title="Delete thread"
                          className={`p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition hover:bg-rose-500 hover:text-white cursor-pointer ${
                            isSelected ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHAT MESSAGES WINDOW */}
        <div className={`${sidebarOpen ? 'lg:col-span-8' : 'lg:col-span-8'} w-full space-y-4`}>
          <div className="ios-glass-card rounded-3xl border-2 border-[#a6c4a1] p-4 sm:p-6 shadow-grave-card flex flex-col min-h-[520px] max-h-[640px] justify-between">
            {/* MESSAGES LIST */}
            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {messages.length === 0 ? (
                <div className="py-8 px-4 text-center space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-3xl bg-matcha-sub border-2 border-[#a6c4a1] text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <currentModeInfo.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-lg font-black text-slate-900 font-luxury">
                      {currentModeInfo.title} Ready
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {currentModeInfo.description}
                    </p>
                  </div>

                  {/* QUICK PROMPTS CHIPS */}
                  <div className="pt-2 space-y-2 max-w-lg mx-auto">
                    <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider font-['JetBrains_Mono']">
                      Suggested Prompts:
                    </div>
                    <div className="flex flex-col gap-2">
                      {currentModeInfo.quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="p-3 rounded-2xl bg-white/90 hover:bg-matcha-sub border border-[#a6c4a1] text-xs font-bold text-slate-800 text-left transition flex items-center justify-between gap-2 cursor-pointer shadow-xs active:scale-98 group"
                        >
                          <span>&ldquo;{prompt}&rdquo;</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';

                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-2xl bg-[#1a3717] text-white flex items-center justify-center shrink-0 shadow-xs border border-[#8ec284] mt-1">
                          <Bot className="w-4 h-4 text-emerald-300" />
                        </div>
                      )}

                      <div className={`max-w-[85%] sm:max-w-[78%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                        {/* MESSAGE BUBBLE */}
                        <div
                          className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isUser
                              ? 'bg-[#1a3717] text-white rounded-tr-none font-medium'
                              : 'bg-white/95 text-slate-900 rounded-tl-none border border-[#a6c4a1] font-medium'
                          }`}
                        >
                          <div className="whitespace-pre-wrap select-text">
                            {msg.content}
                          </div>
                        </div>

                        {/* INTERACTIVE ACTION CARDS (TOOL EXECUTIONS) */}
                        {msg.actionData && (
                          <div className="space-y-2 w-full">
                            {msg.actionData.action === 'shift_chapter' && (
                              <div className="p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-400 text-slate-950 space-y-2.5 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950 font-['JetBrains_Mono']">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                    <span>Full Chapter Shift Executed ({msg.actionData.count} Lessons)</span>
                                  </div>
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-950 font-['JetBrains_Mono']">
                                    Batch Shifted
                                  </span>
                                </div>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <span className="font-bold text-slate-600">Chapter:</span>{' '}
                                    <span className="font-black text-indigo-950">{msg.actionData.unitName}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-600">Target Date:</span>
                                    <span className="px-2 py-0.5 rounded-lg bg-indigo-200 text-indigo-950 text-[11px] font-black font-mono">
                                      {msg.actionData.to}
                                    </span>
                                  </div>
                                </div>

                                {Array.isArray(msg.actionData.tasks) && msg.actionData.tasks.length > 0 && (
                                  <div className="p-2.5 rounded-xl bg-white/90 border border-indigo-200 space-y-1">
                                    <div className="text-[10px] font-black uppercase text-indigo-900 font-['JetBrains_Mono']">
                                      All Moved Lessons ({msg.actionData.tasks.length}):
                                    </div>
                                    <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] pr-1">
                                      {msg.actionData.tasks.map((t: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-slate-800 font-medium">
                                          <span className="truncate">&bull; {t.label}</span>
                                          <span className="text-[10px] text-slate-500 shrink-0 font-mono ml-2">from {t.from}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {onNavigateToCalendar && (
                                  <button
                                    onClick={onNavigateToCalendar}
                                    className="text-[11px] font-black text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                                  >
                                    <span>View on Calendar</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}

                            {msg.actionData.action === 'shift_lesson' && (
                              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-slate-950 space-y-2 shadow-xs">
                                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 font-['JetBrains_Mono']">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Task Shift Executed in Database</span>
                                </div>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <span className="font-bold text-slate-600">Lesson:</span>{' '}
                                    <span className="font-black text-slate-950">{msg.actionData.taskLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-lg bg-slate-200 text-[11px] font-bold">
                                      From: {msg.actionData.from}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                                    <span className="px-2 py-0.5 rounded-lg bg-emerald-200 text-emerald-950 text-[11px] font-black">
                                      To: {msg.actionData.to}
                                    </span>
                                  </div>
                                </div>
                                {onNavigateToCalendar && (
                                  <button
                                    onClick={onNavigateToCalendar}
                                    className="text-[11px] font-black text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                                  >
                                    <span>View on Calendar</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}

                            {msg.actionData.action === 'log_error' && (
                              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-slate-950 space-y-2 shadow-xs">
                                <div className="flex items-center gap-1.5 text-xs font-black text-rose-900 font-['JetBrains_Mono']">
                                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                                  <span>Recorded into Official Error Log</span>
                                </div>
                                <div className="text-xs space-y-1">
                                  <div className="font-bold text-slate-900">
                                    {msg.actionData.errorLog.testOrSection} &bull; {msg.actionData.errorLog.questionRef}
                                  </div>
                                  <div className="text-slate-700">
                                    <strong>Why Missed:</strong> {msg.actionData.errorLog.whyMissed}
                                  </div>
                                  <div className="text-rose-900 font-mono text-[11px] bg-white p-2 rounded-xl border border-rose-200">
                                    Rule: {msg.actionData.errorLog.takeawayRule}
                                  </div>
                                </div>
                                {onNavigateToErrorLog && (
                                  <button
                                    onClick={onNavigateToErrorLog}
                                    className="text-[11px] font-black text-rose-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                                  >
                                    <span>Open Error Log Page</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}

              {loading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-2xl bg-[#1a3717] text-white flex items-center justify-center shrink-0 shadow-xs border border-[#8ec284]">
                    <Bot className="w-4 h-4 text-emerald-300 animate-pulse" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-[#a6c4a1] flex items-center gap-2 text-xs font-bold text-slate-700">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>Gemini is thinking and executing actions...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="pt-3 border-t border-[#a6c4a1]/50 space-y-2 mt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 font-['JetBrains_Mono']">
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Mode: {currentModeInfo.title}</span>
                </span>
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>

              <div className="relative flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeMode === 'plan_modifier'
                      ? 'e.g., Shift Math Chapter 5 from today (Day 22) to this Sunday...'
                      : activeMode === 'teacher'
                      ? 'e.g., Explain circle equation (x-h)²+(y-k)²=r² with a hard Bluebook example...'
                      : activeMode === 'coach'
                      ? 'e.g., I have 3 hours of homework tonight, how do I keep my 8:30 PM anchor time?'
                      : 'e.g., Log error for Bluebook Test 1 Q14: missed because I forgot the slope formula...'
                  }
                  rows={2}
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-matcha-input border-2 border-[#a6c4a1] text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#1a3717] focus:border-[#1a3717] resize-none transition shadow-xs"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputPrompt.trim() || loading}
                  className="absolute right-2.5 bottom-2.5 p-2 rounded-xl bg-[#1a3717] hover:bg-[#254e20] text-white disabled:opacity-40 disabled:hover:bg-[#1a3717] transition active:scale-95 cursor-pointer shadow-xs"
                  title="Send message"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
