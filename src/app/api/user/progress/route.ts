import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// In-memory fallback cache when PostgreSQL is not yet started or during initial setup
const inMemoryProgressStore: Record<string, any> = {};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();

    // Try reading from Prisma DB
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          progress: true,
          dayNotes: true,
          errorLogs: {
            orderBy: { createdAt: 'desc' },
          },
          sessionLogs: true,
          testScores: true,
          packingItems: true,
          cheatCodeBookmarks: true,
          stuckConcepts: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (user) {
        const dayNotesMap: Record<string, string> = {};
        user.dayNotes?.forEach((n) => {
          dayNotesMap[n.dateStr] = n.notes;
        });

        const sessionTimingsMap: Record<string, any> = {};
        user.sessionLogs?.forEach((s) => {
          sessionTimingsMap[s.dateStr] = (s.details as any) || {
            dateStr: s.dateStr,
            dayTitle: s.dayTitle || undefined,
            completedAt: s.completedAt.toISOString(),
            math: {
              allocatedMinutes: 45,
              actualMinutes: Math.round(s.phase1Seconds / 60),
              actualSeconds: s.phase1Seconds,
              rating: s.overallRating || 'perfect',
              ratingLabel: 'Pacing Recorded',
              ratingDescription: '',
              badgeBg: 'bg-emerald-500/10',
              badgeText: 'text-emerald-400',
              badgeBorder: 'border-emerald-500/30',
            },
            totalSessionMinutes: s.totalMinutes || Math.round(s.totalSeconds / 60),
            overallRating: s.overallRating || 'perfect',
          };
        });

        const formattedErrorLogs = user.errorLogs?.map((e) => ({
          id: e.id,
          date: e.date || e.createdAt.toISOString().split('T')[0],
          testOrSection: e.testOrSection,
          questionRef: e.questionRef,
          domain: e.domain,
          whyMissed: e.whyMissed,
          takeawayRule: e.takeawayRule,
          reviewed: e.reviewed,
          createdAt: e.createdAt.getTime(),
        })) || [];

        const testScoresMap: Record<string, any> = {};
        user.testScores?.forEach((ts) => {
          const idMap: Record<number, string> = {
            1: 'bluebook-test-1',
            2: 'bluebook-test-2',
            3: 'bluebook-test-3',
            4: 'bluebook-test-4',
            5: 'w9-d1-2',
          };
          const testId = idMap[ts.testNumber] || `test-${ts.testNumber}`;
          testScoresMap[testId] = {
            testId,
            testName: ts.testName,
            date: ts.dateTaken,
            targetTotal: 1500,
            targetMath: 780,
            targetRW: 720,
            mathScore: ts.mathScore || 0,
            rwScore: ts.rwScore || 0,
            totalScore: ts.totalScore || 0,
            contentMistakes: 0,
            carelessMistakes: 0,
            timeMistakes: 0,
            notes: ts.notes || '',
            updatedAt: ts.updatedAt.toISOString(),
          };
        });

        const formattedStuckConcepts = user.stuckConcepts?.map((sc) => ({
          id: sc.id,
          dateStr: sc.dateStr,
          dayNumber: sc.dayNumber ?? undefined,
          lessonCode: sc.lessonCode,
          lessonTitle: sc.lessonTitle,
          chapter: sc.chapter,
          conceptFormula: sc.conceptFormula,
          notes: sc.notes,
          takeawayRule: sc.takeawayRule || undefined,
          errorLogId: sc.errorLogId || undefined,
          resolved: sc.resolved,
          createdAt: sc.createdAt.getTime(),
        })) || [];

        return NextResponse.json({
          source: 'database',
          completedTaskIds: user.progress?.completedTaskIds || {},
          taskCompletionDays: user.progress?.taskCompletionDays || {},
          taskScheduleOverrides: user.progress?.taskScheduleOverrides || {},
          packingList: user.progress?.packingList || null,
          anchorTime: user.progress?.anchorTime || '20:30',
          dayNotes: dayNotesMap,
          errorLogs: formattedErrorLogs,
          sessionTimings: sessionTimingsMap,
          mockTestScores: testScoresMap,
          stuckConcepts: formattedStuckConcepts,
          targetScore: user.progress?.targetScore || 1550,
          examDate: user.progress?.examDate || '2026-11-07',
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB query fallback to memory:', dbErr instanceof Error ? dbErr.message : dbErr);
    }

    // Memory fallback
    const cached = inMemoryProgressStore[email] || {
      completedTaskIds: {},
      taskCompletionDays: {},
      packingList: null,
      anchorTime: '20:30',
      dayNotes: {},
      errorLogs: [],
      sessionTimings: {},
    };

    return NextResponse.json({
      source: 'memory-fallback',
      ...cached,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const body = await req.json();
    const {
      completedTaskIds,
      taskCompletionDays,
      taskScheduleOverrides,
      packingList,
      anchorTime,
      dayNotes,
      errorLogs,
      sessionTimings,
      mockTestScores,
      stuckConcepts,
      lastActiveDate,
      targetScore,
      examDate,
    } = body;

    // Update in-memory fallback store
    inMemoryProgressStore[email] = {
      completedTaskIds: completedTaskIds || {},
      taskCompletionDays: taskCompletionDays || {},
      taskScheduleOverrides: taskScheduleOverrides || {},
      packingList: packingList || null,
      anchorTime: anchorTime || '20:30',
      dayNotes: dayNotes || {},
      errorLogs: errorLogs || [],
      sessionTimings: sessionTimings || {},
      mockTestScores: mockTestScores || inMemoryProgressStore[email]?.mockTestScores || {},
      stuckConcepts: stuckConcepts || inMemoryProgressStore[email]?.stuckConcepts || [],
      lastActiveDate: lastActiveDate || new Date().toISOString().split('T')[0],
      targetScore: targetScore || 1550,
      examDate: examDate || '2026-11-07',
      updatedAt: new Date().toISOString(),
    };

    // Try persisting to Prisma DB
    try {
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

      // 1. Persist User Progress
      if (completedTaskIds !== undefined || packingList !== undefined || taskCompletionDays !== undefined || taskScheduleOverrides !== undefined) {
        await prisma.userProgress.upsert({
          where: { userId: user.id },
          update: {
            completedTaskIds: completedTaskIds ?? undefined,
            taskCompletionDays: taskCompletionDays ?? undefined,
            taskScheduleOverrides: taskScheduleOverrides ?? undefined,
            packingList: packingList ?? undefined,
            anchorTime: anchorTime ?? undefined,
            targetScore: targetScore ?? undefined,
            examDate: examDate ?? undefined,
            lastActiveDate: lastActiveDate || new Date().toISOString().split('T')[0],
          },
          create: {
            userId: user.id,
            completedTaskIds: completedTaskIds || {},
            taskCompletionDays: taskCompletionDays || {},
            taskScheduleOverrides: taskScheduleOverrides || {},
            packingList: packingList || [],
            anchorTime: anchorTime || '20:30',
            targetScore: targetScore || 1550,
            examDate: examDate || '2026-11-07',
            lastActiveDate: lastActiveDate || new Date().toISOString().split('T')[0],
          },
        });
      }

      // 2. Persist Day Notes
      if (dayNotes && typeof dayNotes === 'object') {
        for (const [dateStr, noteText] of Object.entries(dayNotes as Record<string, string>)) {
          if (dateStr && typeof noteText === 'string') {
            await prisma.userDayNote.upsert({
              where: {
                userId_dateStr: {
                  userId: user.id,
                  dateStr: dateStr,
                },
              },
              update: {
                notes: noteText,
              },
              create: {
                userId: user.id,
                dateStr: dateStr,
                notes: noteText,
              },
            });
          }
        }
      }

      // 3. Persist Error Logs
      if (Array.isArray(errorLogs)) {
        for (const err of errorLogs) {
          if (err && err.testOrSection && err.questionRef) {
            try {
              if (err.id && !err.id.startsWith('err-temp')) {
                await prisma.userErrorLog.upsert({
                  where: { id: err.id },
                  update: {
                    date: err.date || undefined,
                    testOrSection: err.testOrSection,
                    questionRef: err.questionRef,
                    domain: err.domain || 'Math',
                    whyMissed: err.whyMissed || '',
                    takeawayRule: err.takeawayRule || '',
                    reviewed: Boolean(err.reviewed),
                  },
                  create: {
                    id: err.id,
                    userId: user.id,
                    date: err.date || new Date().toISOString().split('T')[0],
                    testOrSection: err.testOrSection,
                    questionRef: err.questionRef,
                    domain: err.domain || 'Math',
                    whyMissed: err.whyMissed || '',
                    takeawayRule: err.takeawayRule || '',
                    reviewed: Boolean(err.reviewed),
                  },
                });
              } else {
                await prisma.userErrorLog.create({
                  data: {
                    userId: user.id,
                    date: err.date || new Date().toISOString().split('T')[0],
                    testOrSection: err.testOrSection,
                    questionRef: err.questionRef,
                    domain: err.domain || 'Math',
                    whyMissed: err.whyMissed || '',
                    takeawayRule: err.takeawayRule || '',
                    reviewed: Boolean(err.reviewed),
                  },
                });
              }
            } catch (errLogErr) {
              console.warn('Error log save item failed:', errLogErr);
            }
          }
        }
      }

      // 4. Persist Session Logs & Pacing Ratings
      if (sessionTimings && typeof sessionTimings === 'object') {
        for (const [dateStr, timing] of Object.entries(sessionTimings as Record<string, any>)) {
          if (timing && dateStr) {
            const p1Sec = timing.math?.actualSeconds ?? 0;
            const brkSec = timing.breakTime?.actualSeconds ?? 0;
            const p2Sec = timing.rw?.actualSeconds ?? 0;
            const totSec = p1Sec + brkSec + p2Sec;
            const totMin = timing.totalSessionMinutes ?? Math.round(totSec / 60);
            const rating = timing.overallRating ?? 'perfect';

            await prisma.userSessionLog.upsert({
              where: {
                userId_dateStr: {
                  userId: user.id,
                  dateStr: dateStr,
                },
              },
              update: {
                dayTitle: timing.dayTitle || undefined,
                phase1Seconds: p1Sec,
                breakSeconds: brkSec,
                phase2Seconds: p2Sec,
                totalSeconds: totSec,
                totalMinutes: totMin,
                overallRating: rating,
                details: timing,
                completedAt: timing.completedAt ? new Date(timing.completedAt) : new Date(),
              },
              create: {
                userId: user.id,
                dateStr: dateStr,
                dayTitle: timing.dayTitle || undefined,
                phase1Seconds: p1Sec,
                breakSeconds: brkSec,
                phase2Seconds: p2Sec,
                totalSeconds: totSec,
                totalMinutes: totMin,
                overallRating: rating,
                details: timing,
                completedAt: timing.completedAt ? new Date(timing.completedAt) : new Date(),
              },
            });
          }
        }
      }

      // 5. Persist Mock Test Scores
      if (mockTestScores && typeof mockTestScores === 'object') {
        const numberMap: Record<string, number> = {
          'bluebook-test-1': 1,
          'bluebook-test-2': 2,
          'bluebook-test-3': 3,
          'bluebook-test-4': 4,
          'w2-diag-1': 1,
          'p2-test-2': 2,
          'p2-test-3': 3,
          'p2-test-4': 4,
          'w9-d1-2': 5,
        };

        for (const [testId, scoreData] of Object.entries(mockTestScores as Record<string, any>)) {
          const testNum = numberMap[testId] || 1;
          if (scoreData && typeof scoreData === 'object') {
            try {
              await prisma.bluebookTestScore.upsert({
                where: {
                  userId_testNumber: {
                    userId: user.id,
                    testNumber: testNum,
                  },
                },
                update: {
                  testName: scoreData.testName || `Practice Test #${testNum}`,
                  dateTaken: scoreData.date || new Date().toISOString().split('T')[0],
                  mathScore: scoreData.mathScore ?? undefined,
                  rwScore: scoreData.rwScore ?? undefined,
                  totalScore: scoreData.totalScore ?? undefined,
                  notes: scoreData.notes ?? undefined,
                  completed: true,
                },
                create: {
                  userId: user.id,
                  testNumber: testNum,
                  testName: scoreData.testName || `Practice Test #${testNum}`,
                  dateTaken: scoreData.date || new Date().toISOString().split('T')[0],
                  mathScore: scoreData.mathScore ?? null,
                  rwScore: scoreData.rwScore ?? null,
                  totalScore: scoreData.totalScore ?? null,
                  notes: scoreData.notes ?? null,
                  completed: true,
                },
              });
            } catch (tsErr) {
              console.warn(`Failed to upsert test score #${testNum}:`, tsErr);
            }
          }
        }
      }

      // 6. Persist Stuck Concepts
      if (Array.isArray(stuckConcepts)) {
        for (const sc of stuckConcepts) {
          if (sc && (sc.lessonCode || sc.conceptFormula)) {
            try {
              if (sc.id && !sc.id.startsWith('stuck-temp')) {
                await prisma.userStuckConcept.upsert({
                  where: { id: sc.id },
                  update: {
                    dateStr: sc.dateStr || '',
                    dayNumber: sc.dayNumber ?? null,
                    lessonCode: sc.lessonCode || '',
                    lessonTitle: sc.lessonTitle || '',
                    chapter: sc.chapter || '',
                    conceptFormula: sc.conceptFormula || '',
                    notes: sc.notes || '',
                    takeawayRule: sc.takeawayRule || null,
                    errorLogId: sc.errorLogId || null,
                    resolved: Boolean(sc.resolved),
                  },
                  create: {
                    id: sc.id,
                    userId: user.id,
                    dateStr: sc.dateStr || '',
                    dayNumber: sc.dayNumber ?? null,
                    lessonCode: sc.lessonCode || '',
                    lessonTitle: sc.lessonTitle || '',
                    chapter: sc.chapter || '',
                    conceptFormula: sc.conceptFormula || '',
                    notes: sc.notes || '',
                    takeawayRule: sc.takeawayRule || null,
                    errorLogId: sc.errorLogId || null,
                    resolved: Boolean(sc.resolved),
                  },
                });
              } else {
                await prisma.userStuckConcept.create({
                  data: {
                    userId: user.id,
                    dateStr: sc.dateStr || '',
                    dayNumber: sc.dayNumber ?? null,
                    lessonCode: sc.lessonCode || '',
                    lessonTitle: sc.lessonTitle || '',
                    chapter: sc.chapter || '',
                    conceptFormula: sc.conceptFormula || '',
                    notes: sc.notes || '',
                    takeawayRule: sc.takeawayRule || null,
                    errorLogId: sc.errorLogId || null,
                    resolved: Boolean(sc.resolved),
                  },
                });
              }
            } catch (scErr) {
              console.warn('Failed to upsert stuck concept:', scErr);
            }
          }
        }
      }

      return NextResponse.json({ success: true, persisted: 'database' });
    } catch (dbErr) {
      console.warn('Prisma DB write fallback to memory:', dbErr instanceof Error ? dbErr.message : dbErr);
      return NextResponse.json({ success: true, persisted: 'memory-fallback' });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
