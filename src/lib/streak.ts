import { prisma } from './prisma';

/**
 * Habit & Streak Tracking Engine
 * Evaluated whenever an exercise or assessment is submitted.
 * Compares user.lastActiveDate against current UTC calendar date:
 * - Same UTC calendar day: maintain streak
 * - Exactly 1 day after lastActiveDate: increment streakCount by 1
 * - Gap greater than 1 day: reset streakCount to 1
 */
export async function updateUserStreak(userId: string): Promise<{
  streakCount: number;
  lastActiveDate: Date;
  isNewDay: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, streakCount: true, lastActiveDate: true }
  });

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const now = new Date();
  // Strip time to UTC date midnight
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  let nextStreak = user.streakCount || 0;
  let isNewDay = false;

  if (!user.lastActiveDate) {
    // First time user activity
    nextStreak = 1;
    isNewDay = true;
  } else {
    const lastActive = new Date(user.lastActiveDate);
    const lastActiveUtc = new Date(
      Date.UTC(lastActive.getUTCFullYear(), lastActive.getUTCMonth(), lastActive.getUTCDate())
    );

    const diffMs = todayUtc.getTime() - lastActiveUtc.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already active today; retain current streak count
      nextStreak = Math.max(1, user.streakCount);
      isNewDay = false;
    } else if (diffDays === 1) {
      // Consecutive calendar day
      nextStreak = (user.streakCount || 0) + 1;
      isNewDay = true;
    } else {
      // Gap > 1 day: streak reset
      nextStreak = 1;
      isNewDay = true;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: nextStreak,
      lastActiveDate: now
    },
    select: { streakCount: true, lastActiveDate: true }
  });

  return {
    streakCount: updatedUser.streakCount,
    lastActiveDate: updatedUser.lastActiveDate || now,
    isNewDay
  };
}
