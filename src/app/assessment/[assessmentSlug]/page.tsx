'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionsForUnit, getQuestionsForLesson, KhanQuestion, KHAN_QUESTION_BANK } from '@/data/khanQuestionBank';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS } from '@/data/khanAcademyCatalog';
import { finalizeAssessmentRun, getAssessmentConfig, AssessmentMode, AssessmentSubmissionResult } from '@/lib/assessmentEngine';
import { DigitalScratchpad } from '@/components/tools/DigitalScratchpad';
import { EmbeddedDesmos } from '@/components/tools/EmbeddedDesmos';
import { SATFormulaSheetDrawer } from '@/components/tools/SATFormulaSheetDrawer';
import { ExerciseCompleteModal } from '@/components/ExerciseCompleteModal';
import { Check, ArrowRight, ArrowLeft, PenTool, Calculator, BookOpen, AlertTriangle, ShieldAlert, Award, RotateCcw } from 'lucide-react';

export default function AssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.assessmentSlug as string) || 'math-u2-test';

  // Determine mode from slug: "quiz", "test" (unit_test), or "challenge" (course_challenge)
  const isQuiz = rawSlug.includes('quiz');
  const isChallenge = rawSlug.includes('challenge');
  const mode: AssessmentMode = isChallenge ? 'course_challenge' : isQuiz ? 'quiz' : 'unit_test';

  const isMath = !rawSlug.toLowerCase().startsWith('rw') && !rawSlug.toLowerCase().includes('reading');
  const unitNumMatches = rawSlug.match(/\d+/);
  const targetUnitNumber = unitNumMatches ? parseInt(unitNumMatches[0], 10) : 2;

  // Title calculation
  const title = isChallenge
    ? `${isMath ? 'Digital SAT Math' : 'Digital SAT Reading & Writing'} Course Challenge`
    : isQuiz
    ? `Unit ${targetUnitNumber} Checkpoint Quiz`
    : `Unit ${targetUnitNumber} High-Stakes Gatekeeper Test`;

  const config = useMemo(() => {
    return getAssessmentConfig(mode, rawSlug, title, isMath ? 'math' : 'rw');
  }, [mode, rawSlug, title, isMath]);

  // Generate question pool based on mode
  const questions: KhanQuestion[] = useMemo(() => {
    if (isChallenge) {
      // 30 questions randomly sampled across course
      const pool = KHAN_QUESTION_BANK.filter((q) => q.subject === (isMath ? 'math' : 'rw'));
      // Shuffle & take 30
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 30);
    } else if (isQuiz) {
      // 6 questions from the unit
      const unitPool = getQuestionsForUnit(targetUnitNumber, isMath ? 'math' : 'rw');
      return unitPool.slice(0, 6);
    } else {
      // Unit Test: 12 questions from the unit
      const unitPool = getQuestionsForUnit(targetUnitNumber, isMath ? 'math' : 'rw');
      return unitPool.slice(0, 12);
    }
  }, [isChallenge, isQuiz, targetUnitNumber, isMath]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);

  // Submission & Results
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AssessmentSubmissionResult | null>(null);
  const [showReviewGrid, setShowReviewGrid] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit assessment at the very end
  const handleSubmitAssessment = () => {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit now?`
      );
      if (!confirmSubmit) return;
    }

    const result = finalizeAssessmentRun(config, questions, userAnswers);
    setSubmissionResult(result);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a150b] text-[#e8f5e6] flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative">
      {/* Scratchpad Overlay */}
      <DigitalScratchpad isOpen={isScratchpadOpen} onClose={() => setIsScratchpadOpen(false)} />

      {/* Desmos Graphing Calculator */}
      <EmbeddedDesmos isOpen={isDesmosOpen} onClose={() => setIsDesmosOpen(false)} />

      {/* Formulas Drawer */}
      <SATFormulaSheetDrawer isOpen={isFormulaDrawerOpen} onClose={() => setIsFormulaDrawerOpen(false)} />

      {/* Top Bar: Linear Counter, Title, Locked Status, Tools */}
      <header className="sticky top-0 z-20 bg-[#060e07]/90 backdrop-blur-md border-b border-emerald-950 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={isMath ? '/course/sat-math' : '/course/sat-reading-writing'}
            className="text-xs uppercase tracking-wider font-mono font-bold text-stone-400 hover:text-emerald-400 bg-stone-900/60 px-3 py-1.5 rounded-lg border border-stone-800 transition"
          >
            ✕ Exit
          </Link>
          <div className="h-4 w-px bg-stone-800" />
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            {mode === 'unit_test' ? 'High-Stakes Unit Test' : mode === 'quiz' ? 'Checkpoint Quiz' : 'Course Challenge'}
          </span>
          <span className="hidden md:inline text-xs text-stone-400 font-medium">
            {title}
          </span>
        </div>

        {/* Question Counter & Review Grid Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowReviewGrid((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-mono text-stone-300 flex items-center gap-1.5 transition"
          >
            <span>Q {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-emerald-400 font-bold">({answeredCount}/{totalQuestions})</span>
          </button>
        </div>

        {/* Toolset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsScratchpadOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
            title="Digital Scratchpad"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">Scratchpad</span>
          </button>

          {isMath && (
            <button
              type="button"
              onClick={() => setIsDesmosOpen(true)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="Official Desmos Calculator"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-mono">Desmos</span>
            </button>
          )}

          {isMath && (
            <button
              type="button"
              onClick={() => setIsFormulaDrawerOpen(true)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="SAT Formulas"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-mono">Formulas</span>
            </button>
          )}
        </div>
      </header>

      {/* Review Matrix Drawer Dropdown */}
      {showReviewGrid && (
        <div className="bg-[#071308] border-b border-emerald-950 p-4 px-6 z-10 animate-in fade-in slide-in-from-top-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-stone-400">
              <span>Question Navigator:</span>
              <span>● Answered &nbsp; ○ Unanswered</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => {
                const isAnswered = userAnswers[i] !== undefined;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(i);
                      setShowReviewGrid(false);
                    }}
                    className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-emerald-400 bg-emerald-950 text-emerald-300'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 text-stone-500 border border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main High-Stakes Question Area OR Results Summary Screen */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {!isSubmitted ? (
          currentQ ? (
            <div className="bg-[#0f2112] rounded-3xl border border-emerald-900/60 p-6 sm:p-10 shadow-2xl relative space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">• {currentQ.lessonCode}</span>
                </div>
                <span className="text-xs font-mono text-stone-400 bg-stone-900/60 px-2 py-0.5 rounded border border-stone-800">
                  Hints Disabled (Formal Testing Mode)
                </span>
              </div>

              {/* Prompt */}
              <div className="text-base sm:text-lg text-emerald-50 leading-relaxed font-sans whitespace-pre-line font-medium">
                {currentQ.question}
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[currentIndex] === oIdx;
                  const letter = String.fromCharCode(65 + oIdx);

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/90 text-white ring-2 ring-emerald-500/40 shadow-sm'
                          : 'border-stone-800 bg-[#0a180c]/60 hover:bg-[#132c17] text-stone-200'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-stone-950 shadow'
                            : 'bg-stone-900 text-stone-400 border border-stone-800'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base font-medium flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">Loading assessment...</div>
          )
        ) : (
          /* High-Stakes Final Results Summary View */
          submissionResult && (
            <div className="bg-[#0f2112] rounded-3xl border border-emerald-900/60 p-6 sm:p-10 shadow-2xl relative space-y-8 animate-in fade-in duration-500">
              {/* Header */}
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {title} Completed
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white font-serif">
                  {submissionResult.score} / {submissionResult.total} Correct ({submissionResult.percentage}%)
                </h1>
                <p className="text-stone-300 text-sm max-w-xl mx-auto">
                  {submissionResult.summaryMessage}
                </p>
              </div>

              {/* Energy Points & Status Tally */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4">
                  <div className="text-xs font-mono text-stone-400 uppercase">Score Accuracy</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {submissionResult.percentage}%
                  </div>
                </div>
                <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4">
                  <div className="text-xs font-mono text-stone-400 uppercase">Energy Points</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    +{submissionResult.energyPointsEarned.toLocaleString()}
                  </div>
                </div>
                <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
                  <div className="text-xs font-mono text-stone-400 uppercase">Mastery State</div>
                  <div className="text-sm font-bold text-white mt-2">
                    {submissionResult.promotedSkills.length > 0
                      ? `+${submissionResult.promotedSkills.length} Promoted`
                      : 'Preserved'}
                  </div>
                </div>
              </div>

              {/* Dynamic Leveling Promotion/Demotion Report */}
              {(submissionResult.promotedSkills.length > 0 || submissionResult.demotedSkills.length > 0) && (
                <div className="space-y-3 bg-[#0a180c] rounded-2xl p-5 border border-emerald-950">
                  <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">
                    Mastery State Machine Dynamics:
                  </div>
                  {submissionResult.promotedSkills.length > 0 && (
                    <div className="text-xs text-emerald-400 flex items-center gap-2">
                      <span className="font-bold">▲ Promoted to Mastered:</span>
                      <span>{submissionResult.promotedSkills.join(', ')}</span>
                    </div>
                  )}
                  {submissionResult.demotedSkills.length > 0 && (
                    <div className="text-xs text-orange-400 flex items-center gap-2">
                      <span className="font-bold">▼ Level Down Triggered:</span>
                      <span>{submissionResult.demotedSkills.join(', ')} (Review missed objectives)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Question by Question Review Matrix */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">
                  Question-by-Question Review Matrix
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 divide-y divide-stone-800/80">
                  {questions.map((q, qIdx) => {
                    const chosen = userAnswers[qIdx];
                    const isRight = chosen === q.correctIndex;
                    return (
                      <div key={q.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-stone-300">
                            Q{qIdx + 1} ({q.lessonCode})
                          </span>
                          <span
                            className={`font-bold font-mono px-2 py-0.5 rounded ${
                              isRight
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isRight ? '✓ Correct' : '✕ Missed'}
                          </span>
                        </div>
                        <p className="text-stone-300 line-clamp-2">{q.question}</p>
                        <p className="text-stone-500">
                          <strong className="text-stone-400">Correct Answer:</strong> {q.options[q.correctIndex]}
                        </p>
                        <p className="text-emerald-400/90 font-mono text-[11px]">
                          ⚡ {q.takeawayRule}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href={isMath ? '/course/sat-math' : '/course/sat-reading-writing'}
                  className="flex-1 text-center py-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl shadow-lg transition"
                >
                  Return to Course Syllabus
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentIndex(0);
                    setUserAnswers({});
                    setSubmissionResult(null);
                  }}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold rounded-xl border border-stone-800 transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Bottom Action Footer */}
      {!isSubmitted && (
        <footer className="sticky bottom-0 z-20 bg-[#060e07]/95 backdrop-blur-md border-t border-emerald-950 px-4 sm:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-300 border border-stone-800 transition flex items-center gap-1 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs font-mono text-stone-400">
              {userAnswers[currentIndex] !== undefined ? (
                <span className="text-emerald-400">● Selected</span>
              ) : (
                <span className="text-stone-500">○ No answer selected yet</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-stone-950 transition flex items-center gap-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitAssessment}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-amber-400 hover:opacity-90 text-stone-950 shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
