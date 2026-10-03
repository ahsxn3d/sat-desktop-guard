import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase();

    if (!email) {
      // Guest fallback: return empty list or allow local storage handling
      return NextResponse.json({ sessions: [] });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await prisma.aIChatSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('Error fetching AI sessions:', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Please sign in to save your AI chats' }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: session.user.name || undefined,
        image: session.user.image || undefined,
      },
      create: {
        email,
        name: session.user.name || 'Student Scholar',
        image: session.user.image,
        role: (session.user as any).role || 'USER',
      },
    });

    const body = await req.json().catch(() => ({}));
    const { mode = 'plan_modifier', title = 'New Chat' } = body;

    const newSession = await prisma.aIChatSession.create({
      data: {
        userId: user.id,
        mode,
        title,
      },
    });

    return NextResponse.json({ session: newSession });
  } catch (err) {
    console.error('Error creating AI session:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      await prisma.aIChatSession.deleteMany({
        where: { userId: user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting AI sessions:', err);
    return NextResponse.json({ error: 'Failed to delete sessions' }, { status: 500 });
  }
}
