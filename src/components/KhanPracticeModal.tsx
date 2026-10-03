'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  Crown,
  ChevronRight,
  RotateCcw,
  Zap,
  BookOpen,
  Calculator,
  Flame,
  ArrowRight
} from 'lucide-react';
import { KhanQuestion, getQuestionsForLesson, getQuestionsForUnit } from '../data/khanQuestionBank';
import {
  recordLessonPracticeScore,
  recordUnitTestScore,
  getLessonMastery,
  MasteryLevel
} from '../lib/masteryTracker';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface KhanPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'lesson_practice' | 'unit_test';
  lessonCode?: string; // e.g. "Math U2.1"
  lessonTitle?: string;
  unitNumber?: number; // e.g. 2
  unitTitle?: string;
  subject?: 'math' | 'rw';
  onMasteryUpdated?: () => void;
}

export const KhanPracticeModal: React.FC<KhanPracticeModalProps> = ({
  isOpen,
  onClose,
  mode,
  lessonCode = 'Math U2.1',
  lessonTitle = 'Solving linear equations and inequalities',
  unitNumber = 2,
  unitTitle = 'Foundations: Algebra',
  subject = 'math',
  onMasteryUpdated
}) => {
  useModalScrollLock(isOpen);

  const [questions, setQuestions] = useState<KhanQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState<KhanQuestion[]>([]);
  const [hasAddedBonus, setHasAddedBonus] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalMasteryLevel, setFinalMasteryLevel] = useState<MasteryLevel>('not_started');

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setScore(0);
      setMissedQuestions([]);
      setHasAddedBonus(false);
      setIsFinished(false);

      if (mode === 'lesson_practice') {
        const qList = getQuestionsForLesson(lessonCode);
        setQuestions(qList);
      } else {
        const qList = getQuestionsForUnit(unitNumber, subject);
        setQuestions(qList);
      }
    }
  }, [isOpen, mode, lessonCode, unitNumber, subject]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isCorrect = selectedOption !== null && selectedOption === currentQ?.correctIndex;

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);

    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      setMissedQuestions((prev) => [...prev, currentQ]);
    }
  };

  const handleNext = () => {
    // If user missed 1 question in lesson practice and we haven't offered bonus yet
    if (
      mode === 'lesson_practice' &&
      !hasAddedBonus &&
      currentIndex === questions.length - 1 &&
      missedQuestions.length === 1
    ) {
      // Add bonus question from bank
      const allQ = getQuestionsForLesson(lessonCode);
      const bonus = allQ.find((q) => !questions.some((existing) => existing.id === q.id));
      if (bonus) {
        setQuestions((prev) => [...prev, bonus]);
        setHasAddedBonus(true);
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        return;
      }
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Test finished
      finalizeTest();
    }
  };

  const finalizeTest = () => {
    setIsFinished(true);

    if (mode === 'lesson_practice') {
      const result = recordLessonPracticeScore(lessonCode, score, questions.length);
      setFinalMasteryLevel(result.level);
    } else {
      const wrongCodes = missedQuestions.map((q) => q.lessonCode);
      const result = recordUnitTestScore(unitNumber, subject, score, questions.length, wrongCodes);
      setFinalMasteryLevel(result.isMastered ? 'mastered' : 'proficient');
    }

    if (onMasteryUpdated) {
      onMasteryUpdated();
    }
  };

  const getMasteryColor = (level: MasteryLevel) => {
    switch (level) {
      case 'mastered':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black';
      case 'proficient':
        return 'bg-emerald-500 text-white font-bold';
      case 'familiar':
        return 'bg-blue-500 text-white font-bold';
      case 'attempted':
        return 'bg-orange-500 text-white font-bold';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#122810]/55 backdrop-blur-md overflow-y-auto overscroll-contain"
        onClick={onClose}
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="ios-glass-card rounded-3xl border-2 border-[#a6c4a1] bg-[#f4faf2]/95 text-[#122810] shadow-2xl max-w-2xl w-full overflow-hidden relative select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20441d] to-[#142d12] text-[#f2f8f0] p-4 sm:p-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#325f2d] text-amber-300 border border-[#488240] font-['JetBrains_Mono']">
                {mode === 'lesson_practice' ? (
                  <>
                    <Zap className="w-3 h-3 text-amber-300" />
                    Khan Practice Drill (4 Questions)
                  </>
                ) : (
                  <>
                    <Crown className="w-3 h-3 text-amber-300" />
                    Unit Test ({questions.length} Questions)
                  </>
                )}
              </span>

              {mode === 'lesson_practice' && hasAddedBonus && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 font-['JetBrains_Mono']">
                  Bonus Question Added
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white font-['Space_Grotesk'] leading-snug">
              {mode === 'lesson_practice' ? `${lessonCode}: ${lessonTitle}` : `Unit ${unitNumber}: ${unitTitle}`}
            </h3>

            {/* Progress Bar */}
            {!isFinished && (
              <div className="mt-3 flex items-center justify-between text-xs text-[#a9cca4] font-['JetBrains_Mono']">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}/{currentIndex + (isAnswerChecked ? 1 : 0)}</span>
              </div>
            )}
            <div className="w-full bg-[#173315] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <motion.div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto overscroll-contain">
            {!isFinished ? (
              <div className="space-y-5">
                {/* Question Prompt */}
                <div className="p-4 rounded-2xl bg-white border border-[#a6c4a1] shadow-xs">
                  <div className="text-sm font-semibold text-[#122810] whitespace-pre-line leading-relaxed font-['Space_Grotesk']">
                    {currentQ?.question}
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {currentQ?.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOption === idx;
                    const isCorrectOpt = idx === currentQ.correctIndex;

                    let optStyle = 'bg-white border-[#a6c4a1] text-[#122810] hover:bg-[#e2efe0]';

                    if (isAnswerChecked) {
                      if (isCorrectOpt) {
                        optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                      } else if (isSelected && !isCorrectOpt) {
                        optStyle = 'bg-red-50 border-red-500 text-red-950';
                      } else {
                        optStyle = 'bg-white/50 border-gray-200 text-gray-400';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-[#264e22] border-[#264e22] text-white shadow-xs';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswerChecked}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3.5 ${optStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 font-['JetBrains_Mono'] ${
                          isAnswerChecked && isCorrectOpt
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : isSelected
                            ? 'bg-amber-400 border-amber-300 text-slate-950'
                            : 'bg-[#e5f0e1] border-[#a6c4a1] text-[#264e22]'
                        }`}>
                          {letters[idx]}
                        </span>
                        <span className="text-sm leading-snug flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon checking */}
                {isAnswerChecked && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm font-['Space_Grotesk']">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Correct! Outstanding precision.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          <span>Incorrect. Review the official method below:</span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-700 whitespace-pre-line">{currentQ.explanation}</p>

                    {currentQ.takeawayRule && (
                      <div className="p-2.5 rounded-xl bg-white/80 border border-gray-200 text-gray-800 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Takeaway Rule:</span> {currentQ.takeawayRule}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ) : (
              /* Final Score Screen */
              <div className="text-center py-6 space-y-5">
                <div className="inline-flex p-4 rounded-3xl bg-[#e5f0e1] border-2 border-[#a6c4a1] shadow-inner">
                  {score === questions.length ? (
                    <Crown className="w-16 h-16 text-amber-500 animate-bounce" />
                  ) : score >= Math.ceil(questions.length * 0.75) ? (
                    <Award className="w-16 h-16 text-emerald-600" />
                  ) : (
                    <RotateCcw className="w-16 h-16 text-orange-500" />
                  )}
                </div>

                <div>
                  <h4 className="text-2xl font-black text-[#122810] font-['Space_Grotesk']">
                    {score === questions.length
                      ? '100% PERFECT MASTERY!'
                      : score >= Math.ceil(questions.length * 0.75)
                      ? 'PROFICIENT LEVEL REACHED!'
                      : 'DRILL COMPLETED — REVIEW RECOMMENDED'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    You scored {score} out of {questions.length} questions correct ({Math.round((score / questions.length) * 100)}%).
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-['JetBrains_Mono'] shadow-xs">
                  <span>Khan Academy Mastery Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full ${getMasteryColor(finalMasteryLevel)}`}>
                    {finalMasteryLevel.toUpperCase()}
                  </span>
                </div>

                {missedQuestions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-[#a6c4a1] text-left text-xs text-gray-700 space-y-2">
                    <span className="font-bold text-[#264e22] block">Skills Missed on this Run:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {missedQuestions.map((q) => (
                        <li key={q.id}>
                          <span className="font-semibold">{q.lessonCode}:</span> {q.question.substring(0, 70)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-white/70 border-t border-[#a6c4a1]/50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#a6c4a1] text-xs font-bold text-[#264e22] hover:bg-[#e2efe0] cursor-pointer"
            >
              Close
            </button>

            {!isFinished ? (
              !isAnswerChecked ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleCheckAnswer}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#264e22] to-[#183915] text-amber-300 font-bold text-xs uppercase tracking-wider font-['JetBrains_Mono'] hover:brightness-110 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#264e22] to-[#183915] text-amber-300 font-bold text-xs uppercase tracking-wider font-['JetBrains_Mono'] hover:brightness-110 active:scale-98 transition-all shadow-md cursor-pointer"
                >
                  {currentIndex === questions.length - 1 && !hasAddedBonus ? 'Finish Test' : 'Next Question'}
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#264e22] to-[#183915] text-amber-300 font-bold text-xs uppercase tracking-wider font-['JetBrains_Mono'] hover:brightness-110 cursor-pointer shadow-md"
              >
                Done
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
