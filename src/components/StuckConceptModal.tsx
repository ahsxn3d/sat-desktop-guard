import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CORE_CURRICULUM_CHAPTERS, getAllCoreLessons } from '../data/coreCurriculum';
import { StuckConceptRecord, TaskItem, DayPlan } from '../types';
import { MatchaSelect, MatchaSelectOption } from './MatchaSelect';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

export interface StuckConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  day?: DayPlan | null;
  dateStr?: string;
  formattedDate?: string;
  dayNumber?: number;
  scheduledTasks?: TaskItem[];
  existingStruggles: StuckConceptRecord[];
  onSaveStruggle?: (
    record: Omit<StuckConceptRecord, 'id' | 'createdAt'>,
    syncToErrorLog: boolean
  ) => void;
  onSave?: (
    record: Omit<StuckConceptRecord, 'id' | 'createdAt'>,
    syncToErrorLog: boolean
  ) => void;
  onDeleteStruggle?: (id: string) => void;
  onToggleResolved?: (id: string) => void;
  onNavigateToCoreInfo?: () => void;
}

export const StuckConceptModal: React.FC<StuckConceptModalProps> = ({
  isOpen,
  onClose,
  day,
  dateStr,
  formattedDate,
  dayNumber,
  scheduledTasks = [],
  existingStruggles = [],
  onSaveStruggle,
  onSave,
  onDeleteStruggle,
  onToggleResolved,
  onNavigateToCoreInfo,
}) => {
  const actualDateStr = day?.dateStr || dateStr || '';
  const actualFormattedDate = day?.formattedDate || formattedDate || '';
  const actualDayNumber = day?.dayNumber ?? dayNumber;
  const actualTasks = day?.tasks || scheduledTasks;
  const handleSave = onSaveStruggle || onSave;

  // Lock background window scroll and pause Lenis smooth scroll while modal is open
  useModalScrollLock(isOpen);

  const curriculumLessons = useMemo(() => getAllCoreLessons(), []);

  // Filter out break tasks to get real study lessons
  const dayStudyTasks = useMemo(() => {
    return actualTasks.filter((t) => t.subject !== 'buffer');
  }, [actualTasks]);

  // Form states
  const [selectedLessonKey, setSelectedLessonKey] = useState<string>('');
  const [selectedLessonCode, setSelectedLessonCode] = useState<string>('');
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('Algebra');
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [customConcept, setCustomConcept] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [takeawayRule, setTakeawayRule] = useState<string>('');
  const [syncToErrorLog, setSyncToErrorLog] = useState<boolean>(true);

  // Lesson dropdown options
  const lessonOptions: MatchaSelectOption[] = useMemo(() => {
    const list: MatchaSelectOption[] = [];
    if (dayStudyTasks.length > 0) {
      dayStudyTasks.forEach((t) => {
        list.push({
          value: `task:${t.id}`,
          label: `${t.code ? `[${t.code}] ` : ''}${t.topic || t.label}`,
          badge: "Today's Task",
        });
      });
    }
    curriculumLessons.forEach((l) => {
      list.push({
        value: `curr:${l.id}`,
        label: `${l.chapterTitle}: ${l.lessonTitle}`,
        badge: l.chapterTitle.split(' ')[0],
      });
    });
    return list;
  }, [dayStudyTasks, curriculumLessons]);

  // Chapter options
  const chapterOptions: MatchaSelectOption[] = useMemo(() => {
    const list: MatchaSelectOption[] = CORE_CURRICULUM_CHAPTERS.map((ch) => ({
      value: ch.title,
      label: ch.title,
      badge: ch.badge,
    }));
    list.push({
      value: 'Reading & Writing',
      label: 'Reading & Writing (Grammar / Strategy)',
      badge: 'R&W',
    });
    return list;
  }, []);

  // Initialize or reset when modal opens or date changes
  useEffect(() => {
    if (isOpen) {
      if (dayStudyTasks.length > 0) {
        const first = dayStudyTasks[0];
        setSelectedLessonKey(`task:${first.id}`);
        setSelectedLessonCode(first.code || 'MATH');
        setSelectedLessonTitle(first.topic || first.label);

        // Auto-detect chapter from first task
        const codeUpper = (first.code || '').toUpperCase();
        if (codeUpper.includes('MATH U3') && !codeUpper.includes('U3.10')) {
          setSelectedChapter('Problem Solving & Data Analysis');
        } else if (codeUpper.includes('MATH U4') || codeUpper.includes('MATH U8') || codeUpper.includes('MATH U12')) {
          setSelectedChapter('Advanced Math');
        } else if (codeUpper.includes('MATH U5') || codeUpper.includes('MATH U9') || codeUpper.includes('MATH U13')) {
          setSelectedChapter('Geometry & Trigonometry');
        } else if (codeUpper.includes('MATH U6') || codeUpper.includes('MATH U10')) {
          setSelectedChapter('Algebra');
        } else if (codeUpper.includes('R&W')) {
          setSelectedChapter('Reading & Writing');
        } else {
          setSelectedChapter('Algebra');
        }
      } else {
        const firstCurriculum = curriculumLessons[0];
        if (firstCurriculum) {
          setSelectedLessonKey(`curr:${firstCurriculum.id}`);
          setSelectedLessonCode(firstCurriculum.lessonTitle);
          setSelectedLessonTitle(firstCurriculum.lessonTitle);
          setSelectedChapter(firstCurriculum.chapterTitle);
        } else {
          setSelectedLessonKey('task:default');
          setSelectedLessonCode('MATH');
          setSelectedLessonTitle('General Study Review');
          setSelectedChapter('Algebra');
        }
      }

      setSelectedConcept('');
      setCustomConcept('');
      setNotes('');
      setTakeawayRule('');
      setSyncToErrorLog(true);
    }
  }, [isOpen, dateStr, dayStudyTasks, curriculumLessons]);

  // Get concepts for the currently selected chapter
  const availableConcepts = useMemo(() => {
    const chapterObj = CORE_CURRICULUM_CHAPTERS.find(
      (ch) =>
        ch.title === selectedChapter ||
        ch.id === selectedChapter ||
        ch.title.toLowerCase().includes(selectedChapter.toLowerCase()) ||
        selectedChapter.toLowerCase().includes(ch.title.toLowerCase())
    );
    if (!chapterObj) return [];
    return chapterObj.lessons.flatMap((l) => l.conceptsForLogging);
  }, [selectedChapter]);

  // Concept options
  const conceptOptions: MatchaSelectOption[] = useMemo(() => {
    const list: MatchaSelectOption[] = availableConcepts.map((c) => ({
      value: c,
      label: c,
      badge: 'Core Info',
    }));
    list.push({
      value: 'other',
      label: '✏️ Custom Question / Formula Variation',
      badge: 'Custom',
    });
    return list;
  }, [availableConcepts]);

  // Auto-select first concept when available concepts change
  useEffect(() => {
    if (availableConcepts.length > 0 && !selectedConcept) {
      setSelectedConcept(availableConcepts[0]);
    }
  }, [availableConcepts, selectedConcept]);

  const handleLessonKeyChange = (val: string) => {
    setSelectedLessonKey(val);
    if (val.startsWith('task:')) {
      const taskId = val.replace('task:', '');
      const task = dayStudyTasks.find((t) => t.id === taskId);
      if (task) {
        setSelectedLessonCode(task.code || 'MATH');
        setSelectedLessonTitle(task.topic || task.label);

        // Auto-detect chapter
        const codeUpper = (task.code || '').toUpperCase();
        if (codeUpper.includes('MATH U3') && !codeUpper.includes('U3.10')) {
          setSelectedChapter('Problem Solving & Data Analysis');
        } else if (codeUpper.includes('MATH U4') || codeUpper.includes('MATH U8') || codeUpper.includes('MATH U12')) {
          setSelectedChapter('Advanced Math');
        } else if (codeUpper.includes('MATH U5') || codeUpper.includes('MATH U9') || codeUpper.includes('MATH U13')) {
          setSelectedChapter('Geometry & Trigonometry');
        } else if (codeUpper.includes('MATH U6') || codeUpper.includes('MATH U10')) {
          setSelectedChapter('Algebra');
        } else if (codeUpper.includes('R&W')) {
          setSelectedChapter('Reading & Writing');
        } else {
          setSelectedChapter('Algebra');
        }
      }
    } else if (val.startsWith('curr:')) {
      const lessonId = val.replace('curr:', '');
      const lesson = curriculumLessons.find((l) => l.id === lessonId);
      if (lesson) {
        setSelectedLessonCode(lesson.lessonTitle);
        setSelectedLessonTitle(lesson.lessonTitle);
        setSelectedChapter(lesson.chapterTitle);
      }
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalConcept = customConcept.trim() || selectedConcept || 'Core Lesson Concept';
    if (!notes.trim()) return;

    if (handleSave) {
      handleSave(
        {
          dateStr: actualDateStr,
          dayNumber: actualDayNumber,
          lessonCode: selectedLessonCode,
          lessonTitle: selectedLessonTitle,
          chapter: selectedChapter,
          conceptFormula: finalConcept,
          notes: notes.trim(),
          takeawayRule: takeawayRule.trim() || undefined,
          resolved: false,
        },
        syncToErrorLog
      );
    }

    // Reset local inputs
    setNotes('');
    setTakeawayRule('');
    setCustomConcept('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto overscroll-contain"
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-matcha-modal rounded-3xl border-2 border-[#a6c4a1] shadow-grave max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col font-sans text-[#122810] backdrop-blur-2xl overscroll-contain"
          data-lenis-prevent="true"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-matcha-sub-dark/70 border-b-2 border-[#a6c4a1] flex items-start justify-between gap-3 shrink-0 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-['JetBrains_Mono'] flex items-center gap-1 shadow-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Struggle & Error Logger</span>
                </span>
                <span className="text-xs font-bold text-[#122810] font-['JetBrains_Mono'] bg-matcha-input/80 px-2.5 py-0.5 rounded-md border border-[#a6c4a1]">
                  {actualDayNumber ? `Day #${actualDayNumber}` : 'Rest / Special Day'} &bull; {actualFormattedDate}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#122810] font-luxury">
                Log Stuck Concept or Trap
              </h3>
              <p className="text-xs text-[#274624] font-medium mt-0.5">
                Pinpoint the exact lesson, chapter formula, or trap where you got stuck. Automatically syncs with your <strong className="text-rose-700">Error Log</strong> and <strong className="text-emerald-900">Core Info</strong>.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/10 text-[#122810] hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div 
            className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 overscroll-contain"
            data-lenis-prevent="true"
          >
            {/* Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Row 1: Lesson & Chapter Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative z-30">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#122810] mb-1.5 font-['JetBrains_Mono']">
                    1. Select Specific Lesson
                  </label>
                  <MatchaSelect
                    value={selectedLessonKey}
                    onChange={handleLessonKeyChange}
                    options={lessonOptions}
                    variant="matcha"
                    fullWidth
                    placeholder="Select specific lesson..."
                  />
                </div>

                <div className="relative z-20">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#122810] mb-1.5 font-['JetBrains_Mono']">
                    2. Chapter / Domain Category
                  </label>
                  <MatchaSelect
                    value={selectedChapter}
                    onChange={(val) => {
                      setSelectedChapter(String(val));
                      setSelectedConcept('');
                    }}
                    options={chapterOptions}
                    variant="matcha"
                    fullWidth
                    placeholder="Select chapter..."
                  />
                </div>
              </div>

              {/* Row 2: Specific Formula / Concept from Core Info */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono']">
                    3. Exact Formula, Rule, or Trap (From Core Info)
                  </label>
                  {onNavigateToCoreInfo && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToCoreInfo();
                      }}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Review Core Info &rarr;</span>
                    </button>
                  )}
                </div>

                {availableConcepts.length > 0 ? (
                  <div className="mb-2">
                    <MatchaSelect
                      value={selectedConcept}
                      onChange={(val) => setSelectedConcept(String(val))}
                      options={conceptOptions}
                      variant="matcha"
                      fullWidth
                      placeholder="Select formula, rule, or trap..."
                    />
                  </div>
                ) : (
                  <p className="text-xs text-[#274624] mb-2 font-medium">Enter custom concept or question detail below:</p>
                )}

                {(selectedConcept === 'other' || availableConcepts.length === 0) && (
                  <input
                    type="text"
                    value={customConcept}
                    onChange={(e) => setCustomConcept(e.target.value)}
                    placeholder="e.g. Cofunction identity in right triangle with supplementary angle"
                    className="w-full text-xs bg-matcha-input border border-[#a6c4a1] rounded-xl p-2.5 text-[#122810] placeholder:text-[#3d5a39] font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none backdrop-blur-md"
                  />
                )}
              </div>

              {/* Row 3: Why Missed / Root Cause */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#122810] mb-1 font-['JetBrains_Mono']">
                  4. Root Cause: Why Did You Get Stuck?
                </label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe where the confusion happened (e.g. I squared both sides of the radical equation but forgot to check for extraneous solutions; or I forgot to divide diameter by 2 before calculating volume)..."
                  className="w-full text-xs bg-matcha-input border border-[#a6c4a1] rounded-xl p-3 text-[#122810] placeholder:text-[#3d5a39] font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed backdrop-blur-md"
                />
              </div>

              {/* Row 4: Takeaway Rule */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#122810] mb-1 font-['JetBrains_Mono']">
                  5. Takeaway Rule / Mental Shortcut to Prevent Repeating
                </label>
                <input
                  type="text"
                  value={takeawayRule}
                  onChange={(e) => setTakeawayRule(e.target.value)}
                  placeholder="e.g. Always plug answers back into the original radical equation!"
                  className="w-full text-xs bg-matcha-input border border-[#a6c4a1] rounded-xl p-2.5 text-[#122810] placeholder:text-[#3d5a39] font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none backdrop-blur-md"
                />
              </div>

              {/* Sync Toggle */}
              <div className="flex items-center gap-2.5 p-3 bg-matcha-sub rounded-xl border border-[#a6c4a1] backdrop-blur-md shadow-xs">
                <input
                  type="checkbox"
                  id="syncErrorLog"
                  checked={syncToErrorLog}
                  onChange={(e) => setSyncToErrorLog(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600 cursor-pointer"
                />
                <label htmlFor="syncErrorLog" className="text-xs font-bold text-[#122810] cursor-pointer">
                  Sync directly to Mistake Autopsy & Error Log tab (/error-log)
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-[#122810] hover:text-black cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Save Struggle & Sync</span>
                </button>
              </div>
            </form>

            {/* List of Previously Logged Struggles for This Day */}
            {existingStruggles.length > 0 && (
              <div className="pt-4 border-t border-[#a6c4a1]/60 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#122810] font-['JetBrains_Mono'] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                  <span>Logged Struggles for {actualFormattedDate} ({existingStruggles.length})</span>
                </h4>

                <div className="space-y-2">
                  {existingStruggles.map((st) => (
                    <div
                      key={st.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-150 backdrop-blur-md ${
                        st.resolved
                          ? 'bg-matcha-sub/80 border-emerald-500/40 opacity-85 shadow-xs'
                          : 'bg-rose-500/10 border-rose-500/30 shadow-grave-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-matcha-sub-dark border border-[#a6c4a1] text-[#122810] font-['JetBrains_Mono']">
                              {st.lessonCode}
                            </span>
                            <span className="text-[10px] font-bold text-[#274624]">
                              {st.chapter}
                            </span>
                            {st.resolved && (
                              <span className="text-[10px] font-black text-emerald-800 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Mastered
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-[#122810]">
                            {st.conceptFormula}
                          </h5>
                          <p className="text-xs text-[#274624] mt-1 leading-relaxed">
                            {st.notes}
                          </p>
                          {st.takeawayRule && (
                            <p className="text-[11px] font-semibold text-rose-800 mt-1 flex items-center gap-1">
                              <span>Rule:</span>
                              <span>{st.takeawayRule}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {onToggleResolved && (
                            <button
                              type="button"
                              onClick={() => onToggleResolved(st.id)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                st.resolved
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-matcha-input border border-[#a6c4a1] text-[#122810] hover:bg-emerald-100'
                              }`}
                              title={st.resolved ? 'Mark unresolved' : 'Mark mastered'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDeleteStruggle && (
                            <button
                              type="button"
                              onClick={() => onDeleteStruggle(st.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                              title="Delete struggle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
