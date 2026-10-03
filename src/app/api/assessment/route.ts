import { NextRequest, NextResponse } from 'next/server';
import {
  generateDiagnosticAssessment,
  generatePracticeAssessment,
  generateUnitTestAssessment,
  processAssessmentSubmission
} from '@/lib/mastery';
import { TestType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') || 'practice').toUpperCase();
    const skillId = searchParams.get('skillId');
    const unitId = searchParams.get('unitId');

    if (type === 'PRACTICE') {
      if (!skillId) {
        return NextResponse.json({ error: 'skillId is required for PRACTICE mode' }, { status: 400 });
      }
      const data = await generatePracticeAssessment(skillId);
      return NextResponse.json({ success: true, data });
    }

    if (type === 'UNIT_TEST') {
      if (!unitId) {
        return NextResponse.json({ error: 'unitId is required for UNIT_TEST mode' }, { status: 400 });
      }
      const data = await generateUnitTestAssessment(unitId);
      return NextResponse.json({ success: true, data });
    }

    if (type === 'DIAGNOSTIC') {
      if (!unitId) {
        return NextResponse.json({ error: 'unitId is required for DIAGNOSTIC mode' }, { status: 400 });
      }
      const data = await generateDiagnosticAssessment(unitId);
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Invalid assessment type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error generating assessment:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

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

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error processing assessment submission:', error);
    return NextResponse.json({ error: error.message || 'Failed to process assessment' }, { status: 500 });
  }
}
