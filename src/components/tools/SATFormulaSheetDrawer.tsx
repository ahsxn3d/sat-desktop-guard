'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface SATFormulaSheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SATFormulaSheetDrawer: React.FC<SATFormulaSheetDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const formulas = [
    { name: 'Circle Area', formula: 'A = πr²', note: 'r is radius' },
    { name: 'Circle Circumference', formula: 'C = 2πr = πd', note: 'd is diameter' },
    { name: 'Triangle Area', formula: 'A = ½ b h', note: 'b is base, h is perpendicular height' },
    { name: 'Pythagorean Theorem', formula: 'a² + b² = c²', note: 'c is hypotenuse of right triangle' },
    { name: '30°-60°-90° Triangle', formula: 'x : x√3 : 2x', note: 'opposite 30° is x; opposite 90° is 2x' },
    { name: '45°-45°-90° Triangle', formula: 's : s : s√2', note: 'legs are s; hypotenuse is s√2' },
    { name: 'Rectangular Prism Volume', formula: 'V = l w h', note: 'length × width × height' },
    { name: 'Cylinder Volume', formula: 'V = π r² h', note: 'base area × height' },
    { name: 'Sphere Volume', formula: 'V = (4/3) π r³', note: 'r is radius' },
    { name: 'Cone Volume', formula: 'V = (1/3) π r² h', note: 'exactly ⅓ of cylinder with same r, h' },
    { name: 'Pyramid Volume', formula: 'V = (1/3) l w h', note: 'exactly ⅓ of rectangular prism' },
    { name: 'Radian & Circle Angles', formula: '2π radians = 360°', note: 'π radians = 180°; arc length s = rθ' }
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full sm:w-[460px] h-full bg-[#0d2112] text-white border-l-2 border-[#86efac]/40 shadow-2xl flex flex-col p-6 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </span>
              <div>
                <h3 className="text-base font-black text-white font-['Space_Grotesk']">
                  Official SAT Reference Sheet
                </h3>
                <p className="text-[11px] text-emerald-300/80 font-mono">Provided on Digital SAT Math Modules</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Formulas Grid */}
          <div className="space-y-3">
            {formulas.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-['JetBrains_Mono']">
                    {item.name}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg font-black text-white font-mono tracking-wide py-0.5">
                  {item.formula}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          {/* Key Facts Callout */}
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-100 space-y-1.5 font-['JetBrains_Mono']">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Universal SAT Rules:</span>
            </div>
            <p>&bull; The number of degrees of arc in a circle is 360.</p>
            <p>&bull; The number of radians of arc in a circle is 2π.</p>
            <p>&bull; The sum of the measures in degrees of the angles of a triangle is 180.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
