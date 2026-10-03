'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionsForUnit, KhanQuestion, KHAN_QUESTION_BANK } from '@/data/khanQuestionBank';
import { finalizeAssessmentRun, getAssessmentConfig, AssessmentMode, AssessmentSubmissionResult } from '@/lib/assessmentEngine';
import { DigitalScratchpad } from '@/components/tools/DigitalScratchpad';
import { EmbeddedDesmos } from '@/components/tools/EmbeddedDesmos';
import { SATFormulaSheetDrawer } from '@/components/tools/SATFormulaSheetDrawer';
import { MathRenderer } from '@/components/MathRenderer';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  PenTool,
  Calculator,
  BookOpen,
  ShieldAlert,
  Clock,
  RotateCcw,
  Award
} from 'lucide-react';

export default function TimedExamRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || 'math-u2-test';

  const isMath = !rawId.toLowerCase().startsWith('rw') && !rawId.toLowerCase().includes('reading');
  const unitNumMatches = rawId.match(/\d+/);
  const targetUnitNumber = unitNumMatches ? parseInt(unitNumMatches[0], 10) : 2;

  // High-Stakes Unit Test: 12 Questions
  const questions: KhanQuestion[] = useMemo(() => {
    const unitPool = getQuestionsForUnit(targetUnitNumber, isMath ? 'math' : 'rw');
    return unitPool.slice(0, 12);
  }, [targetUnitNumber, isMath]);

  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedAnswersMap, setSelectedAnswersMap] = useState<Record<string, string>>({});

  // 25-minute test countdown timer (1500 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(true);

  // Tools
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);
  const [showReviewGrid, setShowReviewGrid] = useState(false);

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AssessmentSubmissionResult | null>(null);

  useEffect(() => {
    if (!timerActive || isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted || !currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
    setSelectedAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: currentQ.options[optIdx]
    }));
  };

  const handleSubmit = async () => {
    setTimerActive(false);

    // Call server assessment evaluation API
    try {
      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-student-session',
          testType: 'UNIT_TEST',
          targetId: rawId,
          answers: selectedAnswersMap
        })
      });
    } catch (e) {
      // Fallback
    }

    const config = getAssessmentConfig('unit_test', rawId, `Unit ${targetUnitNumber} Exam`, isMath ? 'math' : 'rw');
    const result = finalizeAssessmentRun(config, questions, userAnswers);
    setSubmissionResult(result);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#071308] text-[#e8f5e6] flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative">
      {/* Scratchpad Overlay */}
      <DigitalScratchpad isOpen={isScratchpadOpen} onClose={() => setIsScratchpadOpen(false)} />

      {/* Desmos Graphing Calculator */}
      <EmbeddedDesmos isOpen={isDesmosOpen} onClose={() => setIsDesmosOpen(false)} />

      {/* SAT Formulas */}
      <SATFormulaSheetDrawer isOpen={isFormulaDrawerOpen} onClose={() => setIsFormulaDrawerOpen(false)} />

      {/* Header: Zero external navbars, locked-down testing environment */}
      <header className="sticky top-0 z-20 bg-[#050e06]/95 backdrop-blur-md border-b border-emerald-950 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider font-mono font-bold text-stone-400 hover:text-emerald-400 bg-stone-900/60 px-3 py-1.5 rounded-lg border border-stone-800 transition"
          >
            ✕ Exit Test
          </Link>
          <div className="h-4 w-px bg-stone-800" />
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Unit {targetUnitNumber} Exam
          </span>
        </div>

        {/* Timed Exam Countdown */}
        {!isSubmitted && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            secondsRemaining < 300
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted} Remaining</span>
          </div>
        )}

        {/* Question Counter and Tool buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowReviewGrid((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-mono text-stone-300 flex items-center gap-1.5 transition"
          >
            <span>Q {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-emerald-400 font-bold">({answeredCount}/{totalQuestions})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScratchpadOpen(true)}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold transition"
            title="Scratchpad"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {isMath && (
            <button
              type="button"
              onClick={() => setIsDesmosOpen(true)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold transition"
              title="Desmos Calculator"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {isMath && (
            <button
              type="button"
              onClick={() => setIsFormulaDrawerOpen(true)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold transition"
              title="Formulas"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </header>

      {/* Navigator Dropdown */}
      {showReviewGrid && (
        <div className="bg-[#050e06] border-b border-emerald-950 p-4 px-6 z-10 animate-in fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2 text-xs font-mono text-stone-400">
              <span>Question Navigator:</span>
              <span>Green: Answered | Dark: Unanswered</span>
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
                        : 'bg-stone-900 text-stone-500 border border-stone-800'
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

      {/* Main Examination View */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {!isSubmitted ? (
          currentQ ? (
            <div className="bg-[#0e1f11] rounded-3xl border border-emerald-900/60 p-6 sm:p-10 shadow-2xl relative space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
                <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-mono text-stone-400 bg-stone-900/80 px-2.5 py-1 rounded border border-stone-800">
                  Hints Disabled (Official Testing Protocol)
                </span>
              </div>

              {/* KaTeX Math Rendered Question */}
              <div className="text-base sm:text-lg text-emerald-50 leading-relaxed font-sans font-medium">
                <MathRenderer content={currentQ.question} />
              </div>

              {/* Options */}
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
                          : 'border-stone-800 bg-[#081509]/60 hover:bg-[#112714] text-stone-200'
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
                      <div className="text-sm sm:text-base font-medium flex-1">
                        <MathRenderer content={opt} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null
        ) : (
          /* Submission Review Screen */
          submissionResult && (
            <div className="bg-[#0e1f11] rounded-3xl border border-emerald-900/60 p-6 sm:p-10 shadow-2xl relative space-y-8 animate-in fade-in">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Unit Test Evaluated
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white font-serif">
                  {submissionResult.score} / {submissionResult.total} Correct ({submissionResult.percentage}%)
                </h1>
                <p className="text-stone-300 text-sm max-w-xl mx-auto">
                  {submissionResult.percentage >= 80
                    ? 'Target mastery gateway unlocked. Proficient objectives promoted to Mastered.'
                    : 'Passing score is 80%. Review missed concepts and retake when prepared.'}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-[#071308] border border-stone-800 rounded-2xl p-4">
                  <div className="text-xs font-mono text-stone-400 uppercase">Score Accuracy</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {submissionResult.percentage}%
                  </div>
                </div>
                <div className="bg-[#071308] border border-stone-800 rounded-2xl p-4">
                  <div className="text-xs font-mono text-stone-400 uppercase">XP Awarded</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    +{submissionResult.energyPointsEarned}
                  </div>
                </div>
                <div className="bg-[#071308] border border-stone-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
                  <div className="text-xs font-mono text-stone-400 uppercase">Promotion Status</div>
                  <div className="text-sm font-bold text-white mt-2">
                    {submissionResult.promotedSkills.length > 0
                      ? `${submissionResult.promotedSkills.length} Skills Promoted`
                      : 'Preserved'}
                  </div>
                </div>
              </div>

              {/* Dynamic Demotions / Promotions Notice */}
              {(submissionResult.promotedSkills.length > 0 || submissionResult.demotedSkills.length > 0) && (
                <div className="space-y-2 bg-[#071308] rounded-2xl p-4 border border-emerald-950 text-xs">
                  {submissionResult.promotedSkills.length > 0 && (
                    <div className="text-emerald-400">
                      <strong>Promoted to Mastered:</strong> {submissionResult.promotedSkills.join(', ')}
                    </div>
                  )}
                  {submissionResult.demotedSkills.length > 0 && (
                    <div className="text-orange-400">
                      <strong>Demoted for Review:</strong> {submissionResult.demotedSkills.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Question Review Matrix */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">
                  Question Review Matrix
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 divide-y divide-stone-800/80">
                  {questions.map((q, qIdx) => {
                    const chosen = userAnswers[qIdx];
                    const isRight = chosen === q.correctIndex;
                    return (
                      <div key={q.id} className="pt-3 first:pt-0 space-y-1 text-xs">
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
                            {isRight ? 'Correct' : 'Missed'}
                          </span>
                        </div>
                        <p className="text-stone-300 line-clamp-2">{q.question}</p>
                        <p className="text-stone-500">
                          <strong className="text-stone-400">Correct Answer:</strong> {q.options[q.correctIndex]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="flex-1 text-center py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl shadow-lg transition"
                >
                  Return to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentIndex(0);
                    setUserAnswers({});
                    setSelectedAnswersMap({});
                    setSecondsRemaining(25 * 60);
                    setTimerActive(true);
                  }}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold rounded-xl border border-stone-800 transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Exam</span>
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      {!isSubmitted && (
        <footer className="sticky bottom-0 z-20 bg-[#050e06]/95 backdrop-blur-md border-t border-emerald-950 px-4 sm:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-300 border border-stone-800 transition flex items-center gap-1 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs font-mono text-stone-400">
              {userAnswers[currentIndex] !== undefined ? (
                <span className="text-emerald-400">Choice Recorded</span>
              ) : (
                <span className="text-stone-500">Unanswered</span>
              )}
            </div>

            <div>
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-stone-950 transition flex items-center gap-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-amber-400 hover:opacity-90 text-stone-950 shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
