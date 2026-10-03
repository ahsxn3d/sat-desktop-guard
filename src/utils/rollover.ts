import { WeekPlan, DayPlan, TaskItem } from '../types';

/**
 * Extracts numeric sorting metrics from a TaskItem.
 * Supports:
 * - Math: Math U3.2, Math U4.10, [MATH U4.4]
 * - Reading & Writing: R&W U3.3, [R&W U4.1]
 * - Tests, Drills, and Bluebook exams
 * - Breaks and rest intervals
 */
export function extractTaskSortMetrics(task: TaskItem): {
  subjectRank: number;
  unit: number;
  lesson: number;
  subLesson: number;
} {
  const isMath = task.subject === 'math';
  const isRw = task.subject === 'rw';
  const isExam = task.subject === 'test' || task.subject === 'drill' || task.subject === 'review';
  const isBreak = task.code === 'BREAK' || task.subject === 'buffer';

  let subjectRank = 5;
  if (isMath) subjectRank = 1;
  else if (isRw) subjectRank = 2;
  else if (isExam) subjectRank = 3;
  else if (isBreak) subjectRank = 4;

  const textToScan = `${task.code || ''} ${task.label || ''}`;

  // Match unit and lesson patterns: e.g. "U4.2", "U4.10", "Unit 3.2", "Ch 4"
  const unitMatch = textToScan.match(/(?:unit|u|ch|chapter)\s*(\d+)(?:[.\s]+(\d+))?(?:[.\s]+(\d+))?/i);
  const unit = unitMatch ? parseInt(unitMatch[1], 10) : 999;
  const lesson = unitMatch && unitMatch[2] ? parseInt(unitMatch[2], 10) : 0;
  const subLesson = unitMatch && unitMatch[3] ? parseInt(unitMatch[3], 10) : 0;

  return { subjectRank, unit, lesson, subLesson };
}

/**
 * Rearranges tasks on a day strictly according to unit and lesson numbering:
 * 1. All Math lessons sorted in ascending numerical order (e.g., U3.2 -> U4.2 -> U4.10).
 * 2. Scheduled rest break interval (if present).
 * 3. All Reading & Writing lessons sorted in ascending numerical order (e.g., U3.1 -> U4.1).
 * 4. Practice exams, drills, and secondary breaks.
 * 5. On buffer days (Sundays) with active lessons, placeholder 'REST' tasks are omitted.
 */
export function sortDayTasks(tasks: TaskItem[], isBufferDay: boolean = false): TaskItem[] {
  if (tasks.length <= 1) return tasks;

  const mathTasks = tasks.filter((t) => t.subject === 'math');
  const rwTasks = tasks.filter((t) => t.subject === 'rw');
  const examTasks = tasks.filter((t) => t.subject === 'test' || t.subject === 'drill' || t.subject === 'review');
  const breakTasks = tasks.filter((t) => t.code === 'BREAK' || (t.subject === 'buffer' && t.code !== 'REST'));
  const restTasks = tasks.filter((t) => t.code === 'REST');
  const logisticsTasks = tasks.filter(
    (t) =>
      t.subject === 'logistics' ||
      (!['math', 'rw', 'test', 'drill', 'review', 'buffer'].includes(t.subject) &&
        t.code !== 'BREAK' &&
        t.code !== 'REST')
  );

  const compareCurriculum = (a: TaskItem, b: TaskItem): number => {
    const ma = extractTaskSortMetrics(a);
    const mb = extractTaskSortMetrics(b);
    if (ma.unit !== mb.unit) return ma.unit - mb.unit;
    if (ma.lesson !== mb.lesson) return ma.lesson - mb.lesson;
    if (ma.subLesson !== mb.subLesson) return ma.subLesson - mb.subLesson;
    return a.label.localeCompare(b.label);
  };

  mathTasks.sort(compareCurriculum);
  rwTasks.sort(compareCurriculum);

  examTasks.sort((a, b) => {
    const numA = (a.label.match(/\d+/) || [0])[0];
    const numB = (b.label.match(/\d+/) || [0])[0];
    return Number(numA) - Number(numB);
  });

  const hasActiveLessons = mathTasks.length > 0 || rwTasks.length > 0 || examTasks.length > 0;

  // On a buffer recovery day (Sunday) with active lessons, omit generic 'REST' task
  if (isBufferDay && hasActiveLessons) {
    // Return sorted active lessons cleanly
    return [...mathTasks, ...rwTasks, ...examTasks, ...breakTasks, ...logisticsTasks];
  }

  // If there are no active lessons (e.g., pure Rest Sunday), return original tasks
  if (!hasActiveLessons) {
    return tasks;
  }

  // Assembling structured day:
  // Math Block -> Interstitial Break -> Reading & Writing Block -> Remaining Breaks -> Exams -> Logistics
  const result: TaskItem[] = [];

  if (mathTasks.length > 0 && rwTasks.length > 0) {
    result.push(...mathTasks);
    if (breakTasks.length > 0) {
      result.push(breakTasks[0]);
    }
    result.push(...rwTasks);
    if (breakTasks.length > 1) {
      result.push(...breakTasks.slice(1));
    }
  } else if (mathTasks.length > 0) {
    result.push(...mathTasks);
    result.push(...breakTasks);
  } else if (rwTasks.length > 0) {
    result.push(...rwTasks);
    result.push(...breakTasks);
  } else {
    result.push(...examTasks);
    result.push(...breakTasks);
  }

  result.push(...examTasks.filter((e) => !result.includes(e)));
  result.push(...logisticsTasks);

  return result;
}

