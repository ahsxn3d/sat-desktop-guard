import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        masteries: {
          include: {
            skill: {
              select: { title: true, slug: true }
            }
          }
        },
        testAttempts: {
          orderBy: { createdAt: 'desc' }
        },
        progress: true,
        errorLogs: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        streakCount: user.streakCount,
        lastActiveDate: user.lastActiveDate
      },
      settings: user.progress,
      masteryRecords: user.masteries.map((m) => ({
        skillTitle: m.skill.title,
        skillSlug: m.skill.slug,
        status: m.status,
        updatedAt: m.updatedAt
      })),
      testAttempts: user.testAttempts,
      errorLogsCount: user.errorLogs.length
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="sat-progress-export-${userId}.json"`
      }
    });
  } catch (error: any) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
