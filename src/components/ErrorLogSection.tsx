import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Plus, AlertTriangle, CheckCircle2, Trash2, Download } from 'lucide-react';
import { ErrorLogEntry } from '../types';
import { MatchaSelect } from './MatchaSelect';

interface ErrorLogSectionProps {
  entries: ErrorLogEntry[];
  onAddEntry: (entry: Omit<ErrorLogEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  onToggleReviewed: (id: string) => void;
  onOpenModal: () => void;
}

export const ErrorLogSection: React.FC<ErrorLogSectionProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  onToggleReviewed,
  onOpenModal,
}) => {
  const [showAddInline, setShowAddInline] = useState(false);
  const [testOrSection, setTestOrSection] = useState('Bluebook Practice Test #1');
  const [questionRef, setQuestionRef] = useState('');
  const [domain, setDomain] = useState<'Math' | 'Reading/Writing'>('Math');
  const [whyMissed, setWhyMissed] = useState('');
  const [takeawayRule, setTakeawayRule] = useState('');

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionRef.trim() || !whyMissed.trim()) return;

    onAddEntry({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      testOrSection,
      questionRef: questionRef.trim(),
      domain,
      whyMissed: whyMissed.trim(),
      takeawayRule: takeawayRule.trim() || 'Review concept before next mock.',
      reviewed: false,
    });

    setQuestionRef('');
    setWhyMissed('');
    setTakeawayRule('');
    setShowAddInline(false);
  };

  return (
    <motion.section 
      id="section-error-log"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl p-5 sm:p-7 shadow-grave hover:shadow-grave-hover space-y-6 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#bfd5bb] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-indigo-100 text-indigo-950 border border-indigo-300 font-['JetBrains_Mono'] shadow-xs">
              High-Scorer Habit
            </span>
            <span className="text-xs text-slate-800 font-black font-['JetBrains_Mono']">
              {entries.length} Missed Questions Logged
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-luxury flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Mistake Autopsy & Error Log</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-2xl leading-relaxed">
            Every point lost on the digital SAT comes from a repeat mistake. Record missed questions here, determine the exact root cause, and formulate a rule so you never miss it again.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddInline(!showAddInline)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] transition-all duration-150 flex items-center gap-1.5 shadow-xs min-h-[44px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log a Mistake</span>
          </button>
          <button
            onClick={onOpenModal}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-800 bg-matcha-sub hover:bg-matcha-input hover:shadow-sm active:scale-[0.98] border border-[#a6c4a1]/70 transition-all duration-150 min-h-[44px] cursor-pointer"
          >
            Full View & Export
          </button>
        </div>
      </div>

      {/* Inline Quick Add Form */}
      {showAddInline && (
        <form onSubmit={handleInlineSubmit} className="p-4 sm:p-5 rounded-2xl bg-matcha-sub border-2 border-indigo-200/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-indigo-950 font-['JetBrains_Mono']">
              Quick Log Missed Question
            </span>
            <button
              type="button"
              onClick={() => setShowAddInline(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 p-1"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-black text-slate-800 font-['JetBrains_Mono']">Test or Source</label>
              <input
                type="text"
                value={testOrSection}
                onChange={(e) => setTestOrSection(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 rounded-xl bg-matcha-input border border-[#a6c4a1]/70 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 min-h-[44px]"
                placeholder="e.g. Bluebook Practice Test #1"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-800 font-['JetBrains_Mono']">Question Reference</label>
              <input
                type="text"
                value={questionRef}
                onChange={(e) => setQuestionRef(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 rounded-xl bg-matcha-input border border-[#a6c4a1]/70 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 min-h-[44px]"
                placeholder="e.g. Module 2 Math Q18"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-800 font-['JetBrains_Mono'] block mb-1">Subject</label>
              <MatchaSelect
                value={domain}
                onChange={(val) => setDomain(val as 'Math' | 'Reading/Writing')}
                options={[
                  { value: 'Math', label: 'Math', badge: 'Math' },
                  { value: 'Reading/Writing', label: 'Reading/Writing', badge: 'R&W' },
                ]}
                variant="white"
                size="md"
                fullWidth
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-800 font-['JetBrains_Mono']">
              Root Cause / Why Missed
            </label>
            <input
              type="text"
              value={whyMissed}
              onChange={(e) => setWhyMissed(e.target.value)}
              className="mt-1 w-full text-xs p-2.5 rounded-xl bg-matcha-input border border-[#a6c4a1]/70 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 min-h-[44px]"
              placeholder="e.g. Misread question asked for 2x + 1 instead of x. Solved for wrong variable."
            />
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-800 font-['JetBrains_Mono']">
              Takeaway Rule (Never Miss Again)
            </label>
            <input
              type="text"
              value={takeawayRule}
              onChange={(e) => setTakeawayRule(e.target.value)}
              className="mt-1 w-full text-xs p-2.5 rounded-xl bg-matcha-input border border-[#a6c4a1]/70 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600"
              placeholder="e.g. Always underline the final question ask. Double check variable target."
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs min-h-[44px]"
            >
              Save to Autopsy Log
            </button>
          </div>
        </form>
      )}

      {/* Entries List or Zero State */}
      {entries.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-matcha-sub border-2 border-dashed border-[#a6c4a1]/70 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-950 font-luxury">
            No Missed Questions Logged Yet
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            When you solve questions tomorrow or take Bluebook practice tests, log every error here to diagnose patterns and prevent repeat mistakes.
          </p>
          <button
            onClick={() => setShowAddInline(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Error Entry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {entries.slice(0, 6).map((entry, eIdx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: eIdx * 0.05 }}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between space-y-3 shadow-grave-card hover:shadow-grave-card-hover ${
                  entry.reviewed
                    ? 'bg-matcha-sub border-[#a6c4a1]/70 opacity-85'
                    : 'bg-matcha-input border-[#a6c4a1]/60 hover:border-indigo-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] shadow-xs ${
                        entry.domain === 'Math'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {entry.domain}
                    </span>
                    <span className="text-[11px] text-slate-600 font-bold font-['JetBrains_Mono']">{entry.date}</span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-slate-950 font-luxury">
                    {entry.questionRef}
                  </h4>
                  <div className="text-[11px] text-slate-600 font-bold">
                    {entry.testOrSection}
                  </div>

                  <div className="mt-2 text-xs text-slate-800 bg-matcha-sub p-2.5 rounded-xl border border-[#a6c4a1]/50 font-medium leading-relaxed">
                    <strong className="text-slate-950 font-black">Root Cause:</strong> {entry.whyMissed}
                  </div>

                  {entry.takeawayRule && (
                    <div className="mt-1.5 text-xs text-emerald-950 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-bold">
                      💡 {entry.takeawayRule}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#a6c4a1]/50 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onToggleReviewed(entry.id)}
                    className={`font-black flex items-center gap-1.5 transition p-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                      entry.reviewed ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{entry.reviewed ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer hover:scale-110 active:scale-90"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {entries.length > 6 && (
            <div className="text-center pt-2">
              <button
                onClick={onOpenModal}
                className="text-xs font-black text-indigo-700 hover:underline cursor-pointer hover:scale-105 transition-transform"
              >
                View all {entries.length} error entries &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
};
