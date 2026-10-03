'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  BookOpen, 
  Save, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Award,
  ChevronUp,
  ChevronDown,
  Calendar
} from 'lucide-react';

export interface MockTestScoreRecord {
  testId: string;
  testName: string;
  date: string;
  targetTotal: number;
  targetMath: number;
  targetRW: number;
  mathScore: number;
  rwScore: number;
  totalScore: number;
  contentMistakes?: number;
  carelessMistakes?: number;
  timeMistakes?: number;
  notes?: string;
  updatedAt: string;
}

const STORAGE_KEY = 'anti_burnout_mock_scores_v1';

export const MOCK_TESTS_CONFIG = [
  { id: 'bluebook-test-1', name: 'Full Bluebook Practice Test #1 (Real Conditions)', date: 'Wed Oct 28', tag: 'Phase 2 Launch' },
  { id: 'bluebook-test-2', name: 'Full Bluebook Practice Test #2 (Timed Simulation)', date: 'Fri Oct 30', tag: 'High-Stakes Simulation' },
  { id: 'bluebook-test-3', name: 'Full Bluebook Practice Test #3 (Final Full Test, Timed)', date: 'Tue Nov 03', tag: 'Final Practice Test' },
];

/**
 * Custom Number Input Stepper Component
 * Strips away native browser white spinner box and provides
 * smooth, customized micro-arrows matching the web UI
 */
interface ScoreInputStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  colorScheme?: 'blue' | 'emerald';
  id?: string;
  ariaLabel?: string;
}

