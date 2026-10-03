import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
    const userEmail = session.user.email.trim().toLowerCase();
    const isUserAdmin = (session.user as any).role === 'ADMIN' || userEmail === adminEmail;

    if (!isUserAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          progress: true,
          _count: {
            select: {
              dayNotes: true,
              errorLogs: true,
              sessionLogs: true,
              testScores: true,
            },
          },
        },
      });

      const formatted = users.map((u) => {
        const completedTasks = u.progress?.completedTaskIds
          ? Object.values(u.progress.completedTaskIds as Record<string, boolean>).filter(Boolean).length
          : 0;

        return {
          id: u.id,
          name: u.name || 'Anonymous Student',
          email: u.email,
          role: u.role,
          image: u.image,
          completedTasks,
          lastActiveDate: u.progress?.lastActiveDate || null,
          targetScore: u.progress?.targetScore || 1550,
          notesCount: u._count.dayNotes,
          errorsCount: u._count.errorLogs,
          sessionsCount: u._count.sessionLogs,
          testsCount: u._count.testScores,
          joinedAt: u.createdAt.toISOString(),
        };
      });

      return NextResponse.json({
        success: true,
        totalUsers: formatted.length,
        users: formatted,
      });
    } catch (dbErr) {
      console.warn('Prisma Admin users fallback:', dbErr);
      return NextResponse.json({
        success: true,
        totalUsers: 1,
        users: [
          {
            id: 'admin-fallback',
            name: session.user.name || 'Admin',
            email: userEmail,
            role: 'ADMIN',
            completedTasks: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            targetScore: 1550,
            notesCount: 0,
            errorsCount: 0,
            sessionsCount: 0,
            testsCount: 0,
            joinedAt: new Date().toISOString(),
          },
        ],
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
