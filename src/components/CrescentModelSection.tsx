import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  AlertTriangle, 
  Trophy, 
  FileText, 
  Laptop, 
  IdCard,
  Target
} from 'lucide-react';
import { PackingItem } from '../types';

interface CrescentModelSectionProps {
  items: PackingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (itemText: string) => void;
}

export const CrescentModelSection: React.FC<CrescentModelSectionProps> = ({
  items,
  onToggleItem,
  onAddItem,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  return (
    <motion.section 
      id="section-crescent"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl p-5 sm:p-7 shadow-grave hover:shadow-grave-hover space-y-6 transition-all duration-300"
    >
      {/* Target Number 7 Exam Alert Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-amber-700 rounded-2xl p-4 sm:p-5 text-white shadow-grave-card hover:shadow-grave-card-hover transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 font-['JetBrains_Mono'] flex items-center gap-1.5 shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-slate-950" />
              <span>KEY DATE: SATURDAY, NOV 7</span>
            </span>
            <span className="text-xs font-black text-amber-200 uppercase tracking-wide font-['JetBrains_Mono']">
              Official SAT Paper Exam Day
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-white">
            November 7: Crescent Model Exam Center
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 font-semibold max-w-2xl leading-relaxed">
            All 57 days of your preparation lead to Saturday, November 7. Crescent Model Higher Secondary School (Lahore). Gates close strictly at 7:45 AM.
          </p>
        </div>

        <div className="p-3.5 bg-black/35 backdrop-blur-xs rounded-2xl border border-white/25 text-center sm:text-right shrink-0 shadow-inner">
          <div className="text-[10px] font-bold uppercase text-amber-300 font-['JetBrains_Mono']">
            Exam Checklist Status
          </div>
          <div className="text-lg sm:text-xl font-black font-['JetBrains_Mono'] text-white">
            {packedCount} / {totalCount} Packed
          </div>
          <div className="text-[10px] text-amber-200 font-extrabold mt-0.5">
            {packedCount === totalCount ? '100% Bag Ready!' : 'Prep Needed'}
          </div>
        </div>
      </div>

      {/* Schedule & Timing Timeline with Scroll Trigger Reveals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="p-4 rounded-2xl bg-matcha-sub border-2 border-slate-200 shadow-grave-card hover:shadow-grave-card-hover hover:border-slate-400 transition-all duration-200 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase font-['JetBrains_Mono']">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>6:30 AM &bull; Nov 7</span>
            </div>
            <h4 className="mt-2 text-base font-bold text-slate-950 font-luxury">
              Wake Up & Fuel
            </h4>
            <p className="mt-1 text-xs text-slate-700 font-semibold leading-relaxed">
              Clean complex carbs & protein (eggs, toast, banana). Sip water, grab your pre-packed bag.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-bold text-indigo-950 bg-indigo-100/70 border border-indigo-200 rounded-lg p-1.5 text-center">
            Zero Last-Minute Cramming
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-grave-card hover:shadow-grave-card-hover hover:border-amber-400 transition-all duration-200 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase font-['JetBrains_Mono']">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>7:15 AM (Strict)</span>
            </div>
            <h4 className="mt-2 text-base font-bold text-slate-950 font-luxury">
              Arrive at Crescent Model
            </h4>
            <p className="mt-1 text-xs text-slate-700 font-semibold leading-relaxed">
              Buffer for traffic. Check in at main gate, clear entrance queue, locate assigned testing wing.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-bold text-amber-950 bg-amber-200/80 border border-amber-300 rounded-lg p-1.5 text-center">
            30-Min Safety Margin
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-300 shadow-grave-card hover:shadow-grave-card-hover hover:border-rose-400 transition-all duration-200 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 uppercase font-['JetBrains_Mono']">
              <Clock className="w-4 h-4 text-rose-700" />
              <span>7:45 AM &bull; Critical</span>
            </div>
            <h4 className="mt-2 text-base font-bold text-slate-950 font-luxury">
              Center Doors Close
            </h4>
            <p className="mt-1 text-xs text-slate-700 font-semibold leading-relaxed">
              College Board enforces strict lockout. Be seated in your exam room by 7:35 AM latest.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-bold text-rose-950 bg-rose-200/80 border border-rose-300 rounded-lg p-1.5 text-center">
            Zero-Tolerance Late Lockout
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 shadow-grave-card hover:shadow-grave-card-hover hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase font-['JetBrains_Mono']">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>8:00 AM &bull; Start</span>
            </div>
            <h4 className="mt-2 text-base font-bold text-slate-950 font-luxury">
              Paper Exam Commences
            </h4>
            <p className="mt-1 text-xs text-slate-700 font-semibold leading-relaxed">
              RW Module 1 &rarr; RW Module 2 &rarr; 10m Break &rarr; Math Module 1 &rarr; Math Module 2.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-bold text-emerald-950 bg-emerald-200/80 border border-emerald-300 rounded-lg p-1.5 text-center">
            Calm Pacing Execution
          </div>
        </motion.div>
      </div>

      {/* Interactive Bag Packing List */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-['JetBrains_Mono']">
              Pack 48 Hours Before: Thursday Night (Nov 5)
            </h3>
            <p className="text-xs text-slate-700 font-medium">
              Never wait until Friday night to discover missing cables, dead power banks, or expired ID.
            </p>
          </div>
          <span className="text-xs font-black text-slate-800 bg-matcha-sub border border-[#a6c4a1]/70 px-3 py-1 rounded-xl self-start sm:self-auto font-['JetBrains_Mono'] shadow-xs">
            {packedCount}/{totalCount} Items Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`task-check-card calendar-date-neon-hover p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 min-h-[44px] cursor-pointer shadow-grave-card ${
                item.packed
                  ? 'bg-emerald-50/70 border-emerald-300 text-slate-600'
                  : 'bg-matcha-input border-[#a6c4a1]/60 text-slate-950'
              }`}
            >
              <span className="task-check-dot mt-0.5 shrink-0">
                {item.packed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-bold block ${
                    item.packed ? 'line-through text-slate-500' : 'text-slate-950'
                  }`}
                >
                  {item.item}
                </span>
                {item.required && (
                  <span className="text-[10px] font-black text-rose-700 uppercase font-['JetBrains_Mono']">
                    Mandatory for Entry
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAdd} className="pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add custom packing item (e.g. backup glasses, chocolate bar, water bottle)..."
            className="flex-1 text-xs px-3.5 py-3 rounded-xl border-2 border-[#a6c4a1]/70 bg-matcha-sub focus:bg-matcha-input focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium text-slate-900 placeholder:text-slate-500 min-h-[44px] shadow-inner"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl text-xs font-black text-white bg-slate-950 hover:bg-slate-800 hover:shadow-md active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 min-h-[44px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </form>
      </div>
    </motion.section>
  );
};
