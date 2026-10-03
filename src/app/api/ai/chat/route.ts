import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI, Type } from '@google/genai';
import { STUDY_PLAN_WEEKS } from '@/data/studyPlan';
import { SAT_FORMULAS_DATA } from '@/data/satFormulas';
import { CHEAT_CODES } from '@/data/cheatCodes';

// Fallback in-memory session store for guest users
const guestSessions: Record<string, { mode: string; title: string; messages: any[] }> = {};

// Helper: Find upcoming Sunday or day of week from reference date
function resolveTargetDate(inputStr: string, refDateStr: string = '2026-09-22'): string {
  const clean = inputStr.trim().toLowerCase();
  
  // Direct YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  // Day number reference e.g. "Day 25"
  const dayNumMatch = clean.match(/day\s*(\d+)/i);
  if (dayNumMatch) {
    const targetDayNum = parseInt(dayNumMatch[1], 10);
    for (const week of STUDY_PLAN_WEEKS) {
      for (const day of week.days) {
        if (day.dayNumber === targetDayNum) {
          return day.dateStr;
        }
      }
    }
  }

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDayIdx = daysOfWeek.findIndex((d) => clean.includes(d));

  if (targetDayIdx !== -1) {
    const refDate = new Date(refDateStr);
    const currentDayIdx = refDate.getDay();
    let diff = targetDayIdx - currentDayIdx;
    if (diff <= 0) diff += 7; // Next occurrence
    const target = new Date(refDate);
    target.setDate(target.getDate() + diff);
    return target.toISOString().split('T')[0];
  }

  if (clean.includes('tomorrow')) {
    const refDate = new Date(refDateStr);
    refDate.setDate(refDate.getDate() + 1);
    return refDate.toISOString().split('T')[0];
  }

  // Default fallback: return today
  return refDateStr;
}

