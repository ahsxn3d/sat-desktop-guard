import { NextRequest, NextResponse } from 'next/server';
import { processAssessmentSubmission } from '@/lib/mastery';
import { submitAssessmentSchema } from '@/lib/validations/user';
import { TestType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Strict Zod schema validation: prevents tampering and malformed payloads
    const parseResult = submitAssessmentSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.issues.map((i) => i.message)
        },
        { status: 400 }
      );
    }

    const { userId, testType, targetId, answers } = parseResult.data;

    // Server-side scoring only: client scores are ignored completely
    const result = await processAssessmentSubmission({
      userId,
      testType: testType as TestType,
      targetId: targetId || '',
      answers
    });

    return NextResponse.json({
      success: true,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      passed: result.passed,
      xpEarned: result.xpEarned,
      streakCount: result.streakCount,
      promotedSkills: result.promotedSkills,
      demotedSkills: result.demotedSkills,
      masteryUpdates: result.masteryUpdates,
      questionResults: result.questionResults
    });
  } catch (error: any) {
    console.error('Error in assessment submit endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Server error evaluating assessment' },
      { status: 500 }
    );
  }
}
