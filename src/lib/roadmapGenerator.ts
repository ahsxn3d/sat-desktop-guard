// src/lib/roadmapGenerator.ts
// Intelligent Dynamic SAT Roadmap Generator
// Transforms student diagnostic answers into an official, personalized Phase 1 & Phase 2 study schedule
// powered by Khan Academy Digital SAT syllabus units and official Bluebook practice tests.

import { WeekPlan, DayPlan, TaskItem } from '../types';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS, KhanLessonItem } from '../data/khanAcademyCatalog';

export interface DiagnosticProfile {
  targetExamDate: string; // e.g. "2026-11-07"
  currentScore: number; // e.g. 1150
  targetScore: number; // e.g. 1550
  dailyMinutes: number; // e.g. 60, 90, 120, 150
  sprintDuration: 'sprint_25' | 'deep_45'; // 25 min sprints vs 45 min deep blocks
  bufferDayOfWeek: number; // 0 for Sunday, 5 for Friday, 6 for Saturday, etc.
  mathWeaknesses: string[]; // ['algebra', 'advanced_math', 'problem_solving', 'geometry_trig']
  rwWeaknesses: string[]; // ['craft_structure', 'information_ideas', 'conventions', 'expression_ideas']
  anchorTime: string; // e.g. "18:30" (6:30 PM)
  theme?: string; // 'matcha' | 'dark' | 'midnight'
  typography?: string; // 'space_grotesk' | 'inter' | 'outfit'
  aiProvider?: 'gemini' | 'openai' | 'custom_models';
  customModelEndpoints?: {
    mathModel?: string;
    rwModel?: string;
    errorModel?: string;
  };
}

export const DEFAULT_DIAGNOSTIC_PROFILE: DiagnosticProfile = {
  targetExamDate: '2026-11-07',
  currentScore: 1200,
  targetScore: 1550,
  dailyMinutes: 120,
  sprintDuration: 'sprint_25',
  bufferDayOfWeek: 0, // Sunday
  mathWeaknesses: ['advanced_math', 'algebra'],
  rwWeaknesses: ['conventions', 'information_ideas'],
  anchorTime: '18:30',
  theme: 'matcha',
  typography: 'space_grotesk',
  aiProvider: 'gemini',
};

// Helper: Format Date to YYYY-MM-DD
function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Helper: Format Date to "Sat Oct 03"
function formatPrettyDate(d: Date): { formattedDate: string; dayOfWeek: string } {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayOfWeek = days[d.getDay()];
  const month = months[d.getMonth()];
  const dateNum = String(d.getDate()).padStart(2, '0');
  return {
    dayOfWeek,
    formattedDate: `${dayOfWeek} ${month} ${dateNum}`
  };
}

// Helper: Compute Time Slot Strings e.g. "6:30 PM - 7:00 PM"
function buildTimeSlot(baseTime: string, elapsedMinutes: number, durationMinutes: number): string {
  const [hStr, mStr] = baseTime.split(':');
  let startTotal = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + elapsedMinutes;
  let endTotal = startTotal + durationMinutes;

  function to12h(totalMin: number): string {
    let normalized = totalMin % (24 * 60);
    let h = Math.floor(normalized / 60);
    let m = normalized % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const mStr = String(m).padStart(2, '0');
    return `${h12}:${mStr} ${ampm}`;
  }

  return `${to12h(startTotal)} - ${to12h(endTotal)}`;
}

