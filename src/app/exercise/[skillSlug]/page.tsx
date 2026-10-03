'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionsForLesson, KhanQuestion } from '@/data/khanQuestionBank';
import { finalizeAssessmentRun, AssessmentSubmissionResult } from '@/lib/assessmentEngine';
import { ProgressiveHintEngine } from '@/components/hints/ProgressiveHintEngine';
import { DigitalScratchpad } from '@/components/tools/DigitalScratchpad';
import { EmbeddedDesmos } from '@/components/tools/EmbeddedDesmos';
import { SATFormulaSheetDrawer } from '@/components/tools/SATFormulaSheetDrawer';
import { ExerciseCompleteModal } from '@/components/ExerciseCompleteModal';
import { Check, X, ArrowRight, Lightbulb, PenTool, Calculator, BookOpen, AlertCircle } from 'lucide-react';

export default function ExerciseRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.skillSlug as string) || 'math-u2-1';

  // Format slug e.g. "math-u2-1" -> "Math U2.1"
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

  // Load 4 questions for standard practice
  const questions: KhanQuestion[] = useMemo(() => {
    const pool = getQuestionsForLesson(formattedCode);
    return pool.slice(0, 4);
  }, [formattedCode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionStatus, setQuestionStatus] = useState<Array<'pending' | 'correct' | 'wrong'>>([
    'pending',
    'pending',
    'pending',
    'pending'
  ]);

  // Modals & Tools
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentSubmissionResult | null>(null);

  const currentQ = questions[currentIndex];

  // Derive step-by-step hints from explanation and takeaway rule
  const hints = useMemo(() => {
    if (!currentQ) return [];
    return [
      `Step 1: Identify key variables and relationships in the prompt.`,
      `Step 2: ${currentQ.explanation.split('.')[0] || 'Work through algebraic simplification.'}.`,
      `Final Rule & Desmos Hack: ${currentQ.takeawayRule}`
    ];
  }, [currentQ]);

  // Handle option select
  const handleSelectOption = (idx: number) => {
    if (hasChecked && isCorrect) return; // Prevent changing after correct
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
  }, [selectedOption, hasChecked, isCorrect, currentIndex]);

  // Check Answer
  const handleCheckAnswer = () => {
    if (selectedOption === null || !currentQ) return;

    const correct = selectedOption === currentQ.correctIndex;
    setIsCorrect(correct);
    setHasChecked(true);

    const updatedAnswers = { ...userAnswers, [currentIndex]: selectedOption };
    setUserAnswers(updatedAnswers);

    const updatedStatus = [...questionStatus];
    updatedStatus[currentIndex] = correct ? 'correct' : 'wrong';
    setQuestionStatus(updatedStatus);
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasChecked(false);
      setIsCorrect(false);
    } else {
      // Completed the 4-question practice set!
      const finalResult = finalizeAssessmentRun(
        {
          mode: 'practice',
          targetId: formattedCode,
          title: `${formattedCode} Practice`,
          subject: isMath ? 'math' : 'rw',
          questionCount: questions.length,
          hintsAllowed: true,
          instantFeedback: true,
          scratchpadAllowed: true,
          desmosAllowed: isMath,
          referenceSheetAllowed: isMath
        },
        questions,
        userAnswers
      );
      setAssessmentResult(finalResult);
      setIsCompleteModalOpen(true);
    }
  };

  const handleRetry = () => {
    setIsCompleteModalOpen(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasChecked(false);
    setIsCorrect(false);
    setUserAnswers({});
    setQuestionStatus(['pending', 'pending', 'pending', 'pending']);
  };

  return (
    <div className="min-h-screen bg-[#0d1c0f] text-[#e8f5e6] flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative">
      {/* Scratchpad Overlay */}
      <DigitalScratchpad isOpen={isScratchpadOpen} onClose={() => setIsScratchpadOpen(false)} />

      {/* Desmos Graphing Calculator Modal */}
      <EmbeddedDesmos isOpen={isDesmosOpen} onClose={() => setIsDesmosOpen(false)} />

      {/* SAT Formula Sheet Drawer */}
      <SATFormulaSheetDrawer isOpen={isFormulaDrawerOpen} onClose={() => setIsFormulaDrawerOpen(false)} />

      {/* Completion Modal with Confetti & Mastery State Upgrades */}
      {assessmentResult && (
        <ExerciseCompleteModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          result={assessmentResult}
          onRetry={handleRetry}
          onNext={() => router.push(isMath ? '/course/sat-math' : '/course/sat-reading-writing')}
        />
      )}

      {/* Top Bar: Progress Segments, Exit, & Floating Tools */}
      <header className="sticky top-0 z-20 bg-[#09140a]/90 backdrop-blur-md border-b border-emerald-950 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Exit & Lesson Identity */}
        <div className="flex items-center gap-3">
          <Link
            href={isMath ? '/course/sat-math' : '/course/sat-reading-writing'}
            className="text-xs uppercase tracking-wider font-mono font-bold text-stone-400 hover:text-emerald-400 bg-stone-900/60 px-3 py-1.5 rounded-lg border border-stone-800 transition flex items-center gap-1"
          >
            ✕ Exit
          </Link>
          <div className="h-4 w-px bg-stone-800" />
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded">
            {formattedCode}
          </span>
          <span className="hidden sm:inline text-xs text-stone-300 font-medium">
            Practice (4 Questions)
          </span>
        </div>

        {/* 4 Circular Indicators representing the 4 questions */}
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

        {/* Floating Tools Toolbar */}
        <div className="flex items-center gap-2">
          {/* Scratchpad Toggle */}
          <button
            type="button"
            onClick={() => setIsScratchpadOpen((prev) => !prev)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              isScratchpadOpen
                ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-800'
            }`}
            title="Digital Scratchpad Pen"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden md:inline font-mono">Scratchpad</span>
          </button>

          {/* Desmos Graphing Calculator */}
          {isMath && (
            <button
              type="button"
              onClick={() => setIsDesmosOpen(true)}
              className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="Official Desmos Calculator"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline font-mono">Desmos</span>
            </button>
          )}

          {/* Formulas Reference */}
          {isMath && (
            <button
              type="button"
              onClick={() => setIsFormulaDrawerOpen(true)}
              className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="Digital SAT Reference Formulas"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline font-mono">Formulas</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container: Question Text, Interactive Inputs, & Hints */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {currentQ ? (
          <div className="bg-[#102413] rounded-3xl border border-emerald-900/60 p-6 sm:p-10 shadow-2xl relative space-y-6">
            {/* Question Label */}
            <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
              <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-mono text-stone-400">
                100% on 4/4 gives Proficient status
              </span>
            </div>

            {/* Question Prompt */}
            <div className="text-base sm:text-lg text-emerald-50 leading-relaxed font-sans whitespace-pre-line font-medium">
              {currentQ.question}
            </div>

            {/* Interactive Multiple Choice Inputs */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const letter = String.fromCharCode(65 + oIdx);

                let optStyle = 'border-stone-800 bg-[#0a180c]/60 hover:bg-[#132c17] text-stone-200';
                if (isSelected) {
                  optStyle = 'border-emerald-500 bg-emerald-950/80 text-white ring-2 ring-emerald-500/40';
                }
                if (hasChecked) {
                  if (oIdx === currentQ.correctIndex) {
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
                    <span className="text-sm sm:text-base font-medium flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Progressive Hint Engine Toggle & Scaffolding */}
            <div className="border-t border-emerald-950/80 pt-4">
              <ProgressiveHintEngine hints={hints} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">Loading drill questions...</div>
        )}
      </main>

      {/* Bottom Floating/Sticky Action Bar */}
      <footer className="sticky bottom-0 z-20 bg-[#09140a]/95 backdrop-blur-md border-t border-emerald-950 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Status Message */}
          <div className="text-xs sm:text-sm font-mono">
            {!hasChecked ? (
              <span className="text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-600 animate-ping" />
                Select an answer to check (or press A-D / 1-4)
              </span>
            ) : isCorrect ? (
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                Correct! Outstanding work.
              </span>
            ) : (
              <span className="text-orange-400 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Not quite. Review the explanation or hints, then proceed.
              </span>
            )}
          </div>

          {/* Action Button: Check -> Next Question */}
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
