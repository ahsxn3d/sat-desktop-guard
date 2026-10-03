import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Coffee, 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  Gamepad2, 
  Footprints, 
  CheckSquare, 
  Laptop,
  Compass,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface DailyTimelineTemplateProps {
  dayTitle?: string;
}

const STORAGE_KEY_ANCHOR = 'sat_daily_timeline_anchor';

interface TimelineBlock {
  id: string;
  relativeStartMin: number;
  durationMin: number;
  title: string;
  category: 'math' | 'break1' | 'rw' | 'break2' | 'log';
  tag: string;
  tagColor: string;
  borderAccent: string;
  bgAccent: string;
  icon: React.ReactNode;
  doText: string;
  dontText?: string;
  scienceNote: string;
}

const DEFAULT_BLOCKS: TimelineBlock[] = [
  {
    id: 'block-1',
    relativeStartMin: 0,
    durationMin: 45,
    title: 'Math Skills & Desmos Drill',
    category: 'math',
    tag: 'Focus Block 1 • 45 min',
    tagColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    borderAccent: 'border-indigo-300',
    bgAccent: 'bg-indigo-50/70',
    icon: <Calculator className="w-4 h-4 text-indigo-700" />,
    doText: 'Active problem solving on target skills. Keep Desmos open side-by-side. Focus purely on Math execution.',
    dontText: 'No tab switching, no checking social notifications.',
    scienceNote: 'Maximum sustained prefrontal cortex focus on analytical problems peaks at 45 minutes.'
  },
  {
    id: 'block-2',
    relativeStartMin: 45,
    durationMin: 15,
    title: 'Protected Real Break',
    category: 'break1',
    tag: 'Real Break • 15 min',
    tagColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    borderAccent: 'border-emerald-400',
    bgAccent: 'bg-emerald-50/75',
    icon: <Footprints className="w-4 h-4 text-emerald-700" />,
    doText: 'Leave the laptop! Walk around, grab a snack, drink water, or play one CS2 round / quick game.',
    dontText: 'Do NOT "scroll Khan Academy tab 2" or read study guides. True physical disengagement.',
    scienceNote: '15-min physical movement clears working memory saturation and restores neurotransmitter pools.'
  },
  {
    id: 'block-3',
    relativeStartMin: 60,
    durationMin: 40,
    title: 'Reading & Writing Skills',
    category: 'rw',
    tag: 'Focus Block 2 • 40 min',
    tagColor: 'bg-amber-100 text-amber-950 border-amber-300',
    borderAccent: 'border-amber-300',
    bgAccent: 'bg-amber-50/70',
    icon: <BookOpen className="w-4 h-4 text-amber-800" />,
    doText: 'Verbal reasoning, punctuation/grammar rules, and words in context. Read passages with an active pencil mindset.',
    dontText: 'Avoid re-reading sentences passively without annotating.',
    scienceNote: 'Switching cognitive modalities (Math → Verbal) prevents unilateral neural fatigue.'
  },
  {
    id: 'block-4',
    relativeStartMin: 100,
    durationMin: 10,
    title: 'Protected Real Break',
    category: 'break2',
    tag: 'Real Break • 10 min',
    tagColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    borderAccent: 'border-emerald-400',
    bgAccent: 'bg-emerald-50/75',
    icon: <Coffee className="w-4 h-4 text-emerald-700" />,
    doText: 'Step away from all screens. Stretch shoulders and neck, splash cool water on face.',
    dontText: 'No screen stimulation.',
    scienceNote: 'A short 10-minute quiet pause consolidates freshly processed verbal patterns into medium-term storage.'
  },
  {
    id: 'block-5',
    relativeStartMin: 110,
    durationMin: 10,
    title: 'Log on Tracker & Close Laptop',
    category: 'log',
    tag: 'Wrap-Up • 10 min',
    tagColor: 'bg-purple-100 text-purple-950 border-purple-300',
    borderAccent: 'border-purple-300',
    bgAccent: 'bg-purple-50/70',
    icon: <CheckSquare className="w-4 h-4 text-purple-700" />,
    doText: 'Log what you did on your tracker, check off today\'s skills, write a 1-sentence note, done!',
    dontText: 'Strict zero overtime rule. When the timer hits 120m door-to-door, shut the laptop.',
    scienceNote: 'Immediate logging creates an emotional dopamine closure loop, reinforcing consistent habit formation.'
  }
];

interface AnchorPreset {
  label: string;
  timeStr: string; // "17:00"
  description: string;
}

