// src/lib/masteryTracker.ts
// Official Khan Academy Mastery Level Engine
// Manages skill mastery ratings: Not Started (0%) -> Attempted (25%) -> Familiar (50%) -> Proficient (80%) -> Mastered (100% Crown)

export type MasteryLevel = 'not_started' | 'attempted' | 'familiar' | 'proficient' | 'mastered';

export interface LessonMasteryState {
  percentage: number; // 0 to 100
  level: MasteryLevel;
  attemptsCount: number;
  lastPracticedAt: string;
}

export interface UnitMasteryState {
  unitNumber: number;
  subject: 'math' | 'rw';
  scorePercentage: number;
  isMastered: boolean;
  lastTestedAt: string;
}

const STORAGE_KEYS = {
  LESSON_MASTERY: 'anti_burnout_khan_lesson_mastery_v1',
  UNIT_MASTERY: 'anti_burnout_khan_unit_mastery_v1'
};

export function getMasteryLevelFromPercentage(pct: number): MasteryLevel {
  if (pct >= 100) return 'mastered';
  if (pct >= 80) return 'proficient';
  if (pct >= 50) return 'familiar';
  if (pct > 0) return 'attempted';
  return 'not_started';
}

export function getAllLessonMasteries(): Record<string, LessonMasteryState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_MASTERY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLessonMastery(lessonCode: string): LessonMasteryState {
  const all = getAllLessonMasteries();
  const cleanCode = lessonCode.trim().toLowerCase();
  return (
    all[cleanCode] || {
      percentage: 0,
      level: 'not_started',
      attemptsCount: 0,
      lastPracticedAt: ''
    }
  );
}

export function recordLessonPracticeScore(
  lessonCode: string,
  correctCount: number,
  totalCount: number
): LessonMasteryState {
  const all = getAllLessonMasteries();
  const cleanCode = lessonCode.trim().toLowerCase();
  const current = all[cleanCode] || {
    percentage: 0,
    level: 'not_started',
    attemptsCount: 0,
    lastPracticedAt: ''
  };

  const rawPercentage = Math.round((correctCount / totalCount) * 100);

  // Khan Academy Mastery rules:
  // 4/4 (100%) => 85% Proficient (or 100% if already proficient)
  // 3/4 (75%) => 60% Familiar
  // 2/4 (50%) => 35% Attempted
  let newPercentage = rawPercentage;
  if (rawPercentage === 100) {
    newPercentage = current.percentage >= 80 ? 100 : 85;
  } else if (rawPercentage >= 75) {
    newPercentage = Math.max(current.percentage, 60);
  } else {
    newPercentage = Math.max(25, Math.min(current.percentage, 50));
  }

  const updated: LessonMasteryState = {
    percentage: newPercentage,
    level: getMasteryLevelFromPercentage(newPercentage),
    attemptsCount: current.attemptsCount + 1,
    lastPracticedAt: new Date().toISOString()
  };

  all[cleanCode] = updated;

  try {
    localStorage.setItem(STORAGE_KEYS.LESSON_MASTERY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save lesson mastery', e);
  }

  return updated;
}

export function getAllUnitMasteries(): Record<string, UnitMasteryState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNIT_MASTERY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUnitMastery(unitNumber: number, subject: 'math' | 'rw'): UnitMasteryState {
  const all = getAllUnitMasteries();
  const key = `${subject}-u${unitNumber}`;
  return all[key] || {
    unitNumber,
    subject,
    scorePercentage: 0,
    isMastered: false,
    lastTestedAt: ''
  };
}

export function recordUnitTestScore(
  unitNumber: number,
  subject: 'math' | 'rw',
  correctCount: number,
  totalCount: number,
  wrongLessonCodes: string[] = []
): UnitMasteryState {
  const allUnits = getAllUnitMasteries();
  const key = `${subject}-u${unitNumber}`;
  const pct = Math.round((correctCount / totalCount) * 100);
  const isMastered = pct === 100;

  const unitState: UnitMasteryState = {
    unitNumber,
    subject,
    scorePercentage: pct,
    isMastered,
    lastTestedAt: new Date().toISOString()
  };

  allUnits[key] = unitState;

  try {
    localStorage.setItem(STORAGE_KEYS.UNIT_MASTERY, JSON.stringify(allUnits));
  } catch (e) {
    console.error('Failed to save unit mastery', e);
  }

  // Synchronize lessons in this unit
  const allLessons = getAllLessonMasteries();

  if (isMastered) {
    // 100% on Unit Test crowns all lessons in this unit as Mastered (100%)
    Object.keys(allLessons).forEach((code) => {
      const match = code.match(/u(\d+)/i);
      if (match && parseInt(match[1], 10) === unitNumber) {
        allLessons[code] = {
          ...allLessons[code],
          percentage: 100,
          level: 'mastered',
          lastPracticedAt: new Date().toISOString()
        };
      }
    });
  } else {
    // Khan Academy penalty: If you got a question wrong from a lesson on the unit test, drop that lesson's mastery
    wrongLessonCodes.forEach((code) => {
      const clean = code.trim().toLowerCase();
      if (allLessons[clean]) {
        const cur = allLessons[clean];
        const reduced = Math.max(25, cur.percentage - 25);
        allLessons[clean] = {
          ...cur,
          percentage: reduced,
          level: getMasteryLevelFromPercentage(reduced)
        };
      }
    });
  }

  try {
    localStorage.setItem(STORAGE_KEYS.LESSON_MASTERY, JSON.stringify(allLessons));
  } catch (e) {}

  return unitState;
}
