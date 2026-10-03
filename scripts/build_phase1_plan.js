const fs = require('fs');
const path = require('path');

const RAW_PHASE1_TEXT = `
=== Day 1 - Mon Sep 14  (study 80 min) ===
  6:30 PM - 6:50 PM   [MATH U3.2] Unit conversion  (20 min)
  6:50 PM - 7:10 PM   [MATH U3.3] Percentages  (20 min)
  7:10 PM - 7:30 PM   [MATH U3.4] Center, spread, and shape of distributions  (20 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:05 PM   [MATH U3.5] Data representations  (20 min)

=== Day 2 - Tue Sep 15  (study 80 min) ===
  6:30 PM - 6:50 PM   [MATH U3.6] Scatterplots  (20 min)
  6:50 PM - 7:10 PM   [MATH U3.7] Linear and exponential growth  (20 min)
  7:10 PM - 7:30 PM   [MATH U3.8] Probability and relative frequency  (20 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:05 PM   [MATH U3.9] Data inferences  (20 min)

=== Day 3 - Wed Sep 16  (study 135 min) ===
  6:30 PM - 6:50 PM   [MATH U3.10] Evaluating statistical claims  (20 min)
  6:50 PM - 7:15 PM   [MATH U4.1] Factoring quadratic and polynomial expressions  (25 min)
  7:15 PM - 7:30 PM   REAL BREAK (15 min)
  7:30 PM - 7:55 PM   [MATH U4.2] Radicals and rational exponents  (25 min)
  7:55 PM - 8:20 PM   [MATH U4.3] Operations with polynomials  (25 min)
  8:20 PM - 8:35 PM   REAL BREAK (15 min)
  8:35 PM - 8:55 PM   [R&W U3.1] Words in context  (20 min)
  8:55 PM - 9:15 PM   [R&W U3.2] Text structure and purpose  (20 min)

=== Day 4 - Thu Sep 17  (study 115 min) ===
  6:30 PM - 6:55 PM   [MATH U4.4] Operations with rational expressions  (25 min)
  6:55 PM - 7:20 PM   [MATH U4.5] Nonlinear functions  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U4.6] Isolating quantities  (25 min)
  8:00 PM - 8:20 PM   [R&W U3.3] Cross-text connections  (20 min)
  8:20 PM - 8:35 PM   REAL BREAK (15 min)
  8:35 PM - 8:55 PM   [R&W U4.1] Transitions  (20 min)

=== Day 5 - Fri Sep 18  (study 115 min) ===
  6:30 PM - 6:55 PM   [MATH U4.7] Solving quadratic equations  (25 min)
  6:55 PM - 7:20 PM   [MATH U4.8] Linear and quadratic systems  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U4.9] Radical, rational, and absolute value equations  (25 min)
  8:00 PM - 8:20 PM   [R&W U4.2] Rhetorical synthesis  (20 min)
  8:20 PM - 8:35 PM   REAL BREAK (15 min)
  8:35 PM - 8:55 PM   [R&W U4.3] Form, structure, and sense  (20 min)

=== Day 6 - Sat Sep 19  (study 117 min) ===
  6:30 PM - 6:55 PM   [MATH U4.10] Quadratic and exponential word problems  (25 min)
  6:55 PM - 7:20 PM   [MATH U4.11] Quadratic graphs  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U4.12] Exponential graphs  (25 min)
  8:00 PM - 8:20 PM   [R&W U4.4] Boundaries  (20 min)
  8:20 PM - 8:35 PM   REAL BREAK (15 min)
  8:35 PM - 8:57 PM   [R&W U5.1] Command of textual evidence  (22 min)

Sun Sep 20 -- REST DAY (no studying)

=== Day 7 - Mon Sep 21  (study 129 min) ===
  6:30 PM - 6:55 PM   [MATH U4.13] Polynomial and other nonlinear graphs  (25 min)
  6:55 PM - 7:25 PM   [MATH U5.1] Area and volume  (30 min)
  7:25 PM - 7:40 PM   REAL BREAK (15 min)
  7:40 PM - 8:10 PM   [MATH U5.2] Congruence, similarity, and angle relationships  (30 min)
  8:10 PM - 8:32 PM   [R&W U5.2] Command of quantitative evidence  (22 min)
  8:32 PM - 8:47 PM   REAL BREAK (15 min)
  8:47 PM - 9:09 PM   [R&W U5.3] Central ideas and details  (22 min)

=== Day 8 - Tue Sep 22  (study 134 min) ===
  6:30 PM - 7:00 PM   [MATH U5.3] Right triangle trigonometry  (30 min)
  7:00 PM - 7:30 PM   [MATH U5.4] Circle theorems  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U5.5] Unit circle trigonometry  (30 min)
  8:15 PM - 8:37 PM   [R&W U5.4] Inferences  (22 min)
  8:37 PM - 8:52 PM   REAL BREAK (15 min)
  8:52 PM - 9:14 PM   [R&W U6.1] Words in context  (22 min)

=== Day 9 - Wed Sep 23  (study 124 min)   <<< FOUNDATIONS FULLY COMPLETE (Math U2-U5 + R&W U2-U4) ===
  6:30 PM - 7:00 PM   [MATH U5.6] Circle equations  (30 min)
  7:00 PM - 7:25 PM   [MATH U6.1] Solving linear equations and inequalities  (25 min)
  7:25 PM - 7:40 PM   REAL BREAK (15 min)
  7:40 PM - 8:05 PM   [MATH U6.2] Linear equation word problems  (25 min)
  8:05 PM - 8:27 PM   [R&W U6.2] Text structure and purpose  (22 min)
  8:27 PM - 8:42 PM   REAL BREAK (15 min)
  8:42 PM - 9:04 PM   [R&W U6.3] Cross-text connections  (22 min)

=== Day 10 - Thu Sep 24  (study 119 min) ===
  6:30 PM - 6:55 PM   [MATH U6.3] Linear relationship word problems  (25 min)
  6:55 PM - 7:20 PM   [MATH U6.4] Graphs of linear equations and functions  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U6.5] Solving systems of linear equations  (25 min)
  8:00 PM - 8:22 PM   [R&W U7.1] Transitions  (22 min)
  8:22 PM - 8:37 PM   REAL BREAK (15 min)
  8:37 PM - 8:59 PM   [R&W U7.2] Rhetorical synthesis  (22 min)

=== Day 11 - Fri Sep 25  (study 119 min) ===
  6:30 PM - 6:55 PM   [MATH U6.6] Systems of linear equations word problems  (25 min)
  6:55 PM - 7:20 PM   [MATH U6.7] Linear inequality word problems  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U6.8] Graphs of linear systems and inequalities  (25 min)
  8:00 PM - 8:22 PM   [R&W U7.3] Form, structure, and sense  (22 min)
  8:22 PM - 8:37 PM   REAL BREAK (15 min)
  8:37 PM - 8:59 PM   [R&W U7.4] Boundaries  (22 min)

=== Day 12 - Sat Sep 26  (study 125 min) ===
  6:30 PM - 6:55 PM   [MATH U7.1] Ratios, rates, and proportions  (25 min)
  6:55 PM - 7:20 PM   [MATH U7.2] Unit conversion  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U7.3] Percentages  (25 min)
  8:00 PM - 8:25 PM   [R&W U8.1] Command of textual evidence  (25 min)
  8:25 PM - 8:40 PM   REAL BREAK (15 min)
  8:40 PM - 9:05 PM   [R&W U8.2] Command of quantitative evidence  (25 min)

Sun Sep 27 -- REST DAY (no studying)

=== Day 13 - Mon Sep 28  (study 125 min) ===
  6:30 PM - 6:55 PM   [MATH U7.4] Center, spread, and shape of distributions  (25 min)
  6:55 PM - 7:20 PM   [MATH U7.5] Data representations  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U7.6] Scatterplots  (25 min)
  8:00 PM - 8:25 PM   [R&W U8.3] Central ideas and details  (25 min)
  8:25 PM - 8:40 PM   REAL BREAK (15 min)
  8:40 PM - 9:05 PM   [R&W U8.4] Inferences  (25 min)

=== Day 14 - Tue Sep 29  (study 125 min) ===
  6:30 PM - 6:55 PM   [MATH U7.7] Linear and exponential growth  (25 min)
  6:55 PM - 7:20 PM   [MATH U7.8] Probability and relative frequency  (25 min)
  7:20 PM - 7:35 PM   REAL BREAK (15 min)
  7:35 PM - 8:00 PM   [MATH U7.9] Data inferences  (25 min)
  8:00 PM - 8:25 PM   [R&W U9.1] Words in context  (25 min)
  8:25 PM - 8:40 PM   REAL BREAK (15 min)
  8:40 PM - 9:05 PM   [R&W U9.2] Text structure and purpose  (25 min)

=== Day 15 - Wed Sep 30  (study 105 min) ===
  6:30 PM - 6:55 PM   [MATH U7.10] Evaluating statistical claims  (25 min)
  6:55 PM - 7:25 PM   [MATH U8.1] Factoring quadratic and polynomial expressions  (30 min)
  7:25 PM - 7:40 PM   REAL BREAK (15 min)
  7:40 PM - 8:05 PM   [R&W U9.3] Cross-text connections  (25 min)
  8:05 PM - 8:30 PM   [R&W U10.1] Transitions  (25 min)

=== Day 16 - Thu Oct 1  (study 110 min) ===
  6:30 PM - 7:00 PM   [MATH U8.2] Radicals and rational exponents  (30 min)
  7:00 PM - 7:30 PM   [MATH U8.3] Operations with polynomials  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:10 PM   [R&W U10.2] Rhetorical synthesis  (25 min)
  8:10 PM - 8:35 PM   [R&W U10.3] Form, structure, and sense  (25 min)

=== Day 17 - Fri Oct 2  (study 120 min) ===
  6:30 PM - 7:00 PM   [MATH U8.4] Operations with rational expressions  (30 min)
  7:00 PM - 7:30 PM   [MATH U8.5] Nonlinear functions  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:10 PM   [R&W U10.4] Boundaries  (25 min)
  8:10 PM - 8:45 PM   [R&W U11.1] Command of evidence  (35 min)

=== Day 18 - Sat Oct 3  (study 160 min) ===
  6:30 PM - 7:00 PM   [MATH U8.6] Isolating quantities  (30 min)
  7:00 PM - 7:30 PM   [MATH U8.7] Solving quadratic equations  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U8.8] Linear and quadratic systems  (30 min)
  8:15 PM - 8:50 PM   [R&W U11.2] Central ideas and details + inferences  (35 min)
  8:50 PM - 9:05 PM   REAL BREAK (15 min)
  9:05 PM - 9:40 PM   [R&W U11.3] Words in context  (35 min)

Sun Oct 4 -- REST DAY (no studying)

=== Day 19 - Mon Oct 5  (study 160 min) ===
  6:30 PM - 7:00 PM   [MATH U8.9] Radical, rational, and absolute value equations  (30 min)
  7:00 PM - 7:30 PM   [MATH U8.10] Quadratic and exponential word problems  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U8.11] Quadratic graphs  (30 min)
  8:15 PM - 8:50 PM   [R&W U11.4] Text structure and purpose + cross-text connections  (35 min)
  8:50 PM - 9:05 PM   REAL BREAK (15 min)
  9:05 PM - 9:40 PM   [R&W U11.5] Boundaries + form, structure, and sense  (35 min)

=== Day 20 - Tue Oct 6  (study 145 min) ===
  6:30 PM - 7:00 PM   [MATH U8.12] Exponential graphs  (30 min)
  7:00 PM - 7:30 PM   [MATH U8.13] Polynomial and other nonlinear graphs  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:20 PM   [MATH U9.1] Area and volume  (35 min)
  8:20 PM - 8:55 PM   [R&W U11.6] Transitions + rhetorical synthesis  (35 min)
      >>> DONE: CHALLENGE UNIT COMPLETE
  8:55 PM - 9:10 PM   REAL BREAK (15 min)
  9:10 PM - 9:25 PM   [R&W U12.1] Subject-verb agreement  (15 min)

=== Day 21 - Wed Oct 7  (study 135 min) ===
  6:30 PM - 7:05 PM   [MATH U9.2] Congruence, similarity, and angle relationships  (35 min)
  7:05 PM - 7:40 PM   [MATH U9.3] Right triangle trigonometry  (35 min)
  7:40 PM - 7:55 PM   REAL BREAK (15 min)
  7:55 PM - 8:30 PM   [MATH U9.4] Circle theorems  (35 min)
  8:30 PM - 8:45 PM   [R&W U12.2] Pronoun-antecedent agreement  (15 min)
  8:45 PM - 9:00 PM   REAL BREAK (15 min)
  9:00 PM - 9:15 PM   [R&W U12.3] Plurals and possessives  (15 min)

=== Day 22 - Thu Oct 8  (study 130 min) ===
  6:30 PM - 7:05 PM   [MATH U9.5] Unit circle trigonometry  (35 min)
  7:05 PM - 7:40 PM   [MATH U9.6] Circle equations  (35 min)
  7:40 PM - 7:55 PM   REAL BREAK (15 min)
  7:55 PM - 8:25 PM   [MATH U10.1] Solving linear equations and inequalities  (30 min)
  8:25 PM - 8:40 PM   [R&W U12.4] Verb forms  (15 min)
  8:40 PM - 8:55 PM   REAL BREAK (15 min)
  8:55 PM - 9:10 PM   [R&W U12.5] Subject-modifier placement  (15 min)

=== Day 23 - Fri Oct 9  (study 150 min) ===
  6:30 PM - 7:00 PM   [MATH U10.2] Linear equation word problems  (30 min)
  7:00 PM - 7:30 PM   [MATH U10.3] Linear relationship word problems  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U10.4] Graphs of linear equations and functions  (30 min)
  8:15 PM - 8:45 PM   [MATH U10.5] Solving systems of linear equations  (30 min)
  8:45 PM - 9:00 PM   REAL BREAK (15 min)
  9:00 PM - 9:15 PM   [R&W U12.6] Linking clauses  (15 min)
  9:15 PM - 9:30 PM   [R&W U12.7] Supplements  (15 min)

=== Day 24 - Sat Oct 10  (study 135 min) ===
  6:30 PM - 7:00 PM   [MATH U10.6] Systems of linear equations word problems  (30 min)
  7:00 PM - 7:30 PM   [MATH U10.7] Linear inequality word problems  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U10.8] Graphs of linear systems and inequalities  (30 min)
  8:15 PM - 8:45 PM   [MATH U11.1] Ratios, rates, and proportions  (30 min)
  8:45 PM - 9:00 PM   REAL BREAK (15 min)
  9:00 PM - 9:15 PM   [R&W U12.8] Punctuation  (15 min)
      >>> DONE: ALL READING & WRITING COMPLETE

Sun Oct 11 -- REST DAY (no studying)

=== Day 25 - Mon Oct 12  (study 120 min) ===
  6:30 PM - 7:00 PM   [MATH U11.2] Unit conversion  (30 min)
  7:00 PM - 7:30 PM   [MATH U11.3] Percentages  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U11.4] Center, spread, and shape of distributions  (30 min)
  8:15 PM - 8:45 PM   [MATH U11.5] Data representations  (30 min)

=== Day 26 - Tue Oct 13  (study 120 min) ===
  6:30 PM - 7:00 PM   [MATH U11.6] Scatterplots  (30 min)
  7:00 PM - 7:30 PM   [MATH U11.7] Linear and exponential growth  (30 min)
  7:30 PM - 7:45 PM   REAL BREAK (15 min)
  7:45 PM - 8:15 PM   [MATH U11.8] Probability and relative frequency  (30 min)
  8:15 PM - 8:45 PM   [MATH U11.9] Data inferences  (30 min)

=== Day 27 - Wed Oct 14  (study 135 min) ===
  6:30 PM - 7:00 PM   [MATH U11.10] Evaluating statistical claims  (30 min)
  7:00 PM - 7:35 PM   [MATH U12.1] Factoring quadratic and polynomial expressions  (35 min)
  7:35 PM - 7:50 PM   REAL BREAK (15 min)
  7:50 PM - 8:25 PM   [MATH U12.2] Radicals and rational exponents  (35 min)
  8:25 PM - 9:00 PM   [MATH U12.3] Operations with polynomials  (35 min)

=== Day 28 - Thu Oct 15  (study 140 min) ===
  6:30 PM - 7:05 PM   [MATH U12.4] Operations with rational expressions  (35 min)
  7:05 PM - 7:40 PM   [MATH U12.5] Nonlinear functions  (35 min)
  7:40 PM - 7:55 PM   REAL BREAK (15 min)
  7:55 PM - 8:30 PM   [MATH U12.6] Isolating quantities  (35 min)
  8:30 PM - 9:05 PM   [MATH U12.7] Solving quadratic equations  (35 min)

=== Day 29 - Fri Oct 16  (study 140 min) ===
  6:30 PM - 7:05 PM   [MATH U12.8] Linear and quadratic systems  (35 min)
  7:05 PM - 7:40 PM   [MATH U12.9] Radical, rational, and absolute value equations  (35 min)
  7:40 PM - 7:55 PM   REAL BREAK (15 min)
  7:55 PM - 8:30 PM   [MATH U12.10] Quadratic and exponential word problems  (35 min)
  8:30 PM - 9:05 PM   [MATH U12.11] Quadratic graphs  (35 min)

=== Day 30 - Sat Oct 17  (study 110 min) ===
  6:30 PM - 7:05 PM   [MATH U12.12] Exponential graphs  (35 min)
  7:05 PM - 7:40 PM   [MATH U12.13] Polynomial and other nonlinear graphs  (35 min)
  7:40 PM - 7:55 PM   REAL BREAK (15 min)
  7:55 PM - 8:35 PM   [MATH U13.1] Area and volume  (40 min)

Sun Oct 18 -- REST DAY (no studying)

=== Day 31 - Mon Oct 19  (study 120 min) ===
  6:30 PM - 7:10 PM   [MATH U13.2] Congruence, similarity, and angle relationships  (40 min)
  7:10 PM - 7:50 PM   [MATH U13.3] Right triangle trigonometry  (40 min)
  7:50 PM - 8:05 PM   REAL BREAK (15 min)
  8:05 PM - 8:45 PM   [MATH U13.4] Circle theorems  (40 min)

=== Day 32 - Tue Oct 20  (study 80 min) ===
  6:30 PM - 7:10 PM   [MATH U13.5] Unit circle trigonometry  (40 min)
  7:10 PM - 7:50 PM   [MATH U13.6] Circle equations  (40 min)
      >>> DONE: ALL MATH COMPLETE
`;

