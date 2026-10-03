const { STUDY_PLAN_WEEKS } = require('../src/data/studyPlan.ts');

console.log('=== VERIFYING STUDY PLAN WEEKS ===');
console.log('Total weeks:', STUDY_PLAN_WEEKS.length);

let totalDays = 0;
let numberedDays = 0;
let testCount = 0;

let mathLessonCount = 0;
let rwLessonCount = 0;
const testDates = [];

for (const w of STUDY_PLAN_WEEKS) {
  console.log(`\n[${w.id}] ${w.title} (${w.days.length} days)`);
  for (const d of w.days) {
    totalDays++;
    if (d.dayNumber) numberedDays++;
    if (d.isTestDay) {
      testCount++;
      testDates.push({ date: d.dateStr, label: d.tasks[0]?.label });
    }

    for (const t of d.tasks) {
      if (t.subject === 'math' && t.code && t.code.startsWith('Math U')) mathLessonCount++;
      if (t.subject === 'rw' && t.code && t.code.startsWith('R&W U')) rwLessonCount++;
    }

    if (
      d.dayNumber === 1 ||
      d.dayNumber === 7 ||
      d.dateStr === '2026-09-22' ||
      d.dateStr === '2026-09-30' ||
      d.dayNumber === 8 ||
      d.dayNumber === 30 ||
      d.isTestDay ||
      d.dateStr === '2026-11-07'
    ) {
      console.log(`  -> Day ${d.dayNumber || 'N/A'}: ${d.formattedDate} (${d.dateStr}) [${d.tasks.length} tasks, study: ${d.studyTimeMinutes}m, break: ${d.breakTimeMinutes}m]`);
      if (d.specialInstructions) {
        console.log(`     * ${d.specialInstructions}`);
      }
    }
  }
}

