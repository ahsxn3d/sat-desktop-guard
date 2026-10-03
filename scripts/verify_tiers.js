const fs = require('fs');

const content = fs.readFileSync('src/data/studyPlan.ts', 'utf8');
const weeksMatch = content.match(/export const STUDY_PLAN_WEEKS: WeekPlan\[\] = (\[[\s\S]*?\]);\n/);
const weeks = JSON.parse(weeksMatch[1]);

function getTaskKhanTier(task) {
  if (task.subject === 'test' || (task.code && /MOCK|TEST/i.test(task.code))) {
    return 'test';
  }
  if (task.subject === 'buffer' && /REST/i.test(task.code || '')) {
    return 'rest';
  }

  const text = `${task.subject || ''} ${task.code || ''} ${task.label || ''}`.toUpperCase();

  // Challenge: R&W Unit 11
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

  if (task.subject === 'drill' || task.subject === 'review') {
    return 'medium';
  }

  return 'foundations';
}

function getDayTier(day) {
  if (day.dateStr === '2026-11-07') {
    return 'exam';
  }

  if (day.isTestDay || day.tasks.some((t) => t.subject === 'test' || /MOCK|TEST/i.test(t.code || '') || /TEST/i.test(t.label || ''))) {
    return 'test';
  }

  const activeTasks = day.tasks.filter((t) => t.subject !== 'buffer');

  if (day.isBuffer && activeTasks.length === 0) {
    return 'rest';
  }

  if (activeTasks.length === 0) {
    return 'rest';
  }

  const tiers = activeTasks.map(getTaskKhanTier);

  if (tiers.includes('challenge')) {
    return 'challenge';
  }

  if (tiers.includes('advanced')) {
    return 'advanced';
  }

  if (tiers.includes('medium')) {
    return 'medium';
  }

  return 'foundations';
}

console.log('--- ALL DAYS & THEIR CALCULATED TIERS ---');
const tierCounts = {};
for (const w of weeks) {
  console.log(`\n=== ${w.title} (${w.dateRange}) ===`);
  for (const d of w.days) {
    const tier = getDayTier(d);
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    const taskCodes = d.tasks.filter(t => t.code && t.code !== 'BREAK').map(t => t.code).join(', ');
    console.log(`  ${d.formattedDate.padEnd(12)} [${tier.toUpperCase().padEnd(11)}] Day #${(d.dayNumber !== undefined ? d.dayNumber : '-').toString().padEnd(2)} | Tasks: ${taskCodes || 'Rest / Exam'}`);
  }
}

console.log('\n--- TIER SUMMARY COUNTS ---');
console.table(tierCounts);
