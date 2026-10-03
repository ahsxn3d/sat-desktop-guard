// src/lib/masteryEngine.ts
// Official Khan Academy Skill State Machine & Mastery Percentage Engine
//
// The Core Formula:
// Mastery % = ((Count(Proficient) + Count(Mastered)) / Total Skills in Course or Unit) * 100
// What Counts: Skills sitting at Not started, Attempted, or Familiar contribute exactly 0% to total mastery.

export type SkillLevel = 'not_started' | 'attempted' | 'familiar' | 'proficient' | 'mastered';

export interface SkillMasteryState {
  skillId: string; // e.g. "math-u2-1", "rw-u4-2"
  title: string;
  level: SkillLevel;
  totalAttempts: number;
  lastScorePercentage: number;
  lastPracticedAt: string;
  consecutivePerfectRuns: number;
}

export interface UnitMasterySummary {
  unitId: string;
  totalSkills: number;
  proficientCount: number;
  masteredCount: number;
  familiarCount: number;
  attemptedCount: number;
  notStartedCount: number;
  masteryPercentage: number; // strictly (proficient + mastered) / total * 100
}

export interface CourseMasterySummary {
  courseId: string;
  totalSkills: number;
  proficientCount: number;
  masteredCount: number;
  masteryPercentage: number; // strictly (proficient + mastered) / total * 100
  totalPointsEarned: number;
}

const STORAGE_KEY = 'khan_mastery_state_machine_v2';

export function getAllSkillMasteries(): Record<string, SkillMasteryState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllSkillMasteries(data: Record<string, SkillMasteryState>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save skill masteries', e);
  }
}

export function getSkillMastery(skillId: string, defaultTitle: string = ''): SkillMasteryState {
  const all = getAllSkillMasteries();
  const cleanId = skillId.trim().toLowerCase();
  return (
    all[cleanId] || {
      skillId: cleanId,
      title: defaultTitle,
      level: 'not_started',
      totalAttempts: 0,
      lastScorePercentage: 0,
      lastPracticedAt: '',
      consecutivePerfectRuns: 0
    }
  );
}

/**
 * 1. PRACTICE SET EVALUATION (4 Questions)
 * Single skill focus. Instant feedback.
 * 4/4 (100%) -> moves skill to 'proficient'
 * 70%-75% -> 'familiar'
 * <70% -> 'attempted'
 */
export function recordPracticeSetResult(
  skillId: string,
  correctCount: number,
  totalCount: number,
  title: string = ''
): SkillMasteryState {
  const all = getAllSkillMasteries();
  const cleanId = skillId.trim().toLowerCase();
  const current = getSkillMastery(cleanId, title);

  const pct = Math.round((correctCount / totalCount) * 100);
  let nextLevel: SkillLevel = current.level;

  if (pct === 100) {
    // 100% on practice set moves skill to Proficient (or preserves Mastered if already Mastered)
    nextLevel = current.level === 'mastered' ? 'mastered' : 'proficient';
  } else if (pct >= 70) {
    // 70%-75% is Familiar unless already Proficient/Mastered
    if (current.level === 'not_started' || current.level === 'attempted') {
      nextLevel = 'familiar';
    }
  } else {
    // Below threshold is Attempted unless already higher
    if (current.level === 'not_started') {
      nextLevel = 'attempted';
    }
  }

  const updated: SkillMasteryState = {
    skillId: cleanId,
    title: title || current.title,
    level: nextLevel,
    totalAttempts: current.totalAttempts + 1,
    lastScorePercentage: pct,
    lastPracticedAt: new Date().toISOString(),
    consecutivePerfectRuns: pct === 100 ? current.consecutivePerfectRuns + 1 : 0
  };

  all[cleanId] = updated;
  saveAllSkillMasteries(all);
  return updated;
}

/**
 * 2. QUIZ EVALUATION (5 to 10 Questions)
 * Multi-skill checkpoint spanning 2-3 lessons.
 * Batch skill evaluation: each tested skill answered correctly is promoted to Proficient.
 */