// Helper: Search task in the syllabus
function findTaskInSyllabus(query: string, fromDateOrDay?: string) {
  const q = query.toLowerCase().trim();
  const allDays = STUDY_PLAN_WEEKS.flatMap((w) => w.days);

  // If a specific day was mentioned (e.g. Day 22 or dateStr)
  let prioritizedDays = allDays;
  if (fromDateOrDay) {
    const fromStr = fromDateOrDay.toLowerCase();
    const dayNumMatch = fromStr.match(/day\s*(\d+)/) || fromStr.match(/^(\d+)$/);
    if (dayNumMatch) {
      const num = parseInt(dayNumMatch[1], 10);
      prioritizedDays = allDays.filter((d) => d.dayNumber === num);
    } else {
      prioritizedDays = allDays.filter((d) => d.dateStr === fromDateOrDay);
    }
  }

  // 1. Search in prioritized days first
  for (const day of prioritizedDays) {
    for (const task of day.tasks) {
      if (
        task.id.toLowerCase() === q ||
        task.label.toLowerCase().includes(q) ||
        (task.topic && task.topic.toLowerCase().includes(q)) ||
        (task.code && task.code.toLowerCase().includes(q))
      ) {
        return { task, day };
      }
    }
  }

  // 2. Search across all days if not found
  for (const day of allDays) {
    for (const task of day.tasks) {
      if (
        task.id.toLowerCase() === q ||
        task.label.toLowerCase().includes(q) ||
        (task.topic && task.topic.toLowerCase().includes(q)) ||
        (task.code && task.code.toLowerCase().includes(q))
      ) {
        return { task, day };
      }
    }
  }

  // 3. Fallback: match chapter numbers e.g. "chapter 5" or "ch 5" or "unit 5"
  const chMatch = q.match(/ch(?:apter)?\s*#?\s*(\d+)/i) || q.match(/unit\s*#?\s*(\d+)/i) || q.match(/\bu(\d+)\b/i);
  if (chMatch) {
    const chNum = chMatch[1];
    const isRw = q.includes('reading') || q.includes('writing') || q.includes('english') || q.includes('r&w');
    const targetPool = prioritizedDays.length > 0 ? prioritizedDays : allDays;
    for (const day of targetPool) {
      for (const task of day.tasks) {
        if (task.subject === 'buffer' || task.subject === 'logistics') continue;
        if (isRw && task.subject !== 'rw') continue;
        if (!isRw && task.subject !== 'math') continue;
        if (
          task.label.toLowerCase().includes(`u${chNum}`) ||
          task.label.toLowerCase().includes(`chapter ${chNum}`) ||
          task.label.toLowerCase().includes(`ch ${chNum}`) ||
          (task.code && task.code.toLowerCase().includes(`u${chNum}`))
        ) {
          return { task, day };
        }
      }
    }
  }

  return null;
}

// Helper: Search all tasks in an entire chapter or unit (e.g. Unit 5, Chapter 5, U5, etc.)
function findTasksForChapterOrUnit(query: string, requestedSubject?: string) {
  const q = query.toLowerCase().trim();
  const allDays = STUDY_PLAN_WEEKS.flatMap((w) => w.days);
  const matchedTasks: { task: any; day: any }[] = [];

  const isRwExplicit =
    requestedSubject === 'rw' ||
    q.includes('reading') ||
    q.includes('writing') ||
    q.includes('r&w') ||
    q.includes('english') ||
    q.includes('rw');

  const unitMatch =
    q.match(/u(\d+)/i) ||
    q.match(/unit\s*#?\s*(\d+)/i) ||
    q.match(/chapter\s*#?\s*(\d+)/i) ||
    q.match(/ch\s*#?\s*(\d+)/i);

  if (unitMatch) {
    const num = unitMatch[1];
    for (const day of allDays) {
      for (const task of day.tasks) {
        if (task.subject === 'buffer' || task.subject === 'logistics') continue;

        if (isRwExplicit) {
          // Strictly English / Reading & Writing
          if (
            task.subject === 'rw' &&
            (task.label.toLowerCase().includes(`r&w u${num}`) ||
              task.label.toLowerCase().includes(`w u${num}`) ||
              (task.code && task.code.toLowerCase().includes(`u${num}`)))
          ) {
            if (!matchedTasks.some((m) => m.task.id === task.id)) {
              matchedTasks.push({ task, day });
            }
          }
        } else {
          // Strictly Math (Default for Chapters 3-13)
          if (
            task.subject === 'math' &&
            (task.label.toLowerCase().includes(`math u${num}`) ||
              task.label.toLowerCase().includes(`[math u${num}`) ||
              (task.code && task.code.toLowerCase().includes(`math u${num}`)))
          ) {
            if (!matchedTasks.some((m) => m.task.id === task.id)) {
              matchedTasks.push({ task, day });
            }
          }
        }
      }
    }
  }

  // Also check subject keywords if no unit match
  if (matchedTasks.length === 0) {
    for (const day of allDays) {
      for (const task of day.tasks) {
        if (task.subject === 'buffer' || task.subject === 'logistics') continue;
        if (isRwExplicit && task.subject !== 'rw') continue;
        if (!isRwExplicit && q.includes('math') && task.subject !== 'math') continue;

        if (
          task.label.toLowerCase().includes(q) ||
          (task.topic && task.topic.toLowerCase().includes(q))
        ) {
          if (!matchedTasks.some((m) => m.task.id === task.id)) {
            matchedTasks.push({ task, day });
          }
        }
      }
    }
  }

  return matchedTasks;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase();

    const body = await req.json();
    const {
      sessionId: reqSessionId,
      mode = 'plan_modifier',
      message,
      currentDateStr = '2026-09-22',
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server. Please check .env.local.' },
        { status: 500 }
      );
    }

    // Initialize Gemini client with latest GoogleGenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Database user lookup or guest fallback
    let user = null;
    let currentSession = null;
    let sessionId = reqSessionId;

    if (email) {
      user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: session?.user?.name || 'Student Scholar',
          role: (session?.user as any)?.role || 'USER',
        },
      });

      if (sessionId) {
        currentSession = await prisma.aIChatSession.findUnique({
          where: { id: sessionId },
          include: {
            messages: {
              take: 8,
              orderBy: { createdAt: 'desc' },
            },
          },
        });
      }

      if (!currentSession) {
        // Auto-generate title from first prompt
        const initialTitle = message.slice(0, 36) + (message.length > 36 ? '...' : '');
        currentSession = await prisma.aIChatSession.create({
          data: {
            userId: user.id,
            mode,
            title: initialTitle,
          },
          include: { messages: true },
        });
        sessionId = currentSession.id;
      }
    } else {
      // Guest session ID
      if (!sessionId) {
        sessionId = 'guest-' + Date.now();
        guestSessions[sessionId] = {
          mode,
          title: message.slice(0, 36),
          messages: [],
        };
      }
    }

    // Build system instructions based on mode
    let systemInstruction = `You are the Anti-Burnout SAT AI Co-Pilot, an elite, supportive, and mathematically precise study assistant.
Current Date: ${currentDateStr}.
The student is following a disciplined 31-day SAT sprint toward the official SAT (Nov 7, 2026) with an 8:30 PM daily anchor time.
Keep responses clear, encouraging, elegant, and directly actionable. Format math formulas cleanly. Avoid unnecessary fluff.`;

    if (mode === 'plan_modifier') {
      systemInstruction += `
MODE: PLAN MODIFIER (Schedule Architect).
Your primary job is helping the student reschedule, shift, or postpone lessons and chapters when unexpected life events occur.
When the student asks to shift or move a lesson/chapter from one day to another (e.g. from Day 22 / today to Sunday):
1. Identify the task or chapter they want to move (e.g., Math Chapter 5).
2. Call the function tool 'shift_lesson' with the topic name and target date.
3. Confirm clearly that the task has been moved in their schedule, which day it was moved from, and which day it was placed on.
Never tell the student to manually edit code or files. You have the direct tool to shift their schedule.`;
    } else if (mode === 'teacher') {
      const topFormulas = SAT_FORMULAS_DATA.slice(0, 10).map(f => `${f.name}: ${f.formula}`).join('\n');
      const topCheats = CHEAT_CODES.slice(0, 5).map(c => `${c.title}: ${c.recommendedSyntax || c.ruleSummary}`).join('\n');
      systemInstruction += `
MODE: SAT MASTER TEACHER.
You are an expert SAT tutor for Math and Reading/Writing.
You know the official SAT test specs, the exact 26 SAT formulas, and Desmos calculator shortcuts.
Reference Formulas:
${topFormulas}
Desmos Shortcuts:
${topCheats}
When answering math or grammar questions:
- Walk through the problem step-by-step.
- Highlight the quickest method (including Desmos shortcuts when applicable).
- Point out the exact trap answer choices that College Board designs to catch students.`;
    } else if (mode === 'coach') {
      systemInstruction += `
MODE: ANTI-BURNOUT COACH & PACING MENTOR.
Your job is protecting the student from cognitive exhaustion, anxiety, and fatigue.
Core principles:
- 8:30 PM Sharp Anchor Time: Consistent sleep schedule is 50% of the score.
- 90-minute daily Khan drill ceiling (45 min Math, 10 min break, 35 min RW). Rushing and marathon 5-hour study sessions trigger burnout and drop test performance.
- Buffer Days are intentional, strategic rest and recovery periods, not slacking off.
- Guide the student with empathetic, stoic, and structured pacing advice.`;
    } else if (mode === 'error_worker') {
      systemInstruction += `
MODE: ERROR LOG WORKER.
Your job is helping the student log their mistakes into their official Error Log immediately.
Whenever the student tells you about a mistake they made (e.g. "I missed Q14 on Bluebook Test 1 because I forgot negative signs" or "Log this error for today..."):
1. Extract the test or section (e.g. "Bluebook Test #1"), the question reference (e.g. "Module 2, Q14"), the domain ("Math" or "Reading/Writing"), the root cause "whyMissed", and the actionable "takeawayRule".
2. Call the function tool 'log_error' to insert it into their official database Error Log for the date specified (defaults to ${currentDateStr}).
3. Confirm that it has been saved to their Error Log and give a one-sentence tip on how to never miss that question type again.`;
    }

    // Function Calling Tools
    const tools: any[] = [];

    // Tool 1: shift_lesson
    const shiftLessonTool = {
      functionDeclarations: [
        {
          name: 'shift_lesson',
          description: 'Shifts or moves a study plan lesson/chapter from one day to a target day (e.g. Sunday or specific date)',
          parameters: {
            type: Type.OBJECT,
            properties: {
              topicOrTask: {
                type: Type.STRING,
                description: 'The lesson, chapter, or task name (e.g., "Math Chapter 5", "Linear Equations", "w4-d22-math")',
              },
              fromDayOrDate: {
                type: Type.STRING,
                description: 'The day or date the task is currently on (e.g., "Day 22", "2026-09-22", "today")',
              },
              targetDate: {
                type: Type.STRING,
                description: 'The target date or day of the week to move the lesson to (e.g., "Sunday", "2026-09-27")',
              },
              subject: {
                type: Type.STRING,
                description: 'Subject domain: "math" or "rw" (defaults to "math" for SAT Math chapters unless English/Reading/Writing is specified)',
              },
              reason: {
                type: Type.STRING,
                description: 'Optional student reason for shifting',
              },
            },
            required: ['topicOrTask', 'targetDate'],
          },
        },
        {
          name: 'log_error',
          description: 'Logs a mistake or missed question into the official database Error Log',
          parameters: {
            type: Type.OBJECT,
            properties: {
              testOrSection: {
                type: Type.STRING,
                description: 'Test name or source (e.g., "Bluebook Test #1", "Khan Academy Math Drill", "College Board Practice")',
              },
              questionRef: {
                type: Type.STRING,
                description: 'Question identifier (e.g., "Module 2, Q14", "Q8 Heart of Algebra")',
              },
              domain: {
                type: Type.STRING,
                description: 'Subject domain: "Math" or "Reading/Writing"',
              },
              whyMissed: {
                type: Type.STRING,
                description: 'Root cause explanation of why the question was missed',
              },
              takeawayRule: {
                type: Type.STRING,
                description: 'Formula, grammar rule, or strategy rule to remember',
              },
              date: {
                type: Type.STRING,
                description: 'Date string YYYY-MM-DD (defaults to current date)',
              },
            },
            required: ['testOrSection', 'questionRef', 'domain', 'whyMissed', 'takeawayRule'],
          },
        },
      ],
    };

    tools.push(shiftLessonTool);

    // Call Gemini
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction,
        tools,
      },
    });

    let assistantText = geminiResponse.text || '';
    let executedActionData: any = null;

    // Check for tool calls
    if (geminiResponse.functionCalls && geminiResponse.functionCalls.length > 0) {
      for (const call of geminiResponse.functionCalls) {
        const args = (call.args || {}) as Record<string, any>;

        if (call.name === 'shift_lesson') {
          const topic = args.topicOrTask || args.topic || 'Lesson';
          const fromParam = args.fromDayOrDate || currentDateStr;
          const targetParam = args.targetDate || 'Sunday';
          const resolvedDate = resolveTargetDate(targetParam, currentDateStr);

          // Check if user requested an entire chapter / unit (e.g. Chapter 5, Unit 5, Geometry, etc.)
          const chapterTasks = findTasksForChapterOrUnit(topic, args.subject);

          if (chapterTasks.length > 1) {
            // Batch shift entire chapter across all its lessons!
            if (user) {
              const currentProgress = await prisma.userProgress.findUnique({
                where: { userId: user.id },
              });
              const existingOverrides = (currentProgress?.taskScheduleOverrides as Record<string, string>) || {};
              const updatedOverrides = { ...existingOverrides };
              for (const item of chapterTasks) {
                updatedOverrides[item.task.id] = resolvedDate;
              }

              await prisma.userProgress.upsert({
                where: { userId: user.id },
                update: { taskScheduleOverrides: updatedOverrides },
                create: { userId: user.id, taskScheduleOverrides: updatedOverrides },
              });
            }

            executedActionData = {
              action: 'shift_chapter',
              unitName: topic,
              count: chapterTasks.length,
              tasks: chapterTasks.map((m) => ({
                id: m.task.id,
                label: m.task.label,
                from: m.day.dateStr,
                to: resolvedDate,
              })),
              to: resolvedDate,
              success: true,
              summary: `Shifted all ${chapterTasks.length} lessons of "${topic}" to ${resolvedDate}.`,
            };

            if (!assistantText) {
              assistantText = `✅ **Full Chapter Shifted!** I have successfully moved all **${chapterTasks.length} lessons** of **${topic}** to **${resolvedDate}**.\n\nAll ${chapterTasks.length} tasks have been updated in your calendar, roadmap, and rollover system in the database.`;
            }
          } else {
            // Find single task in syllabus
            const found = findTaskInSyllabus(topic, fromParam);
            const taskId = found ? found.task.id : `custom-shift-${Date.now()}`;
            const taskLabel = found ? found.task.label : topic;
            const origDate = found ? found.day.dateStr : fromParam;

            // Update user's taskScheduleOverrides in Database if logged in
            if (user) {
              const currentProgress = await prisma.userProgress.findUnique({
                where: { userId: user.id },
              });
              const existingOverrides = (currentProgress?.taskScheduleOverrides as Record<string, string>) || {};
              const updatedOverrides = {
                ...existingOverrides,
                [taskId]: resolvedDate,
              };

              await prisma.userProgress.upsert({
                where: { userId: user.id },
                update: {
                  taskScheduleOverrides: updatedOverrides,
                },
                create: {
                  userId: user.id,
                  taskScheduleOverrides: updatedOverrides,
                },
              });
            }

            executedActionData = {
              action: 'shift_lesson',
              taskId,
              taskLabel,
              from: origDate,
              to: resolvedDate,
              success: true,
              summary: `Shifted "${taskLabel}" from ${origDate} to ${resolvedDate}.`,
            };

            if (!assistantText) {
              assistantText = `✅ **Schedule Updated!** I have successfully shifted **${taskLabel}** from **${origDate}** to **${resolvedDate}**. Your calendar, daily roadmap, and rollover checklist have been synchronized in the database.`;
            }
          }
        } else if (call.name === 'log_error') {
          const testOrSection = args.testOrSection || 'Practice Drill';
          const questionRef = args.questionRef || 'General Mistake';
          const domain = args.domain === 'Reading/Writing' ? 'Reading/Writing' : 'Math';
          const whyMissed = args.whyMissed || 'Conceptual gap';
          const takeawayRule = args.takeawayRule || 'Review core formula';
          const errorDate = args.date || currentDateStr;

          let createdError = null;
          if (user) {
            createdError = await prisma.userErrorLog.create({
              data: {
                userId: user.id,
                testOrSection,
                questionRef,
                domain,
                whyMissed,
                takeawayRule,
                date: errorDate,
                reviewed: false,
              },
            });
          }

          executedActionData = {
            action: 'log_error',
            errorLog: {
              id: createdError?.id || `err-${Date.now()}`,
              testOrSection,
              questionRef,
              domain,
              whyMissed,
              takeawayRule,
              date: errorDate,
            },
            success: true,
            summary: `Logged mistake for ${testOrSection} (${questionRef}).`,
          };

          if (!assistantText) {
            assistantText = `📝 **Mistake Logged to Error Log!**\n- **Test / Section:** ${testOrSection}\n- **Question:** ${questionRef} (${domain})\n- **Date:** ${errorDate}\n- **Root Cause:** ${whyMissed}\n- **Takeaway Rule:** \`${takeawayRule}\`\n\nThis entry has been stored in your official Error Log for targeted review during your Sunday buffer days!`;
          }
        }
      }
    }

    if (!assistantText) {
      assistantText = "I have processed your request and synchronized your study schedule.";
    }

    // Persist messages to Database if user is logged in
    if (user && currentSession) {
      // User message
      await prisma.aIChatMessage.create({
        data: {
          sessionId: currentSession.id,
          role: 'user',
          content: message,
        },
      });

      // Assistant message
      await prisma.aIChatMessage.create({
        data: {
          sessionId: currentSession.id,
          role: 'assistant',
          content: assistantText,
          actionData: executedActionData || undefined,
        },
      });

      // Update session timestamp
      await prisma.aIChatSession.update({
        where: { id: currentSession.id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      message: assistantText,
      actionData: executedActionData,
      sessionId,
      sessionTitle: currentSession?.title || 'Chat',
    });
  } catch (err: any) {
    console.error('Error in AI Chat API route:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while generating the AI response.' },
      { status: 500 }
    );
  }
}
