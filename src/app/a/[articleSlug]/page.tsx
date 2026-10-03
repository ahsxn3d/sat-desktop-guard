'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS, KhanLessonItem } from '@/data/khanAcademyCatalog';
import { getQuestionsForLesson, KhanQuestion } from '@/data/khanQuestionBank';
import { BookOpen, Check, ArrowRight, Play, FileText, ChevronRight, HelpCircle } from 'lucide-react';

export default function TheoryArticlePage() {
  const params = useParams();
  const rawSlug = (params?.articleSlug as string) || 'math-u2-1';

  // Format code e.g. "math-u2-1" -> "Math U2.1"
  const formattedCode = useMemo(() => {
    const parts = rawSlug.split('-');
    if (parts.length >= 3) {
      const subj = parts[0] === 'rw' ? 'R&W' : 'Math';
      const unit = parts[1].toUpperCase();
      const lesson = parts[2];
      return `${subj} ${unit}.${lesson}`;
    }
    return rawSlug.replace('-', ' ').toUpperCase();
  }, [rawSlug]);

  const isMath = !rawSlug.toLowerCase().startsWith('rw');
  const catalog = isMath ? KHAN_MATH_UNITS : KHAN_RW_UNITS;

  // Find target lesson
  let targetLesson: KhanLessonItem | null = null;
  let targetUnit = catalog[0];

  for (const u of catalog) {
    const found = u.lessons.find((l) => l.code.toLowerCase() === formattedCode.toLowerCase());
    if (found) {
      targetLesson = found;
      targetUnit = u;
      break;
    }
  }

  if (!targetLesson) {
    targetLesson = targetUnit.lessons[0];
  }

  // Mini-checkpoint question from the question bank
  const checkpointQuestions = useMemo(() => {
    return getQuestionsForLesson(formattedCode).slice(0, 1);
  }, [formattedCode]);
  const checkpointQ = checkpointQuestions[0];

  const [checkpointAnswer, setCheckpointAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-[#122810] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Reading Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/unit/${isMath ? 'math' : 'rw'}-${targetUnit.unitNumber}`}
              className="text-xs uppercase tracking-wider font-mono font-bold text-stone-500 hover:text-emerald-700 transition"
            >
              ← Unit {targetUnit.unitNumber}
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
              {targetLesson.code}
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-stone-700 truncate max-w-sm">
              {targetLesson.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/v/${rawSlug}`}
              className="px-3 py-1 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1 transition"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              <span>Video</span>
            </Link>
            <Link
              href={`/exercise/${rawSlug}`}
              className="px-3.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1 transition"
            >
              <span>Practice (4 Qs)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: Article Content (Left/Center) + Lesson Syllabus Sidebar (Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Article Reader Body */}
        <article className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
          {/* Article Header */}
          <div className="space-y-3 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Official SAT Study Guide • {targetUnit.title}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
              {targetLesson.title}
            </h1>
            <p className="text-base text-stone-600 leading-relaxed">
              {targetLesson.description}
            </p>
          </div>

          {/* Section 1: Core Concept & Theoretical Foundations */}
          <section className="space-y-4 text-stone-800 leading-relaxed">
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              1. Fundamental Principles & SAT Framing
            </h2>
            <p>
              On the Digital SAT, the College Board evaluates your proficiency with{' '}
              <strong className="text-emerald-950 font-semibold">{targetLesson.title}</strong>{' '}
              using both conceptual questions and multi-step computational problems. Success requires mastering two simultaneous vectors: deep theoretical mechanics and rapid elimination shortcuts.
            </p>

            <div className="bg-[#f2f7f1] border-l-4 border-emerald-600 p-4 rounded-r-2xl space-y-1 font-mono text-xs text-stone-800">
              <div className="font-bold text-emerald-900">Key SAT Blueprint Rule:</div>
              <div>
                Always evaluate what the question is asking for before completing your algebra. In many instances, the question asks for an expression (e.g. 2x + 1 or x - y) rather than the individual variable x.
              </div>
            </div>
          </section>

          {/* Section 2: Step-by-Step Strategic Workflow */}
          <section className="space-y-4 text-stone-800 leading-relaxed">
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              2. The Strategic Solving Pipeline
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Translate Word Context to Algebraic Structure:</strong> Identify constants (y-intercepts, baseline fees) and coefficients (rates of change, slopes, per-unit costs).
              </li>
              <li>
                <strong>Desmos Rapid Verification:</strong> Before spending minutes doing pencil calculations, enter equations directly into the built-in Desmos graphing calculator to locate coordinate intersections and zeros.
              </li>
              <li>
                <strong>Sanity Check Boundary Constraints:</strong> Confirm units (hours vs. minutes, meters vs. kilometers) and ensure the algebraic sign matches the real-world domain.
              </li>
            </ol>
          </section>

          {/* Section 3: Interactive Mini-Checkpoint Accordion */}
          {checkpointQ && (
            <section className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Concept Checkpoint: Check Your Understanding</span>
              </div>

              <div className="text-sm font-medium text-stone-800 whitespace-pre-line">
                {checkpointQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {checkpointQ.options.map((opt, idx) => {
                  const isSelected = checkpointAnswer === idx;
                  const letter = String.fromCharCode(65 + idx);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCheckpointAnswer(idx);
                        setShowExplanation(true);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                        isSelected
                          ? idx === checkpointQ.correctIndex
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                            : 'bg-rose-50 border-rose-400 text-rose-950'
                          : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-stone-100 font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Dropdown */}
              {showExplanation && (
                <div className="mt-3 p-4 bg-white rounded-xl border border-stone-200 space-y-1.5 animate-in fade-in">
                  <div className="text-xs font-bold text-stone-900">
                    {checkpointAnswer === checkpointQ.correctIndex ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" /> Exactly right!
                      </span>
                    ) : (
                      <span className="text-orange-700">Not quite right. Here is why:</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {checkpointQ.explanation}
                  </p>
                  <p className="text-xs font-mono font-semibold text-emerald-800 pt-1">
                    ⚡ {checkpointQ.takeawayRule}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Section 4: Next Steps Banner */}
          <div className="p-5 bg-gradient-to-r from-emerald-900 to-[#122810] rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-emerald-300 uppercase font-bold">
                Ready to practice?
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                Lock in Proficient status on the 4-question drill.
              </div>
            </div>
            <Link
              href={`/exercise/${rawSlug}`}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold rounded-xl shadow-md transition text-center"
            >
              Start Practice (4 Qs) →
            </Link>
          </div>
        </article>

        {/* Right-Hand Sidebar: Lesson Syllabus & Course Navigation */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs sticky top-20 space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
                Unit {targetUnit.unitNumber} Syllabus
              </span>
              <h3 className="font-bold text-stone-900 text-sm mt-0.5">
                {targetUnit.title}
              </h3>
            </div>

            {/* List of lessons in this unit */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {targetUnit.lessons.map((lesson) => {
                const lSlug = lesson.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const isCurrent = lesson.code.toLowerCase() === targetLesson?.code.toLowerCase();

                return (
                  <div
                    key={lesson.code}
                    className={`p-2.5 rounded-xl border text-xs transition ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                        : 'bg-stone-50/60 border-stone-200/60 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-stone-500">{lesson.code}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                          Reading
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 line-clamp-1">{lesson.title}</div>
                    <div className="mt-2 flex items-center gap-2 pt-1 border-t border-stone-200/50">
                      <Link
                        href={`/a/${lSlug}`}
                        className="text-[11px] text-stone-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                      >
                        <FileText className="w-3 h-3" />
                        Article
                      </Link>
                      <Link
                        href={`/v/${lSlug}`}
                        className="text-[11px] text-stone-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                      >
                        <Play className="w-3 h-3" />
                        Video
                      </Link>
                      <Link
                        href={`/exercise/${lSlug}`}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 ml-auto font-bold flex items-center gap-0.5"
                      >
                        Practice →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
