export interface TaskItem {
  id: string;
  label: string;
  subject: 'math' | 'rw' | 'test' | 'drill' | 'buffer' | 'review' | 'logistics';
  code?: string;
  topic?: string;
  durationMinutes?: number;
  timeSlot?: string;
  completed: boolean;
  type?: string;
  duration?: number;
  isCarriedOver?: boolean;
  isRescheduled?: boolean;
  originalDayId?: string;
  originalDateStr?: string;
  originalFormattedDate?: string;
  completedOnDateStr?: string;
}

export interface DayPlan {
  id: string;
  dateStr: string; // '2026-09-12'
  dayOfWeek: string; // 'Sat', 'Sun', etc.
  formattedDate: string; // 'Sat Sep 12'
  dayNumber?: number; // 1 to 31
  weekId: string;
  weekNumber: number | string;
  weekTitle: string;
  phase: 'foundations' | 'bluebook' | 'exam';
  isBuffer: boolean;
  isTestDay?: boolean;
  studyTimeMinutes?: number;
  breakTimeMinutes?: number;
  totalTimeMinutes?: number;
  tasks: TaskItem[];
  specialInstructions?: string;
  userNotes?: string;
  hasCarriedOverTasks?: boolean;
  carriedOverCount?: number;
}

export interface WeekPlan {
  id: string;
  weekNumber?: number | string;
  title: string;
  dateRange: string;
  subtitle: string;
  phase: 'foundations' | 'bluebook' | 'exam';
  days: DayPlan[];
  startDate?: string;
  endDate?: string;
}

export interface ErrorLogEntry {
  id: string;
  date: string;
  testOrSection: string; // e.g., 'Bluebook Test #1', 'Khan Drill'
  questionRef: string; // e.g., 'Module 2, Q14'
  domain: 'Math' | 'Reading/Writing';
  whyMissed: string; // "Write down why you missed each question"
  takeawayRule: string; // Formula or grammar rule to prevent repeating
  reviewed: boolean;
  createdAt: number;
}

export type TimerPhase = 'math' | 'break' | 'rw' | 'completed';

export type PaceRating = 'too_fast' | 'perfect' | 'too_late';

export interface SectionPacingResult {
  allocatedMinutes: number; // e.g. 45 for math, 10 for break, 35 for rw
  actualMinutes: number; // e.g. 35
  actualSeconds: number; // exact seconds recorded
  rating: PaceRating;
  ratingLabel: string; // e.g. "Fully Perfect Pace", "Too Fast (Rushing Trap)", "Too Late (Overtime)"
  ratingDescription: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface DaySessionTiming {
  dateStr: string; // '2026-09-12'
  dayTitle: string; // 'Sat Sep 12'
  completedAt: string;
  math: SectionPacingResult;
  breakTime?: SectionPacingResult;
  rw?: SectionPacingResult;
  totalSessionMinutes: number;
  overallRating: PaceRating;
}

export interface TaskTimingRecord {
  seconds: number;
  formatted: string;
  completedAt: string;
}

export interface PackingItem {
  id: string;
  item: string;
  description?: string;
  rank?: 1 | 2 | 3 | 4 | 5;
  rankTitle?: string;
  category: 'essential' | 'tech' | 'comfort' | 'custom' | 'habit' | 'lowest';
  required: boolean;
  packed: boolean;
}

export interface StuckConceptRecord {
  id: string;
  dateStr: string;
  dayNumber?: number;
  lessonCode: string;
  lessonTitle: string;
  chapter: string;
  conceptFormula: string;
  notes: string;
  takeawayRule?: string;
  resolved: boolean;
  errorLogId?: string;
  createdAt: number;
}

export type AIMode = 'plan_modifier' | 'teacher' | 'coach' | 'error_worker';

export interface AIChatMessageItem {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  actionData?: any;
  createdAt: string | number;
}

export interface AIChatSessionItem {
  id: string;
  mode: AIMode;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: AIChatMessageItem[];
}