// Helper parser for date string from "Mon Sep 14" -> "2026-09-14"
const MONTH_MAP = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};

function parseDateFormatted(str) {
  const parts = str.trim().split(/\s+/);
  const m = MONTH_MAP[parts[1]];
  const d = parts[2].padStart(2, '0');
  return `2026-${m}-${d}`;
}

// Parse text into day blocks
const parsedDays = [];
const lines = RAW_PHASE1_TEXT.trim().split('\n');

let currentDay = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Check for rest day line: e.g. "Sun Sep 20 -- REST DAY (no studying)"
  const restMatch = line.match(/^(Sun\s+(Sep|Oct)\s+\d+)\s+--\s+REST DAY/i);
  if (restMatch) {
    const formattedDate = restMatch[1];
    const dateStr = parseDateFormatted(formattedDate);
    const dayOfWeek = formattedDate.split(/\s+/)[0];
    parsedDays.push({
      dateStr,
      formattedDate,
      dayOfWeek,
      dayNumber: undefined,
      isBuffer: true,
      isTestDay: false,
      studyTimeMinutes: 0,
      breakTimeMinutes: 0,
      totalTimeMinutes: 0,
      specialInstructions: 'Guaranteed Rest Day: Zero assigned lessons. Allow mental recharge, sleep, and physical recovery.',
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
    currentDay = null;
    continue;
  }

  // Check for diagnostic test line: e.g. "Sun Sep 27 -- DIAGNOSTIC TEST: Full Bluebook Practice Test #1 (8:00 AM - 10:24 AM)"
  const testMatch = line.match(/^(Sun\s+(Sep|Oct)\s+\d+)\s+--\s+DIAGNOSTIC TEST:\s*(.*)/i);
  if (testMatch) {
    const formattedDate = testMatch[1];
    const dateStr = parseDateFormatted(formattedDate);
    const dayOfWeek = formattedDate.split(/\s+/)[0];
    parsedDays.push({
      dateStr,
      formattedDate,
      dayOfWeek,
      dayNumber: undefined,
      isBuffer: false,
      isTestDay: true,
      studyTimeMinutes: 144,
      breakTimeMinutes: 10,
      totalTimeMinutes: 154,
      specialInstructions: 'DIAGNOSTIC TEST: Full Bluebook Practice Test #1 (8:00 AM - 10:24 AM). Foundations complete as of Sep 23 -- this is your real baseline, not a mid-Foundations snapshot.',
      tasks: [
        {
          id: 'bluebook-test-1',
          label: 'Full Bluebook Practice Test #1 (real conditions, timed)',
          subject: 'test',
          code: 'TEST #1',
          topic: 'Foundations Checkpoint Diagnostic Mock',
          timeSlot: '8:00 AM - 10:24 AM',
          durationMinutes: 144,
          completed: false
        }
      ]
    });
    currentDay = null;
    continue;
  }

  // Check for day header: e.g. "=== Day 1 - Mon Sep 14  (study 80 min) ==="
  const headerMatch = line.match(/^===\s*Day\s+(\d+)\s*-\s*([A-Za-z]{3}\s+[A-Za-z]{3}\s+\d+)\s*\((study\s+\d+\s*min[^\)]*)\)(.*)===/i);
  if (headerMatch) {
    const dayNumber = parseInt(headerMatch[1], 10);
    const formattedDate = headerMatch[2].trim();
    const dateStr = parseDateFormatted(formattedDate);
    const dayOfWeek = formattedDate.split(/\s+/)[0];
    const extraNote = headerMatch[4] ? headerMatch[4].replace(/<<+|>>+/g, '').trim() : '';

    currentDay = {
      dateStr,
      formattedDate,
      dayOfWeek,
      dayNumber,
      isBuffer: false,
      isTestDay: false,
      studyTimeMinutes: 0,
      breakTimeMinutes: 0,
      totalTimeMinutes: 0,
      specialInstructions: extraNote || `Day ${dayNumber}: Complete assigned tasks with strict timer adherence. Rest during scheduled break intervals.`,
      tasks: []
    };
    parsedDays.push(currentDay);
    continue;
  }

  // Task line or break line:
  // e.g. "6:30 PM - 6:50 PM   [MATH U3.2] Unit conversion  (20 min)"
  // e.g. "7:30 PM - 7:45 PM   REAL BREAK (15 min)"
  if (currentDay) {
    // Check break
    const breakMatch = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM))\s+(REAL BREAK|BREAK)\s*\((?:.*?)(\d+)\s*min\)/i);
    if (breakMatch) {
      const timeSlot = breakMatch[1].trim();
      const dur = parseInt(breakMatch[3], 10) || 15;
      currentDay.breakTimeMinutes += dur;
      currentDay.tasks.push({
        id: `break-${currentDay.dateStr}-${currentDay.tasks.length + 1}`,
        label: 'Screen-Free Rest & Recharge',
        subject: 'buffer',
        code: 'BREAK',
        topic: 'Screen-Free Rest & Recharge',
        timeSlot,
        durationMinutes: dur,
        completed: false
      });
      continue;
    }

    // Check study task:
    const taskMatch = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM))\s+\[([A-Za-z&]+\s*U[\d\.]+)\]\s*(.*?)\s*\((?:.*?)(\d+)\s*min\)/i);
    if (taskMatch) {
      const timeSlot = taskMatch[1].trim();
      const rawCode = taskMatch[2].trim();
      const topic = taskMatch[3].trim();
      const dur = parseInt(taskMatch[4], 10) || 20;

      const isMath = /MATH/i.test(rawCode);
      const subject = isMath ? 'math' : 'rw';
      const cleanCode = isMath ? rawCode.replace(/MATH\s*/i, 'Math ') : rawCode.replace(/R&W\s*/i, 'R&W ');

      currentDay.studyTimeMinutes += dur;
      currentDay.tasks.push({
        id: `task-${currentDay.dateStr}-${currentDay.tasks.length + 1}`,
        label: `[${cleanCode.toUpperCase()}] ${topic}`,
        subject,
        code: cleanCode,
        topic,
        timeSlot,
        durationMinutes: dur,
        completed: false
      });
      continue;
    }
  }
}