const PRESETS: AnchorPreset[] = [
  { label: '4:30 PM', timeStr: '16:30', description: 'Post-College Early' },
  { label: '5:30 PM', timeStr: '17:30', description: 'Post-Asr Afternoon' },
  { label: '7:00 PM', timeStr: '19:00', description: 'Post-Maghrib Evening' },
  { label: '8:30 PM', timeStr: '20:30', description: 'Post-Isha Night Anchor (Recommended)' },
];

export const DailyTimelineTemplate: React.FC<DailyTimelineTemplateProps> = ({
  dayTitle = 'Tomorrow (Mon Sep 14) - Day 1 Session'
}) => {
  // Start time in "HH:mm" (24h) - Default strictly '20:30' on both SSR and initial client render to avoid hydration mismatch
  const [anchorTime, setAnchorTime] = useState<string>('20:30');
  const [customInput, setCustomInput] = useState<string>('20:30');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load user saved anchor from localStorage safely on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANCHOR);
      if (saved) {
        setAnchorTime(saved);
        setCustomInput(saved);
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever user changes anchor
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ANCHOR, anchorTime);
      } catch {
        // ignore
      }
    }
  }, [anchorTime, isLoaded]);

  // Helper to format minutes offset from anchor into human readable time (e.g. "8:30 PM")
  const formatTimeOffset = (offsetMinutes: number): string => {
    const [hStr, mStr] = anchorTime.split(':');
    const baseHour = parseInt(hStr, 10) || 20;
    const baseMin = parseInt(mStr, 10) || 30;

    const totalMinutes = baseHour * 60 + baseMin + offsetMinutes;
    const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const hour24 = Math.floor(normalizedMinutes / 60);
    const minute = normalizedMinutes % 60;

    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const minuteFormatted = minute.toString().padStart(2, '0');

    return `${hour12}:${minuteFormatted} ${period}`;
  };

  // Human readable anchor display
  const anchorFormatted = useMemo(() => {
    return formatTimeOffset(0);
  }, [anchorTime]);

  const endFormatted = useMemo(() => {
    return formatTimeOffset(120);
  }, [anchorTime]);

  return (
    <div className="ios-glass-card rounded-3xl p-5 sm:p-7 shadow-grave hover:shadow-grave-hover space-y-6 transition-all duration-300 border border-[#a6c4a1]/70">
      
      {/* Header & Philosophy */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#bfd5bb] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs font-['JetBrains_Mono']">
              The Anti-Burnout Protocol
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-matcha-sub text-slate-700 border border-[#a6c4a1]/60 font-['JetBrains_Mono']">
              5-Block Structure
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-luxury flex items-center gap-2">
            <span>Daily Timeline & Routine Template</span>
            <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl leading-relaxed">
            Adjust the clock times to fit around college and prayers, but <strong>keep the block structure strictly identical</strong>. Only ~85 minutes is actual studying; the rest is protected recovery.
          </p>
        </div>
      </div>

      {/* Start Time Anchor Selector */}
      <div className="bg-matcha-sub/80 p-4 sm:p-5 rounded-2xl border border-[#a6c4a1]/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-xs font-black text-slate-900 font-['JetBrains_Mono'] flex items-center gap-1.5 uppercase">
              <Clock className="w-4 h-4 text-indigo-700" />
              <span>Choose Your Daily Start Time Anchor</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              Consistency of the start time matters more than which hour you pick. Same slot every day trains your brain to switch into focus mode instantly.
            </p>
          </div>

          {/* Current Active Window Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-matcha-input border border-[#a6c4a1] shadow-2xs flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black text-slate-900 font-['JetBrains_Mono']" suppressHydrationWarning>
              {anchorFormatted} &rarr; {endFormatted}
            </span>
          </div>
        </div>

        {/* Presets & Custom Input */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {PRESETS.map((p) => {
            const isActive = anchorTime === p.timeStr;
            return (
              <button
                key={p.timeStr}
                onClick={() => {
                  setAnchorTime(p.timeStr);
                  setCustomInput(p.timeStr);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black font-['JetBrains_Mono'] transition-all duration-200 cursor-pointer border flex items-center gap-1.5 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#2b542d] text-white border-[#407444] shadow-xs'
                    : 'bg-matcha-input text-slate-800 border-[#a6c4a1]/70 hover:bg-white/80 hover:border-slate-400'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[10px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  ({p.description.split(' ')[0]})
                </span>
              </button>
            );
          })}

          {/* Custom Time Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-matcha-input border border-[#a6c4a1]/70">
            <span className="text-[10px] font-bold text-slate-600 font-['JetBrains_Mono'] uppercase">
              Custom:
            </span>
            <input
              type="time"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (e.target.value) {
                  setAnchorTime(e.target.value);
                }
              }}
              className="text-xs font-black font-['JetBrains_Mono'] bg-transparent text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visual Door-to-Door Segment Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black font-['JetBrains_Mono'] text-slate-800">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Door-to-Door Session Breakdown (~2 Hours / 120 Mins)</span>
          </span>
          <span className="text-[11px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
            85m Study &bull; 35m Protected Break/Log
          </span>
        </div>

        {/* Multi-segment Visual Progress Strip */}
        <div className="w-full h-3 rounded-full bg-slate-200/80 overflow-hidden flex shadow-inner border border-[#a6c4a1]/50">
          <div 
            style={{ width: '37.5%' }} 
            className="bg-indigo-600 h-full border-r border-white/30" 
            title="Math Skills: 45 min" 
          />
          <div 
            style={{ width: '12.5%' }} 
            className="bg-emerald-500 h-full border-r border-white/30" 
            title="Real Break 1: 15 min" 
          />
          <div 
            style={{ width: '33.33%' }} 
            className="bg-amber-500 h-full border-r border-white/30" 
            title="Reading & Writing Skills: 40 min" 
          />
          <div 
            style={{ width: '8.33%' }} 
            className="bg-emerald-500 h-full border-r border-white/30" 
            title="Real Break 2: 10 min" 
          />
          <div 
            style={{ width: '8.34%' }} 
            className="bg-purple-600 h-full" 
            title="Log on Tracker & Close Laptop: 10 min" 
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-['JetBrains_Mono'] pt-0.5">
          <span suppressHydrationWarning>0 min ({anchorFormatted})</span>
          <span>+45 min</span>
          <span>+60 min</span>
          <span>+100 min</span>
          <span>+110 min</span>
          <span suppressHydrationWarning>+120 min ({endFormatted})</span>
        </div>
      </div>

      {/* 5-Block Chronological Cards */}
      <div className="space-y-3">
        {DEFAULT_BLOCKS.map((block, idx) => {
          const clockStart = formatTimeOffset(block.relativeStartMin);
          const clockEnd = formatTimeOffset(block.relativeStartMin + block.durationMin);
          const isBreak = block.category.startsWith('break');

          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className={`p-4 rounded-2xl border transition-all duration-300 smooth-card-hover flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-2xs ${
                isBreak
                  ? 'bg-emerald-50/50 border-emerald-300/80 hover:border-emerald-500'
                  : block.category === 'math'
                  ? 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400'
                  : block.category === 'rw'
                  ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                  : 'bg-purple-50/50 border-purple-200 hover:border-purple-400'
              }`}
            >
              {/* Left Column: Clock Times & Badges */}
              <div className="sm:w-64 shrink-0 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                    {block.icon}
                  </div>
                  <div>
                    <div className="text-xs font-black font-['JetBrains_Mono'] text-slate-950" suppressHydrationWarning>
                      {clockStart} &ndash; {clockEnd}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 font-['JetBrains_Mono']">
                      {block.relativeStartMin === 0 ? 'Start Time' : `+${block.relativeStartMin} min`} &bull; {block.durationMin} min block
                    </div>
                  </div>
                </div>

                <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md border font-['JetBrains_Mono'] ${block.tagColor}`}>
                  {block.tag}
                </span>
              </div>

              {/* Middle Column: Title & Specific Action Guidance */}
              <div className="flex-1 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-950 font-luxury flex items-center gap-1.5">
                  <span>{block.title}</span>
                  {isBreak && (
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Leave Laptop
                    </span>
                  )}
                </h4>

                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {block.doText}
                </p>

                {block.dontText && (
                  <p className="text-[11px] text-rose-800 font-bold bg-rose-50/80 px-2 py-1 rounded-lg border border-rose-200 leading-snug">
                    &bull; {block.dontText}
                  </p>
                )}
              </div>

              {/* Right Column: Science / Retention Note */}
              <div className="sm:w-56 shrink-0 bg-matcha-sub/90 p-2.5 rounded-xl border border-[#a6c4a1]/60 self-stretch flex flex-col justify-center">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-['JetBrains_Mono'] mb-0.5">
                  Retention Note
                </div>
                <div className="text-[11px] font-semibold text-slate-700 leading-tight">
                  {block.scienceNote}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Psychology Rule Callout Banner */}
      <div className="p-4 rounded-2xl bg-[#254928] text-white border border-[#407444] shadow-grave-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5 max-w-xl">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 font-['JetBrains_Mono']">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>The Daily Anchor Rule</span>
          </div>
          <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
            &ldquo;Consistency of the start time matters more than which hour you pick. The same slot every day trains your brain to switch into study mode faster over time. Pick something that doesn&apos;t collide with college or prayer times and stick to that anchor.&rdquo;
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-black text-emerald-400 font-['JetBrains_Mono']">
            ~85 Mins
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">
            Active Study / Day
          </div>
        </div>
      </div>
    </div>
  );
};
