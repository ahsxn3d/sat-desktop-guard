import { prisma } from './prisma';
import { MasteryStatus, TestType, Question } from '@prisma/client';
import { updateUserStreak } from './streak';

export interface AssessmentGenerationResult {
  testType: TestType;
  title: string;
  questions: Array<{
    id: string;
    skillId: string;
    prompt: string;
    options: any;
    hints: string[];
    difficulty: string;
  }>;
  totalQuestions: number;
}

export interface AssessmentSubmissionPayload {
  userId: string;
  testType: TestType;
  targetId: string; // skillId (for practice) or unitId (for diagnostic/unit_test)
  answers: Record<string, string>; // questionId -> selectedOption/solution string
}

export interface AssessmentEvaluationResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  streakCount: number;
  promotedSkills: string[];
  demotedSkills: string[];
  masteryUpdates: Record<string, MasteryStatus>;
  questionResults: Array<{
    questionId: string;
    skillId: string;
    prompt: string;
    userAnswer: string;
    solution: string;
    isCorrect: boolean;
  }>;
}

/**
 * 1. Diagnostic Mode Generator
 * Generates a 15-question mixed assessment across unit skills.
 */
export async function generateDiagnosticAssessment(unitId: string): Promise<AssessmentGenerationResult> {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      lessons: {
        include: {
          skills: {
            include: {
              questions: true
            }
          }
        }
      }
    }
  });

  if (!unit) {
    throw new Error(`Unit with id ${unitId} not found`);
  }

  const allQuestions: Question[] = [];
  unit.lessons.forEach((l) => {
    l.skills.forEach((s) => {
      allQuestions.push(...s.questions);
    });
  });

  // Shuffle questions and select up to 15
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return {
    testType: TestType.DIAGNOSTIC,
    title: `${unit.title} Diagnostic Assessment`,
    questions: selected.map((q) => ({
      id: q.id,
      skillId: q.skillId,
      prompt: q.prompt,
      options: q.options,
      hints: [], // hints hidden during diagnostic
      difficulty: q.difficulty
    })),
    totalQuestions: selected.length
  };
}

/**
 * 2. Practice Mode Generator (4 Questions)
 * Fetches 4 random questions for a specific skillId.
 */
export async function generatePracticeAssessment(skillId: string): Promise<AssessmentGenerationResult> {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    include: { questions: true }
  });

  if (!skill) {
    throw new Error(`Skill with id ${skillId} not found`);
  }

  // Shuffle and pick 4
  const shuffled = [...skill.questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);

  return {
    testType: TestType.PRACTICE,
    title: `${skill.title} Practice Drill`,
    questions: selected.map((q) => ({
      id: q.id,
      skillId: q.skillId,
      prompt: q.prompt,
      options: q.options,
      hints: q.hints, // hints allowed in practice mode
      difficulty: q.difficulty
    })),
    totalQuestions: selected.length
  };
}

/**
 * 3. Unit Test Mode Generator (High-Stakes)
 * Pulls 2 random questions per skill across all skills in the unit.
 */
export async function generateUnitTestAssessment(unitId: string): Promise<AssessmentGenerationResult> {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      lessons: {
        include: {
          skills: {
            include: {
              questions: true
            }
          }
        }
      }
    }
  });

  if (!unit) {
    throw new Error(`Unit with id ${unitId} not found`);
  }

  const selectedQuestions: Question[] = [];

  unit.lessons.forEach((l) => {
    l.skills.forEach((s) => {
      const shuffled = [...s.questions].sort(() => Math.random() - 0.5);
      // Pull 2 random questions per skill
      selectedQuestions.push(...shuffled.slice(0, 2));
    });
  });

  return {
    testType: TestType.UNIT_TEST,
    title: `${unit.title} High-Stakes Unit Test`,
    questions: selectedQuestions.map((q) => ({
      id: q.id,
      skillId: q.skillId,
      prompt: q.prompt,
      options: q.options,
      hints: [], // hints disabled completely in high-stakes test
      difficulty: q.difficulty
    })),
    totalQuestions: selectedQuestions.length
  };
}

/**
 * 4. Master Assessment Processing & State Machine Transition Engine
 * Computes scores, mutates mastery states, demotes on failure, updates streaks, and records test attempt.
 */
