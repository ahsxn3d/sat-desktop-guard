import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteAccountSchema } from '@/lib/validations/user';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = deleteAccountSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Confirmation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    // Permanently delete user and cascaded records
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Account and associated records permanently purged'
    });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: error.message || 'Deletion failed' }, { status: 500 });
  }
}
