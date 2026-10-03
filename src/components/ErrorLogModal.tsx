import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle, BookOpen, AlertTriangle, Filter, Download } from 'lucide-react';
import { ErrorLogEntry } from '../types';
import { MatchaSelect } from './MatchaSelect';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface ErrorLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: ErrorLogEntry[];
  onAddEntry: (entry: Omit<ErrorLogEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  onToggleReviewed: (id: string) => void;
}

export const ErrorLogModal: React.FC<ErrorLogModalProps> = ({
  isOpen,
  onClose,
  entries,
  onAddEntry,
  onDeleteEntry,
  onToggleReviewed,
}) => {
  useModalScrollLock(isOpen);
  const [isAdding, setIsAdding] = useState(false);
  const [testOrSection, setTestOrSection] = useState('Bluebook Practice Test #1');
  const [questionRef, setQuestionRef] = useState('');
  const [domain, setDomain] = useState<'Math' | 'Reading/Writing'>('Math');
  const [whyMissed, setWhyMissed] = useState('');
  const [takeawayRule, setTakeawayRule] = useState('');
  const [filterDomain, setFilterDomain] = useState<'All' | 'Math' | 'Reading/Writing'>('All');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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

    // Reset form
    setQuestionRef('');
    setWhyMissed('');
    setTakeawayRule('');
    setIsAdding(false);
  };

  const filteredEntries = entries.filter((e) => {
    if (filterDomain === 'All') return true;
    return e.domain === filterDomain;
  });

  const exportAsText = () => {
    if (entries.length === 0) return;
    const text = entries
      .map(
        (e, idx) =>
          `[#${idx + 1}] ${e.testOrSection} | ${e.domain} - ${e.questionRef} (${e.date})\n` +
          `Why Missed: ${e.whyMissed}\n` +
          `Takeaway Rule: ${e.takeawayRule}\n` +
          `Status: ${e.reviewed ? 'Mastered / Reviewed' : 'Needs Practice'}\n` +
          `----------------------------------------------------`
      )
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SAT-Error-Log.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
    >
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-matcha-input rounded-3xl shadow-grave border-2 border-slate-300 overflow-hidden flex flex-col overscroll-contain"
        data-lenis-prevent="true"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                SAT Mistake Autopsy & Error Log 📓
              </h3>
              <p className="text-xs text-slate-400">
                &ldquo;Write down why you missed each question&rdquo; &mdash; Non-negotiable for 1500+
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={exportAsText}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition text-xs flex items-center gap-1 bg-white/10 px-2.5"
                title="Export Error Log"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-matcha-sub border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Filter:</span>
            {(['All', 'Math', 'Reading/Writing'] as const).map((dom) => (
              <button
                key={dom}
                onClick={() => setFilterDomain(dom)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  filterDomain === dom ? 'bg-indigo-600 text-white shadow-xs' : 'bg-matcha-input text-slate-600 border border-slate-200 hover:bg-[rgba(195,218,190,0.65)]'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Cancel Entry' : 'Log New Mistake'}</span>
          </button>
        </div>

        {/* New Entry Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-5 bg-indigo-50/50 border-b border-indigo-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              New Mistake Autopsy Entry
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Source / Test</label>
                <MatchaSelect
                  value={testOrSection}
                  onChange={(val) => setTestOrSection(val)}
                  options={[
                    { value: 'Bluebook Practice Test #1', label: 'Bluebook Test #1', badge: 'Mock #1' },
                    { value: 'Bluebook Practice Test #2', label: 'Bluebook Test #2', badge: 'Mock #2' },
                    { value: 'Bluebook Practice Test #3', label: 'Bluebook Test #3', badge: 'Mock #3' },
                    { value: 'Bluebook Practice Test #4', label: 'Bluebook Test #4', badge: 'Mock #4' },
                    { value: 'Bluebook Practice Test #5', label: 'Bluebook Test #5', badge: 'Mock #5' },
                    { value: 'Khan Academy Drill', label: 'Khan Academy Drill', badge: 'Drill' },
                    { value: 'Unit Test / Quiz', label: 'Unit Test / Quiz', badge: 'Quiz' },
                  ]}
                  variant="white"
                  size="sm"
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Question Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Mod 2 Math Q14 (Circle eq)"
                  value={questionRef}
                  onChange={(e) => setQuestionRef(e.target.value)}
                  className="w-full text-xs bg-matcha-input border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Domain</label>
                <div className="flex gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setDomain('Math')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      domain === 'Math' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-matcha-input text-slate-700 border-slate-200'
                    }`}
                  >
                    Math
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomain('Reading/Writing')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      domain === 'Reading/Writing' ? 'bg-amber-600 text-white border-amber-600' : 'bg-matcha-input text-slate-700 border-slate-200'
                    }`}
                  >
                    Reading/Writing
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Why Did I Miss It? <span className="text-slate-400 font-normal">(Root cause, not just careless)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Confused diameter with radius; rushed through last step and forgot to divide by 2."
                  value={whyMissed}
                  onChange={(e) => setWhyMissed(e.target.value)}
                  className="w-full text-xs bg-matcha-input border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Takeaway Rule / Antidote <span className="text-slate-400 font-normal">(Formula or habit to prevent repeat)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Circle equation standard form is (x-h)^2 + (y-k)^2 = r^2. Always underline what the question asks for (radius vs diameter)!"
                  value={takeawayRule}
                  onChange={(e) => setTakeawayRule(e.target.value)}
                  className="w-full text-xs bg-matcha-input border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-matcha-input border border-slate-200 hover:bg-[rgba(195,218,190,0.65)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save Mistake to Log
              </button>
            </div>
          </form>
        )}

        {/* Entries List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <AlertTriangle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-700">No mistakes logged in this view yet</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                During your practice tests and drills, record every incorrect question and identify the precise root cause.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
              >
                + Log Your First Mistake
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-2xl border transition ${
                  entry.reviewed ? 'bg-matcha-sub border-slate-200 opacity-80' : 'bg-matcha-input border-slate-200 shadow-xs hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        entry.domain === 'Math'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {entry.domain}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{entry.testOrSection}</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {entry.questionRef}
                    </span>
                    <span className="text-[11px] text-slate-400">{entry.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleReviewed(entry.id)}
                      className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                        entry.reviewed
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-500 hover:text-indigo-600 hover:bg-[rgba(195,218,190,0.65)]'
                      }`}
                      title={entry.reviewed ? 'Mark as needing review' : 'Mark as mastered'}
                    >
                      <CheckCircle className={`w-4 h-4 ${entry.reviewed ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                      <span className="text-[11px]">{entry.reviewed ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    <span className="font-bold text-rose-800 block mb-0.5">Why Missed:</span>
                    <p className="text-slate-700 leading-relaxed">{entry.whyMissed}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-800 block mb-0.5">Takeaway / Never Repeat Rule:</span>
                    <p className="text-slate-700 leading-relaxed">{entry.takeawayRule}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-matcha-sub px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Total Mistakes: <strong className="text-slate-800">{entries.length}</strong> &bull; Mastered:{' '}
            <strong className="text-emerald-700">{entries.filter((e) => e.reviewed).length}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-matcha-input border border-slate-200 hover:bg-[rgba(195,218,190,0.65)] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