// Calculate totalTimeMinutes for all parsed days
for (const d of parsedDays) {
  d.totalTimeMinutes = d.studyTimeMinutes + d.breakTimeMinutes;
}

// Phase 2 Days: Oct 21 to Nov 7
const phase2Days = [
  {
    dateStr: '2026-10-21',
    formattedDate: 'Wed Oct 21',
    dayOfWeek: 'Wed',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    specialInstructions: 'TEST #1 (full Bluebook Practice Test, real conditions): 8:00 AM - 10:24 AM.',
    tasks: [
      {
        id: 'bluebook-test-1',
        label: 'TEST #1 (full Bluebook Practice Test, real conditions)',
        subject: 'test',
        code: 'TEST #1',
        topic: 'Full Bluebook Practice Test #1 (Real Conditions)',
        timeSlot: '8:00 AM - 10:24 AM',
        durationMinutes: 144,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-22',
    formattedDate: 'Thu Oct 22',
    dayOfWeek: 'Thu',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    specialInstructions: 'Error-log review of Test #1 (45 min): Open score report, dissect every wrong question: skill & root-cause autopsy.',
    tasks: [
      {
        id: 'p2-d2-1',
        label: 'Error-log review of Test #1 (45 min)',
        subject: 'review',
        code: 'AUTOPSY',
        topic: 'Test #1 Error Log Dissection',
        timeSlot: '6:30 PM - 7:15 PM',
        durationMinutes: 45,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-23',
    formattedDate: 'Fri Oct 23',
    dayOfWeek: 'Fri',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 75,
    breakTimeMinutes: 0,
    totalTimeMinutes: 75,
    specialInstructions: 'Targeted Math drills on Test #1 errors (45m) + Desmos speed drills on systems & roots (30m).',
    tasks: [
      {
        id: 'p2-d3-1',
        label: 'Targeted Math drills + Desmos speed drills (75 min)',
        subject: 'drill',
        code: 'MATH DRILL',
        topic: 'Test #1 Error Drills & Desmos Speed Training',
        timeSlot: '6:30 PM - 7:45 PM',
        durationMinutes: 75,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-24',
    formattedDate: 'Sat Oct 24',
    dayOfWeek: 'Sat',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 60,
    breakTimeMinutes: 0,
    totalTimeMinutes: 60,
    specialInstructions: 'Targeted R&W drills, punctuation/grammar review: Redo missed skills on Khan, review grammar rules.',
    tasks: [
      {
        id: 'p2-d4-1',
        label: 'Targeted R&W drills, punctuation/grammar review (60 min)',
        subject: 'drill',
        code: 'RW DRILL',
        topic: 'Grammar Traps & Reading Drills',
        timeSlot: '6:30 PM - 7:30 PM',
        durationMinutes: 60,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-25',
    formattedDate: 'Sun Oct 25',
    dayOfWeek: 'Sun',
    dayNumber: undefined,
    isBuffer: true,
    isTestDay: false,
    studyTimeMinutes: 0,
    breakTimeMinutes: 0,
    totalTimeMinutes: 0,
    specialInstructions: 'REST DAY: Full day off, no studying. Guaranteed mental reset & recovery.',
    tasks: [
      {
        id: 'rest-2026-10-25',
        label: 'REST DAY: Full day off, no studying. Guaranteed mental reset',
        subject: 'buffer',
        code: 'REST',
        topic: 'Cognitive Recovery',
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-26',
    formattedDate: 'Mon Oct 26',
    dayOfWeek: 'Mon',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    specialInstructions: 'Light targeted practice on remaining weak spots (45 min): Only weak spots still bothering you, nothing new.',
    tasks: [
      {
        id: 'p2-d6-1',
        label: 'Light targeted practice on remaining weak spots (45 min)',
        subject: 'drill',
        code: 'LIGHT DRILL',
        topic: 'Weak Spot Maintenance',
        timeSlot: '6:30 PM - 7:15 PM',
        durationMinutes: 45,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-27',
    formattedDate: 'Tue Oct 27',
    dayOfWeek: 'Tue',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    specialInstructions: 'TEST #2 (full Bluebook Practice Test): 8:00 AM - 10:24 AM.',
    tasks: [
      {
        id: 'bluebook-test-2',
        label: 'TEST #2 (full Bluebook Practice Test)',
        subject: 'test',
        code: 'TEST #2',
        topic: 'Full Bluebook Practice Test #2 (Real Conditions)',
        timeSlot: '8:00 AM - 10:24 AM',
        durationMinutes: 144,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-28',
    formattedDate: 'Wed Oct 28',
    dayOfWeek: 'Wed',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    specialInstructions: 'Error-log review of Test #2 (45 min): Dissect every wrong question and log root-cause rules.',
    tasks: [
      {
        id: 'p2-d8-1',
        label: 'Error-log review of Test #2 (45 min)',
        subject: 'review',
        code: 'AUTOPSY',
        topic: 'Test #2 Error Dissection',
        timeSlot: '6:30 PM - 7:15 PM',
        durationMinutes: 45,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-29',
    formattedDate: 'Thu Oct 29',
    dayOfWeek: 'Thu',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 60,
    breakTimeMinutes: 0,
    totalTimeMinutes: 60,
    specialInstructions: 'Targeted drills on Test #2 weak areas (60 min): Fix what Test #2 exposed with targeted Khan practice.',
    tasks: [
      {
        id: 'p2-d9-1',
        label: 'Targeted drills on Test #2 weak areas (60 min)',
        subject: 'drill',
        code: 'TARGETED DRILL',
        topic: 'Test #2 Weak Areas Targeted Drills',
        timeSlot: '6:30 PM - 7:30 PM',
        durationMinutes: 60,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-30',
    formattedDate: 'Fri Oct 30',
    dayOfWeek: 'Fri',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 60,
    breakTimeMinutes: 0,
    totalTimeMinutes: 60,
    specialInstructions: 'Deep review, punctuation & transitions traps + Math cleanup (60 min).',
    tasks: [
      {
        id: 'p2-d10-1',
        label: 'Deep review, punctuation & transitions traps + Math cleanup (60 min)',
        subject: 'review',
        code: 'DEEP REVIEW',
        topic: 'Grammar Traps & Math Polish',
        timeSlot: '6:30 PM - 7:30 PM',
        durationMinutes: 60,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-10-31',
    formattedDate: 'Sat Oct 31',
    dayOfWeek: 'Sat',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    specialInstructions: 'TEST #3 (final full test, timed): 8:00 AM - 10:24 AM under real conditions.',
    tasks: [
      {
        id: 'bluebook-test-3',
        label: 'TEST #3 (final full test, timed)',
        subject: 'test',
        code: 'TEST #3',
        topic: 'Final Full Bluebook Practice Test #3 (Real Conditions)',
        timeSlot: '8:00 AM - 10:24 AM',
        durationMinutes: 144,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-01',
    formattedDate: 'Sun Nov 1',
    dayOfWeek: 'Sun',
    dayNumber: undefined,
    isBuffer: true,
    isTestDay: false,
    studyTimeMinutes: 0,
    breakTimeMinutes: 0,
    totalTimeMinutes: 0,
    specialInstructions: 'REST DAY: Full day off, no studying. Guaranteed mental reset.',
    tasks: [
      {
        id: 'rest-2026-11-01',
        label: 'REST DAY: Full day off, no studying',
        subject: 'buffer',
        code: 'REST',
        topic: 'Mental Reset',
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-02',
    formattedDate: 'Mon Nov 2',
    dayOfWeek: 'Mon',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 45,
    breakTimeMinutes: 0,
    totalTimeMinutes: 45,
    specialInstructions: 'Error-log review of Test #3 + simulate exact test-day timing (45 min): Write down every wrong question and why, across both Math and Reading & Writing.',
    tasks: [
      {
        id: 'w8-d1-1',
        label: 'Error-log review of Test #3 + simulate exact test-day timing (45 min)',
        subject: 'review',
        code: 'AUTOPSY',
        topic: 'Test #3 Error-Log Review & Timing Calibration',
        timeSlot: '6:30 PM - 7:15 PM',
        durationMinutes: 45,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-03',
    formattedDate: 'Tue Nov 3',
    dayOfWeek: 'Tue',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 30,
    breakTimeMinutes: 0,
    totalTimeMinutes: 30,
    specialInstructions: 'Light taper, review error notebook + grammar rules (30 min): No heavy problem sets, gentle reinforcement.',
    tasks: [
      {
        id: 'w8-d2-1',
        label: 'Light taper, review error notebook + grammar rules (30 min)',
        subject: 'review',
        code: 'LIGHT TAPER',
        topic: 'Error Notebook & Grammar Traps Refresh',
        timeSlot: '6:30 PM - 7:00 PM',
        durationMinutes: 30,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-04',
    formattedDate: 'Wed Nov 4',
    dayOfWeek: 'Wed',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 20,
    breakTimeMinutes: 0,
    totalTimeMinutes: 20,
    specialInstructions: 'Verify Bluebook app, admission ticket, ID (20 min): Ensure device is updated, admission ticket printed, ID ready.',
    tasks: [
      {
        id: 'w8-d3-1',
        label: 'Verify Bluebook app, admission ticket, ID (20 min)',
        subject: 'logistics',
        code: 'LOGISTICS',
        topic: 'Bluebook App Verification & Admission Ticket Check',
        timeSlot: '6:30 PM - 6:50 PM',
        durationMinutes: 20,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-05',
    formattedDate: 'Thu Nov 5',
    dayOfWeek: 'Thu',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: false,
    studyTimeMinutes: 20,
    breakTimeMinutes: 0,
    totalTimeMinutes: 20,
    specialInstructions: 'Very light review, then pack bag (20 min): Re-read top 5 rules, pack bag with ID/Smart CNIC, charger, snacks, calculator.',
    tasks: [
      {
        id: 'w8-d4-1',
        label: 'Very light review, then pack bag (20 min)',
        subject: 'logistics',
        code: 'BAG PACKOUT',
        topic: 'Formula Checklist & Exam Bag Packing',
        timeSlot: '6:30 PM - 6:50 PM',
        durationMinutes: 20,
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-06',
    formattedDate: 'Fri Nov 6',
    dayOfWeek: 'Fri',
    dayNumber: undefined,
    isBuffer: true,
    isTestDay: false,
    studyTimeMinutes: 0,
    breakTimeMinutes: 0,
    totalTimeMinutes: 0,
    specialInstructions: 'FULL REST. No studying. Sleep early. Relax, hydrate, eat well, and sleep early.',
    tasks: [
      {
        id: 'w8-d5-1',
        label: 'FULL REST. No studying. Sleep early',
        subject: 'buffer',
        code: 'REST',
        topic: 'Full Rest & Pre-Exam Sleep Curfew',
        completed: false
      }
    ]
  },
  {
    dateStr: '2026-11-07',
    formattedDate: 'Sat Nov 7',
    dayOfWeek: 'Sat',
    dayNumber: undefined,
    isBuffer: false,
    isTestDay: true,
    studyTimeMinutes: 144,
    breakTimeMinutes: 10,
    totalTimeMinutes: 154,
    specialInstructions: 'Sat Nov 7 -- EXAM DAY: Follow your official admission ticket reporting time exactly. Arrive at Crescent Model School, Shadman Lahore by 7:15 AM sharp (gates lock at 7:45 AM).',
    tasks: [
      {
        id: 'sat-exam-day',
        label: 'EXAM DAY: Follow your official admission ticket reporting time exactly',
        subject: 'test',
        code: 'OFFICIAL SAT',
        topic: 'Official Digital SAT Exam',
        timeSlot: '7:15 AM arrival',
        durationMinutes: 144,
        completed: false
      }
    ]
  }
];

// Combine all 55 days
const allDaysCombined = [...parsedDays, ...phase2Days];
allDaysCombined.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

// Weeks metadata definitions
const WEEKS_META = [
  {
    id: 'week-1',
    weekNumber: 1,
    title: 'Week 1: Problem Solving & Advanced Math Foundations',
    dateRange: 'Sep 14 to Sep 20',
    subtitle: 'Ratios, unit conversions, percentages, data distributions & R&W launch.',
    phase: 'foundations',
    startDate: '2026-09-14',
    endDate: '2026-09-20'
  },
  {
    id: 'week-2',
    weekNumber: 2,
    title: 'Week 2: Foundations Mastery & Pure Content Study',
    dateRange: 'Sep 21 to Sep 27',
    subtitle: 'Linear equations, systems, right triangles & pure content study.',
    phase: 'foundations',
    startDate: '2026-09-21',
    endDate: '2026-09-27'
  },
  {
    id: 'week-3',
    weekNumber: 3,
    title: 'Week 3: Medium Tier Acceleration & Synthesis',
    dateRange: 'Sep 28 to Oct 04',
    subtitle: 'Medium tier Khan lessons, rhetorical synthesis & boundaries.',
    phase: 'foundations',
    startDate: '2026-09-28',
    endDate: '2026-10-04'
  },
  {
    id: 'week-4',
    weekNumber: 4,
    title: 'Week 4: Challenge Unit Completion & All R&W Complete',
    dateRange: 'Oct 05 to Oct 11',
    subtitle: 'Challenge Unit finished on Oct 3; All Reading & Writing 100% finished on Thu Oct 8!',
    phase: 'foundations',
    startDate: '2026-10-05',
    endDate: '2026-10-11'
  },
  {
    id: 'week-5',
    weekNumber: 5,
    title: 'Week 5: Advanced Math Climax (Units 11 & 12)',
    dateRange: 'Oct 12 to Oct 18',
    subtitle: 'Advanced Math units: Data inferences, polynomial operations & quadratic systems.',
    phase: 'foundations',
    startDate: '2026-10-12',
    endDate: '2026-10-18'
  },
  {
    id: 'week-6',
    weekNumber: 6,
    title: 'Week 6: All Math Complete & Phase 2 Testing Launch',
    dateRange: 'Oct 19 to Oct 25',
    subtitle: 'All Math finished on Tue Oct 20; Full Bluebook Test #1 on Wed Oct 21.',
    phase: 'bluebook',
    startDate: '2026-10-19',
    endDate: '2026-10-25'
  },
  {
    id: 'week-7',
    weekNumber: 7,
    title: 'Week 7: Practice Tests #2 & #3 Simulations',
    dateRange: 'Oct 26 to Nov 01',
    subtitle: 'Full Bluebook Test #2 on Tue Oct 27 and Final Test #3 on Sat Oct 31.',
    phase: 'bluebook',
    startDate: '2026-10-26',
    endDate: '2026-11-01'
  },
  {
    id: 'week-8',
    weekNumber: 8,
    title: 'Week 8: Test #3 Autopsy, Taper Protocol & Official SAT Exam Day',
    dateRange: 'Nov 02 to Nov 07',
    subtitle: 'Test #3 error review, light taper, logistics check, bag packout, full rest & Sat Nov 7 Exam Day.',
    phase: 'exam',
    startDate: '2026-11-02',
    endDate: '2026-11-07'
  }
];

const studyPlanWeeks = [];

for (const wMeta of WEEKS_META) {
  const weekDays = allDaysCombined.filter(d => d.dateStr >= wMeta.startDate && d.dateStr <= wMeta.endDate);
  const formattedDays = weekDays.map(d => ({
    id: d.dateStr,
    dateStr: d.dateStr,
    dayOfWeek: d.dayOfWeek,
    formattedDate: d.formattedDate,
    dayNumber: d.dayNumber,
    weekId: wMeta.id,
    weekNumber: wMeta.weekNumber,
    weekTitle: wMeta.title.replace(/^Week \d+:\s*/, ''),
    phase: wMeta.phase,
    isBuffer: d.isBuffer,
    isTestDay: d.isTestDay,
    studyTimeMinutes: d.studyTimeMinutes,
    breakTimeMinutes: d.breakTimeMinutes,
    totalTimeMinutes: d.totalTimeMinutes,
    specialInstructions: d.specialInstructions,
    tasks: d.tasks
  }));

  studyPlanWeeks.push({
    id: wMeta.id,
    title: wMeta.title,
    dateRange: wMeta.dateRange,
    subtitle: wMeta.subtitle,
    phase: wMeta.phase,
    days: formattedDays
  });
}

// Read packing snippet
const packingSnippet = fs.readFileSync(path.join(__dirname, 'packing_snippet.txt'), 'utf-8');

// Generate the TypeScript file content
const outputContent = `import { WeekPlan, PackingItem } from '../types';

${packingSnippet}
export const STUDY_PLAN_WEEKS: WeekPlan[] = ${JSON.stringify(studyPlanWeeks, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'studyPlan.ts');
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log('Successfully generated STUDY_PLAN_WEEKS with ' + studyPlanWeeks.length + ' weeks!');
for (const w of studyPlanWeeks) {
  console.log('- ' + w.id + ' (' + w.dateRange + '): ' + w.days.length + ' days');
}
console.log('Total days in schedule: ' + allDaysCombined.length);
