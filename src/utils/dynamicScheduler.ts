import { WeekPlan, DayPlan, TaskItem } from '../types';

export const DEFAULT_BUFFER_DATES: string[] = [
  '2026-09-22',
  '2026-09-23',
  '2026-09-24',
  '2026-09-25',
  '2026-09-26',
  '2026-09-27',
  '2026-09-28',
  '2026-09-29',
  '2026-09-30',
  '2026-10-01',
  '2026-10-02',
];

/**
 * Builds the calendar weeks from the authoritative master plan (STUDY_PLAN_WEEKS).
 *
 * - If the user has NOT added any extra buffer days beyond those already in the plan,
 *   the master plan is returned exactly as written (dates, Sundays, Phase 2 — untouched).
 * - If the user marks extra buffer days, only Phase 1 curriculum days shift forward.
 *   Overflow consumes elastic Phase 2 days (drills/reviews), never tests, rest-before-exam,
 *   or exam day.
 */
export function buildDynamicWeeks(
  customBufferDates: string[],
  baseWeeks: WeekPlan[]
): WeekPlan[] {
  const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
  const weeks = clone(baseWeeks);
  const allDays = weeks.flatMap((w) => w.days);

  const baseBufferDates = new Set(allDays.filter((d) => d.isBuffer).map((d) => d.dateStr));
  const extraBuffers = new Set(customBufferDates.filter((d) => !baseBufferDates.has(d)));

  if (extraBuffers.size === 0) return weeks;

  // Curriculum queue: Phase 1 study days in order
  const curriculum = allDays
    .filter((d) => d.phase === 'foundations' && !d.isBuffer && d.dayNumber !== undefined)
    .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));

  let qi = 0;
  const isProtected = (d: DayPlan) =>
    d.isTestDay || d.phase === 'exam' || (d.isBuffer && d.phase !== 'foundations');

  for (const week of weeks) {
    week.days = week.days.map((slot) => {
      const meta = {
        id: slot.dateStr,
        dateStr: slot.dateStr,
        dayOfWeek: slot.dayOfWeek,
        formattedDate: slot.formattedDate,
        weekId: slot.weekId,
        weekNumber: slot.weekNumber,
        weekTitle: slot.weekTitle,
      };

      // Base rest/buffer days stay as they are
      if (slot.isBuffer && slot.phase === 'foundations') return slot;

      // User-added buffer day
      if (extraBuffers.has(slot.dateStr) && !isProtected(slot)) {
        return {
          ...meta,
          phase: slot.phase,
          isBuffer: true,
          isTestDay: false,
          studyTimeMinutes: 0,
          breakTimeMinutes: 0,
          totalTimeMinutes: 0,
          specialInstructions:
            'Anti-Burnout Buffer Day: Recovery window. All remaining syllabus shifts forward cleanly without loss.',
          tasks: [
            {
              id: `buffer-${slot.dateStr}`,
              label: 'Anti-Burnout Buffer Day • Zero Assigned Study',
              subject: 'buffer',
              durationMinutes: 0,
              completed: false,
            },
          ],
        } as DayPlan;
      }

      // Phase 1 slot, or elastic Phase 2 slot while curriculum is still pending
      const isPhase1Slot = slot.phase === 'foundations' && !slot.isBuffer;
      const canAbsorb = isPhase1Slot || (!isProtected(slot) && qi < curriculum.length);
      if (canAbsorb && qi < curriculum.length) {
        const src = curriculum[qi++];
        return { ...src, ...meta, phase: 'foundations', isBuffer: false } as DayPlan;
      }
      if (isPhase1Slot) {
        // Curriculum exhausted early — leave a light review day
        return {
          ...meta,
          phase: 'foundations',
          isBuffer: false,
          studyTimeMinutes: 45,
          breakTimeMinutes: 0,
          totalTimeMinutes: 45,
          specialInstructions: 'Phase 1 complete. Light error-log review.',
          tasks: [
            {
              id: `review-${slot.dateStr}`,
              label: 'Error-log review & weak-skill cleanup (45 min)',
              subject: 'review',
              durationMinutes: 45,
              completed: false,
            },
          ],
        } as DayPlan;
      }
      return slot;
    });
  }

  return weeks;
}