/**
 * Computes weeks with dynamic rollover / carryover of uncompleted tasks.
 * 
 * Rules:
 * 1. Preparation starts on '2026-09-14' (Day 1).
 * 2. Rollover works ONLY when the student actually worked on a day and left specific tasks uncompleted
 *    (e.g., completed English on Saturday, but skipped Math). Untouched / unstarted days do NOT roll over!
 * 3. CRITICAL: Uncompleted rollover tasks roll over ONLY to the NEXT BUFFER DAY / SUNDAY!
 *    Regular study days (Mon-Sat) are NEVER polluted with rollover backlog.
 * 4. Tasks on every day automatically rearrange and sort themselves according to unit numbering.
 * 5. Explicitly shifted / rescheduled tasks (taskScheduleOverrides):
 *    - Belong ONLY to their scheduled target date.
 *    - Never appear or roll over on intermediate days.
 *    - Are treated as regular scheduled lessons (isCarriedOver = false) and do NOT display rollover badges.
 * 6. If the user marks the carried-over task as done on Sunday, it is automatically marked
 *    as completed on BOTH Sunday and its original day.
 */
export function computeWeeksWithRollover(
  rawWeeks: WeekPlan[],
  completedTaskIds: Record<string, boolean>,
  taskCompletionDay: Record<string, string>,
  dayNotes: Record<string, string> = {},
  todayDateStr: string = '2026-09-14',
  taskScheduleOverrides: Record<string, string> = {}
): WeekPlan[] {
  // 1. Flatten all days in chronological order
  const allRawDays: DayPlan[] = rawWeeks.flatMap((w) => w.days);
  const KICKOFF_DATE = '2026-09-14';

  // Helper: determine if a day has actively been engaged with and left uncompleted backlog
  const hasDayLeftovers = (day: DayPlan): boolean => {
    if (day.dateStr < KICKOFF_DATE) return false;

    // Must have active curriculum tasks (exclude buffer/rest & logistics)
    // AND CRITICALLY: Exclude tasks that have been explicitly rescheduled to another date
    const activeTasks = day.tasks
      .filter((t) => t.subject !== 'buffer' && t.subject !== 'logistics')
      .filter((t) => {
        const targetDate = taskScheduleOverrides[t.id];
        return !targetDate || targetDate === day.dateStr;
      });

    const completedCount = activeTasks.filter((t) => !!completedTaskIds[t.id]).length;
    const hasUncompleted = activeTasks.some((t) => !completedTaskIds[t.id]);
    const hasNotes = !!(dayNotes[day.id] || dayNotes[day.dateStr]);

    // Engagement requirement:
    // Only days where the user actually completed at least 1 task (or added specific notes)
    // AND left some tasks incomplete have legitimate leftovers!
    // Untouched / unstarted days NEVER dump their syllabus into future days.
    const hasEngagement = completedCount > 0 || (hasNotes && day.dateStr <= todayDateStr);

    return hasEngagement && hasUncompleted;
  };

  // 2. For each day, compute its native tasks, scheduled shift tasks, and eligible carried-over tasks
  const updatedDaysMap = new Map<string, DayPlan>();

  allRawDays.forEach((day, dayIndex) => {
    // A. Native tasks of this day (exclude tasks shifted away to another date)
    const nativeTasks: TaskItem[] = day.tasks
      .filter((task) => {
        const targetDate = taskScheduleOverrides[task.id];
        return !targetDate || targetDate === day.dateStr;
      })
      .map((task) => ({
        ...task,
        completed: !!completedTaskIds[task.id],
        isCarriedOver: false,
      }));

    const nativeTaskIds = new Set(nativeTasks.map((t) => t.id));

    // B. Explicit Schedule Overrides (Lessons deliberately scheduled/shifted to THIS specific date)
    // IMPORTANT: These are scheduled lessons, NOT uncompleted rollovers, so isCarriedOver = false
    const scheduledShiftTasks: TaskItem[] = [];
    allRawDays.forEach((otherDay) => {
      if (otherDay.dateStr === day.dateStr) return;
      otherDay.tasks.forEach((origTask) => {
        const targetDate = taskScheduleOverrides[origTask.id];
        if (targetDate === day.dateStr) {
          if (!nativeTaskIds.has(origTask.id) && !scheduledShiftTasks.some((t) => t.id === origTask.id)) {
            const isDone = !!completedTaskIds[origTask.id];
            scheduledShiftTasks.push({
              ...origTask,
              completed: isDone,
              isCarriedOver: false, // NOT a rollover! Intentionally scheduled by user/AI.
              isRescheduled: true,
              originalDayId: otherDay.id,
              originalDateStr: otherDay.dateStr,
              originalFormattedDate: otherDay.formattedDate,
              completedOnDateStr: isDone ? (taskCompletionDay[origTask.id] || day.dateStr) : undefined,
            });
          }
        }
      });
    });

    const scheduledShiftTaskIds = new Set(scheduledShiftTasks.map((t) => t.id));
    const carriedOverTasks: TaskItem[] = [];

    // C. Check earlier days (j < dayIndex) for uncompleted rollover
    for (let j = 0; j < dayIndex; j++) {
      const prevDay = allRawDays[j];

      // Rollover begins only from kickoff date onwards
      if (prevDay.dateStr < KICKOFF_DATE) continue;

      // Only days that were engaged with and left uncompleted backlog can generate rollover
      if (!hasDayLeftovers(prevDay)) continue;

      // RULE: Rollover lands ONLY on the NEXT BUFFER DAY / SUNDAY!
      // Find the first buffer day (isBuffer === true or Sunday) after prevDay:
      let targetBufferDayIndex = -1;
      for (let k = j + 1; k < allRawDays.length; k++) {
        if (allRawDays[k].isBuffer || allRawDays[k].dayOfWeek === 'Sun') {
          targetBufferDayIndex = k;
          break;
        }
      }

      // `day` is eligible to receive this backlog ONLY if it is that designated buffer day:
      const isEligibleRecipient = dayIndex === targetBufferDayIndex;

      prevDay.tasks.forEach((prevTask) => {
        // Buffer and logistics reminders do not roll over as curriculum tasks
        if (prevTask.subject === 'buffer' || prevTask.subject === 'logistics') return;

        // CRITICAL: If this task has an explicit schedule override,
        // it belongs ONLY to its scheduled date! It MUST NOT roll over to any intermediate days!
        if (taskScheduleOverrides[prevTask.id]) return;

        // Skip if this task ID already belongs natively to today or scheduled shifts
        if (nativeTaskIds.has(prevTask.id)) return;
        if (scheduledShiftTaskIds.has(prevTask.id)) return;
        if (carriedOverTasks.some((t) => t.id === prevTask.id)) return;

        const isTaskDone = !!completedTaskIds[prevTask.id];
        const completionDay = taskCompletionDay[prevTask.id];

        if (!isTaskDone && isEligibleRecipient) {
          // Left uncompleted on prevDay -> rolls over ONLY to the next buffer day / Sunday
          carriedOverTasks.push({
            ...prevTask,
            completed: false,
            isCarriedOver: true,
            originalDayId: prevDay.id,
            originalDateStr: prevDay.dateStr,
            originalFormattedDate: prevDay.formattedDate,
          });
        } else if (isTaskDone && completionDay === day.dateStr) {
          // Completed on THIS specific shifted day -> show completed on this day
          carriedOverTasks.push({
            ...prevTask,
            completed: true,
            isCarriedOver: true,
            originalDayId: prevDay.id,
            originalDateStr: prevDay.dateStr,
            originalFormattedDate: prevDay.formattedDate,
            completedOnDateStr: day.dateStr,
          });
        }
      });
    }

    // Combine carried over backlog, native tasks, and scheduled shifts
    const combinedTasks = [...carriedOverTasks, ...nativeTasks, ...scheduledShiftTasks];

    // Rearrange and sort tasks strictly according to unit numbering!
    const isBufferDay = day.isBuffer || day.dayOfWeek === 'Sun';
    const sortedTasks = sortDayTasks(combinedTasks, isBufferDay);

    updatedDaysMap.set(day.id, {
      ...day,
      userNotes: dayNotes[day.id] || dayNotes[day.dateStr] || '',
      tasks: sortedTasks,
      hasCarriedOverTasks: carriedOverTasks.length > 0,
      carriedOverCount: carriedOverTasks.length,
    });
  });

  // 3. Reconstruct WeekPlan array
  return rawWeeks.map((week) => ({
    ...week,
    days: week.days.map((d) => updatedDaysMap.get(d.id) || d),
  }));
}