console.log(`\nVerification Summary:`);
console.log(`- Total Days: ${totalDays} (expected: 55) -> ${totalDays === 55 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`- Numbered Study Days (Phase 1): ${numberedDays} (expected: 30) -> ${numberedDays === 30 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`- Math Lessons: ${mathLessonCount} (expected: 102) -> ${mathLessonCount === 102 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`- R&W Lessons: ${rwLessonCount} (expected: 43) -> ${rwLessonCount === 43 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`- Total Curriculum Lessons: ${mathLessonCount + rwLessonCount} (expected: 145) -> ${mathLessonCount + rwLessonCount === 145 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`- Full Practice Tests: ${testCount} (expected: 4) -> ${testCount === 4 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`- Test Dates:`, testDates);

console.log('\n=== TESTING ROLLOVER & AUTO-SORTING INTEGRITY ===');
const { computeWeeksWithRollover, sortDayTasks, extractTaskSortMetrics } = require('../src/utils/rollover');

// Test 1: Day 1 untouched -> should NOT roll over anything
const weeks1 = computeWeeksWithRollover(STUDY_PLAN_WEEKS, {}, {});
const day2Carried1 = weeks1[0].days[1].tasks.filter(t => t.isCarriedOver).length;
const sunCarried1 = weeks1[0].days[6].tasks.filter(t => t.isCarriedOver).length;
console.log('Test 1 (Day 1 untouched): Day 2 carried =', day2Carried1, ', Sunday carried =', sunCarried1, (day2Carried1 === 0 && sunCarried1 === 0) ? '✓ PASS' : '✗ FAIL');

// Test 2: Saturday Sep 19 engaged with leftovers -> rolls over ONLY to Sunday Sep 20 (buffer day), NOT to Monday Sep 21!
const day6 = STUDY_PLAN_WEEKS[0].days[5]; // Sat Sep 19
const completedOnDay6 = { [day6.tasks[3].id]: true }; // Completed 1 task, left others uncompleted
const weeks2 = computeWeeksWithRollover(STUDY_PLAN_WEEKS, completedOnDay6, {});

const sundayDay = weeks2[0].days[6]; // Sun Sep 20 (Buffer day)
const mondayDay = weeks2[1].days[0]; // Mon Sep 21 (Regular study day)

const sundayCarried = sundayDay.tasks.filter(t => t.isCarriedOver).length;
const mondayCarried = mondayDay.tasks.filter(t => t.isCarriedOver).length;

console.log('\nTest 2 (Saturday leftovers roll over ONLY to Sunday Buffer Day):');
console.log('  Sunday Sep 20 received rollover backlog =', sundayCarried > 0 ? `✓ PASS (${sundayCarried} tasks)` : '✗ FAIL');
console.log('  Monday Sep 21 clean of rollover backlog =', mondayCarried === 0 ? '✓ PASS (0 tasks)' : '✗ FAIL');

// Test 3: User shifts lessons from Sep 19 to Sep 26
// -> Must NOT appear on Sep 20, 21, 22, 23, 24, 25!
// -> Must appear on Sep 26 with isCarriedOver: false!
const taskToShift1 = day6.tasks[0].id;
const taskToShift2 = day6.tasks[1].id;
const targetDateStr = '2026-09-26';

const overrides = {
  [taskToShift1]: targetDateStr,
  [taskToShift2]: targetDateStr,
};

const weeks3 = computeWeeksWithRollover(STUDY_PLAN_WEEKS, completedOnDay6, {}, {}, '2026-09-26', overrides);
const allDays3 = weeks3.flatMap(w => w.days);

const intermediateDates = ['2026-09-20', '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'];
let intermediateLeak = false;

for (const date of intermediateDates) {
  const d = allDays3.find(day => day.dateStr === date);
  if (d) {
    const hasShifted = d.tasks.some(t => t.id === taskToShift1 || t.id === taskToShift2);
    if (hasShifted) {
      console.log(`  ✗ LEAK DETECTED on ${date}: Task appeared unexpectedly!`);
      intermediateLeak = true;
    }
  }
}

const targetDayObj = allDays3.find(d => d.dateStr === targetDateStr);
const shifted1OnTarget = targetDayObj ? targetDayObj.tasks.find(t => t.id === taskToShift1) : null;
const shifted2OnTarget = targetDayObj ? targetDayObj.tasks.find(t => t.id === taskToShift2) : null;

console.log('\nTest 3 (Task shifted from Sep 19 to Sep 26):');
console.log('  Intermediate days (Sep 20-25) clean of shifted tasks =', !intermediateLeak ? '✓ PASS' : '✗ FAIL');
console.log('  Tasks present on target day (Sep 26) =', (shifted1OnTarget && shifted2OnTarget) ? '✓ PASS' : '✗ FAIL');
console.log('  isCarriedOver is false on target day =', (shifted1OnTarget && !shifted1OnTarget.isCarriedOver && shifted2OnTarget && !shifted2OnTarget.isCarriedOver) ? '✓ PASS' : '✗ FAIL');

// Test 4: Task auto-sorting according to unit and lesson numbering
const mockTasks = [
  { id: 't1', label: '[MATH U4.10] Radical expressions', subject: 'math', code: 'Math U4.10', completed: false },
  { id: 't2', label: '[MATH U4.2] Linear equations', subject: 'math', code: 'Math U4.2', completed: false },
  { id: 't3', label: '[MATH U3.2] Unit conversion', subject: 'math', code: 'Math U3.2', completed: false },
  { id: 't4', label: '[R&W U4.1] Transitions', subject: 'rw', code: 'R&W U4.1', completed: false },
  { id: 't5', label: '[R&W U3.3] Cross-text connections', subject: 'rw', code: 'R&W U3.3', completed: false },
  { id: 'b1', label: 'Screen-Free Rest & Recharge', subject: 'buffer', code: 'BREAK', completed: false },
];

const sorted = sortDayTasks(mockTasks);
const sortedCodes = sorted.filter(t => t.code !== 'BREAK').map(t => t.code);
const expectedCodes = ['Math U3.2', 'Math U4.2', 'Math U4.10', 'R&W U3.3', 'R&W U4.1'];
const isSortedCorrectly = JSON.stringify(sortedCodes) === JSON.stringify(expectedCodes);

console.log('\nTest 4 (Natural Unit Numbering Auto-Sort):');
console.log('  Input order:   ', mockTasks.map(t => t.code).join(', '));
console.log('  Sorted order:  ', sortedCodes.join(', '));
console.log('  Matches natural numeric sequence (U3.2 < U4.2 < U4.10 < R&W U3.3 < R&W U4.1) =', isSortedCorrectly ? '✓ PASS' : '✗ FAIL');


