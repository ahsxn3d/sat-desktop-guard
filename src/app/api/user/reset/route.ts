import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resetProgressSchema } from '@/lib/validations/user';
import { MasteryStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = resetProgressSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    // Reset all user masteries to NOT_STARTED
    const updateResult = await prisma.userMastery.updateMany({
      where: { userId },
      data: { status: MasteryStatus.NOT_STARTED }
    });

    return NextResponse.json({
      success: true,
      message: 'Course progress successfully reset to zero',
      skillsResetCount: updateResult.count
    });
  } catch (error: any) {
    console.error('Error resetting progress:', error);
    return NextResponse.json({ error: error.message || 'Reset failed' }, { status: 500 });
  }
}
