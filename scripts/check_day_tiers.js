const { STUDY_PLAN_WEEKS } = require('../src/data/studyPlan.ts');
const { getTaskKhanTier, getDayLoadDifficulty } = require('../src/utils/difficulty.ts');

console.log('=== CHECKING TASK TIER COUNTS & CALCULATED DAY TIER ===');
for (const w of STUDY_PLAN_WEEKS) {
  for (const d of w.days) {
    if (d.tasks.length > 0 && !d.isTestDay && !d.isBuffer && d.dateStr !== '2026-11-07') {
      const active = d.tasks.filter(t => t.subject !== 'buffer');
      const counts = { foundations: 0, medium: 0, challenge: 0, advanced: 0 };
      active.forEach(t => {
        const tier = getTaskKhanTier(t);
        counts[tier] = (counts[tier] || 0) + 1;
      });
      const dayDiff = getDayLoadDifficulty(d);
      console.log(
        `${d.formattedDate} (${d.dateStr}) [Day ${d.dayNumber || 'P2'}]: ` +
        `F:${counts.foundations} M:${counts.medium} C:${counts.challenge} A:${counts.advanced} => DAY TIER: [${dayDiff.type.toUpperCase()}] (${dayDiff.shortLabel})`
      );
    }
  }
}
