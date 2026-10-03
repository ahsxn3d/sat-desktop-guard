import { DayPlan, TaskItem } from '../types';

export type KhanDifficultyTier = 
  | 'foundations' 
  | 'medium' 
  | 'challenge' 
  | 'advanced' 
  | 'test' 
  | 'rest' 
  | 'exam';

export type DayLoadDifficulty = KhanDifficultyTier | 'light' | 'standard' | 'intensive';

export interface DifficultyConfig {
  type: KhanDifficultyTier;
  label: string;
  shortLabel: string;
  badgeText: string;
  badgeClass: string;
  calendarCellClass: string;
  cardBorderClass: string;
  cardBgClass: string;
  dotColor: string;
  performanceDescription: string;
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<KhanDifficultyTier | 'light' | 'standard' | 'intensive', DifficultyConfig> = {
  foundations: {
    type: 'foundations',
    label: 'Foundations Tier (Math U2–U5 & R&W U2–U4)',
    shortLabel: 'Foundations',
    badgeText: '🌱 Foundations',
    badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black',
    calendarCellClass: 'bg-emerald-50/90 border-emerald-400 text-emerald-950 hover:bg-emerald-100/90 ring-1 ring-emerald-300/60',
    cardBorderClass: 'border-emerald-400',
    cardBgClass: 'bg-emerald-50/70',
    dotColor: 'bg-emerald-500',
    performanceDescription: 'Foundations Tier (Math U2–U5 & R&W U2–U4) • Core conceptual mastery',
    description: 'Khan Academy Foundations Tier • Core conceptual mastery and key algebraic foundations',
  },
  medium: {
    type: 'medium',
    label: 'Medium Tier (Math U6–U9 & R&W U5–U10, U12)',
    shortLabel: 'Medium',
    badgeText: '🎯 Medium',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-400 font-black',
    calendarCellClass: 'bg-amber-50/90 border-amber-400 text-amber-950 hover:bg-amber-100/90 ring-1 ring-amber-300/60',
    cardBorderClass: 'border-amber-400',
    cardBgClass: 'bg-amber-50/70',
    dotColor: 'bg-amber-500',
    performanceDescription: 'Medium Tier (Math U6–U9 & R&W U5–U10, U12) • Multi-step SAT problems',
    description: 'Khan Academy Medium Tier • Multi-step problem solving & standard SAT traps',
  },
  challenge: {
    type: 'challenge',
    label: 'Challenge Unit (R&W Unit 11 High Difficulty)',
    shortLabel: 'Challenge',
    badgeText: '⚡ Challenge',
    badgeClass: 'bg-purple-100 text-purple-950 border-purple-400 font-black',
    calendarCellClass: 'bg-purple-50/90 border-purple-400 text-purple-950 hover:bg-purple-100/90 ring-1 ring-purple-300/60',
    cardBorderClass: 'border-purple-400',
    cardBgClass: 'bg-purple-50/70',
    dotColor: 'bg-purple-500',
    performanceDescription: 'Challenge Unit (R&W Unit 11) • Hardest textual evidence, inferences & synthesis',
    description: 'Khan Academy High-Difficulty Challenge Unit • Nuanced reading passages & complex grammar',
  },
  advanced: {
    type: 'advanced',
    label: 'Advanced / Hard Tier (Math U10–U13)',
    shortLabel: 'Advanced',
    badgeText: '🔥 Advanced',
    badgeClass: 'bg-rose-100 text-rose-950 border-rose-400 font-black',
    calendarCellClass: 'bg-rose-50/90 border-rose-400 text-rose-950 hover:bg-rose-100/90 ring-1 ring-rose-300/60',
    cardBorderClass: 'border-rose-400',
    cardBgClass: 'bg-rose-50/70',
    dotColor: 'bg-rose-500',
    performanceDescription: 'Advanced / Hard Tier (Math U10–U13) • Peak nonlinear algebra & geometry',
    description: 'Khan Academy Advanced Tier • Peak difficulty SAT Math & complex multi-layer problems',
  },
  test: {
    type: 'test',
    label: 'Bluebook Practice Mock Exam',
    shortLabel: 'Mock Exam',
    badgeText: '📝 Mock Exam',
    badgeClass: 'bg-sky-100 text-sky-950 border-sky-400 font-black',
    calendarCellClass: 'bg-sky-50/95 border-sky-400 text-sky-950 hover:bg-sky-100/90 ring-1 ring-sky-300/60',
    cardBorderClass: 'border-sky-400',
    cardBgClass: 'bg-sky-50/80',
    dotColor: 'bg-sky-600',
    performanceDescription: 'Performance: Full Timed Simulation (134 Mins) • Bluebook Test & Error Log',
    description: 'Full-length Bluebook exam diagnostic simulation under real testing conditions',
  },
  rest: {
    type: 'rest',
    label: 'Rest & Recovery',
    shortLabel: 'Rest',
    badgeText: '🌴 Rest (0 Units)',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300 font-black',
    calendarCellClass: 'bg-slate-50/90 border-slate-300 text-slate-800 hover:bg-slate-100/80 ring-1 ring-slate-200/60',
    cardBorderClass: 'border-slate-300',
    cardBgClass: 'bg-slate-50/70',
    dotColor: 'bg-slate-400',
    performanceDescription: 'Performance: Rest & Cognitive Recovery • Zero assigned lessons',
    description: 'Zero assigned lessons • Guaranteed mental recovery & emergency buffer',
  },
  exam: {
    type: 'exam',
    label: 'Official SAT Exam',
    shortLabel: 'Official SAT',
    badgeText: '🏆 Official SAT',
    badgeClass: 'bg-amber-300 text-slate-950 font-black shadow-xs',
    calendarCellClass: 'bg-gradient-to-br from-amber-500 via-rose-500 to-rose-700 text-white border-amber-300 shadow-md ring-2 ring-amber-300/80',
    cardBorderClass: 'border-amber-400',
    cardBgClass: 'bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-rose-700/10',
    dotColor: 'bg-rose-500',
    performanceDescription: 'Performance: Real Exam Day • Crescent Model School Center (7:15 AM Gates Close)',
    description: 'Crescent Model Higher Secondary School • 7:15 AM Paper Day',
  },
  // Backward compatibility mappings
  light: {
    type: 'foundations',
    label: 'Foundations Tier (Math U2–U5 & R&W U2–U4)',
    shortLabel: 'Foundations',
    badgeText: '🌱 Foundations',
    badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black',
    calendarCellClass: 'bg-emerald-50/90 border-emerald-400 text-emerald-950 hover:bg-emerald-100/90 ring-1 ring-emerald-300/60',
    cardBorderClass: 'border-emerald-400',
    cardBgClass: 'bg-emerald-50/70',
    dotColor: 'bg-emerald-500',
    performanceDescription: 'Foundations Tier (Math U2–U5 & R&W U2–U4) • Core conceptual mastery',
    description: 'Khan Academy Foundations Tier • Core conceptual mastery and key algebraic foundations',
  },
  standard: {
    type: 'medium',
    label: 'Medium Tier (Math U6–U9 & R&W U5–U10, U12)',
    shortLabel: 'Medium',
    badgeText: '🎯 Medium',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-400 font-black',
    calendarCellClass: 'bg-amber-50/90 border-amber-400 text-amber-950 hover:bg-amber-100/90 ring-1 ring-amber-300/60',
    cardBorderClass: 'border-amber-400',
    cardBgClass: 'bg-amber-50/70',
    dotColor: 'bg-amber-500',
    performanceDescription: 'Medium Tier (Math U6–U9 & R&W U5–U10, U12) • Multi-step SAT problems',
    description: 'Khan Academy Medium Tier • Multi-step problem solving & standard SAT traps',
  },
  intensive: {
    type: 'advanced',
    label: 'Advanced / Hard Tier (Math U10–U13)',
    shortLabel: 'Advanced',
    badgeText: '🔥 Advanced',
    badgeClass: 'bg-rose-100 text-rose-950 border-rose-400 font-black',
    calendarCellClass: 'bg-rose-50/90 border-rose-400 text-rose-950 hover:bg-rose-100/90 ring-1 ring-rose-300/60',
    cardBorderClass: 'border-rose-400',
    cardBgClass: 'bg-rose-50/70',
    dotColor: 'bg-rose-500',
    performanceDescription: 'Advanced / Hard Tier (Math U10–U13) • Peak nonlinear algebra & geometry',
    description: 'Khan Academy Advanced Tier • Peak difficulty SAT Math & complex multi-layer problems',
  },
};

/**
 * Identifies the exact Khan Academy difficulty tier for any individual task
 */
export function getTaskKhanTier(task: { code?: string; label?: string; subject?: string }): KhanDifficultyTier {
  if (task.subject === 'test' || (task.code && /^(MOCK|TEST(\s*#?\d+)?)$/i.test(task.code.trim()))) {
    return 'test';
  }
  if (task.subject === 'buffer' && /REST/i.test(task.code || '')) {
    return 'rest';
  }

  const text = `${task.subject || ''} ${task.code || ''} ${task.label || ''}`.toUpperCase();

  // Challenge: R&W Unit 11 (Khan Academy Challenge Unit)
  if (
    /R&W\s*U11\b|RW\s*U11\b|UNIT\s*11.*(READING|WRITING|EVIDENCE|INFERENCES|TRANSITIONS|BOUNDARIES)/i.test(text) ||
    (task.subject === 'rw' && /\bU11(\.|\b)/i.test(text))
  ) {
    return 'challenge';
  }

  // Advanced / Hard: Math Units 10, 11, 12, 13
  if (
    /MATH\s*U1[0-3]\b|MATH\s*UNIT\s*1[0-3]\b/i.test(text) ||
    (task.subject === 'math' && /\bU1[0-3](\.|\b)/i.test(text))
  ) {
    return 'advanced';
  }

  // Medium: Math Units 6, 7, 8, 9 OR R&W Units 5, 6, 7, 8, 9, 10, 12
  if (
    /MATH\s*U[6-9]\b|MATH\s*UNIT\s*[6-9]\b/i.test(text) ||
    /R&W\s*U([5-9]|10|12)\b|RW\s*U([5-9]|10|12)\b/i.test(text) ||
    (task.subject === 'math' && /\bU[6-9](\.|\b)/i.test(text)) ||
    (task.subject === 'rw' && /\bU([5-9]|10|12)(\.|\b)/i.test(text))
  ) {
    return 'medium';
  }

  // Foundations: Math Units 2, 3, 4, 5 OR R&W Units 2, 3, 4
  if (
    /MATH\s*U[2-5]\b|MATH\s*UNIT\s*[2-5]\b/i.test(text) ||
    /R&W\s*U[2-4]\b|RW\s*U[2-4]\b/i.test(text) ||
    (task.subject === 'math' && /\bU[2-5](\.|\b)/i.test(text)) ||
    (task.subject === 'rw' && /\bU[2-4](\.|\b)/i.test(text))
  ) {
    return 'foundations';
  }

  // Phase 2 targeted drills / autopsies
  if (task.subject === 'drill' || task.subject === 'review') {
    return 'medium';
  }

  return 'foundations';
}

/**
 * Returns visual pill styling for an individual Khan Academy task
 */
export function getKhanTierBadge(tier: KhanDifficultyTier): { label: string; badgeClass: string } {
  switch (tier) {
    case 'foundations':
      return { label: 'Foundations', badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    case 'medium':
      return { label: 'Medium', badgeClass: 'bg-amber-100 text-amber-950 border-amber-300' };
    case 'challenge':
      return { label: 'Challenge', badgeClass: 'bg-purple-100 text-purple-950 border-purple-300' };
    case 'advanced':
      return { label: 'Advanced', badgeClass: 'bg-rose-100 text-rose-950 border-rose-300' };
    case 'test':
      return { label: 'Mock Test', badgeClass: 'bg-sky-100 text-sky-950 border-sky-300' };
    case 'rest':
      return { label: 'Rest', badgeClass: 'bg-slate-100 text-slate-800 border-slate-300' };
    case 'exam':
      return { label: 'SAT Exam', badgeClass: 'bg-amber-300 text-slate-950 border-amber-400' };
  }
}

/**
 * Returns the difficulty and visual configuration for any study day
 * mapped directly to Khan Academy's Foundations / Medium / Challenge / Advanced curriculum tiers
 */
export function getDayLoadDifficulty(day: DayPlan): DifficultyConfig {
  if (day.dateStr === '2026-11-07') {
    return DIFFICULTY_CONFIGS.exam;
  }

  if (day.isTestDay || day.tasks.some((t) => t.subject === 'test' || (t.code && /^(MOCK|TEST(\s*#?\d+)?)$/i.test(t.code.trim())))) {
    return DIFFICULTY_CONFIGS.test;
  }

  const activeTasks = day.tasks.filter((t) => t.subject !== 'buffer');

  // True buffer or rest day with zero active study tasks
  if (day.isBuffer && activeTasks.length === 0) {
    return DIFFICULTY_CONFIGS.rest;
  }

  if (activeTasks.length === 0) {
    return DIFFICULTY_CONFIGS.rest;
  }

  // Count lessons by Khan Academy tier
  let foundationsCount = 0;
  let mediumCount = 0;
  let challengeCount = 0;
  let advancedCount = 0; // Hard / Advanced

  activeTasks.forEach((t) => {
    const tier = getTaskKhanTier(t);
    if (tier === 'challenge') challengeCount++;
    else if (tier === 'advanced') advancedCount++;
    else if (tier === 'medium') mediumCount++;
    else if (tier === 'foundations') foundationsCount++;
  });

  // Rule 1: If a day has 2 or more challenging lessons -> Challenge tier (purple)
  if (challengeCount >= 2) {
    return DIFFICULTY_CONFIGS.challenge;
  }

  // Rule 2: Majority / plurality rule between Hard (Advanced), Medium, and Foundations
  // Whichever tier has the most lessons determines the day's difficulty and color
  if (advancedCount > mediumCount && advancedCount > foundationsCount) {
    return DIFFICULTY_CONFIGS.advanced;
  }

  if (mediumCount > advancedCount && mediumCount > foundationsCount) {
    return DIFFICULTY_CONFIGS.medium;
  }

  if (foundationsCount > advancedCount && foundationsCount > mediumCount) {
    return DIFFICULTY_CONFIGS.foundations;
  }

  // Tie-breaking: higher difficulty tier takes precedence (Hard > Medium > Foundations)
  if (advancedCount >= mediumCount && advancedCount >= foundationsCount && advancedCount > 0) {
    return DIFFICULTY_CONFIGS.advanced;
  }

  if (mediumCount >= foundationsCount && mediumCount > 0) {
    return DIFFICULTY_CONFIGS.medium;
  }

  if (challengeCount > 0) {
    return DIFFICULTY_CONFIGS.challenge;
  }

  return DIFFICULTY_CONFIGS.foundations;
}

/**
 * Strips duplicate trailing duration like "(20 min)" or "(15 min)" from a skill label
 * so it can be cleanly preceded by its timing pill: e.g. [6:30 PM - 6:50 PM (20m)]
 */
export function cleanSkillLabel(label: string): string {
  if (!label) return '';
  return label.replace(/\s*\(\d+\s*min\)$/i, '').trim();
}
