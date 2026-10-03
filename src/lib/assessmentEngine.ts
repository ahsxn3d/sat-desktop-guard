// src/lib/assessmentEngine.ts
// Khan Academy 4-Mode Assessment Pipeline Engine
// Practice Sets (4 Qs) -> Quizzes (5-10 Qs) -> Unit Tests (10-20 Qs) -> Course Challenge (30 Qs)

import { KhanQuestion, getQuestionsForLesson, getQuestionsForUnit } from '../data/khanQuestionBank';
import { recordPracticeSetResult, recordQuizBatchResult, recordAssessmentSkillResults, SkillMasteryState } from './masteryEngine';
import { recordUserActivity } from './streakEngine';
import { awardEnergyPoints } from './energyPoints';

export type AssessmentMode = 'practice' | 'quiz' | 'unit_test' | 'course_challenge';

export interface AssessmentConfig {
  mode: AssessmentMode;
  targetId: string; // lessonCode e.g. "Math U2.1", or unitNumber e.g. "math-2", or "sat-math"
  title: string;
  subject: 'math' | 'rw';
  questionCount: number;
  hintsAllowed: boolean;
  instantFeedback: boolean; // true for Practice; false for Quiz/Unit Test/Course Challenge
  scratchpadAllowed: boolean;
  desmosAllowed: boolean;
  referenceSheetAllowed: boolean;
}

export function getAssessmentConfig(mode: AssessmentMode, targetId: string, title: string, subject: 'math' | 'rw'): AssessmentConfig {
  switch (mode) {
    case 'practice':
      return {
        mode: 'practice',
        targetId,
        title,
        subject,
        questionCount: 4,
        hintsAllowed: true,
        instantFeedback: true,
        scratchpadAllowed: true,
        desmosAllowed: subject === 'math',
        referenceSheetAllowed: subject === 'math'
      };
    case 'quiz':
      return {
        mode: 'quiz',
        targetId,
        title: title || 'Checkpoint Quiz',
        subject,
        questionCount: 6,
        hintsAllowed: false,
        instantFeedback: false,
        scratchpadAllowed: true,
        desmosAllowed: subject === 'math',
        referenceSheetAllowed: subject === 'math'
      };
    case 'unit_test':
      return {
        mode: 'unit_test',
        targetId,
        title: title || 'High-Stakes Unit Test',
        subject,
        questionCount: 12,
        hintsAllowed: false,
        instantFeedback: false,
        scratchpadAllowed: true,
        desmosAllowed: subject === 'math',
        referenceSheetAllowed: subject === 'math'
      };
    case 'course_challenge':
      return {
        mode: 'course_challenge',
        targetId,
        title: title || 'Full Course Challenge',
        subject,
        questionCount: 30,
        hintsAllowed: false,
        instantFeedback: false,
        scratchpadAllowed: true,
        desmosAllowed: subject === 'math',
        referenceSheetAllowed: subject === 'math'
      };
  }
}

export interface AssessmentSubmissionResult {
  score: number;
  total: number;
  percentage: number;
  energyPointsEarned: number;
  promotedSkills: string[];
  demotedSkills: string[];
  summaryMessage: string;
}

export function finalizeAssessmentRun(
  config: AssessmentConfig,
  questions: KhanQuestion[],
  userAnswers: Record<number, number> // questionIndex -> selectedOptionIndex
): AssessmentSubmissionResult {
  let score = 0;
  const skillResults: Array<{ skillId: string; isCorrect: boolean; title?: string }> = [];

  questions.forEach((q, idx) => {
    const isCorrect = userAnswers[idx] === q.correctIndex;
    if (isCorrect) score++;
    skillResults.push({
      skillId: q.lessonCode,
      isCorrect,
      title: q.lessonCode
    });
  });

  const percentage = Math.round((score / questions.length) * 100);
  let promoted: string[] = [];
  let demoted: string[] = [];

  if (config.mode === 'practice') {
    const res = recordPracticeSetResult(config.targetId, score, questions.length, config.title);
    if (res.level === 'proficient' || res.level === 'mastered') {
      promoted.push(config.targetId);
    }
  } else if (config.mode === 'quiz') {
    const quizMap: Record<string, { correct: boolean; title?: string }> = {};
    skillResults.forEach((s) => {
      quizMap[s.skillId] = { correct: s.isCorrect, title: s.title };
    });
    recordQuizBatchResult(quizMap);
  } else {
    // Unit Test or Course Challenge: High Stakes Gatekeeper (Promotions & Demotions)
    const outcome = recordAssessmentSkillResults(skillResults);
    promoted = outcome.promotedSkills;
    demoted = outcome.demotedSkills;
  }

  // Energy points calculation:
  // 100 pts per correct problem + 500 bonus for perfect practice + 1000 for unit test pass
  let pointsAwarded = score * 100;
  if (percentage === 100 && config.mode === 'practice') pointsAwarded += 500;
  if (percentage >= 80 && config.mode === 'unit_test') pointsAwarded += 1000;
  if (percentage >= 80 && config.mode === 'course_challenge') pointsAwarded += 3000;

  awardEnergyPoints(pointsAwarded, `${config.title} (${config.mode})`);
  recordUserActivity('exercise_complete');

  let summaryMessage = `You completed ${config.title} with ${score}/${questions.length} correct (${percentage}%).`;
  if (percentage === 100) {
    summaryMessage = `PERFECT 100% MASTERY! Outstanding performance across all tested objectives.`;
  } else if (percentage >= 80) {
    summaryMessage = `PROFICIENT GATEWAY UNLOCKED! High performance achieved.`;
  }

  return {
    score,
    total: questions.length,
    percentage,
    energyPointsEarned: pointsAwarded,
    promotedSkills: promoted,
    demotedSkills: demoted,
    summaryMessage
  };
}
