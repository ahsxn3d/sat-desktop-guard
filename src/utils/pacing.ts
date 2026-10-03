import { SectionPacingResult, PaceRating } from '../types';

/**
 * Pacing Benchmarks for SAT Focus Blocks
 * 
 * Math Sprint:
 * - Allocated: 45 minutes
 * - Range 1 (< 28 min): Too Fast — Rushing through multi-step algebra questions, high risk of careless calculation traps and overlooked constraints.
 * - Range 2 (28–45 min): Fully Perfect Pace — Ideal speed; ensures step-by-step verification and Desmos checks without running out of time. E.g., 35 minutes is textbook perfect.
 * - Range 3 (> 45 min): Too Late — Over the 45-minute focus cap; causes cognitive fatigue and leads to unfinished grid-in questions.
 */
export const MATH_PACING_BENCHMARKS = {
  allocatedMinutes: 45,
  tooFastMax: 27, // 0 to 27 min
  perfectMin: 28, // 28 to 45 min
  perfectMax: 45,
  tooLateMin: 46, // 46+ min
};

export const BREAK_PACING_BENCHMARKS = {
  allocatedMinutes: 10,
  tooFastMax: 6,
  perfectMin: 7,
  perfectMax: 12,
  tooLateMin: 13,
};

export const RW_PACING_BENCHMARKS = {
  allocatedMinutes: 35,
  tooFastMax: 24,
  perfectMin: 25,
  perfectMax: 35,
  tooLateMin: 36,
};

export function evaluatePacing(
  section: 'math' | 'break' | 'rw',
  actualSeconds: number,
  allocatedMinutes: number = section === 'math' ? 45 : section === 'break' ? 10 : 35
): SectionPacingResult {
  const actualMinutes = Math.max(1, Math.round(actualSeconds / 60));

  let rating: PaceRating = 'perfect';
  let ratingLabel = 'Fully Perfect Pace';
  let ratingDescription = '';
  let badgeBg = 'bg-emerald-100';
  let badgeText = 'text-emerald-900';
  let badgeBorder = 'border-emerald-300';

  if (section === 'math') {
    if (actualMinutes <= MATH_PACING_BENCHMARKS.tooFastMax) {
      rating = 'too_fast';
      ratingLabel = 'Too Fast (Rushing Trap)';
      ratingDescription = `You finished in ${actualMinutes}m while having 45m allocated. This is too fast—rushing through algebra increases the risk of sign errors, missed constraints, and skipped Desmos verification.`;
      badgeBg = 'bg-rose-100';
      badgeText = 'text-rose-900';
      badgeBorder = 'border-rose-300';
    } else if (actualMinutes <= MATH_PACING_BENCHMARKS.perfectMax) {
      rating = 'perfect';
      ratingLabel = 'Fully Perfect Pace';
      ratingDescription = `You finished in ${actualMinutes}m while having 45m allocated. This specific range (28–45 mins) is fully perfect—allowing thorough problem solving, step verification, and Desmos graphing without rushing or lagging.`;
      badgeBg = 'bg-emerald-100';
      badgeText = 'text-emerald-900';
      badgeBorder = 'border-emerald-300';
    } else {
      rating = 'too_late';
      ratingLabel = 'Too Late (Overtime / Fatigue)';
      ratingDescription = `You took ${actualMinutes}m, exceeding the 45m allocated. On the digital SAT, spending over 45 mins per study module leads to cognitive fatigue and unfinished questions.`;
      badgeBg = 'bg-amber-100';
      badgeText = 'text-amber-950';
      badgeBorder = 'border-amber-300';
    }
  } else if (section === 'break') {
    if (actualMinutes <= BREAK_PACING_BENCHMARKS.tooFastMax) {
      rating = 'too_fast';
      ratingLabel = 'Too Short (Rest Skipped)';
      ratingDescription = `Break was only ${actualMinutes}m (10m allocated). Skipping the screen-free break prevents cognitive working memory from resetting.`;
      badgeBg = 'bg-amber-100';
      badgeText = 'text-amber-900';
      badgeBorder = 'border-amber-300';
    } else if (actualMinutes <= BREAK_PACING_BENCHMARKS.perfectMax) {
      rating = 'perfect';
      ratingLabel = 'Fully Perfect Rest';
      ratingDescription = `Ideal 10-minute restorative break. You stepped away and rested your eyes without losing mental momentum.`;
      badgeBg = 'bg-emerald-100';
      badgeText = 'text-emerald-900';
      badgeBorder = 'border-emerald-300';
    } else {
      rating = 'too_late';
      ratingLabel = 'Extended Break';
      ratingDescription = `Break lasted ${actualMinutes}m. Keep breaks under 12 minutes to maintain study momentum for Reading & Writing.`;
      badgeBg = 'bg-amber-100';
      badgeText = 'text-amber-900';
      badgeBorder = 'border-amber-300';
    }
  } else {
    // Reading & Writing
    if (actualMinutes <= RW_PACING_BENCHMARKS.tooFastMax) {
      rating = 'too_fast';
      ratingLabel = 'Too Fast (Skimming Risk)';
      ratingDescription = `Completed in ${actualMinutes}m (35m allocated). Skimming reading passages too fast can lead to missing subtle rhetorical contrast words.`;
      badgeBg = 'bg-rose-100';
      badgeText = 'text-rose-900';
      badgeBorder = 'border-rose-300';
    } else if (actualMinutes <= allocatedMinutes + 2) {
      rating = 'perfect';
      ratingLabel = 'Fully Perfect Pace';
      ratingDescription = `Completed in ${actualMinutes}m while having ${allocatedMinutes}m allocated. Balanced speed and grammar verification.`;
      badgeBg = 'bg-emerald-100';
      badgeText = 'text-emerald-900';
      badgeBorder = 'border-emerald-300';
    } else {
      rating = 'too_late';
      ratingLabel = 'Too Late (Over Budget)';
      ratingDescription = `Took ${actualMinutes}m (over ${allocatedMinutes}m). Keep RW tight to honor the daily 90-minute cap.`;
      badgeBg = 'bg-amber-100';
      badgeText = 'text-amber-950';
      badgeBorder = 'border-amber-300';
    }
  }

  return {
    allocatedMinutes,
    actualMinutes,
    actualSeconds,
    rating,
    ratingLabel,
    ratingDescription,
    badgeBg,
    badgeText,
    badgeBorder,
  };
}
