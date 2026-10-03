// scripts/build_study_plan.js
const fs = require('fs');
const path = require('path');

const WEEKS_META = [
  {
    id: 'week-1',
    weekNumber: 1,
    title: 'Week 1: Problem Solving & Advanced Math Foundations',
    dateRange: 'Sep 14 to Sep 20',
    subtitle: 'Days 1-6 cover unit conversion, distributions, scatterplots, factoring & polynomial expressions.',
    phase: 'foundations',
    startDate: '2026-09-14',
    endDate: '2026-09-20'
  },
  {
    id: 'week-2',
    weekNumber: 2,
    title: 'Week 2: Unit 4 Climax & Recovery Buffer Block',
    dateRange: 'Sep 21 to Sep 27',
    subtitle: 'Day 7 completes Unit 4, followed by Sep 22–27 buffer window for full illness recovery.',
    phase: 'foundations',
    startDate: '2026-09-21',
    endDate: '2026-09-27'
  },
  {
    id: 'week-3',
    weekNumber: 3,
    title: 'Week 3: Illness Recovery & Chapter 5 Launch (Oct 01 - Oct 04)',
    dateRange: 'Sep 28 to Oct 04',
    subtitle: 'Sep 28-30 illness recovery; Chapter 5 of English and Math officially launch on Oct 1st (Days 8–10).',
    phase: 'foundations',
    startDate: '2026-09-28',
    endDate: '2026-10-04'
  },
  {
    id: 'week-4',
    weekNumber: 4,
    title: 'Week 4: Linear Systems, Ratios, Data & Reading Synthesis',
    dateRange: 'Oct 05 to Oct 11',
    subtitle: 'Days 11–16 master linear systems, ratios, scatterplots, quadratics & rhetorical evidence.',
    phase: 'foundations',
    startDate: '2026-10-05',
    endDate: '2026-10-11'
  },
  {
    id: 'week-5',
    weekNumber: 5,
    title: 'Week 5: Advanced Quadratics, Geometry & Conventions',
    dateRange: 'Oct 12 to Oct 18',
    subtitle: 'Days 17–22 cover quadratic equations, circle theorems, linear inequalities & expression conventions.',
    phase: 'foundations',
    startDate: '2026-10-12',
    endDate: '2026-10-18'
  },
  {
    id: 'week-6',
    weekNumber: 6,
    title: 'Week 6: Statistics, Advanced Functions & Grammar Mastery',
    dateRange: 'Oct 19 to Oct 25',
    subtitle: 'Days 23–28 cover statistical inferences, nonlinear functions, systems & standard English conventions.',
    phase: 'foundations',
    startDate: '2026-10-19',
    endDate: '2026-10-25'
  },
  {
    id: 'week-7',
    weekNumber: 7,
    title: 'Week 7: Phase 1 Climax (Ends Oct 27) & Phase 2 Launch (Tests #1 & #2)',
    dateRange: 'Oct 26 to Nov 01',
    subtitle: 'Days 29-30 complete all 145 skills by Tue Oct 27. Phase 2 launches Wed Oct 28 with Test #1 & Test #2 on Fri Oct 30.',
    phase: 'bluebook',
    startDate: '2026-10-26',
    endDate: '2026-11-01'
  },
  {
    id: 'week-8',
    weekNumber: 8,
    title: 'Week 8: Test #3 Final Mock, Taper, Packout & Official SAT Exam Day',
    dateRange: 'Nov 02 to Nov 07',
    subtitle: 'Test #3 (Tue Nov 3), light taper, bag packout, full rest & Sat Nov 7 Exam Day.',
    phase: 'exam',
    startDate: '2026-11-02',
    endDate: '2026-11-07'
  }
];

function formatSlot(startMin, duration) {
  function toAmPm(m) {
    let hour = Math.floor(m / 60);
    const min = m % 60;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const minStr = min < 10 ? '0' + min : min;
    return `${hour}:${minStr} ${ampm}`;
  }
  return `${toAmPm(startMin)} - ${toAmPm(startMin + duration)}`;
}

function buildStudyDay(meta, mathItems, rwItems) {
  let curMin = 18 * 60 + 30; // 6:30 PM
  const rawTasks = [];

  if (mathItems.length <= 2) {
    mathItems.forEach(item => {
      rawTasks.push({
        timeSlot: formatSlot(curMin, item.duration),
        type: 'math',
        code: item.code,
        topic: item.topic,
        duration: item.duration
      });
      curMin += item.duration;
    });
  } else {
    const half = Math.ceil(mathItems.length / 2);
    mathItems.slice(0, half).forEach(item => {
      rawTasks.push({
        timeSlot: formatSlot(curMin, item.duration),
        type: 'math',
        code: item.code,
        topic: item.topic,
        duration: item.duration
      });
      curMin += item.duration;
    });
    // Break 1
    rawTasks.push({
      timeSlot: formatSlot(curMin, 15),
      type: 'buffer',
      code: 'BREAK',
      topic: 'Screen-Free Rest & Recharge',
      duration: 15
    });
    curMin += 15;
    mathItems.slice(half).forEach(item => {
      rawTasks.push({
        timeSlot: formatSlot(curMin, item.duration),
        type: 'math',
        code: item.code,
        topic: item.topic,
        duration: item.duration
      });
      curMin += item.duration;
    });
  }

  // Break 2 before R&W if there are R&W items
  if (rwItems.length > 0) {
    rawTasks.push({
      timeSlot: formatSlot(curMin, 15),
      type: 'buffer',
      code: 'BREAK',
      topic: 'Screen-Free Rest & Recharge',
      duration: 15
    });
    curMin += 15;

    rwItems.forEach(item => {
      rawTasks.push({
        timeSlot: formatSlot(curMin, item.duration),
        type: 'rw',
        code: item.code,
        topic: item.topic,
        duration: item.duration
      });
      curMin += item.duration;
    });
  }

  let instructions = `Day ${meta.dayNumber}: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.`;
  if (meta.dayNumber === 30) {
    instructions = 'PHASE 1 COMPLETE: All 145 Khan Academy Math & R&W curriculum skills mastered! Tomorrow Phase 2 launches with Test #1.';
  }

  return {
    dateStr: meta.dateStr,
    dayOfWeek: meta.dayOfWeek,
    formattedDate: meta.formattedDate,
    dayNumber: meta.dayNumber,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: instructions,
    rawTasks
  };
}

