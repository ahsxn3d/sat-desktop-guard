import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateSettingsSchema } from '@/lib/validations/user';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { progress: true }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        settings: {
          name: 'Ahsan Javed',
          email: 'muhammadahsanjaved09@gmail.com',
          targetScore: 1550,
          examDate: '2026-11-07',
          anchorTime: '20:30',
          streakCount: 1
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        name: user.name || 'SAT Scholar',
        email: user.email,
        targetScore: user.progress?.targetScore || 1550,
        examDate: user.progress?.examDate || '2026-11-07',
        anchorTime: user.progress?.anchorTime || '20:30',
        streakCount: user.streakCount
      }
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message || 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, ...settingsPayload } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const parsed = updateSettingsSchema.safeParse(settingsPayload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid settings data', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Update user display name if provided
    if (data.displayName) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.displayName }
      });
    }

    // Upsert UserProgress record
    const updatedProgress = await prisma.userProgress.upsert({
      where: { userId },
      update: {
        targetScore: data.targetScore,
        examDate: data.targetDate
      },
      create: {
        userId,
        targetScore: data.targetScore || 1550,
        examDate: data.targetDate || '2026-11-07'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      progress: updatedProgress
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