export function recordQuizBatchResult(
  resultsBySkill: Record<string, { correct: boolean; title?: string }>
): Record<string, SkillMasteryState> {
  const all = getAllSkillMasteries();
  const updatedSkills: Record<string, SkillMasteryState> = {};

  Object.entries(resultsBySkill).forEach(([skillId, { correct, title }]) => {
    const cleanId = skillId.trim().toLowerCase();
    const cur = getSkillMastery(cleanId, title);
    let nextLevel = cur.level;

    if (correct) {
      if (cur.level !== 'mastered') {
        nextLevel = 'proficient';
      }
    } else {
      if (cur.level === 'not_started') {
        nextLevel = 'attempted';
      }
    }

    const updated: SkillMasteryState = {
      ...cur,
      title: title || cur.title,
      level: nextLevel,
      totalAttempts: cur.totalAttempts + 1,
      lastPracticedAt: new Date().toISOString()
    };

    all[cleanId] = updated;
    updatedSkills[cleanId] = updated;
  });

  saveAllSkillMasteries(all);
  return updatedSkills;
}

/**
 * 3. UNIT TEST & COURSE CHALLENGE EVALUATION (High-Stakes Gatekeeper)
 * - Correct answer promotes Proficient -> Mastered!
 * - Missed question triggers DYNAMIC DEMOTION: Mastered/Proficient -> Familiar or Attempted!
 */
export function recordAssessmentSkillResults(
  skillResults: Array<{ skillId: string; isCorrect: boolean; title?: string }>
): {
  promotedSkills: string[];
  demotedSkills: string[];
  unaffectedSkills: string[];
} {
  const all = getAllSkillMasteries();
  const promotedSkills: string[] = [];
  const demotedSkills: string[] = [];
  const unaffectedSkills: string[] = [];

  skillResults.forEach(({ skillId, isCorrect, title }) => {
    const cleanId = skillId.trim().toLowerCase();
    const cur = getSkillMastery(cleanId, title);
    const oldLevel = cur.level;
    let nextLevel: SkillLevel = oldLevel;

    if (isCorrect) {
      if (oldLevel === 'proficient' || oldLevel === 'mastered') {
        nextLevel = 'mastered';
        if (oldLevel !== 'mastered') promotedSkills.push(cleanId);
      } else {
        nextLevel = 'proficient';
        promotedSkills.push(cleanId);
      }
    } else {
      // Dynamic Leveling Down
      if (oldLevel === 'mastered') {
        nextLevel = 'proficient';
        demotedSkills.push(cleanId);
      } else if (oldLevel === 'proficient') {
        nextLevel = 'familiar';
        demotedSkills.push(cleanId);
      } else if (oldLevel === 'familiar') {
        nextLevel = 'attempted';
        demotedSkills.push(cleanId);
      } else if (oldLevel === 'not_started') {
        nextLevel = 'attempted';
      }
    }

    if (oldLevel === nextLevel) {
      unaffectedSkills.push(cleanId);
    }

    all[cleanId] = {
      ...cur,
      title: title || cur.title,
      level: nextLevel,
      totalAttempts: cur.totalAttempts + 1,
      lastPracticedAt: new Date().toISOString()
    };
  });

  saveAllSkillMasteries(all);
  return { promotedSkills, demotedSkills, unaffectedSkills };
}

/**
 * The Exact Khan Academy Mastery Calculation Formula:
 * Mastery % = ((Count(Proficient) + Count(Mastered)) / Total Skills) * 100
 */
export function calculateMasteryPercentage(skillIds: string[]): {
  percentage: number;
  proficientCount: number;
  masteredCount: number;
  familiarCount: number;
  attemptedCount: number;
  notStartedCount: number;
  totalSkills: number;
} {
  if (skillIds.length === 0) {
    return {
      percentage: 0,
      proficientCount: 0,
      masteredCount: 0,
      familiarCount: 0,
      attemptedCount: 0,
      notStartedCount: 0,
      totalSkills: 0
    };
  }

  const all = getAllSkillMasteries();
  let proficientCount = 0;
  let masteredCount = 0;
  let familiarCount = 0;
  let attemptedCount = 0;
  let notStartedCount = 0;

  skillIds.forEach((id) => {
    const cleanId = id.trim().toLowerCase();
    const skill = all[cleanId];
    const level = skill?.level || 'not_started';

    if (level === 'mastered') masteredCount++;
    else if (level === 'proficient') proficientCount++;
    else if (level === 'familiar') familiarCount++;
    else if (level === 'attempted') attemptedCount++;
    else notStartedCount++;
  });

  const percentage = Math.round(((proficientCount + masteredCount) / skillIds.length) * 100);

  return {
    percentage,
    proficientCount,
    masteredCount,
    familiarCount,
    attemptedCount,
    notStartedCount,
    totalSkills: skillIds.length
  };
}