// ---------------------------------------------------------------------------
// Legacy scheduler (kept for reference; no longer used)
// ---------------------------------------------------------------------------

export interface Phase2Metrics {
  totalBufferDays: number;
  phase2FillerDaysSubtracted: number;
  phase1CompletionDateStr: string;
  phase1CompletionFormatted: string;
  test1DateStr: string;
  test2DateStr: string;
  test3DateStr: string;
  examDateStr: string;
  statusLabel: string;
}

function getDayInfo(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const monthStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  return {
    dayOfWeek,
    formattedDate: `${dayOfWeek} ${monthStr} ${d}`,
  };
}

interface Phase2TemplateItem {
  id: string;
  type: string;
  priority: number; // 1 = mandatory mock/exam/taper; 2 = logistics; 3 = elastic drill/review that can be compressed
  isTestDay?: boolean;
  studyTimeMinutes: number;
  breakTimeMinutes: number;
  totalTimeMinutes: number;
  tasks: TaskItem[];
  specialInstructions: string;
}

const PHASE_2_MASTER_CANDIDATES: Phase2TemplateItem[] = [
  {
    id: 'p2-item-test-1',
    type: 'test',
    priority: 1,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    tasks: [{ id: 'bluebook-test-1', label: 'TEST #1 (full Bluebook Practice Test, real conditions)', subject: 'test', durationMinutes: 144, completed: false }],
    specialInstructions: '8:00 AM - 10:24 AM: Full timed Bluebook Practice Test #1 under real conditions. No pausing, official calculator only.',
  },
  {
    id: 'p2-item-review-1',
    type: 'review',
    priority: 1,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    tasks: [{ id: 'p2-d2-1', label: 'Error-log review of Test #1 (45 min)', subject: 'review', durationMinutes: 45, completed: false }],
    specialInstructions: 'Dissect every wrong question on Test #1: skill & root-cause autopsy in the Mistake Autopsy Notebook.',
  },
  {
    id: 'p2-item-drill-1',
    type: 'drill',
    priority: 3, // Elastic filler
    studyTimeMinutes: 60,
    breakTimeMinutes: 0,
    totalTimeMinutes: 60,
    tasks: [{ id: 'p2-d3-1', label: 'Targeted Math & Desmos speed drills (60 min)', subject: 'drill', durationMinutes: 60, completed: false }],
    specialInstructions: 'Targeted Math drills on Test #1 errors + Desmos shortcuts.',
  },
  {
    id: 'p2-item-test-2',
    type: 'test',
    priority: 1,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    tasks: [{ id: 'bluebook-test-2', label: 'TEST #2 (full Bluebook Practice Test)', subject: 'test', durationMinutes: 144, completed: false }],
    specialInstructions: '8:00 AM - 10:24 AM: Full timed Bluebook Practice Test #2 under real conditions.',
  },
  {
    id: 'p2-item-review-2',
    type: 'review',
    priority: 1,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    tasks: [{ id: 'p2-d8-1', label: 'Error-log review of Test #2 (45 min)', subject: 'review', durationMinutes: 45, completed: false }],
    specialInstructions: 'Dissect every wrong question on Test #2 and log root causes in your Error Notebook.',
  },
  {
    id: 'p2-item-review-deep',
    type: 'review',
    priority: 2, // Elastic review
    studyTimeMinutes: 60,
    breakTimeMinutes: 0,
    totalTimeMinutes: 60,
    tasks: [{ id: 'p2-d10-1', label: 'Deep review, punctuation & transitions traps + Math cleanup (60 min)', subject: 'review', durationMinutes: 60, completed: false }],
    specialInstructions: 'Grammar traps, transitions and Desmos shortcuts review before final full test.',
  },
  {
    id: 'p2-item-test-3',
    type: 'test',
    priority: 1,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    tasks: [{ id: 'bluebook-test-3', label: 'TEST #3 (final full test, timed)', subject: 'test', durationMinutes: 144, completed: false }],
    specialInstructions: '8:00 AM - 10:24 AM: Final official Bluebook Practice Test #3 under full timed conditions.',
  },
  {
    id: 'p2-item-review-3',
    type: 'review',
    priority: 1,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    tasks: [{ id: 'w8-d1-1', label: 'Error-log review of Test #3 + simulate exact test-day timing (45 min)', subject: 'review', durationMinutes: 45, completed: false }],
    specialInstructions: 'Root cause autopsy across both Math and R&W. Lock in your final cheat codes.',
  },
  {
    id: 'p2-item-taper',
    type: 'taper',
    priority: 1,
    studyTimeMinutes: 30,
    breakTimeMinutes: 0,
    totalTimeMinutes: 30,
    tasks: [{ id: 'w8-d2-1', label: 'Light taper, review error notebook + grammar rules (30 min)', subject: 'review', durationMinutes: 30, completed: false }],
    specialInstructions: 'Gentle review of high-yield formulas and grammar rules. Do not take tests.',
  },
  {
    id: 'p2-item-logistics-1',
    type: 'logistics',
    priority: 2,
    studyTimeMinutes: 20,
    breakTimeMinutes: 0,
    totalTimeMinutes: 20,
    tasks: [{ id: 'w8-d3-1', label: 'Verify Bluebook app, admission ticket, ID (20 min)', subject: 'logistics', durationMinutes: 20, completed: false }],
    specialInstructions: 'Logistics check: verify Bluebook exam setup, print physical ticket, confirm passport/smart CNIC.',
  },
  {
    id: 'p2-item-logistics-2',
    type: 'logistics',
    priority: 2,
    studyTimeMinutes: 20,
    breakTimeMinutes: 0,
    totalTimeMinutes: 20,
    tasks: [{ id: 'w8-d4-1', label: 'Very light review, then pack bag (20 min)', subject: 'logistics', durationMinutes: 20, completed: false }],
    specialInstructions: 'Formula checklist review & complete bag packout according to the Rank 1-4 packing list.',
  },
];