export async function processAssessmentSubmission(
  payload: AssessmentSubmissionPayload
): Promise<AssessmentEvaluationResult> {
  const { userId, testType, targetId, answers } = payload;

  const questionIds = Object.keys(answers);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    include: { skill: true }
  });

  let score = 0;
  const questionResults = [];
  const skillAccuracyMap: Record<string, { correct: number; total: number }> = {};

  for (const q of questions) {
    const userAnswer = (answers[q.id] || '').trim();
    const solution = q.solution.trim();

    // Check correctness: either exact match or option matching solution
    const isCorrect = userAnswer.toLowerCase() === solution.toLowerCase();
    if (isCorrect) {
      score++;
    }

    if (!skillAccuracyMap[q.skillId]) {
      skillAccuracyMap[q.skillId] = { correct: 0, total: 0 };
    }
    skillAccuracyMap[q.skillId].total++;
    if (isCorrect) {
      skillAccuracyMap[q.skillId].correct++;
    }

    questionResults.push({
      questionId: q.id,
      skillId: q.skillId,
      prompt: q.prompt,
      userAnswer,
      solution: q.solution,
      isCorrect
    });
  }

  const totalQuestions = questions.length || 1;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = testType === 'DIAGNOSTIC' ? percentage >= 70 : percentage >= 80;

  // Retrieve current masteries for affected skills
  const testedSkillIds = Object.keys(skillAccuracyMap);
  const currentMasteries = await prisma.userMastery.findMany({
    where: {
      userId,
      skillId: { in: testedSkillIds }
    }
  });

  const masteryMap = new Map(currentMasteries.map((m) => [m.skillId, m.status]));
  const promotedSkills: string[] = [];
  const demotedSkills: string[] = [];
  const masteryUpdates: Record<string, MasteryStatus> = {};

  // Apply Khan Academy State Machine Progression Rules
  for (const skillId of testedSkillIds) {
    const currentStatus = masteryMap.get(skillId) || MasteryStatus.NOT_STARTED;
    const { correct, total } = skillAccuracyMap[skillId];
    const skillPct = (correct / total) * 100;
    let nextStatus = currentStatus;

    if (testType === TestType.DIAGNOSTIC) {
      // 1. Diagnostic Mode: If accuracy > 70%, mark relevant skills as FAMILIAR
      if (skillPct >= 70) {
        if (currentStatus === MasteryStatus.NOT_STARTED || currentStatus === MasteryStatus.ATTEMPTED) {
          nextStatus = MasteryStatus.FAMILIAR;
          promotedSkills.push(skillId);
        }
      } else {
        if (currentStatus === MasteryStatus.NOT_STARTED) {
          nextStatus = MasteryStatus.ATTEMPTED;
        }
      }
    } else if (testType === TestType.PRACTICE) {
      // 2. Practice Mode: If student scores 4/4 (100%), promote skill to PROFICIENT
      if (score === totalQuestions && totalQuestions >= 4) {
        if (currentStatus !== MasteryStatus.MASTERED) {
          nextStatus = MasteryStatus.PROFICIENT;
          promotedSkills.push(skillId);
        }
      } else if (skillPct >= 70) {
        if (currentStatus === MasteryStatus.NOT_STARTED || currentStatus === MasteryStatus.ATTEMPTED) {
          nextStatus = MasteryStatus.FAMILIAR;
        }
      } else {
        if (currentStatus === MasteryStatus.NOT_STARTED) {
          nextStatus = MasteryStatus.ATTEMPTED;
        }
      }
    } else if (testType === TestType.UNIT_TEST || testType === TestType.QUIZ) {
      // 3. Unit Test Mode (High-Stakes):
      // If overall score >= 80%: promote all participating PROFICIENT skills to MASTERED
      if (percentage >= 80) {
        if (currentStatus === MasteryStatus.PROFICIENT) {
          nextStatus = MasteryStatus.MASTERED;
          promotedSkills.push(skillId);
        } else if (currentStatus === MasteryStatus.FAMILIAR || currentStatus === MasteryStatus.ATTEMPTED) {
          nextStatus = MasteryStatus.PROFICIENT;
          promotedSkills.push(skillId);
        }
      }

      // If a student misses questions on a currently MASTERED skill: demote back to PROFICIENT or FAMILIAR
      if (correct < total) {
        if (currentStatus === MasteryStatus.MASTERED) {
          nextStatus = MasteryStatus.PROFICIENT;
          demotedSkills.push(skillId);
        } else if (currentStatus === MasteryStatus.PROFICIENT) {
          nextStatus = MasteryStatus.FAMILIAR;
          demotedSkills.push(skillId);
        }
      }
    }

    masteryUpdates[skillId] = nextStatus;

    // Persist to UserMastery in PostgreSQL
    await prisma.userMastery.upsert({
      where: {
        userId_skillId: { userId, skillId }
      },
      update: { status: nextStatus },
      create: {
        userId,
        skillId,
        status: nextStatus
      }
    });
  }

  // Record TestAttempt
  await prisma.testAttempt.create({
    data: {
      userId,
      testType,
      score,
      totalQuestions,
      passed
    }
  });

  // Habit Engine: Update user streak in PostgreSQL
  let streakCount = 1;
  try {
    const streakResult = await updateUserStreak(userId);
    streakCount = streakResult.streakCount;
  } catch (e) {
    console.error('Streak update failed:', e);
  }

  // Calculate XP points: 100 XP per correct question + 500 bonus for 100%
  let xpEarned = score * 100;
  if (percentage === 100) xpEarned += 500;
  if (passed && testType === TestType.UNIT_TEST) xpEarned += 1000;

  return {
    score,
    totalQuestions,
    percentage,
    passed,
    xpEarned,
    streakCount,
    promotedSkills,
    demotedSkills,
    masteryUpdates,
    questionResults
  };
}
