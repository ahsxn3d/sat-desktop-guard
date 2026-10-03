'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronDown, Sparkles, AlertCircle } from 'lucide-react';

interface ProgressiveHintEngineProps {
  hints: string[];
  disabled?: boolean;
  disabledReason?: string;
}

export const ProgressiveHintEngine: React.FC<ProgressiveHintEngineProps> = ({
  hints,
  disabled = false,
  disabledReason = 'Hints are disabled during high-stakes Quizzes and Unit Tests.'
}) => {
  const [revealedCount, setRevealedCount] = useState(0);

  if (disabled) {
    return (
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-2 font-['JetBrains_Mono']">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{disabledReason}</span>
      </div>
    );
  }

  if (!hints || hints.length === 0) return null;

  const handleRevealNext = () => {
    if (revealedCount < hints.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Hint Reveal Button */}
      {revealedCount < hints.length && (
        <button
          type="button"
          onClick={handleRevealNext}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs font-['JetBrains_Mono'] border border-amber-300 transition-all cursor-pointer shadow-xs active:scale-98"
        >
          <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>
            {revealedCount === 0 ? `Get a hint (${hints.length} available)` : `Get next hint (${hints.length - revealedCount} remaining)`}
          </span>
        </button>
      )}

      {/* Revealed Hints Accordion List */}
      <AnimatePresence>
        {hints.slice(0, revealedCount).map((hint, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 rounded-2xl bg-white border-2 border-amber-200/80 shadow-xs space-y-1.5"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-800 font-['JetBrains_Mono']">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Hint {idx + 1} of {hints.length}</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
              {hint}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