/**
 * Legacy: dynamically constructs the 8 weeks based on any active buffer dates.
 * Superseded by buildDynamicWeeks above (forced Sunday rests; ignored master plan).
 */
export function legacyBuildDynamicWeeks(
  customBufferDates: string[],
  baseWeeks: WeekPlan[]
): WeekPlan[] {
  const bufferSet = new Set(customBufferDates);

  // 1. Extract canonical 30 Phase 1 days in sequential order
  const curriculumDays: DayPlan[] = [];
  baseWeeks.forEach((w) => {
    w.days.forEach((d) => {
      if (d.dayNumber !== undefined && d.dayNumber >= 1 && d.dayNumber <= 30) {
        if (!curriculumDays.some((c) => c.dayNumber === d.dayNumber)) {
          curriculumDays.push(d);
        }
      }
    });
  });
  curriculumDays.sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));

  // 2. Generate all dates from 2026-09-14 to 2026-11-07
  const allDateStrs: string[] = [];
  const cur = new Date(2026, 8, 14); // Sep 14
  const end = new Date(2026, 10, 7); // Nov 7
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    allDateStrs.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }

  // 3. Schedule days
  let curriculumIndex = 0;
  const flatScheduledDays: (DayPlan & { pendingPhase2?: boolean })[] = [];

  allDateStrs.forEach((dateStr) => {
    const { dayOfWeek, formattedDate } = getDayInfo(dateStr);
    const isSunday = dayOfWeek === 'Sun';
    const isUserBuffer = bufferSet.has(dateStr);
    const isExamDay = dateStr === '2026-11-07';
    const isPreExamRest = dateStr === '2026-11-06';

    if (isExamDay) {
      flatScheduledDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: 'week-8',
        weekNumber: 8,
        weekTitle: 'Test #3 Autopsy, Taper Protocol & Official SAT Exam Day',
        phase: 'exam',
        isBuffer: false,
        isTestDay: true,
        studyTimeMinutes: 144,
        breakTimeMinutes: 10,
        totalTimeMinutes: 154,
        tasks: [
          {
            id: 'sat-exam-day',
            label: 'OFFICIAL SAT EXAM DAY: Arrive at Crescent Model by 7:15 AM sharp',
            subject: 'test',
            durationMinutes: 144,
            completed: false,
          },
        ],
        specialInstructions: 'Doors close strictly around 7:45 AM. Arrive by 7:15 AM. Bring original physical ID, printed ticket, testing laptop & charger.',
      });
      return;
    }

    if (isPreExamRest) {
      flatScheduledDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: 'week-8',
        weekNumber: 8,
        weekTitle: 'Test #3 Autopsy, Taper Protocol & Official SAT Exam Day',
        phase: 'exam',
        isBuffer: true,
        studyTimeMinutes: 0,
        breakTimeMinutes: 0,
        totalTimeMinutes: 0,
        tasks: [
          {
            id: `break-${dateStr}`,
            label: 'FULL REST. No studying. Sleep early',
            subject: 'buffer',
            durationMinutes: 0,
            completed: false,
          },
        ],
        specialInstructions: 'Zero studying. Eat a nutritious dinner, hydrate, lay out clothes, and sleep early for exam day.',
      });
      return;
    }

    if (isSunday || isUserBuffer) {
      const reason = isUserBuffer
        ? 'Anti-Burnout Buffer Day: Recovery Window (Energy / Exhaustion Reset) • Zero Assigned Study'
        : 'Full Rest & Cognitive Recovery • Zero Assigned Study';
      flatScheduledDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: 'week-temp',
        weekNumber: 1,
        weekTitle: 'Study Plan',
        phase: curriculumIndex < 32 ? 'foundations' : 'bluebook',
        isBuffer: true,
        studyTimeMinutes: 0,
        breakTimeMinutes: 0,
        totalTimeMinutes: 0,
        tasks: [
          {
            id: `buffer-${dateStr}`,
            label: reason,
            subject: 'buffer',
            durationMinutes: 0,
            completed: false,
          },
        ],
        specialInstructions: isUserBuffer
          ? 'Anti-Burnout Buffer Day: Permitted rest window to recover energy, solve external problems, and reset mental stamina. All syllabus tasks shift forward cleanly without loss.'
          : 'Weekly recovery window. Full day off, no studying.',
      });
      return;
    }

    // Regular study day
    if (curriculumIndex < curriculumDays.length) {
      const canonicalDay = curriculumDays[curriculumIndex];
      flatScheduledDays.push({
        ...canonicalDay,
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        phase: 'foundations',
        isBuffer: false,
      });
      curriculumIndex++;
    } else {
      // Phase 2 Study Day
      flatScheduledDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: 'week-temp',
        weekNumber: 7,
        weekTitle: 'Phase 2 Arena',
        phase: 'bluebook',
        isBuffer: false,
        pendingPhase2: true,
        tasks: [],
      });
    }
  });

  // 4. Dynamically allocate Phase 2 candidate items to available Phase 2 slots
  const p2Slots = flatScheduledDays.filter((d) => d.pendingPhase2);
  let candidates = [...PHASE_2_MASTER_CANDIDATES];

  if (candidates.length > p2Slots.length) {
    // Compress Phase 2: drop lower priority items (priority 3 first, then 2)
    candidates = candidates.filter((c) => c.priority < 3);
    if (candidates.length > p2Slots.length) {
      candidates = candidates.filter((c) => c.priority === 1);
    }
  }

  p2Slots.forEach((slot, idx) => {
    delete slot.pendingPhase2;
    const item = candidates[idx] || candidates[candidates.length - 1];
    slot.isTestDay = item.isTestDay;
    slot.studyTimeMinutes = item.studyTimeMinutes;
    slot.breakTimeMinutes = item.breakTimeMinutes;
    slot.totalTimeMinutes = item.totalTimeMinutes;
    slot.tasks = item.tasks;
    slot.specialInstructions = item.specialInstructions;
  });

  // 5. Partition the 55 scheduled days into the 8 calendar weeks
  // Weeks 1..7 have 7 days (Mon-Sun); Week 8 has 6 days (Mon-Sat, ending Nov 7)
  const weekDefinitions = [
    { id: 'week-1', num: 1, title: 'Week 1: Problem Solving & Advanced Math Foundations', range: 'Sep 14 to Sep 20', subtitle: 'Ratios, unit conversions, percentages, data distributions & quadratic foundations.', phase: 'foundations' as const },
    { id: 'week-2', num: 2, title: 'Week 2: Math U5 Launch & Recovery Buffer Block', range: 'Sep 21 to Sep 27', subtitle: 'Day 7 completed, then Sep 22–27 buffer window for full illness recovery.', phase: 'foundations' as const },
    { id: 'week-3', num: 3, title: 'Week 3: Illness Buffer Recovery & Phase 1 Resume (Oct 03 - Oct 04)', range: 'Sep 28 to Oct 04', subtitle: 'Sep 28-Oct 2 illness recovery; Days 8–9 resume Phase 1 foundations.', phase: 'foundations' as const },
    { id: 'week-4', num: 4, title: 'Week 4: Advanced Quadratics, Functions, Geometry & Reading Skills', range: 'Oct 05 to Oct 11', subtitle: 'Days 10–15 cover ratios, data inferences, factoring, polynomials & rhetorical skills.', phase: 'foundations' as const },
    { id: 'week-5', num: 5, title: 'Week 5: Advanced Algebra, Statistics & Grammar Mastery', range: 'Oct 12 to Oct 18', subtitle: 'Days 16–21 master 3D geometry, circle equations, linear inequalities, percentages & data.', phase: 'foundations' as const },
    { id: 'week-6', num: 6, title: 'Week 6: Exponential Models, Advanced Quadratics & Grammar Systems', range: 'Oct 19 to Oct 25', subtitle: 'Days 22–27 cover scatterplots, quadratics, systems, word problems & grammar conventions.', phase: 'foundations' as const },
    { id: 'week-7', num: 7, title: 'Week 7: Phase 1 Climax (Ends Oct 24) & Phase 2 Launch (Test #1)', range: 'Oct 26 to Nov 01', subtitle: 'Days 28-29 complete all 145 skills by Sat Oct 24. Phase 2 launches Mon Oct 26 with Test #1 & Test #2 on Fri Oct 30.', phase: 'bluebook' as const },
    { id: 'week-8', num: 8, title: 'Week 8: Test #3 Final Mock, Taper, Packout & Official SAT Exam Day', range: 'Nov 02 to Nov 07', subtitle: 'Test #3 (Tue Nov 3), light taper, bag packout, full rest & Sat Nov 7 Exam Day.', phase: 'exam' as const },
  ];

  const weeks: WeekPlan[] = [];
  let dayOffset = 0;

  weekDefinitions.forEach((def, wIdx) => {
    const dayCount = wIdx === 7 ? 6 : 7;
    const weekDays = flatScheduledDays.slice(dayOffset, dayOffset + dayCount);
    dayOffset += dayCount;

    weekDays.forEach((day) => {
      day.weekId = def.id;
      day.weekNumber = def.num;
      day.weekTitle = def.title;
      // Preserve exam phase for week 8, otherwise match week phase or day's own phase
      if (def.phase === 'exam' || day.phase === 'exam') {
        day.phase = 'exam';
      } else if (def.phase === 'bluebook' || day.phase === 'bluebook') {
        day.phase = 'bluebook';
      } else {
        day.phase = 'foundations';
      }
    });

    weeks.push({
      id: def.id,
      title: def.title,
      dateRange: def.range,
      subtitle: def.subtitle,
      phase: def.phase,
      days: weekDays,
    });
  });

  return weeks;
}

/**
 * Returns summary metrics for the dynamic schedule
 */
export function getPhase2BufferMetrics(customBufferDates: string[]): Phase2Metrics {
  const totalBufferDays = customBufferDates.length;
  const phase2FillerDaysSubtracted = Math.max(0, totalBufferDays);

  return {
    totalBufferDays,
    phase2FillerDaysSubtracted,
    phase1CompletionDateStr: '2026-10-24',
    phase1CompletionFormatted: 'Sat Oct 24',
    test1DateStr: '2026-10-26',
    test2DateStr: '2026-10-30',
    test3DateStr: '2026-11-03',
    examDateStr: '2026-11-07',
    statusLabel: `${totalBufferDays} Buffer Days Active • Phase 2 Balanced (${phase2FillerDaysSubtracted} filler days compressed)`
  };
}
