// src/lib/streakEngine.ts
// Khan Academy Streak and Local Calendar Activity Engine
// Manages daily activity tracking, loss-aversion streak preservation, and weekly day-by-day goals.

export interface UserStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDaysThisWeek: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  totalActiveDaysCount: number;
  activityHistory: Record<string, number>; // dateStr -> minutes / sessions
}

const STREAK_STORAGE_KEY = 'khan_user_streak_state_v2';

function getTodayLocalDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayLocalDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, '0');
  const d = String(yesterday.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Convert JS getDay() (0=Sun, 1=Mon, ..., 6=Sat) to Monday-based index (0=Mon, ..., 6=Sun)
function getMondayBasedDayIndex(d: Date = new Date()): number {
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function getUserStreakState(): UserStreakState {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: getTodayLocalDate(),
      activeDaysThisWeek: [false, false, false, false, false, false, false],
      totalActiveDaysCount: 1,
      activityHistory: {}
    };
  }

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      const initial: UserStreakState = {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: getTodayLocalDate(),
        activeDaysThisWeek: [false, false, false, false, false, false, false],
        totalActiveDaysCount: 1,
        activityHistory: { [getTodayLocalDate()]: 1 }
      };
      initial.activeDaysThisWeek[getMondayBasedDayIndex()] = true;
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: getTodayLocalDate(),
      activeDaysThisWeek: [false, false, false, false, false, false, false],
      totalActiveDaysCount: 1,
      activityHistory: {}
    };
  }
}

/**
 * Activity Engine Trigger:
 * Evaluated whenever user completes an exercise or records at least 5 minutes of study.
 */
export function recordUserActivity(activityType: 'exercise_complete' | 'five_min_session' | 'manual' = 'exercise_complete'): UserStreakState {
  const state = getUserStreakState();
  const today = getTodayLocalDate();
  const yesterday = getYesterdayLocalDate();
  const dayIdx = getMondayBasedDayIndex();

  let nextCurrentStreak = state.currentStreak;
  let nextLongestStreak = state.longestStreak;
  const nextWeekly = [...state.activeDaysThisWeek];
  nextWeekly[dayIdx] = true;

  const nextHistory = { ...state.activityHistory };
  nextHistory[today] = (nextHistory[today] || 0) + 1;

  if (state.lastActiveDate === today) {
    // Already counted today
  } else if (state.lastActiveDate === yesterday) {
    // Active on consecutive day: increment streak
    nextCurrentStreak = state.currentStreak + 1;
    if (nextCurrentStreak > nextLongestStreak) {
      nextLongestStreak = nextCurrentStreak;
    }
  } else {
    // Missed at least one calendar day: reset streak to 1
    nextCurrentStreak = 1;
  }

  const updated: UserStreakState = {
    currentStreak: nextCurrentStreak,
    longestStreak: Math.max(nextLongestStreak, nextCurrentStreak),
    lastActiveDate: today,
    activeDaysThisWeek: nextWeekly,
    totalActiveDaysCount: Object.keys(nextHistory).length,
    activityHistory: nextHistory
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist streak state', e);
    }
  }

  return updated;
}