const mathLessonsCh5Plus = [
  // Unit 5 (6)
  { code: 'Math U5.1', topic: 'Area and volume', duration: 30 },
  { code: 'Math U5.2', topic: 'Congruence, similarity, and angle relationships', duration: 30 },
  { code: 'Math U5.3', topic: 'Right triangle trigonometry', duration: 30 },
  { code: 'Math U5.4', topic: 'Circle theorems', duration: 30 },
  { code: 'Math U5.5', topic: 'Unit circle trigonometry', duration: 30 },
  { code: 'Math U5.6', topic: 'Circle equations', duration: 30 },
  // Unit 6 (8)
  { code: 'Math U6.1', topic: 'Solving linear equations and inequalities', duration: 25 },
  { code: 'Math U6.2', topic: 'Linear equation word problems', duration: 25 },
  { code: 'Math U6.3', topic: 'Linear relationship word problems', duration: 25 },
  { code: 'Math U6.4', topic: 'Graphs of linear equations and functions', duration: 25 },
  { code: 'Math U6.5', topic: 'Solving systems of linear equations', duration: 25 },
  { code: 'Math U6.6', topic: 'Systems of linear equations word problems', duration: 25 },
  { code: 'Math U6.7', topic: 'Linear inequality word problems', duration: 25 },
  { code: 'Math U6.8', topic: 'Graphs of linear systems and inequalities', duration: 25 },
  // Unit 7 (10)
  { code: 'Math U7.1', topic: 'Ratios, rates, and proportions', duration: 25 },
  { code: 'Math U7.2', topic: 'Unit conversion', duration: 25 },
  { code: 'Math U7.3', topic: 'Percentages', duration: 25 },
  { code: 'Math U7.4', topic: 'Center, spread, and shape of distributions', duration: 25 },
  { code: 'Math U7.5', topic: 'Data representations', duration: 25 },
  { code: 'Math U7.6', topic: 'Scatterplots', duration: 25 },
  { code: 'Math U7.7', topic: 'Linear and exponential growth', duration: 25 },
  { code: 'Math U7.8', topic: 'Probability and relative frequency', duration: 25 },
  { code: 'Math U7.9', topic: 'Data inferences', duration: 25 },
  { code: 'Math U7.10', topic: 'Evaluating statistical claims', duration: 25 },
  // Unit 8 (13)
  { code: 'Math U8.1', topic: 'Factoring quadratic and polynomial expressions', duration: 30 },
  { code: 'Math U8.2', topic: 'Radicals and rational exponents', duration: 30 },
  { code: 'Math U8.3', topic: 'Operations with polynomials', duration: 30 },
  { code: 'Math U8.4', topic: 'Operations with rational expressions', duration: 30 },
  { code: 'Math U8.5', topic: 'Nonlinear functions', duration: 30 },
  { code: 'Math U8.6', topic: 'Isolating quantities', duration: 30 },
  { code: 'Math U8.7', topic: 'Solving quadratic equations', duration: 30 },
  { code: 'Math U8.8', topic: 'Linear and quadratic systems', duration: 30 },
  { code: 'Math U8.9', topic: 'Radical, rational, and absolute value equations', duration: 30 },
  { code: 'Math U8.10', topic: 'Quadratic and exponential word problems', duration: 30 },
  { code: 'Math U8.11', topic: 'Quadratic graphs', duration: 30 },
  { code: 'Math U8.12', topic: 'Exponential graphs', duration: 30 },
  { code: 'Math U8.13', topic: 'Polynomial and other nonlinear graphs', duration: 30 },
  // Unit 9 (6)
  { code: 'Math U9.1', topic: 'Area and volume', duration: 35 },
  { code: 'Math U9.2', topic: 'Congruence, similarity, and angle relationships', duration: 35 },
  { code: 'Math U9.3', topic: 'Right triangle trigonometry', duration: 35 },
  { code: 'Math U9.4', topic: 'Circle theorems', duration: 35 },
  { code: 'Math U9.5', topic: 'Unit circle trigonometry', duration: 35 },
  { code: 'Math U9.6', topic: 'Circle equations', duration: 35 },
  // Unit 10 (8)
  { code: 'Math U10.1', topic: 'Solving linear equations and inequalities', duration: 30 },
  { code: 'Math U10.2', topic: 'Linear equation word problems', duration: 30 },
  { code: 'Math U10.3', topic: 'Linear relationship word problems', duration: 30 },
  { code: 'Math U10.4', topic: 'Graphs of linear equations and functions', duration: 30 },
  { code: 'Math U10.5', topic: 'Solving systems of linear equations', duration: 30 },
  { code: 'Math U10.6', topic: 'Systems of linear equations word problems', duration: 30 },
  { code: 'Math U10.7', topic: 'Linear inequality word problems', duration: 30 },
  { code: 'Math U10.8', topic: 'Graphs of linear systems and inequalities', duration: 30 },
  // Unit 11 (10)
  { code: 'Math U11.1', topic: 'Ratios, rates, and proportions', duration: 30 },
  { code: 'Math U11.2', topic: 'Unit conversion', duration: 30 },
  { code: 'Math U11.3', topic: 'Percentages', duration: 30 },
  { code: 'Math U11.4', topic: 'Center, spread, and shape of distributions', duration: 30 },
  { code: 'Math U11.5', topic: 'Data representations', duration: 30 },
  { code: 'Math U11.6', topic: 'Scatterplots', duration: 30 },
  { code: 'Math U11.7', topic: 'Linear and exponential growth', duration: 30 },
  { code: 'Math U11.8', topic: 'Probability and relative frequency', duration: 30 },
  { code: 'Math U11.9', topic: 'Data inferences', duration: 30 },
  { code: 'Math U11.10', topic: 'Evaluating statistical claims', duration: 30 },
  // Unit 12 (13)
  { code: 'Math U12.1', topic: 'Factoring quadratic and polynomial expressions', duration: 35 },
  { code: 'Math U12.2', topic: 'Radicals and rational exponents', duration: 35 },
  { code: 'Math U12.3', topic: 'Operations with polynomials', duration: 35 },
  { code: 'Math U12.4', topic: 'Operations with rational expressions', duration: 35 },
  { code: 'Math U12.5', topic: 'Nonlinear functions', duration: 35 },
  { code: 'Math U12.6', topic: 'Isolating quantities', duration: 35 },
  { code: 'Math U12.7', topic: 'Solving quadratic equations', duration: 35 },
  { code: 'Math U12.8', topic: 'Linear and quadratic systems', duration: 35 },
  { code: 'Math U12.9', topic: 'Radical, rational, and absolute value equations', duration: 35 },
  { code: 'Math U12.10', topic: 'Quadratic and exponential word problems', duration: 35 },
  { code: 'Math U12.11', topic: 'Quadratic graphs', duration: 35 },
  { code: 'Math U12.12', topic: 'Exponential graphs', duration: 35 },
  { code: 'Math U12.13', topic: 'Polynomial and other nonlinear graphs', duration: 35 },
  // Unit 13 (6)
  { code: 'Math U13.1', topic: 'Area and volume', duration: 40 },
  { code: 'Math U13.2', topic: 'Congruence, similarity, and angle relationships', duration: 40 },
  { code: 'Math U13.3', topic: 'Right triangle trigonometry', duration: 40 },
  { code: 'Math U13.4', topic: 'Circle theorems', duration: 40 },
  { code: 'Math U13.5', topic: 'Unit circle trigonometry', duration: 40 },
  { code: 'Math U13.6', topic: 'Circle equations', duration: 40 }
];