const ScoreInputStepper: React.FC<ScoreInputStepperProps> = ({
  value,
  onChange,
  min = 200,
  max = 800,
  step = 10,
  colorScheme = 'blue',
  id,
  ariaLabel
}) => {
  const handleIncrement = () => {
    const current = value > 0 ? value : min;
    onChange(Math.min(max, current + step));
  };

  const handleDecrement = () => {
    const current = value > 0 ? value : min;
    onChange(Math.max(min, current - step));
  };

  const isBlue = colorScheme === 'blue';

  return (
    <div className="relative group flex items-center">
      <input
        id={id}
        aria-label={ariaLabel}
        type="number"
        min={min}
        max={max}
        step={step}
        placeholder="e.g. 740"
        value={value > 0 ? value : ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            onChange(0);
          } else {
            const v = parseInt(raw) || 0;
            onChange(v);
          }
        }}
        className={`w-full py-3 pl-4 pr-11 rounded-xl border-2 font-black text-center text-xl transition font-['JetBrains_Mono'] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-sky-300/40 placeholder:font-normal ${
          isBlue
            ? 'bg-[#07243f]/90 text-white border-sky-400/35 focus:border-sky-300 focus:ring-2 focus:ring-sky-400/25 shadow-inner'
            : 'bg-[#062629]/90 text-white border-emerald-400/35 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/25 shadow-inner'
        }`}
      />
      
      {/* Custom styled stepper controls */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-[#0c355e] group-hover:bg-[#13497d] rounded-lg border border-sky-400/35 shadow-2xs overflow-hidden transition-all duration-150">
        <button
          type="button"
          tabIndex={-1}
          onClick={handleIncrement}
          className="w-7 h-4 flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-500/50 active:bg-sky-500/70 transition cursor-pointer"
          title="Increase (+10)"
          aria-label="Increase by 10"
        >
          <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
        </button>
        <div className="w-full h-[1px] bg-sky-400/30" />
        <button
          type="button"
          tabIndex={-1}
          onClick={handleDecrement}
          className="w-7 h-4 flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-500/50 active:bg-sky-500/70 transition cursor-pointer"
          title="Decrease (-10)"
          aria-label="Decrease by 10"
        >
          <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

interface ScoreCalculatorSectionProps {
  initialTestId?: string;
  onNavigateToErrorLog?: () => void;
}

export const ScoreCalculatorSection: React.FC<ScoreCalculatorSectionProps> = ({
  initialTestId = 'bluebook-test-1',
  onNavigateToErrorLog
}) => {
  const { data: session, status } = useSession();
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId);
  const [allSavedRecords, setAllSavedRecords] = useState<Record<string, MockTestScoreRecord>>({});

  // Active form inputs (NO DUMMY DEFAULT DATA)
  const [targetTotal, setTargetTotal] = useState<number>(1500);
  const [targetMath, setTargetMath] = useState<number>(780);
  const [targetRW, setTargetRW] = useState<number>(720);
  const [mathScore, setMathScore] = useState<number>(0);
  const [rwScore, setRwScore] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [saveToast, setSaveToast] = useState(false);
  const [retakeToast, setRetakeToast] = useState(false);

  // Load all records on mount from local storage immediately
  const loadSavedRecords = () => {
    try {
      const savedStr = localStorage.getItem(STORAGE_KEY);
      if (savedStr) {
        const parsed: Record<string, MockTestScoreRecord> = JSON.parse(savedStr);
        setAllSavedRecords(parsed);
        if (parsed[selectedTestId]) {
          const rec = parsed[selectedTestId];
          setTargetTotal(rec.targetTotal || 1500);
          setTargetMath(rec.targetMath || 780);
          setTargetRW(rec.targetRW || 720);
          setMathScore(rec.mathScore || 0);
          setRwScore(rec.rwScore || 0);
          setNotes(rec.notes || '');
        } else {
          setMathScore(0);
          setRwScore(0);
          setNotes('');
        }
      } else {
        setMathScore(0);
        setRwScore(0);
        setNotes('');
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadSavedRecords();
  }, [selectedTestId]);

  // Cloud database sync restoration if signed in
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/progress')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.mockTestScores && Object.keys(data.mockTestScores).length > 0) {
            setAllSavedRecords((prev) => {
              const merged = { ...data.mockTestScores, ...prev };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              if (merged[selectedTestId]) {
                const rec = merged[selectedTestId];
                setTargetTotal(rec.targetTotal || 1500);
                setTargetMath(rec.targetMath || 780);
                setTargetRW(rec.targetRW || 720);
                setMathScore(rec.mathScore || 0);
                setRwScore(rec.rwScore || 0);
                setNotes(rec.notes || '');
              }
              return merged;
            });
          }
        })
        .catch((err) => console.warn('Mock score cloud sync fetch error:', err));
    }
  }, [status, selectedTestId]);

  // Handle switching tests
  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    if (allSavedRecords[testId]) {
      const rec = allSavedRecords[testId];
      setTargetTotal(rec.targetTotal || 1500);
      setTargetMath(rec.targetMath || 780);
      setTargetRW(rec.targetRW || 720);
      setMathScore(rec.mathScore || 0);
      setRwScore(rec.rwScore || 0);
      setNotes(rec.notes || '');
    } else {
      // No dummy data!
      setMathScore(0);
      setRwScore(0);
      setNotes('');
    }
  };

  const currentTestIdx = MOCK_TESTS_CONFIG.findIndex((t) => t.id === selectedTestId);
  const currentTest = MOCK_TESTS_CONFIG[currentTestIdx] || MOCK_TESTS_CONFIG[0];
  const nextTest = currentTestIdx < MOCK_TESTS_CONFIG.length - 1 ? MOCK_TESTS_CONFIG[currentTestIdx + 1] : null;

  // Determine unlock status for any test index
  const isTestUnlocked = (idx: number) => {
    if (idx === 0) return true; // Test 1 is always open
    const prevTest = MOCK_TESTS_CONFIG[idx - 1];
    const prevRec = allSavedRecords[prevTest.id];
    if (!prevRec || !prevRec.totalScore) return false;
    return (prevRec.totalScore - prevRec.targetTotal) >= -40; // near goal or passed
  };

  const hasScore = mathScore > 0 && rwScore > 0;
  const totalScore = mathScore + rwScore;
  const scoreDelta = totalScore - targetTotal;
  const mathDelta = mathScore - targetMath;
  const rwDelta = rwScore - targetRW;

  // Progression Evaluation Logic
  const isGoalAchieved = hasScore && scoreDelta >= 0;
  const isNearGoal = hasScore && scoreDelta >= -40 && scoreDelta < 0; // within 40 points
  const isRetakeRequired = hasScore && scoreDelta < -40; // gap too big

  // Retake current test action
  const handleRetakeCurrentTest = () => {
    setMathScore(0);
    setRwScore(0);
    setNotes('');
    setRetakeToast(true);
    setTimeout(() => setRetakeToast(false), 3000);
  };

  // Save handler
  const handleSave = () => {
    try {
      const activeTest = MOCK_TESTS_CONFIG.find((t) => t.id === selectedTestId) || MOCK_TESTS_CONFIG[0];
      const updatedRecords: Record<string, MockTestScoreRecord> = {
        ...allSavedRecords,
        [selectedTestId]: {
          testId: selectedTestId,
          testName: activeTest.name,
          date: activeTest.date,
          targetTotal,
          targetMath,
          targetRW,
          mathScore,
          rwScore,
          totalScore,
          contentMistakes: 0,
          carelessMistakes: 0,
          timeMistakes: 0,
          notes,
          updatedAt: new Date().toISOString()
        }
      };

      // 1. Permanent Local Storage persistence
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      setAllSavedRecords(updatedRecords);

      // 2. Cloud Database sync (Prisma BluebookTestScore table)
      fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestScores: updatedRecords,
        }),
      }).catch((err) => console.warn('Mock score cloud sync push error:', err));

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (e) {
      console.error('Failed to save mock score', e);
    }
  };

  return (
    <section id="section-score-calculator" className="space-y-6">
      {/* Top Banner - Harmonized Luminous Bluebook Gradient */}
      <div className="bg-gradient-to-br from-[#06243f]/95 via-[#0b3b64]/90 to-[#026aa2]/85 border-2 border-sky-400/40 rounded-3xl p-6 sm:p-8 shadow-grave hover:shadow-grave-hover text-white relative overflow-hidden backdrop-blur-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-sky-400/25 text-sky-200 border border-sky-300/40 font-['JetBrains_Mono'] shadow-2xs">
                Official Bluebook Scoring Engine
              </span>
              <span className="text-[11px] text-amber-300 font-extrabold font-['JetBrains_Mono'] flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Target 1500+ (1600 Total Points)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-luxury tracking-tight flex items-center gap-2.5 text-white">
              <Trophy className="w-7 h-7 text-amber-400" />
              <span>Mock Test Score Target & Gap Calculator</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed font-medium">
              Validate your real Bluebook practice scores against your goal. The exam has 1600 points total with 1500+ as the non-negotiable baseline. If your score doesn't reach your target, the system prompts you to retake Test #{currentTestIdx + 1} until cleared.
            </p>
          </div>

          {/* Real-time score indicator */}
          <div className="bg-[#082a4a]/85 border border-sky-400/40 rounded-2xl p-4 min-w-[230px] space-y-1 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase font-['JetBrains_Mono'] text-sky-200">
                Score vs Goal
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-['JetBrains_Mono']">
                {targetTotal} Goal
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-300 font-['JetBrains_Mono']">
              {hasScore ? totalScore : '--'} <span className="text-sm text-sky-200 font-normal">/ {targetTotal}</span>
            </div>
            <div className="text-[11px] font-bold font-['JetBrains_Mono']">
              {hasScore ? (
                <>Gap vs {targetTotal}: <span className={scoreDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts</span></>
              ) : (
                <span className="text-sky-200/60">Score Not Entered Yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Test Selector Tabs Bar - Luminous Executive Blue */}
      <div className="bg-[#082a4a]/80 p-3.5 rounded-2xl border-2 border-sky-400/35 shadow-grave space-y-2.5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-200 font-['JetBrains_Mono']">
            Select Practice Test Benchmark:
          </span>
          <span className="text-[11px] text-sky-200/90 font-['JetBrains_Mono']">
            Must achieve 1500+ target on previous test to clear sequence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {MOCK_TESTS_CONFIG.map((t, idx) => {
            const isSelected = selectedTestId === t.id;
            const record = allSavedRecords[t.id];
            const hasRecord = !!record && (record.totalScore > 0);
            const testTotal = record?.totalScore;
            const unlocked = isTestUnlocked(idx);

            return (
              <button
                key={t.id}
                onClick={() => handleSelectTest(t.id)}
                className={`p-3 rounded-xl border-2 text-left transition min-h-[58px] cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white border-sky-300 shadow-md ring-2 ring-sky-300/40'
                    : unlocked
                    ? 'bg-[#0c3863]/85 text-sky-100 border-sky-400/30 hover:bg-[#13497d] hover:border-sky-300 shadow-xs'
                    : 'bg-[#071f36]/70 text-slate-400 border-sky-900/30 hover:border-sky-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase font-['JetBrains_Mono'] flex items-center gap-1 ${
                    isSelected ? 'text-white' : unlocked ? 'text-sky-200' : 'text-slate-400'
                  }`}>
                    {!unlocked && <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                    Test #{idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold font-['JetBrains_Mono'] ${
                    isSelected ? 'text-amber-200' : 'text-amber-300/80'
                  }`}>
                    {t.date}
                  </span>
                </div>
                <div className="text-xs font-bold truncate mt-1">
                  {t.name.split('(')[0]}
                </div>
                {hasRecord ? (
                  <div className={`text-[10px] font-extrabold font-['JetBrains_Mono'] mt-0.5 ${
                    isSelected ? 'text-emerald-200' : 'text-emerald-400'
                  }`}>
                    Score: {testTotal} / 1600
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-['JetBrains_Mono'] mt-0.5">
                    {unlocked ? 'Score Pending' : `Requires Test #${idx}`}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Calculator Form Stage - Beautiful Bluebook Oceanic Canvas */}
      <div className="bg-gradient-to-br from-[#072744]/95 via-[#0c3c66]/90 to-[#0b355a]/95 rounded-3xl border-2 border-sky-400/40 shadow-grave p-6 sm:p-8 space-y-7 text-white backdrop-blur-xl">
        
        {/* Prerequisite Alert if user clicked on a later test before clearing previous */}
        {!isTestUnlocked(currentTestIdx) && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-400/40 text-amber-100 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs font-['JetBrains_Mono'] leading-relaxed">
              <strong>Sequence Warning:</strong> Test #{currentTestIdx} target has not been met yet!
              You can still input scores here, but the Rulebook recommends giving Test #{currentTestIdx} again before taking this exam.
            </div>
          </div>
        )}

        {/* Target vs Actual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Score Card */}
          <div className="bg-[#0c3863]/85 p-5 rounded-2xl border-2 border-sky-400/35 space-y-4 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-sky-400/30 pb-2.5">
              <span className="text-xs font-black uppercase text-sky-200 font-['JetBrains_Mono'] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-sky-300" />
                Target Score Setup
              </span>
              <span className="text-xs font-bold text-amber-300 font-['JetBrains_Mono']">Goal Baseline</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-sky-200 block mb-1.5">Target Math (Max 800)</label>
                <ScoreInputStepper
                  id="input-target-math"
                  ariaLabel="Target Math Score"
                  value={targetMath}
                  onChange={(val) => {
                    setTargetMath(val);
                    setTargetTotal(val + targetRW);
                  }}
                  min={200}
                  max={800}
                  step={10}
                  colorScheme="blue"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-sky-200 block mb-1.5">Target R&W (Max 800)</label>
                <ScoreInputStepper
                  id="input-target-rw"
                  ariaLabel="Target Reading and Writing Score"
                  value={targetRW}
                  onChange={(val) => {
                    setTargetRW(val);
                    setTargetTotal(targetMath + val);
                  }}
                  min={200}
                  max={800}
                  step={10}
                  colorScheme="blue"
                />
              </div>
            </div>

            <div className="text-right text-xs font-black font-['JetBrains_Mono'] text-sky-200 pt-1">
              Combined Target Goal: <strong className="text-amber-300 text-xl font-black">{targetTotal}</strong> <span className="text-xs text-amber-200/80 font-normal">({targetTotal} Goal &bull; 1600 Total Points)</span>
            </div>
          </div>

          {/* Actual Score Card - Deep Matcha Emerald Undertone */}
          <div className="bg-[#093c3e]/85 p-5 rounded-2xl border-2 border-emerald-400/40 space-y-4 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-emerald-400/30 pb-2.5">
              <span className="text-xs font-black uppercase text-emerald-300 font-['JetBrains_Mono'] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Actual Bluebook Score
              </span>
              <span className="text-xs font-bold text-emerald-300 font-['JetBrains_Mono']">Score Report</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-emerald-200 block mb-1.5">Actual Math Score</label>
                <ScoreInputStepper
                  id="input-actual-math"
                  ariaLabel="Actual Math Score"
                  value={mathScore}
                  onChange={(val) => setMathScore(val)}
                  min={200}
                  max={800}
                  step={10}
                  colorScheme="emerald"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-200 block mb-1.5">Actual R&W Score</label>
                <ScoreInputStepper
                  id="input-actual-rw"
                  ariaLabel="Actual Reading and Writing Score"
                  value={rwScore}
                  onChange={(val) => setRwScore(val)}
                  min={200}
                  max={800}
                  step={10}
                  colorScheme="emerald"
                />
              </div>
            </div>

            <div className="text-right text-xs font-black font-['JetBrains_Mono'] text-emerald-200 pt-1">
              Combined Achieved Score: <strong className="text-emerald-400 text-xl font-black">{hasScore ? `${totalScore} / ${targetTotal}` : `-- / ${targetTotal}`}</strong>
            </div>
          </div>
        </div>

        {/* 3. Real-Time Score Gap Metrics Banner */}
        <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md backdrop-blur-md ${
          !hasScore
            ? 'bg-[#0c3863]/85 border-sky-400/40 text-sky-100'
            : isGoalAchieved 
            ? 'bg-gradient-to-r from-[#063b28]/95 to-[#0a4d35]/90 border-emerald-400/60 text-emerald-100'
            : isNearGoal
            ? 'bg-gradient-to-r from-[#0c3d6c]/95 to-[#124d85]/90 border-sky-400/60 text-sky-100'
            : 'bg-gradient-to-r from-[#3e1422]/95 via-[#4a1728]/90 to-[#35121c]/95 border-rose-400/40 text-rose-100'
        }`}>
          <div className="flex items-center gap-3.5">
            {!hasScore ? (
              <Clock className="w-9 h-9 text-sky-300 shrink-0" />
            ) : isGoalAchieved ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-400 shrink-0" />
            ) : isNearGoal ? (
              <Sparkles className="w-9 h-9 text-sky-300 shrink-0" />
            ) : (
              <AlertTriangle className="w-9 h-9 text-rose-300 shrink-0" />
            )}
            <div>
              <h4 className="text-lg font-bold font-luxury">
                {!hasScore
                  ? 'Awaiting Test Scores'
                  : isGoalAchieved 
                  ? 'Goal Reached or Exceeded!' 
                  : isNearGoal
                  ? `Near Goal! Within Striking Range (${Math.abs(scoreDelta)} pts below 1500+)`
                  : `Target Not Met: ${Math.abs(scoreDelta)} Points Below Goal`}
              </h4>
              <p className="text-xs sm:text-sm font-medium mt-0.5">
                {hasScore ? (
                  <>
                    Math Gap: <strong className={mathDelta >= 0 ? 'text-emerald-300' : 'text-amber-300'}>{mathDelta > 0 ? `+${mathDelta}` : mathDelta} pts</strong> &bull; 
                    R&amp;W Gap: <strong className={rwDelta >= 0 ? 'text-emerald-300' : 'text-amber-300'}>{rwDelta > 0 ? `+${rwDelta}` : rwDelta} pts</strong>
                  </>
                ) : (
                  `Type your Math and Reading/Writing scores above to see your point gap against ${targetTotal} goal.`
                )}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-3xl font-black font-['JetBrains_Mono'] text-white">
              {hasScore ? totalScore : '--'} <span className="text-lg font-bold text-sky-300">/ {targetTotal}</span>
            </span>
            <span className="text-[11px] font-black text-amber-300 block font-['JetBrains_Mono'] mt-0.5">
              Goal: {targetTotal} (Saves as / 1600)
            </span>
          </div>
        </div>

        {/* 4. DYNAMIC TARGET PROGRESSION & RETAKE DECISION ENGINE */}
        {!hasScore ? (
          /* STATE 0: AWAITING INPUT (NO DUMMY DATA) */
          <div className="bg-[#0c3863]/85 p-5 sm:p-6 rounded-2xl border-2 border-sky-400/35 space-y-3 text-sky-100 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-luxury text-white">
                  Ready to Log Bluebook Test #{currentTestIdx + 1}
                </h3>
                <p className="text-xs text-sky-200 font-medium">
                  Enter your raw scores from the Bluebook app above (out of 1600 total points). The Rulebook will calculate your exact gap and determine if you are ready to advance to Test #{currentTestIdx + 2}.
                </p>
              </div>
            </div>
          </div>
        ) : isGoalAchieved ? (
          /* STATE A: GOAL FULLY MET */
          <div className="bg-gradient-to-br from-[#063b28]/95 to-[#0a4d35]/90 p-5 sm:p-6 rounded-2xl border-2 border-emerald-400/60 shadow-grave space-y-4 text-emerald-100 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Target Cleared &bull; Advancement Approved
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-luxury text-white mt-0.5">
                    Goal Achieved! You Are Cleared to Proceed
                  </h3>
                </div>
              </div>
              <div className="text-left sm:text-right font-['JetBrains_Mono']">
                <div className="text-2xl font-black text-emerald-300">+{scoreDelta} pts</div>
                <div className="text-[11px] text-emerald-200/80">above {targetTotal} goal</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Sensational execution! Your actual score of <strong>{totalScore} / {targetTotal}</strong> meets or exceeds your <strong>{targetTotal}</strong> goal ({scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} points over goal). 
              You have conquered this benchmark and are officially qualified to advance to the next official Bluebook exam.
            </p>

            {nextTest ? (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectTest(nextTest.id)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer font-['JetBrains_Mono']"
                >
                  <Unlock className="w-4 h-4 text-slate-950" />
                  <span>Shift to Bluebook Test #{currentTestIdx + 2} ({nextTest.date}) &rarr;</span>
                </button>
                <span className="text-xs text-emerald-300 font-['JetBrains_Mono']">
                  ✓ Next mock benchmark unlocked
                </span>
              </div>
            ) : (
              <div className="text-xs font-bold text-emerald-300 font-['JetBrains_Mono'] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>All 5 Official Benchmarks Cleared! You are primed for Test Day execution.</span>
              </div>
            )}
          </div>
        ) : isNearGoal ? (
          /* STATE B: NEAR GOAL (STRIKING DISTANCE) */
          <div className="bg-gradient-to-br from-[#0c3d6c]/95 to-[#124d85]/90 p-5 sm:p-6 rounded-2xl border-2 border-sky-400/60 shadow-grave space-y-4 text-sky-100 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                    Within Striking Range &bull; Gap: {Math.abs(scoreDelta)} pts
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-luxury text-white mt-0.5">
                    Near Goal! You Can Shift to Next Test or Retake
                  </h3>
                </div>
              </div>
              <div className="text-left sm:text-right font-['JetBrains_Mono']">
                <div className="text-2xl font-black text-sky-300">{scoreDelta} pts</div>
                <div className="text-[11px] text-sky-200/80">near {targetTotal} goal</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
              You scored <strong>{totalScore} / {targetTotal}</strong>, which is within striking distance of your <strong>{targetTotal}</strong> goal ({Math.abs(scoreDelta)} pts gap). 
              Because you are close to the threshold, you may either give Test #{currentTestIdx + 1} a quick retake to hit the exact target, or shift forward to <strong>Bluebook Test #{currentTestIdx + 2}</strong>.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 flex-wrap">
              {nextTest && (
                <button
                  type="button"
                  onClick={() => handleSelectTest(nextTest.id)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-sky-300 hover:bg-sky-200 transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer font-['JetBrains_Mono']"
                >
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                  <span>Shift to Bluebook Test #{currentTestIdx + 2} &rarr;</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleRetakeCurrentTest}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-sky-100 bg-[#082a4a] hover:bg-[#0d3b66] border-2 border-sky-400/40 transition flex items-center justify-center gap-2 cursor-pointer font-['JetBrains_Mono']"
              >
                <RotateCcw className="w-4 h-4 text-sky-300" />
                <span>Retake Test #{currentTestIdx + 1} to Hit Exact {targetTotal}</span>
              </button>
            </div>
          </div>
        ) : (
          /* STATE C: GOAL NOT MET — RETAKE MANDATORY (Smooth, Elegant Red - NOT Neon) */
          <div className="bg-gradient-to-br from-[#38131f]/95 via-[#461726]/90 to-[#2c0f18]/95 p-5 sm:p-6 rounded-2xl border-2 border-rose-400/40 shadow-grave space-y-4 text-rose-100 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-300/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-300" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-200 border border-rose-400/30">
                    Target Not Met &bull; Retake Required
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-luxury text-white mt-0.5">
                    Give Test #{currentTestIdx + 1} Again Before Moving On!
                  </h3>
                </div>
              </div>
              <div className="text-left sm:text-right font-['JetBrains_Mono']">
                <div className="text-2xl font-black text-rose-300">-{Math.abs(scoreDelta)} pts</div>
                <div className="text-[11px] text-rose-200/80">below {targetTotal} goal</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-medium">
              Your actual score of <strong>{totalScore} / {targetTotal}</strong> is <strong>{Math.abs(scoreDelta)} points below</strong> your goal of <strong>{targetTotal}</strong> (Math: {mathScore} / {targetMath}, R&amp;W: {rwScore} / {targetRW}). 
              According to the Anti-Burnout Rulebook, do <strong>NOT</strong> waste the next practice test until you address these leaked points. 
              Review your missed questions in the Error Log, drill the weak concepts on Khan Academy, and <strong>give Test #{currentTestIdx + 1} again and again until you achieve that goal!</strong>
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleRetakeCurrentTest}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#b91c1c] via-[#be123c] to-[#9f1239] hover:from-[#dc2626] hover:via-[#e11d48] hover:to-[#be123c] transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer font-['JetBrains_Mono'] border border-rose-300/30"
              >
                <RotateCcw className="w-4 h-4 text-white" />
                <span>Give Test #{currentTestIdx + 1} Again (Retake Test)</span>
              </button>

              {onNavigateToErrorLog && (
                <button
                  type="button"
                  onClick={onNavigateToErrorLog}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-rose-100 bg-[#280f18]/80 hover:bg-[#3d1624] border-2 border-rose-400/30 transition flex items-center justify-center gap-2 cursor-pointer font-['JetBrains_Mono']"
                >
                  <BookOpen className="w-4 h-4 text-rose-300" />
                  <span>Review Weak Questions in Error Log</span>
                </button>
              )}

              {nextTest && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#200b13]/80 border border-rose-400/25 text-rose-200/70 text-xs font-['JetBrains_Mono'] cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5 text-rose-300" />
                  <span>Test #{currentTestIdx + 2} Locked (Requires score &ge; {targetTotal - 40})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Retake feedback toast */}
        {retakeToast && (
          <div className="p-3.5 rounded-xl bg-[#0c3863] border border-sky-400 text-sky-100 text-xs font-['JetBrains_Mono'] flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-sky-300 animate-spin" />
            <span>Retake initiated! Retest on Bluebook, then input your updated scores above.</span>
          </div>
        )}

        {/* 5. Qualitative Reflection Notes */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-sky-200 tracking-wider font-['JetBrains_Mono'] block">
            Test Reflection & Specific Skills to Review Before Retaking
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Struggled with circle geometry on Question 19, punctuation was clean, need to practice Desmos table regressions..."
            rows={3}
            className="w-full p-3.5 rounded-xl border-2 border-sky-400/35 text-xs sm:text-sm text-sky-100 placeholder:text-sky-300/40 bg-[#07243f] focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400/20 font-sans leading-relaxed"
          />
        </div>

        {/* 6. Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-sky-400/25">
          <div>
            {onNavigateToErrorLog && (
              <button
                type="button"
                onClick={onNavigateToErrorLog}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-100 bg-[#341420]/80 hover:bg-[#461a2b] border-2 border-rose-400/30 transition flex items-center gap-1.5 min-h-[44px] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-rose-300" />
                <span>Log Questions in Mistake Autopsy</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] border border-emerald-300 font-['JetBrains_Mono']"
            >
              <Save className="w-4 h-4" />
              <span>{saveToast ? `✓ Saved: ${totalScore} / 1600!` : 'Save Test Score & Gap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. DEDICATED BLUEBOOK PRACTICE TEST SCORES & PERFORMANCE RECORD LIST      */}
      {/* Every test has a heading, and under it the exact numbering!              */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#06243f]/95 via-[#0b3b64]/90 to-[#026aa2]/80 rounded-3xl p-6 sm:p-8 border-2 border-sky-400/40 shadow-grave space-y-5 text-white backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-400/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-400/25 text-sky-200 border border-sky-300/40 font-['JetBrains_Mono']">
                Complete Exam Log
              </span>
              <span className="text-xs text-amber-300 font-black font-['JetBrains_Mono']">
                5 Scheduled Bluebook Benchmarks
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-luxury text-white mt-1">
              Official Bluebook Practice Test Scores & Performance Record
            </h3>
            <p className="text-xs text-sky-100/90 mt-0.5 font-medium">
              Every practice test benchmark listed with its exact score numbering, target goal, and qualification status.
            </p>
          </div>

          <span className="text-xs text-sky-200 font-['JetBrains_Mono'] bg-[#072540]/90 px-3 py-1.5 rounded-xl border border-sky-400/35 shrink-0">
            {Object.values(allSavedRecords).filter((r) => r.totalScore > 0).length} of 5 Logged
          </span>
        </div>

        {/* Stacked Cards for Each Test */}
        <div className="space-y-3.5">
          {MOCK_TESTS_CONFIG.map((test, idx) => {
            const rec = allSavedRecords[test.id];
            const isLogged = !!rec && rec.totalScore > 0;
            const delta = isLogged ? rec.totalScore - rec.targetTotal : 0;
            const isSelected = selectedTestId === test.id;

            return (
              <div 
                key={test.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[#0c3863] border-sky-300 shadow-md ring-2 ring-sky-400/40' 
                    : 'bg-[#082a4a]/85 border-sky-400/30 hover:border-sky-300/60 shadow-xs'
                }`}
              >
                {/* Heading: Exact Test Title, Numbering & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-400/25 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-sky-500/25 border border-sky-400/30 flex items-center justify-center text-xs font-black text-sky-200 font-['JetBrains_Mono'] shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white font-luxury flex items-center gap-2">
                        <span>{test.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40 font-['JetBrains_Mono']">
                            Currently Active
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-amber-300 font-bold font-['JetBrains_Mono'] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {test.date} &bull; {test.tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    {isLogged ? (
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border font-['JetBrains_Mono'] ${
                        delta >= 0 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : delta >= -40
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-rose-500/15 text-rose-200 border-rose-400/30'
                      }`}>
                        {delta >= 0 ? '✓ Goal Cleared' : delta >= -40 ? '⚡ Striking Distance' : '🚫 Retake Required'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#071f36]/80 text-slate-400 border border-sky-900/40 font-['JetBrains_Mono']">
                        ⏳ Awaiting Score
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSelectTest(test.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-sky-100 bg-[#0c3863] hover:bg-sky-600 hover:text-white transition cursor-pointer border border-sky-400/35"
                    >
                      {isSelected ? 'Editing' : 'Load in Form'}
                    </button>
                  </div>
                </div>

                {/* Under the Heading: Exact Numbering Breakdown */}
                <div className="pt-3 grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-['JetBrains_Mono'] text-center sm:text-left">
                  <div className="p-2 rounded-xl bg-[#062038]/90 border border-sky-400/30">
                    <span className="text-[10px] text-sky-200/70 uppercase block">Math Score</span>
                    <span className="text-sm font-black text-white">
                      {isLogged ? `${rec.mathScore} / 800` : '--'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#062038]/90 border border-sky-400/30">
                    <span className="text-[10px] text-sky-200/70 uppercase block">R&amp;W Score</span>
                    <span className="text-sm font-black text-white">
                      {isLogged ? `${rec.rwScore} / 800` : '--'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#062038]/90 border border-sky-400/30">
                    <span className="text-[10px] text-sky-200/70 uppercase block">Total Score</span>
                    <span className="text-base font-black text-amber-300">
                      {isLogged ? `${rec.totalScore} / 1600` : '-- / 1600'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#062038]/90 border border-sky-400/30">
                    <span className="text-[10px] text-sky-200/70 uppercase block">Target Goal</span>
                    <span className="text-sm font-bold text-sky-200">
                      {isLogged ? `${rec.targetTotal} Goal` : `${targetTotal} Goal`}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#062038]/90 border border-sky-400/30 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-sky-200/70 uppercase block">Goal Delta</span>
                    <span className={`text-sm font-black ${
                      !isLogged 
                        ? 'text-slate-400' 
                        : delta >= 0 
                        ? 'text-emerald-400' 
                        : 'text-rose-300'
                    }`}>
                      {isLogged ? (delta >= 0 ? `+${delta} pts` : `${delta} pts`) : '--'}
                    </span>
                  </div>
                </div>

                {/* Notes if recorded */}
                {isLogged && rec.notes && (
                  <div className="mt-2.5 text-xs text-sky-100/90 bg-[#072542]/90 p-2.5 rounded-xl border border-sky-400/25 font-sans">
                    <strong className="text-sky-300 font-semibold font-['JetBrains_Mono']">Notes: </strong> 
                    {rec.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
