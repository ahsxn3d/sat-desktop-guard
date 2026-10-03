import { NextRequest, NextResponse } from 'next/server';
import { processAssessmentSubmission } from '@/lib/mastery';
import { TestType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, testType, targetId, answers } = body;

    if (!userId || !testType || !answers) {
      return NextResponse.json(
        { error: 'userId, testType, and answers dictionary are required' },
        { status: 400 }
      );
    }

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
    console.error('Error submitting assessment:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit assessment' }, { status: 500 });
  }
}