const rwLessonsCh5Plus = [
  // Unit 5 (4)
  { code: 'R&W U5.1', topic: 'Command of textual evidence', duration: 22 },
  { code: 'R&W U5.2', topic: 'Command of quantitative evidence', duration: 22 },
  { code: 'R&W U5.3', topic: 'Central ideas and details', duration: 22 },
  { code: 'R&W U5.4', topic: 'Inferences', duration: 22 },
  // Unit 6 (3)
  { code: 'R&W U6.1', topic: 'Words in context', duration: 22 },
  { code: 'R&W U6.2', topic: 'Text structure and purpose', duration: 22 },
  { code: 'R&W U6.3', topic: 'Cross-text connections', duration: 22 },
  // Unit 7 (4)
  { code: 'R&W U7.1', topic: 'Transitions', duration: 22 },
  { code: 'R&W U7.2', topic: 'Rhetorical synthesis', duration: 22 },
  { code: 'R&W U7.3', topic: 'Form, structure, and sense', duration: 22 },
  { code: 'R&W U7.4', topic: 'Boundaries', duration: 22 },
  // Unit 8 (4)
  { code: 'R&W U8.1', topic: 'Command of textual evidence', duration: 25 },
  { code: 'R&W U8.2', topic: 'Command of quantitative evidence', duration: 25 },
  { code: 'R&W U8.3', topic: 'Central ideas and details', duration: 25 },
  { code: 'R&W U8.4', topic: 'Inferences', duration: 25 },
  // Unit 9 (3)
  { code: 'R&W U9.1', topic: 'Words in context', duration: 25 },
  { code: 'R&W U9.2', topic: 'Text structure and purpose', duration: 25 },
  { code: 'R&W U9.3', topic: 'Cross-text connections', duration: 25 },
  // Unit 10 (4)
  { code: 'R&W U10.1', topic: 'Transitions', duration: 25 },
  { code: 'R&W U10.2', topic: 'Rhetorical synthesis', duration: 25 },
  { code: 'R&W U10.3', topic: 'Form, structure, and sense', duration: 25 },
  { code: 'R&W U10.4', topic: 'Boundaries', duration: 25 },
  // Unit 11 (6)
  { code: 'R&W U11.1', topic: 'Command of evidence', duration: 35 },
  { code: 'R&W U11.2', topic: 'Central ideas and details + inferences', duration: 35 },
  { code: 'R&W U11.3', topic: 'Words in context', duration: 35 },
  { code: 'R&W U11.4', topic: 'Text structure and purpose + cross-text connections', duration: 35 },
  { code: 'R&W U11.5', topic: 'Boundaries + form, structure, and sense', duration: 35 },
  { code: 'R&W U11.6', topic: 'Transitions + rhetorical synthesis', duration: 35 },
  // Unit 12 (8)
  { code: 'R&W U12.1', topic: 'Subject-verb agreement', duration: 15 },
  { code: 'R&W U12.2', topic: 'Pronoun-antecedent agreement', duration: 15 },
  { code: 'R&W U12.3', topic: 'Plurals and possessives', duration: 15 },
  { code: 'R&W U12.4', topic: 'Verb forms', duration: 15 },
  { code: 'R&W U12.5', topic: 'Subject-modifier placement', duration: 15 },
  { code: 'R&W U12.6', topic: 'Linking clauses', duration: 15 },
  { code: 'R&W U12.7', topic: 'Supplements', duration: 15 },
  { code: 'R&W U12.8', topic: 'Punctuation', duration: 15 }
];

const studyDatesMeta = [
  { dateStr: '2026-10-01', dayOfWeek: 'Thu', formattedDate: 'Thu Oct 01', dayNumber: 8 },
  { dateStr: '2026-10-02', dayOfWeek: 'Fri', formattedDate: 'Fri Oct 02', dayNumber: 9 },
  { dateStr: '2026-10-03', dayOfWeek: 'Sat', formattedDate: 'Sat Oct 03', dayNumber: 10 },
  // Sun Oct 04 is Rest
  { dateStr: '2026-10-05', dayOfWeek: 'Mon', formattedDate: 'Mon Oct 05', dayNumber: 11 },
  { dateStr: '2026-10-06', dayOfWeek: 'Tue', formattedDate: 'Tue Oct 06', dayNumber: 12 },
  { dateStr: '2026-10-07', dayOfWeek: 'Wed', formattedDate: 'Wed Oct 07', dayNumber: 13 },
  { dateStr: '2026-10-08', dayOfWeek: 'Thu', formattedDate: 'Thu Oct 08', dayNumber: 14 },
  { dateStr: '2026-10-09', dayOfWeek: 'Fri', formattedDate: 'Fri Oct 09', dayNumber: 15 },
  { dateStr: '2026-10-10', dayOfWeek: 'Sat', formattedDate: 'Sat Oct 10', dayNumber: 16 },
  // Sun Oct 11 is Rest
  { dateStr: '2026-10-12', dayOfWeek: 'Mon', formattedDate: 'Mon Oct 12', dayNumber: 17 },
  { dateStr: '2026-10-13', dayOfWeek: 'Tue', formattedDate: 'Tue Oct 13', dayNumber: 18 },
  { dateStr: '2026-10-14', dayOfWeek: 'Wed', formattedDate: 'Wed Oct 14', dayNumber: 19 },
  { dateStr: '2026-10-15', dayOfWeek: 'Thu', formattedDate: 'Thu Oct 15', dayNumber: 20 },
  { dateStr: '2026-10-16', dayOfWeek: 'Fri', formattedDate: 'Fri Oct 16', dayNumber: 21 },
  { dateStr: '2026-10-17', dayOfWeek: 'Sat', formattedDate: 'Sat Oct 17', dayNumber: 22 },
  // Sun Oct 18 is Rest
  { dateStr: '2026-10-19', dayOfWeek: 'Mon', formattedDate: 'Mon Oct 19', dayNumber: 23 },
  { dateStr: '2026-10-20', dayOfWeek: 'Tue', formattedDate: 'Tue Oct 20', dayNumber: 24 },
  { dateStr: '2026-10-21', dayOfWeek: 'Wed', formattedDate: 'Wed Oct 21', dayNumber: 25 },
  { dateStr: '2026-10-22', dayOfWeek: 'Thu', formattedDate: 'Thu Oct 22', dayNumber: 26 },
  { dateStr: '2026-10-23', dayOfWeek: 'Fri', formattedDate: 'Fri Oct 23', dayNumber: 27 },
  { dateStr: '2026-10-24', dayOfWeek: 'Sat', formattedDate: 'Sat Oct 24', dayNumber: 28 },
  // Sun Oct 25 is Rest
  { dateStr: '2026-10-26', dayOfWeek: 'Mon', formattedDate: 'Mon Oct 26', dayNumber: 29 },
  { dateStr: '2026-10-27', dayOfWeek: 'Tue', formattedDate: 'Tue Oct 27', dayNumber: 30 },
];

