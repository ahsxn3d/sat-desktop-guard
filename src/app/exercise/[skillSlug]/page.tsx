'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { getQuestionsForLesson, KhanQuestion, KHAN_QUESTION_BANK } from '@/data/khanQuestionBank';
import { finalizeAssessmentRun, AssessmentSubmissionResult } from '@/lib/assessmentEngine';
import { getUserStreakState } from '@/lib/streakEngine';
import { ProgressiveHintEngine } from '@/components/hints/ProgressiveHintEngine';
import { DigitalScratchpad } from '@/components/tools/DigitalScratchpad';
import { EmbeddedDesmos } from '@/components/tools/EmbeddedDesmos';
import { SATFormulaSheetDrawer } from '@/components/tools/SATFormulaSheetDrawer';
import { MathRenderer } from '@/components/MathRenderer';
import {
  Check,
  X,
  ArrowRight,
  Lightbulb,
  PenTool,
  Calculator,
  BookOpen,
  AlertCircle,
  Flame,
  Award,
  Zap,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface QuestionItem {
  id: string;
  skillId?: string;
  prompt: string;
  options: string[];
  solution: string;
  hints: string[];
  difficulty?: string;
}

export default function ExerciseRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const rawParam = (params?.skillSlug || params?.skillId || 'math-u2-1') as string;

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questionStatus, setQuestionStatus] = useState<Array<'pending' | 'correct' | 'wrong'>>([
    'pending',
    'pending',
    'pending',
    'pending'
  ]);

  // Tools
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);

  // Completion modal state
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<{
    score: number;
    total: number;
    percentage: number;
    xpEarned: number;
    promotedStatus: string;
  } | null>(null);

  // Load questions from PostgreSQL API or fallback to local question bank
  useEffect(() => {
    const streak = getUserStreakState();
    setStreakCount(streak.currentStreak || 1);

    async function fetchQuestions() {
      setLoading(true);
      try {
        // Attempt DB API fetch first
        const res = await fetch(`/api/assessment?type=PRACTICE&skillId=${encodeURIComponent(rawParam)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.questions && json.data.questions.length > 0) {
            setQuestions(json.data.questions);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to local catalog
      }

      // Format code e.g. "math-u2-1" -> "Math U2.1"
      let formattedCode = 'Math U2.1';
      const parts = rawParam.split('-');
      if (parts.length >= 3) {
        const subj = parts[0] === 'rw' ? 'R&W' : 'Math';
        const unit = parts[1].toUpperCase();
        const lesson = parts[2];
        formattedCode = `${subj} ${unit}.${lesson}`;
      }

      const localPool = getQuestionsForLesson(formattedCode).slice(0, 4);
      const adapted: QuestionItem[] = localPool.map((q) => ({
        id: q.id,
        prompt: q.question,
        options: q.options,
        solution: q.options[q.correctIndex],
        hints: [
          'Step 1: Identify given equations, rates of change, and constants.',
          q.explanation,
          `⚡ Desmos Shortcut: ${q.takeawayRule}`
        ],
        difficulty: 'MEDIUM'
      }));

      setQuestions(adapted);
      setLoading(false);
    }

    fetchQuestions();
  }, [rawParam]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasChecked && isCorrect) return;
    setSelectedOption(idx);
    setHasChecked(false);
  };

  // Keyboard navigation for A, B, C, D (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', 'a', 'A'].includes(e.key)) handleSelectOption(0);
      else if (['2', 'b', 'B'].includes(e.key)) handleSelectOption(1);
      else if (['3', 'c', 'C'].includes(e.key)) handleSelectOption(2);
      else if (['4', 'd', 'D'].includes(e.key)) handleSelectOption(3);
      else if (e.key === 'Enter') {
        if (!hasChecked && selectedOption !== null) {
          handleCheckAnswer();
        } else if (hasChecked && isCorrect) {
          handleNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, hasChecked, isCorrect, currentIndex, questions]);

  const handleCheckAnswer = () => {
    if (selectedOption === null || !currentQ) return;

    const chosenText = currentQ.options[selectedOption];
    const correct =
      chosenText.trim().toLowerCase() === currentQ.solution.trim().toLowerCase() ||
      selectedOption === 0 && currentQ.options[0] === currentQ.solution;

    setIsCorrect(correct);
    setHasChecked(true);

    const updatedAnswers = { ...userAnswers, [currentQ.id]: chosenText };
    setUserAnswers(updatedAnswers);

    const updatedStatus = [...questionStatus];
    updatedStatus[currentIndex] = correct ? 'correct' : 'wrong';
    setQuestionStatus(updatedStatus);
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasChecked(false);
      setIsCorrect(false);
    } else {
      // Completed the 4-question run!
      const correctCount = questionStatus.filter((s) => s === 'correct').length + (isCorrect ? 1 : 0);
      const score = Math.min(questions.length, correctCount);
      const percentage = Math.round((score / questions.length) * 100);
      const xp = score * 100 + (percentage === 100 ? 500 : 0);
      const promoted = percentage === 100 ? 'PROFICIENT' : percentage >= 70 ? 'FAMILIAR' : 'ATTEMPTED';

      // Submit to PostgreSQL API
      try {
        await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'usr-student-session',
            testType: 'PRACTICE',
            targetId: rawParam,
            answers: userAnswers
          })
        });
      } catch (e) {
        // Fallback graceful
      }

      setCompletionData({
        score,
        total: questions.length,
        percentage,
        xpEarned: xp,
        promotedStatus: promoted
      });
      setIsCompleted(true);

      // Trigger canvas-confetti explosion
      try {
        confetti({
          particleCount: percentage === 100 ? 120 : 50,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  };

  const handleRetry = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasChecked(false);
    setIsCorrect(false);
    setUserAnswers({});
    setQuestionStatus(['pending', 'pending', 'pending', 'pending']);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1c0f] text-[#e8f5e6] flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span>Loading practice questions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1c0f] text-[#e8f5e6] flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative">
      {/* Scratchpad Overlay */}
      <DigitalScratchpad isOpen={isScratchpadOpen} onClose={() => setIsScratchpadOpen(false)} />

      {/* Slide-out Desmos Calculator Drawer */}
      <EmbeddedDesmos isOpen={isDesmosOpen} onClose={() => setIsDesmosOpen(false)} />

      {/* SAT Formulas Drawer */}
      <SATFormulaSheetDrawer isOpen={isFormulaDrawerOpen} onClose={() => setIsFormulaDrawerOpen(false)} />

      {/* Phase 5 Completion Modal with Confetti, XP, and Mastery Status */}
      {isCompleted && completionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#102413] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />

            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/30">
              {completionData.percentage === 100 ? '🏆' : '🎯'}
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Practice Set Completed
              </span>
              <h2 className="text-2xl font-black text-white font-serif mt-2">
                {completionData.score} / {completionData.total} Correct ({completionData.percentage}%)
              </h2>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a180c] border border-stone-800 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-mono text-stone-400 uppercase">XP Awarded</span>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  +{completionData.xpEarned} XP
                </div>
              </div>
              <div className="bg-[#0a180c] border border-stone-800 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-mono text-stone-400 uppercase">Skill Status</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  {completionData.promotedStatus}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/course/sat-math"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Continue Course</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleRetry}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs rounded-xl border border-stone-800 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Practice Set</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Header: Progress Dots, Exit Button, & Streak Badge */}
      <header className="sticky top-0 z-20 bg-[#09140a]/90 backdrop-blur-md border-b border-emerald-950 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Exit Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/course/sat-math"
            className="text-xs uppercase tracking-wider font-mono font-bold text-stone-400 hover:text-emerald-400 bg-stone-900/60 px-3 py-1.5 rounded-lg border border-stone-800 transition flex items-center gap-1"
          >
            ✕ Exit
          </Link>
          <div className="h-4 w-px bg-stone-800" />
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded">
            Practice
          </span>
        </div>

        {/* 4 Circular Progress Dots */}
        <div className="flex items-center gap-2">
          {questions.map((_, idx) => {
            const status = questionStatus[idx];
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={idx}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  status === 'correct'
                    ? 'bg-emerald-500 text-stone-950 shadow-sm shadow-emerald-500/30'
                    : status === 'wrong'
                    ? 'bg-orange-500 text-white'
                    : isCurrent
                    ? 'bg-emerald-950 text-emerald-400 border-2 border-emerald-400 animate-pulse'
                    : 'bg-stone-900 text-stone-500 border border-stone-800'
                }`}
              >
                {status === 'correct' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
            );
          })}
        </div>

        {/* Streak Badge & Tool Buttons */}
        <div className="flex items-center gap-2">
          {/* Current Streak Badge */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-300 font-bold text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{streakCount}d</span>
          </div>

          {/* Desmos Tool */}
          <button
            type="button"
            onClick={() => setIsDesmosOpen(true)}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
            title="Desmos Graphing Calculator"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline font-mono">Desmos</span>
          </button>

          {/* Formulas */}
          <button
            type="button"
            onClick={() => setIsFormulaDrawerOpen(true)}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
            title="SAT Formulas"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline font-mono">Formulas</span>
          </button>

          {/* Scratchpad */}
          <button
            type="button"
            onClick={() => setIsScratchpadOpen(true)}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
            title="Digital Scratchpad"
          >
            <PenTool className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Question View */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {currentQ ? (
          <div className="bg-[#102413] rounded-3xl border border-emerald-900/60 p-6 sm:p-10 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
              <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-mono text-stone-400">
                Score 4/4 to unlock Proficient status
              </span>
            </div>

            {/* LaTeX Math Rendered Prompt */}
            <div className="text-base sm:text-lg text-emerald-50 leading-relaxed font-sans font-medium">
              <MathRenderer content={currentQ.prompt} />
            </div>

            {/* Interactive Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const letter = String.fromCharCode(65 + oIdx);

                let optStyle = 'border-stone-800 bg-[#0a180c]/60 hover:bg-[#132c17] text-stone-200';
                if (isSelected) {
                  optStyle = 'border-emerald-500 bg-emerald-950/80 text-white ring-2 ring-emerald-500/40';
                }
                if (hasChecked) {
                  if (opt === currentQ.solution || oIdx === 0 && currentQ.options[0] === currentQ.solution) {
                    optStyle = 'border-emerald-400 bg-emerald-900/60 text-emerald-200 ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'border-rose-500 bg-rose-950/60 text-rose-200 ring-2 ring-rose-500';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${optStyle}`}
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

            {/* "Get a Hint" Sequential Scaffolding */}
            <div className="border-t border-emerald-950/80 pt-4">
              <ProgressiveHintEngine hints={currentQ.hints} />
            </div>
          </div>
        ) : null}
      </main>

      {/* Feedback Footer: "Check Answer" / "Next Question" */}
      <footer className="sticky bottom-0 z-20 bg-[#09140a]/95 backdrop-blur-md border-t border-emerald-950 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-xs sm:text-sm font-mono">
            {!hasChecked ? (
              <span className="text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-600 animate-ping" />
                Select an answer to check (Keys A–D or 1–4)
              </span>
            ) : isCorrect ? (
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                Correct! Excellent deduction.
              </span>
            ) : (
              <span className="text-orange-400 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Review the progressive hints and try again.
              </span>
            )}
          </div>

          <div>
            {!hasChecked ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
