'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Crown, Award, CheckCircle2, RotateCcw, ArrowRight, Zap, Flame, Sparkles } from 'lucide-react';
import { AssessmentSubmissionResult } from '../lib/assessmentEngine';

interface ExerciseCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AssessmentSubmissionResult;
  onRetry?: () => void;
  onNext?: () => void;
}

export const ExerciseCompleteModal: React.FC<ExerciseCompleteModalProps> = ({
  isOpen,
  onClose,
  result,
  onRetry,
  onNext
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: result.percentage >= 80 ? 100 : 40,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti burst error', e);
      }
    }
  }, [isOpen, result.percentage]);

  if (!isOpen) return null;

  const isPerfect = result.percentage === 100;
  const isProficient = result.percentage >= 80;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg rounded-3xl bg-[#0d2112] text-white border-2 border-[#86efac]/50 shadow-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Glow */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="inline-flex p-4 rounded-3xl bg-[#16381e] border-2 border-[#86efac]/40 shadow-inner relative">
            {isPerfect ? (
              <Crown className="w-16 h-16 text-amber-400 animate-bounce" />
            ) : isProficient ? (
              <Award className="w-16 h-16 text-emerald-400" />
            ) : (
              <RotateCcw className="w-16 h-16 text-orange-400" />
            )}
          </div>

          {/* Title & Score */}
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
              {isPerfect
                ? '100% PERFECT MASTERY!'
                : isProficient
                ? 'PROFICIENT LEVEL REACHED!'
                : 'DRILL COMPLETED'}
            </h3>
            <p className="text-sm text-emerald-200/90 font-medium">
              You scored <span className="font-bold text-white">{result.score}</span> out of{' '}
              <span className="font-bold text-white">{result.total}</span> questions correct ({result.percentage}%).
            </p>
          </div>

          {/* Rewards & Energy Points Card */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 font-['JetBrains_Mono']">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Energy Points</span>
              <span className="text-xl font-black text-amber-400">+{result.energyPointsEarned} XP</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">Streak Status</span>
              <span className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                Active
              </span>
            </div>
          </div>

          {/* Skill Promotions / Demotions */}
          {result.promotedSkills.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-left text-xs space-y-1 font-['JetBrains_Mono']">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Skills Promoted on this Set:</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.promotedSkills.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-bold">
                    {s} &bull; {isPerfect ? 'MASTERED 👑' : 'PROFICIENT 🟢'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.demotedSkills.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-left text-xs space-y-1 font-['JetBrains_Mono']">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Skills Demoted (Unit Test Penalty):</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.demotedSkills.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-200 border border-rose-400/40 font-bold">
                    {s} &bull; Needs Practice
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer font-['JetBrains_Mono']"
              >
                Retry Drill
              </button>
            )}
            <button
              type="button"
              onClick={onNext || onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs font-['JetBrains_Mono'] hover:brightness-110 active:scale-98 transition shadow-lg cursor-pointer"
            >
              <span>{onNext ? 'Next Lesson' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