const mathCounts = [3, 3, 4, 4, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 4, 3, 4, 3, 4, 3, 4, 4, 4];
const rwCounts =   [2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2];

let mathIdx = 0;
let rwIdx = 0;
const phase1Ch5DaysMap = {};

studyDatesMeta.forEach((meta, i) => {
  const mCount = mathCounts[i];
  const rCount = rwCounts[i];

  const mSlice = mathLessonsCh5Plus.slice(mathIdx, mathIdx + mCount);
  mathIdx += mCount;

  const rSlice = rwLessonsCh5Plus.slice(rwIdx, rwIdx + rCount);
  rwIdx += rCount;

  phase1Ch5DaysMap[meta.dateStr] = buildStudyDay(meta, mSlice, rSlice);
});

const ALL_DAYS_DATA = [
  // WEEK 1
  {
    dateStr: '2026-09-14',
    dayOfWeek: 'Mon',
    formattedDate: 'Mon Sep 14',
    dayNumber: 1,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 1: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:50 PM', type: 'math', code: 'Math U3.2', topic: 'Unit conversion', duration: 20 },
      { timeSlot: '6:50 PM - 7:10 PM', type: 'math', code: 'Math U3.3', topic: 'Percentages', duration: 20 },
      { timeSlot: '7:10 PM - 7:30 PM', type: 'math', code: 'Math U3.4', topic: 'Center, spread, and shape of distributions', duration: 20 },
      { timeSlot: '7:30 PM - 7:45 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '7:45 PM - 8:05 PM', type: 'math', code: 'Math U3.5', topic: 'Data representations', duration: 20 },
    ]
  },
  {
    dateStr: '2026-09-15',
    dayOfWeek: 'Tue',
    formattedDate: 'Tue Sep 15',
    dayNumber: 2,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 2: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:50 PM', type: 'math', code: 'Math U3.6', topic: 'Scatterplots', duration: 20 },
      { timeSlot: '6:50 PM - 7:10 PM', type: 'math', code: 'Math U3.7', topic: 'Linear and exponential growth', duration: 20 },
      { timeSlot: '7:10 PM - 7:30 PM', type: 'math', code: 'Math U3.8', topic: 'Probability and relative frequency', duration: 20 },
      { timeSlot: '7:30 PM - 7:45 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '7:45 PM - 8:05 PM', type: 'math', code: 'Math U3.9', topic: 'Data inferences', duration: 20 },
    ]
  },
  {
    dateStr: '2026-09-16',
    dayOfWeek: 'Wed',
    formattedDate: 'Wed Sep 16',
    dayNumber: 3,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 3: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:50 PM', type: 'math', code: 'Math U3.10', topic: 'Evaluating statistical claims', duration: 20 },
      { timeSlot: '6:50 PM - 7:15 PM', type: 'math', code: 'Math U4.1', topic: 'Factoring quadratic and polynomial expressions', duration: 25 },
      { timeSlot: '7:15 PM - 7:30 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '7:30 PM - 7:55 PM', type: 'math', code: 'Math U4.2', topic: 'Radicals and rational exponents', duration: 25 },
      { timeSlot: '7:55 PM - 8:20 PM', type: 'math', code: 'Math U4.3', topic: 'Operations with polynomials', duration: 25 },
      { timeSlot: '8:20 PM - 8:35 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '8:35 PM - 8:55 PM', type: 'rw', code: 'R&W U3.1', topic: 'Words in context', duration: 20 },
      { timeSlot: '8:55 PM - 9:15 PM', type: 'rw', code: 'R&W U3.2', topic: 'Text structure and purpose', duration: 20 },
    ]
  },
  {
    dateStr: '2026-09-17',
    dayOfWeek: 'Thu',
    formattedDate: 'Thu Sep 17',
    dayNumber: 4,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 4: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:55 PM', type: 'math', code: 'Math U4.4', topic: 'Operations with rational expressions', duration: 25 },
      { timeSlot: '6:55 PM - 7:20 PM', type: 'math', code: 'Math U4.5', topic: 'Nonlinear functions', duration: 25 },
      { timeSlot: '7:20 PM - 7:35 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '7:35 PM - 8:00 PM', type: 'math', code: 'Math U4.6', topic: 'Isolating quantities', duration: 25 },
      { timeSlot: '8:00 PM - 8:20 PM', type: 'rw', code: 'R&W U3.3', topic: 'Cross-text connections', duration: 20 },
      { timeSlot: '8:20 PM - 8:35 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '8:35 PM - 8:55 PM', type: 'rw', code: 'R&W U4.1', topic: 'Transitions', duration: 20 },
    ]
  },
  {
    dateStr: '2026-09-18',
    dayOfWeek: 'Fri',
    formattedDate: 'Fri Sep 18',
    dayNumber: 5,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 5: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:55 PM', type: 'math', code: 'Math U4.7', topic: 'Solving quadratic equations', duration: 25 },
      { timeSlot: '6:55 PM - 7:20 PM', type: 'math', code: 'Math U4.8', topic: 'Linear and quadratic systems', duration: 25 },
      { timeSlot: '7:20 PM - 7:35 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '7:35 PM - 8:00 PM', type: 'math', code: 'Math U4.9', topic: 'Radical, rational, and absolute value equations', duration: 25 },
      { timeSlot: '8:00 PM - 8:20 PM', type: 'rw', code: 'R&W U4.2', topic: 'Rhetorical synthesis', duration: 20 },
      { timeSlot: '8:20 PM - 8:35 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '8:35 PM - 8:55 PM', type: 'rw', code: 'R&W U4.3', topic: 'Form, structure, and sense', duration: 20 },
    ]
  },
  // Day 6: R&W U5.1 removed (Chapter 5 starts Oct 1)
  {
    dateStr: '2026-09-19',
    dayOfWeek: 'Sat',
    formattedDate: 'Sat Sep 19',
    dayNumber: 6,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 6: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:55 PM', type: 'math', code: 'Math U4.10', topic: 'Quadratic and exponential word problems', duration: 25 },
      { timeSlot: '6:55 PM - 7:20 PM', type: 'math', code: 'Math U4.11', topic: 'Quadratic graphs', duration: 25 },
      { timeSlot: '7:20 PM - 7:35 PM', type: 'buffer', code: 'BREAK', topic: 'Screen-Free Rest & Recharge', duration: 15 },
      { timeSlot: '7:35 PM - 8:00 PM', type: 'math', code: 'Math U4.12', topic: 'Exponential graphs', duration: 25 },
      { timeSlot: '8:00 PM - 8:20 PM', type: 'rw', code: 'R&W U4.4', topic: 'Boundaries', duration: 20 },
    ]
  },
  {
    dateStr: '2026-09-20',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Sep 20',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Resting on Sundays consolidates the week’s learning and resets mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 2
  // Day 7: Unit 4 Climax (Math U5.1, U5.2, R&W U5.2, U5.3 removed)
  {
    dateStr: '2026-09-21',
    dayOfWeek: 'Mon',
    formattedDate: 'Mon Sep 21',
    dayNumber: 7,
    phase: 'foundations',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Day 7: Unit 4 Climax. Complete assigned lesson with strict timer adherence.',
    rawTasks: [
      { timeSlot: '6:30 PM - 6:55 PM', type: 'math', code: 'Math U4.13', topic: 'Polynomial and other nonlinear graphs', duration: 25 },
      { timeSlot: '6:55 PM - 7:25 PM', type: 'review', code: 'REVIEW', topic: 'Unit 3 & 4 Mastery Check & Consolidation', duration: 30 },
    ]
  },
  {
    dateStr: '2026-09-22',
    dayOfWeek: 'Tue',
    formattedDate: 'Tue Sep 22',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-23',
    dayOfWeek: 'Wed',
    formattedDate: 'Wed Sep 23',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-24',
    dayOfWeek: 'Thu',
    formattedDate: 'Thu Sep 24',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-25',
    dayOfWeek: 'Fri',
    formattedDate: 'Fri Sep 25',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-26',
    dayOfWeek: 'Sat',
    formattedDate: 'Sat Sep 26',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-27',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Sep 27',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Resting on Sundays consolidates the week’s learning and resets mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 3
  {
    dateStr: '2026-09-28',
    dayOfWeek: 'Mon',
    formattedDate: 'Mon Sep 28',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-29',
    dayOfWeek: 'Tue',
    formattedDate: 'Tue Sep 29',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  {
    dateStr: '2026-09-30',
    dayOfWeek: 'Wed',
    formattedDate: 'Wed Sep 30',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'BUFFER DAY (illness): Zero assigned study. Full rest and recovery. Work redistributed across Oct 1 - Oct 27.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'BUFFER', topic: 'Health & Recovery Buffer (No Study)', duration: 0 },
    ]
  },
  // Days 8, 9, 10: Chapter 5 launch!
  phase1Ch5DaysMap['2026-10-01'],
  phase1Ch5DaysMap['2026-10-02'],
  phase1Ch5DaysMap['2026-10-03'],
  {
    dateStr: '2026-10-04',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Oct 04',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Resting on Sundays consolidates the week’s learning and resets mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 4
  phase1Ch5DaysMap['2026-10-05'],
  phase1Ch5DaysMap['2026-10-06'],
  phase1Ch5DaysMap['2026-10-07'],
  phase1Ch5DaysMap['2026-10-08'],
  phase1Ch5DaysMap['2026-10-09'],
  phase1Ch5DaysMap['2026-10-10'],
  {
    dateStr: '2026-10-11',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Oct 11',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Resting on Sundays consolidates the week’s learning and resets mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 5
  phase1Ch5DaysMap['2026-10-12'],
  phase1Ch5DaysMap['2026-10-13'],
  phase1Ch5DaysMap['2026-10-14'],
  phase1Ch5DaysMap['2026-10-15'],
  phase1Ch5DaysMap['2026-10-16'],
  phase1Ch5DaysMap['2026-10-17'],
  {
    dateStr: '2026-10-18',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Oct 18',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Resting on Sundays consolidates the week’s learning and resets mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 6
  phase1Ch5DaysMap['2026-10-19'],
  phase1Ch5DaysMap['2026-10-20'],
  phase1Ch5DaysMap['2026-10-21'],
  phase1Ch5DaysMap['2026-10-22'],
  phase1Ch5DaysMap['2026-10-23'],
  phase1Ch5DaysMap['2026-10-24'],
  {
    dateStr: '2026-10-25',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Oct 25',
    dayNumber: null,
    phase: 'foundations',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Resting on Sundays consolidates the week’s learning and resets mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 7
  phase1Ch5DaysMap['2026-10-26'], // Day 29
  phase1Ch5DaysMap['2026-10-27'], // Day 30 - Phase 1 Complete!
  // Wed Oct 28 - Phase 2 Launch: TEST #1
  {
    dateStr: '2026-10-28',
    dayOfWeek: 'Wed',
    formattedDate: 'Wed Oct 28',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: true,
    specialInstructions: 'TEST #1: Full timed Bluebook Practice Test #1 under strict testing conditions (8:00 AM - 10:24 AM). Phase 2 officially launches!',
    rawTasks: [
      { timeSlot: '8:00 AM - 10:24 AM', type: 'test', code: 'MOCK-1', topic: 'TEST #1 (full Bluebook Practice Test, real conditions)', duration: 144 },
    ]
  },
  {
    dateStr: '2026-10-29',
    dayOfWeek: 'Thu',
    formattedDate: 'Thu Oct 29',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Thu Oct 29: Error-log review of Test #1 + targeted Math/R&W drills on weak areas (75 min).',
    rawTasks: [
      { timeSlot: '6:30 PM - 7:45 PM', type: 'review', code: 'AUTOPSY', topic: 'Error-log review of Test #1 + targeted Math/R&W drills on weak areas (75 min)', duration: 75 },
    ]
  },
  {
    dateStr: '2026-10-30',
    dayOfWeek: 'Fri',
    formattedDate: 'Fri Oct 30',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: true,
    specialInstructions: 'TEST #2: Full timed Bluebook Practice Test #2 under real exam conditions (8:00 AM - 10:24 AM).',
    rawTasks: [
      { timeSlot: '8:00 AM - 10:24 AM', type: 'test', code: 'MOCK-2', topic: 'TEST #2 (full Bluebook Practice Test)', duration: 144 },
    ]
  },
  {
    dateStr: '2026-10-31',
    dayOfWeek: 'Sat',
    formattedDate: 'Sat Oct 31',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Sat Oct 31: Error-log review of Test #2 + targeted drills on weak areas (75 min).',
    rawTasks: [
      { timeSlot: '6:30 PM - 7:45 PM', type: 'review', code: 'AUTOPSY', topic: 'Error-log review of Test #2 + targeted drills on weak areas (75 min)', duration: 75 },
    ]
  },
  {
    dateStr: '2026-11-01',
    dayOfWeek: 'Sun',
    formattedDate: 'Sun Nov 01',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Weekly recovery window. Anti-burnout rule #1: Full rest day before final exam week. Consolidate gains and reset mental stamina.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'Screen-Free Mental Reset (No Studying)', duration: 0 },
    ]
  },

  // WEEK 8
  {
    dateStr: '2026-11-02',
    dayOfWeek: 'Mon',
    formattedDate: 'Mon Nov 02',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Mon Nov 2: Deep review -- punctuation/transitions traps + Math formula cleanup (60 min).',
    rawTasks: [
      { timeSlot: '6:30 PM - 7:30 PM', type: 'review', code: 'STRATEGY', topic: 'Deep review -- punctuation/transitions traps + Math formula cleanup (60 min)', duration: 60 },
    ]
  },
  {
    dateStr: '2026-11-03',
    dayOfWeek: 'Tue',
    formattedDate: 'Tue Nov 03',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: true,
    specialInstructions: 'TEST #3: Final full Bluebook Practice Test under strict timed conditions (8:00 AM - 10:24 AM).',
    rawTasks: [
      { timeSlot: '8:00 AM - 10:24 AM', type: 'test', code: 'MOCK-3', topic: 'TEST #3 (final full test, timed)', duration: 144 },
    ]
  },
  {
    dateStr: '2026-11-04',
    dayOfWeek: 'Wed',
    formattedDate: 'Wed Nov 04',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Wed Nov 4: Error-log review of Test #3 + simulate exact test-day timing (45 min).',
    rawTasks: [
      { timeSlot: '6:30 PM - 7:15 PM', type: 'review', code: 'AUTOPSY', topic: 'Error-log review of Test #3 + simulate exact test-day timing (45 min)', duration: 45 },
    ]
  },
  {
    dateStr: '2026-11-05',
    dayOfWeek: 'Thu',
    formattedDate: 'Thu Nov 05',
    dayNumber: null,
    phase: 'bluebook',
    isBuffer: false,
    isTestDay: false,
    specialInstructions: 'Thu Nov 5: Verify Bluebook app/ID/admission ticket + pack your bag (30 min).',
    rawTasks: [
      { timeSlot: '6:30 PM - 7:00 PM', type: 'review', code: 'LOGISTICS', topic: 'Verify Bluebook app/ID/admission ticket + pack your bag (30 min)', duration: 30 },
    ]
  },
  {
    dateStr: '2026-11-06',
    dayOfWeek: 'Fri',
    formattedDate: 'Fri Nov 06',
    dayNumber: null,
    phase: 'exam',
    isBuffer: true,
    isTestDay: false,
    specialInstructions: 'Fri Nov 6: FULL REST. No studying. Sleep early. Mental taper before exam day.',
    rawTasks: [
      { timeSlot: 'All Day', type: 'buffer', code: 'REST', topic: 'FULL REST. No studying. Sleep early.', duration: 0 },
    ]
  },
  {
    dateStr: '2026-11-07',
    dayOfWeek: 'Sat',
    formattedDate: 'Sat Nov 07',
    dayNumber: null,
    phase: 'exam',
    isBuffer: false,
    isTestDay: true,
    specialInstructions: 'Sat Nov 7 -- EXAM DAY: Follow your official admission ticket reporting time exactly. Crescent Model School, Shadman Lahore. Arrive by 7:15 AM sharp (gates lock at 7:45 AM). Stay calm and execute.',
    rawTasks: [
      { timeSlot: '7:15 AM - 12:00 PM', type: 'exam', code: 'EXAM', topic: '[EXAM] OFFICIAL DIGITAL SAT EXAM DAY: Crescent Model School, Shadman Lahore (Arrive 7:15 AM)', duration: 144 },
    ]
  }
];

function enrichTask(t, rawDay, idx) {
  let subject = 'buffer';
  if (t.type === 'math' || (t.code && (t.code.startsWith('Math') || t.code.startsWith('MATH')))) {
    subject = 'math';
  } else if (t.type === 'rw' || (t.code && (t.code.startsWith('R&W') || t.code.startsWith('RW')))) {
    subject = 'rw';
  } else if (t.type === 'test') {
    subject = 'test';
  } else if (t.type === 'review') {
    subject = 'review';
  } else if (t.type === 'exam') {
    subject = 'test';
  }

  let label = t.topic;
  if (t.code === 'BREAK') {
    label = '[BREAK] Screen-Free Rest & Recharge';
  } else if (t.code === 'REST') {
    label = '[REST] Screen-Free Mental Reset (No Studying)';
  } else if (t.code === 'BUFFER') {
    label = '[BUFFER] Health & Recovery Buffer (No Study)';
  } else if (t.code) {
    label = `[${t.code.toUpperCase()}] ${t.topic}`;
  }

  let taskId = `task-${rawDay.dateStr}-${idx + 1}`;
  if (rawDay.dateStr === '2026-10-28' && t.type === 'test') taskId = 'bluebook-test-1';
  if (rawDay.dateStr === '2026-10-30' && t.type === 'test') taskId = 'bluebook-test-2';
  if (rawDay.dateStr === '2026-11-03' && t.type === 'test') taskId = 'bluebook-test-3';
  if (rawDay.dateStr === '2026-11-07' && (t.type === 'exam' || t.code === 'EXAM')) taskId = 'sat-exam-day';

  return {
    id: taskId,
    label,
    subject,
    type: subject,
    code: t.code,
    topic: t.topic,
    timeSlot: t.timeSlot,
    durationMinutes: t.duration,
    duration: t.duration,
    completed: false
  };
}

const finalWeeks = [];
let dayPointer = 0;

WEEKS_META.forEach((wMeta, wIdx) => {
  const dayCount = wIdx === 7 ? 6 : 7;
  const weekDaysRaw = ALL_DAYS_DATA.slice(dayPointer, dayPointer + dayCount);
  dayPointer += dayCount;

  const days = weekDaysRaw.map(rawDay => {
    const tasks = rawDay.rawTasks.map((t, idx) => enrichTask(t, rawDay, idx));

    const studyTimeMinutes = tasks
      .filter(t => t.subject === 'math' || t.subject === 'rw' || t.subject === 'test' || t.subject === 'review')
      .reduce((sum, t) => sum + t.durationMinutes, 0);

    const breakTimeMinutes = tasks
      .filter(t => t.subject === 'buffer' && t.code === 'BREAK')
      .reduce((sum, t) => sum + t.durationMinutes, 0);

    return {
      id: rawDay.dateStr,
      dateStr: rawDay.dateStr,
      dayOfWeek: rawDay.dayOfWeek,
      formattedDate: rawDay.formattedDate,
      dayNumber: rawDay.dayNumber,
      weekNumber: wMeta.weekNumber,
      weekId: wMeta.id,
      weekTitle: wMeta.title,
      phase: wMeta.phase,
      isBuffer: rawDay.isBuffer,
      isTestDay: rawDay.isTestDay,
      specialInstructions: rawDay.specialInstructions,
      studyTimeMinutes,
      breakTimeMinutes,
      totalTimeMinutes: studyTimeMinutes + breakTimeMinutes,
      tasks
    };
  });

  finalWeeks.push({
    id: wMeta.id,
    weekNumber: wMeta.weekNumber,
    title: wMeta.title,
    dateRange: wMeta.dateRange,
    subtitle: wMeta.subtitle,
    phase: wMeta.phase,
    startDate: wMeta.startDate,
    endDate: wMeta.endDate,
    days
  });
});

const packingListCode = `export type { PackingItem } from '../types';

export const INITIAL_PACKING_LIST: PackingItem[] = [
  // =========================================================================
  // RANK 1: GATEKEEPER ESSENTIALS (LIFE OR DEATH) 🪪🚫
  // =========================================================================
  {
    id: 'rank1-id',
    item: 'Original Physical ID (Passport / Smart CNIC)',
    description: 'Your non-expired Pakistani Passport or Smart CNIC. No color photocopies, no digital photos on your phone, and no school ID cards. The name on the document must match "Muhammad Ahsan Javed" letter for letter.',
    rank: 1,
    rankTitle: 'Rank 1: Gatekeeper Essentials (Life or Death) 🪪🚫',
    category: 'essential',
    required: true,
    packed: false,
  },
  {
    id: 'rank1-laptop',
    item: 'Testing Laptop & Original Power Adapter',
    description: 'Your laptop must boot reliably, hold a charge, and run the latest version of Bluebook. Pack the original power brick and charging cable in your bag.',
    rank: 1,
    rankTitle: 'Rank 1: Gatekeeper Essentials (Life or Death) 🪪🚫',
    category: 'tech',
    required: true,
    packed: false,
  },
  {
    id: 'rank1-ticket',
    item: 'Official Printed Admission Ticket',
    description: 'Generated inside the Bluebook application five days before exam day during Exam Setup. Print a physical paper copy to present at the door.',
    rank: 1,
    rankTitle: 'Rank 1: Gatekeeper Essentials (Life or Death) 🪪🚫',
    category: 'essential',
    required: true,
    packed: false,
  },
  {
    id: 'rank1-arrival',
    item: 'Arriving Before the Gate Locks (7:15 AM Arrival)',
    description: 'College Board enforces a zero-tolerance lockout policy. Doors close strictly around 7:45 AM. Arrive at Crescent Model by 7:15 AM so you can clear the entry line without panic.',
    rank: 1,
    rankTitle: 'Rank 1: Gatekeeper Essentials (Life or Death) 🪪🚫',
    category: 'essential',
    required: true,
    packed: false,
  },

  // =========================================================================
  // RANK 2: CORE SCORE DRIVERS (THE 80/20 RULE) 📚🧠
  // =========================================================================
  {
    id: 'rank2-khan',
    item: 'Daily Khan Academy Reps (90-Minute Cap)',
    description: 'Consistent practice in two focused blocks: 45 minutes of Math, a 10-minute break, and 35 to 45 minutes of Reading and Writing. Active problem solving builds the intuition you need on test day.',
    rank: 2,
    rankTitle: 'Rank 2: Core Score Drivers (The 80/20 Rule) 📚🧠',
    category: 'habit',
    required: true,
    packed: false,
  },
  {
    id: 'rank2-error-log',
    item: 'Mistake Autopsy Notebook (Error Log)',
    description: 'Logging missed questions is where score gains happen. After every quiz or practice test, write down the root cause: did you misread the question, fall for a trap answer, or miss a math formula?',
    rank: 2,
    rankTitle: 'Rank 2: Core Score Drivers (The 80/20 Rule) 📚🧠',
    category: 'habit',
    required: true,
    packed: false,
  },
  {
    id: 'rank2-mocks',
    item: 'Official Full-Length Bluebook Mocks',
    description: 'Third-party PDFs cannot simulate adaptive testing. Taking official timed Bluebook tests trains your stamina for the 2-hour digital exam.',
    rank: 2,
    rankTitle: 'Rank 2: Core Score Drivers (The 80/20 Rule) 📚🧠',
    category: 'habit',
    required: true,
    packed: false,
  },

  // =========================================================================
  // RANK 3: TACTICAL MULTIPLIERS (SPEED & ACCURACY) ⚡💻
  // =========================================================================
  {
    id: 'rank3-desmos',
    item: 'Desmos Graphing Mastery',
    description: 'Learning how to type equations directly into Desmos to find intersections, vertex points, and roots saves minutes of manual scratch work.',
    rank: 3,
    rankTitle: 'Rank 3: Tactical Multipliers (Speed & Accuracy) ⚡💻',
    category: 'tech',
    required: false,
    packed: false,
  },
  {
    id: 'rank3-mouse',
    item: 'External Mouse & Mousepad',
    description: 'Using a laptop trackpad to highlight text and drag graphs on Desmos is slow. A responsive external mouse gives you smoother control during timed modules.',
    rank: 3,
    rankTitle: 'Rank 3: Tactical Multipliers (Speed & Accuracy) ⚡💻',
    category: 'tech',
    required: false,
    packed: false,
  },
  {
    id: 'rank3-pens',
    item: 'Reliable Writing Utensils (2 Pens/Pencils)',
    description: 'Bring two working pens or pencils. The exam center supplies official blank scratch paper, but they do not guarantee pens for test takers.',
    rank: 3,
    rankTitle: 'Rank 3: Tactical Multipliers (Speed & Accuracy) ⚡💻',
    category: 'comfort',
    required: false,
    packed: false,
  },

  // =========================================================================
  // RANK 4: BIOLOGICAL OPTIMIZATION (TEST-DAY FUEL) 🥪🔋
  // =========================================================================
  {
    id: 'rank4-sleep',
    item: 'Sleep Schedule Alignment (10 PM Curfew)',
    description: 'A full night of sleep before test day protects your working memory far more than late-night cramming.',
    rank: 4,
    rankTitle: 'Rank 4: Biological Optimization (Test-Day Fuel) 🥪🔋',
    category: 'comfort',
    required: false,
    packed: false,
  },
  {
    id: 'rank4-fuel',
    item: 'Mid-Exam Fuel (Water Bottle & Dates/Almonds/Banana)',
    description: 'A clear water bottle and a simple snack like dates, almonds, or a banana during the mandatory 10-minute break keeps your focus steady for Math Module 2.',
    rank: 4,
    rankTitle: 'Rank 4: Biological Optimization (Test-Day Fuel) 🥪🔋',
    category: 'comfort',
    required: false,
    packed: false,
  },
  {
    id: 'rank4-clothing',
    item: 'Comfortable Layered Clothing',
    description: 'Testing rooms can be drafty or warm depending on the hall. Wear layers so you can adjust comfortably.',
    rank: 4,
    rankTitle: 'Rank 4: Biological Optimization (Test-Day Fuel) 🥪🔋',
    category: 'comfort',
    required: false,
    packed: false,
  },

  // =========================================================================
  // RANK 5: LOWEST PRIORITY (THINGS STUDENTS WASTE TIME ON) 📉🛋️
  // =========================================================================
  {
    id: 'rank5-books',
    item: 'Avoid Third-Party Paper Prep Books',
    description: "Paper prep books designed for the old paper SAT contain outdated question types and won't teach you digital interface mechanics.",
    rank: 5,
    rankTitle: 'Rank 5: Lowest Priority (Things Students Waste Time On) 📉🛋️',
    category: 'lowest',
    required: false,
    packed: false,
  },
  {
    id: 'rank5-flashcards',
    item: 'Avoid Complex Note Formatting / Heavy Binders',
    description: 'Color-coded flashcards and elaborate binders look neat, but doing practice questions on the screen is what actually raises your score.',
    rank: 5,
    rankTitle: 'Rank 5: Lowest Priority (Things Students Waste Time On) 📉🛋️',
    category: 'lowest',
    required: false,
    packed: false,
  },
  {
    id: 'rank5-localhost',
    item: 'Avoid Over-Tweaking Web Trackers on Localhost 😂',
    description: "Your React app looks great, but don't let perfecting CSS buttons pull time away from your daily Khan Academy reps! 😂",
    rank: 5,
    rankTitle: 'Rank 5: Lowest Priority (Things Students Waste Time On) 📉🛋️',
    category: 'lowest',
    required: false,
    packed: false,
  },
];

export function mergePackingListWithDefaults(savedList?: PackingItem[] | null): PackingItem[] {
  if (!savedList || !Array.isArray(savedList) || savedList.length === 0) {
    return INITIAL_PACKING_LIST;
  }

  const packedStatusById = new Map<string, boolean>();
  const packedStatusByName = new Map<string, boolean>();
  const customItems: PackingItem[] = [];

  savedList.forEach((item) => {
    if (!item) return;
    if (item.id) {
      packedStatusById.set(item.id, !!item.packed);
    }
    if (item.item) {
      packedStatusByName.set(item.item.trim().toLowerCase(), !!item.packed);
    }

    const isCanonical = INITIAL_PACKING_LIST.some((canonical) => canonical.id === item.id);
    if (!isCanonical && item.id && (item.id.startsWith('custom-') || !item.id.startsWith('pack-'))) {
      customItems.push({
        ...item,
        rank: item.rank || 1,
        packed: !!item.packed,
      });
    }
  });

  const mergedCanonical = INITIAL_PACKING_LIST.map((canonical) => {
    let isPacked = false;
    if (packedStatusById.has(canonical.id)) {
      isPacked = packedStatusById.get(canonical.id)!;
    } else if (packedStatusByName.has(canonical.item.trim().toLowerCase())) {
      isPacked = packedStatusByName.get(canonical.item.trim().toLowerCase())!;
    }
    return {
      ...canonical,
      packed: isPacked,
    };
  });

  return [...mergedCanonical, ...customItems];
}
`;

const fileContent = `// Auto-generated by scripts/build_study_plan.js
// SAT Study Plan Data: Official 55-Day Master Curriculum
// Phase 1 (Sep 14 - Oct 27): Exactly 30 Numbered Study Days (102 Math + 43 R&W = 145 Skills)
// Buffer Days (Sep 22 - Sep 30): 9 Full Illness Recovery Days (0 study minutes)
// Chapter 5 of English and Math officially start on Oct 1st
// Phase 2 (Oct 28 - Nov 07): 3 Timed Bluebook Practice Tests + Official SAT Exam Day (Nov 07)

import { WeekPlan, DayPlan, TaskItem, PackingItem } from '../types';

${packingListCode}

export const STUDY_PLAN_WEEKS: WeekPlan[] = ${JSON.stringify(finalWeeks, null, 2)};
`;

const outputPath = path.join(__dirname, '../src/data/studyPlan.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log('Successfully generated STUDY_PLAN_WEEKS with 8 weeks!');
finalWeeks.forEach(w => console.log(`- ${w.id} (${w.dateRange}): ${w.days.length} days`));

const allDays = finalWeeks.flatMap(w => w.days);
const numberedDays = allDays.filter(d => d.dayNumber !== null);
const mathTasks = allDays.flatMap(d => d.tasks).filter(t => t.subject === 'math');
const rwTasks = allDays.flatMap(d => d.tasks).filter(t => t.subject === 'rw');

console.log('\\nTotals:');
console.log(`- Total Days: ${allDays.length}`);
console.log(`- Numbered Study Days (Phase 1): ${numberedDays.length}`);
console.log(`- Math Lessons: ${mathTasks.length} (Expect 102)`);
console.log(`- R&W Lessons: ${rwTasks.length} (Expect 43)`);
console.log(`- Total Curriculum Lessons: ${mathTasks.length + rwTasks.length} (Expect 145)`);