export function generatePersonalizedRoadmap(profile: DiagnosticProfile, startingDateStr?: string): WeekPlan[] {
  const today = startingDateStr ? new Date(startingDateStr) : new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(profile.targetExamDate);
  examDate.setHours(0, 0, 0, 0);

  // If exam date is in past or less than 7 days ahead, default to 35 days ahead
  if (examDate <= today || (examDate.getTime() - today.getTime()) < 7 * 86400000) {
    examDate.setTime(today.getTime() + 35 * 86400000);
  }

  // Generate continuous list of dates
  const allDates: Date[] = [];
  let curr = new Date(today);
  while (curr <= examDate) {
    allDates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  const totalDaysCount = allDates.length;

  // Allocate Phase 2 testing days (Last 12 to 14 days, or at least 40% if total days < 14)
  const phase2Length = totalDaysCount <= 14 ? Math.max(4, Math.floor(totalDaysCount * 0.4)) : 14;
  const phase1Length = totalDaysCount - phase2Length;

  const phase1Dates = allDates.slice(0, phase1Length);
  const phase2Dates = allDates.slice(phase1Length);

  // Prepare Khan Academy lesson pool
  const allMathLessons: KhanLessonItem[] = KHAN_MATH_UNITS.flatMap((u) => u.lessons);
  const allRWLessons: KhanLessonItem[] = KHAN_RW_UNITS.flatMap((u) => u.lessons);

  // Filter & prioritize according to student weaknesses
  const prioritizedMath = [...allMathLessons].sort((a, b) => {
    const aWeak = profile.mathWeaknesses.includes(a.domain) ? 1 : 0;
    const bWeak = profile.mathWeaknesses.includes(b.domain) ? 1 : 0;
    return bWeak - aWeak;
  });

  const prioritizedRW = [...allRWLessons].sort((a, b) => {
    const aWeak = profile.rwWeaknesses.includes(a.domain) ? 1 : 0;
    const bWeak = profile.rwWeaknesses.includes(b.domain) ? 1 : 0;
    return bWeak - aWeak;
  });

  // Calculate lessons per study day based on daily study capacity
  const lessonMinutes = profile.sprintDuration === 'deep_45' ? 40 : 25;
  const lessonsPerDay = Math.max(2, Math.floor((profile.dailyMinutes - 15) / lessonMinutes));

  // Build Phase 1 Days
  let mathIndex = 0;
  let rwIndex = 0;
  let studyDayCounter = 1;

  const plannedDays: DayPlan[] = [];

  for (let i = 0; i < phase1Dates.length; i++) {
    const d = phase1Dates[i];
    const dateStr = formatDate(d);
    const { dayOfWeek, formattedDate } = formatPrettyDate(d);
    const isBuffer = d.getDay() === profile.bufferDayOfWeek;

    if (isBuffer) {
      // Full rest/recharge buffer day
      plannedDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: '',
        weekNumber: 1,
        weekTitle: '',
        phase: 'foundations',
        isBuffer: true,
        isTestDay: false,
        studyTimeMinutes: 0,
        breakTimeMinutes: 0,
        totalTimeMinutes: 0,
        specialInstructions: 'Guaranteed Rest Day: Zero assigned lessons. Allow complete mental recharge, sleep, and physical recovery.',
        tasks: [
          {
            id: `rest-${dateStr}`,
            label: 'Full Rest & Cognitive Recovery • Zero Assigned Study',
            subject: 'buffer',
            code: 'REST',
            topic: 'Cognitive Recovery',
            completed: false
          }
        ]
      });
      continue;
    }

    // Active Study Day
    const dayTasks: TaskItem[] = [];
    let elapsedMinutes = 0;
    let totalStudyMin = 0;
    let totalBreakMin = 0;

    // Alternate between Math and R&W lessons
    for (let taskIdx = 0; taskIdx < lessonsPerDay; taskIdx++) {
      // Pick subject: Even taskIdx = Math, Odd = RW
      const isMathTask = taskIdx % 2 === 0;
      let lesson: KhanLessonItem | null = null;

      if (isMathTask) {
        lesson = prioritizedMath[mathIndex % prioritizedMath.length];
        mathIndex++;
      } else {
        lesson = prioritizedRW[rwIndex % prioritizedRW.length];
        rwIndex++;
      }

      const dur = Math.min(profile.sprintDuration === 'deep_45' ? 40 : 25, lesson.recommendedMinutes);
      const timeSlot = buildTimeSlot(profile.anchorTime, elapsedMinutes, dur);
      elapsedMinutes += dur;
      totalStudyMin += dur;

      dayTasks.push({
        id: `task-${dateStr}-${dayTasks.length + 1}`,
        label: `[${lesson.code.toUpperCase()}] ${lesson.title}`,
        subject: isMathTask ? 'math' : 'rw',
        code: lesson.code,
        topic: lesson.title,
        timeSlot,
        durationMinutes: dur,
        completed: false
      });

      // Insert real 15-min break halfway through
      if (taskIdx === Math.floor(lessonsPerDay / 2) - 1) {
        const breakDur = 15;
        const breakTimeSlot = buildTimeSlot(profile.anchorTime, elapsedMinutes, breakDur);
        elapsedMinutes += breakDur;
        totalBreakMin += breakDur;

        dayTasks.push({
          id: `break-${dateStr}-${dayTasks.length + 1}`,
          label: 'Screen-Free Rest & Recharge',
          subject: 'buffer',
          code: 'BREAK',
          topic: 'Screen-Free Rest & Recharge',
          timeSlot: breakTimeSlot,
          durationMinutes: breakDur,
          completed: false
        });
      }
    }

    plannedDays.push({
      id: dateStr,
      dateStr,
      dayOfWeek,
      formattedDate,
      dayNumber: studyDayCounter++,
      weekId: '',
      weekNumber: 1,
      weekTitle: '',
      phase: 'foundations',
      isBuffer: false,
      isTestDay: false,
      studyTimeMinutes: totalStudyMin,
      breakTimeMinutes: totalBreakMin,
      totalTimeMinutes: totalStudyMin + totalBreakMin,
      specialInstructions: `Day ${studyDayCounter - 1}: Focus on weak-domain drills and adhere to timer intervals.`,
      tasks: dayTasks
    });
  }

  // Build Phase 2 Days (Bluebook Arena & Taper Protocol)
  let testNumberCounter = 1;

  for (let i = 0; i < phase2Dates.length; i++) {
    const d = phase2Dates[i];
    const dateStr = formatDate(d);
    const { dayOfWeek, formattedDate } = formatPrettyDate(d);
    const isExamDay = i === phase2Dates.length - 1;
    const isPreExamRest = i === phase2Dates.length - 2;
    const isLogisticsDay = i === phase2Dates.length - 3;

    if (isExamDay) {
      plannedDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: '',
        weekNumber: 1,
        weekTitle: '',
        phase: 'exam',
        isBuffer: false,
        isTestDay: true,
        studyTimeMinutes: 144,
        breakTimeMinutes: 10,
        totalTimeMinutes: 154,
        specialInstructions: 'OFFICIAL SAT EXAM DAY! Arrive at test center by 7:15 AM. Execute with absolute focus and confidence.',
        tasks: [
          {
            id: 'official-sat-exam-day',
            label: 'OFFICIAL DIGITAL SAT EXAM DAY',
            subject: 'test',
            code: 'EXAM DAY',
            topic: 'Official Digital SAT Administration',
            timeSlot: '7:15 AM - 12:00 PM',
            durationMinutes: 144,
            completed: false
          }
        ]
      });
    } else if (isPreExamRest) {
      plannedDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: '',
        weekNumber: 1,
        weekTitle: '',
        phase: 'exam',
        isBuffer: true,
        isTestDay: false,
        studyTimeMinutes: 0,
        breakTimeMinutes: 0,
        totalTimeMinutes: 0,
        specialInstructions: 'FULL REST. Zero studying. No screens after 8 PM. Sleep early for tomorrow’s official exam.',
        tasks: [
          {
            id: `rest-${dateStr}`,
            label: 'Complete Rest Protocol • Sleep Early for Peak Cognitive Acuity',
            subject: 'buffer',
            code: 'REST',
            topic: 'Peak Performance Pre-Exam Taper',
            completed: false
          }
        ]
      });
    } else if (isLogisticsDay) {
      plannedDays.push({
        id: dateStr,
        dateStr,
        dayOfWeek,
        formattedDate,
        weekId: '',
        weekNumber: 1,
        weekTitle: '',
        phase: 'exam',
        isBuffer: false,
        isTestDay: false,
        studyTimeMinutes: 30,
        breakTimeMinutes: 0,
        totalTimeMinutes: 30,
        specialInstructions: 'Verify Bluebook app, admission ticket, original photo ID, and pack your gear. Zero high-stress academics.',
        tasks: [
          {
            id: `logistics-${dateStr}`,
            label: 'Exam Day Readiness: Bluebook App, Ticket, Original ID & Bag Packout',
            subject: 'logistics',
            code: 'LOGISTICS',
            topic: 'Exam Logistics & Gear Verification',
            timeSlot: buildTimeSlot(profile.anchorTime, 0, 30),
            durationMinutes: 30,
            completed: false
          }
        ]
      });
    } else {
      // Alternating Bluebook Test Day vs. Error-Log Review Day
      const isTestSimulationDay = i % 4 === 0 && testNumberCounter <= 4;

      if (isTestSimulationDay) {
        const testNum = testNumberCounter++;
        plannedDays.push({
          id: dateStr,
          dateStr,
          dayOfWeek,
          formattedDate,
          weekId: '',
          weekNumber: 1,
          weekTitle: '',
          phase: 'bluebook',
          isBuffer: false,
          isTestDay: true,
          studyTimeMinutes: 144,
          breakTimeMinutes: 10,
          totalTimeMinutes: 154,
          specialInstructions: `TEST #${testNum} (Full Bluebook Practice Test, real conditions): 8:00 AM - 10:24 AM. Complete under strict exam conditions.`,
          tasks: [
            {
              id: `bluebook-test-${testNum}`,
              label: `TEST #${testNum} (Full Bluebook Practice Test, Real Conditions)`,
              subject: 'test',
              code: `TEST #${testNum}`,
              topic: `Official Bluebook Practice Test #${testNum} (Timed)`,
              timeSlot: '8:00 AM - 10:24 AM',
              durationMinutes: 144,
              completed: false
            }
          ]
        });
      } else if ((i % 4 === 1)) {
        // Error Autopsy Day
        plannedDays.push({
          id: dateStr,
          dateStr,
          dayOfWeek,
          formattedDate,
          weekId: '',
          weekNumber: 1,
          weekTitle: '',
          phase: 'bluebook',
          isBuffer: false,
          isTestDay: false,
          studyTimeMinutes: 75,
          breakTimeMinutes: 0,
          totalTimeMinutes: 75,
          specialInstructions: 'Error-log autopsy of practice test + targeted weakness remediation drills.',
          tasks: [
            {
              id: `review-${dateStr}`,
              label: 'Full Error-Log Autopsy + Root Cause Remediation',
              subject: 'review',
              code: 'AUTOPSY',
              topic: 'Practice Test Error Analysis',
              timeSlot: buildTimeSlot(profile.anchorTime, 0, 75),
              durationMinutes: 75,
              completed: false
            }
          ]
        });
      } else if (d.getDay() === profile.bufferDayOfWeek) {
        // Guaranteed Rest Day
        plannedDays.push({
          id: dateStr,
          dateStr,
          dayOfWeek,
          formattedDate,
          weekId: '',
          weekNumber: 1,
          weekTitle: '',
          phase: 'bluebook',
          isBuffer: true,
          isTestDay: false,
          studyTimeMinutes: 0,
          breakTimeMinutes: 0,
          totalTimeMinutes: 0,
          specialInstructions: 'Guaranteed Rest Day: Mandatory cognitive recovery before upcoming full mock test.',
          tasks: [
            {
              id: `rest-${dateStr}`,
              label: 'Full Rest & Mental Recovery • Zero Assigned Study',
              subject: 'buffer',
              code: 'REST',
              topic: 'Cognitive Recovery',
              completed: false
            }
          ]
        });
      } else {
        // Targeted Drills Day
        plannedDays.push({
          id: dateStr,
          dateStr,
          dayOfWeek,
          formattedDate,
          weekId: '',
          weekNumber: 1,
          weekTitle: '',
          phase: 'bluebook',
          isBuffer: false,
          isTestDay: false,
          studyTimeMinutes: 60,
          breakTimeMinutes: 0,
          totalTimeMinutes: 60,
          specialInstructions: 'Targeted weak-domain drills and Desmos speed training.',
          tasks: [
            {
              id: `drill-${dateStr}`,
              label: 'Targeted High-Yield Drills: Desmos Speed & Grammar Traps',
              subject: 'drill',
              code: 'TARGETED DRILL',
              topic: 'High-Yield Formula & Rule Polish',
              timeSlot: buildTimeSlot(profile.anchorTime, 0, 60),
              durationMinutes: 60,
              completed: false
            }
          ]
        });
      }
    }
  }

  // Group into consecutive 7-day Weeks
  const weeks: WeekPlan[] = [];
  const chunkSize = 7;

  for (let i = 0; i < plannedDays.length; i += chunkSize) {
    const chunkDays = plannedDays.slice(i, i + chunkSize);
    const weekNum = Math.floor(i / chunkSize) + 1;
    const startD = chunkDays[0];
    const endD = chunkDays[chunkDays.length - 1];

    const weekId = `week-${weekNum}`;
    const startLabel = startD.formattedDate.replace(/^[A-Za-z]+\s*/, '');
    const endLabel = endD.formattedDate.replace(/^[A-Za-z]+\s*/, '');
    const dateRange = `${startLabel} to ${endLabel}`;

    const isPhase2 = chunkDays.some((d) => d.phase === 'bluebook' || d.phase === 'exam');
    const phase = isPhase2 ? (chunkDays.some((d) => d.phase === 'exam') ? 'exam' : 'bluebook') : 'foundations';

    let title = `Week ${weekNum}: Skill Foundations & Targeted Drills`;
    let subtitle = `Mastering prioritized Khan Academy units mapped to your target SAT exam date.`;

    if (phase === 'bluebook') {
      title = `Week ${weekNum}: Bluebook Practice Arena & Error Autopsies`;
      subtitle = `Simulating full-length timed Bluebook digital tests under real exam conditions.`;
    } else if (phase === 'exam') {
      title = `Week ${weekNum}: Peak Performance Taper & Official Exam Day`;
      subtitle = `Final error closure, gear verification, rest protocol, and official SAT administration.`;
    }

    // Attach week metadata to days
    for (const d of chunkDays) {
      d.weekId = weekId;
      d.weekNumber = weekNum;
      d.weekTitle = title.replace(/^Week \d+:\s*/, '');
    }

    weeks.push({
      id: weekId,
      weekNumber: weekNum,
      title,
      dateRange,
      subtitle,
      phase,
      days: chunkDays,
      startDate: startD.dateStr,
      endDate: endD.dateStr
    });
  }

  return weeks;
}
