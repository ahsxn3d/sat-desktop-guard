// src/lib/energyPoints.ts
// Khan Academy Energy Points & Badge Gamification Engine

export interface BadgeInfo {
  id: string;
  name: string;
  tier: 'meteorite' | 'moon' | 'earth' | 'sun' | 'black_hole';
  description: string;
  pointsRequired: number;
  icon: string;
  unlockedAt?: string;
}

export const OFFICIAL_BADGES: BadgeInfo[] = [
  {
    id: 'badge-meteorite-1',
    name: 'First Steps',
    tier: 'meteorite',
    description: 'Complete your first practice problem set with focused effort.',
    pointsRequired: 100,
    icon: '☄️'
  },
  {
    id: 'badge-moon-1',
    name: 'Orbital Consistency',
    tier: 'moon',
    description: 'Build a consecutive daily study habit and accumulate 500 energy points.',
    pointsRequired: 500,
    icon: '🌙'
  },
  {
    id: 'badge-earth-1',
    name: 'Atmospheric Mastery',
    tier: 'earth',
    description: 'Pass high-stakes unit tests and conquer foundational Digital SAT modules.',
    pointsRequired: 2500,
    icon: '🌍'
  },
  {
    id: 'badge-sun-1',
    name: 'Solar Intensity',
    tier: 'sun',
    description: 'Demonstrate elite speed and precision across 10,000 energy points.',
    pointsRequired: 10000,
    icon: '☀️'
  },
  {
    id: 'badge-black-hole-1',
    name: 'Singularity Perfection',
    tier: 'black_hole',
    description: 'Achieve legendary status: master full Digital SAT course syllabi with zero burnout.',
    pointsRequired: 50000,
    icon: '🕳️'
  }
];

export interface EnergyPointsState {
  totalPoints: number;
  unlockedBadgeIds: string[];
  history: Array<{ timestamp: string; points: number; reason: string }>;
}

const STORAGE_KEY = 'khan_energy_points_v2';

export function getEnergyPointsState(): EnergyPointsState {
  if (typeof window === 'undefined') {
    return { totalPoints: 350, unlockedBadgeIds: ['badge-meteorite-1'], history: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: EnergyPointsState = {
        totalPoints: 350,
        unlockedBadgeIds: ['badge-meteorite-1'],
        history: [{ timestamp: new Date().toISOString(), points: 350, reason: 'Initial onboarding grant' }]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return { totalPoints: 350, unlockedBadgeIds: ['badge-meteorite-1'], history: [] };
  }
}

export function awardEnergyPoints(points: number, reason: string): EnergyPointsState {
  const current = getEnergyPointsState();
  const nextTotal = current.totalPoints + points;

  // Check newly unlocked badges
  const newlyUnlocked: string[] = [];
  OFFICIAL_BADGES.forEach((b) => {
    if (nextTotal >= b.pointsRequired && !current.unlockedBadgeIds.includes(b.id)) {
      newlyUnlocked.push(b.id);
    }
  });

  const updated: EnergyPointsState = {
    totalPoints: nextTotal,
    unlockedBadgeIds: [...current.unlockedBadgeIds, ...newlyUnlocked],
    history: [{ timestamp: new Date().toISOString(), points, reason }, ...current.history].slice(0, 50)
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save energy points', e);
    }
  }

  return updated;
}
