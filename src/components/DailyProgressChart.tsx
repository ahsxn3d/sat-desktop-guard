'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Target,
  Zap,
  Info
} from 'lucide-react';

export interface DailyProgressEntry {
  date: string; // "YYYY-MM-DD"
  assignedLessons: number;
  completedLessons: number;
  hoursSpent: number;
  isMilestone?: boolean;
  milestoneTitle?: string;
  notes?: string;
  dayTitle?: string;
  phaseName?: string;
  completedTaskTitles?: string[];
  pendingTaskTitles?: string[];
}

export interface DailyProgressChartProps {
  initialEntries?: DailyProgressEntry[];
  currentDate?: string;
  onEntryLogged?: (entry: DailyProgressEntry) => void;
  className?: string;
  embedded?: boolean;
}

export const DailyProgressChart: React.FC<DailyProgressChartProps> = ({
  initialEntries = [],
  currentDate = '2026-09-14',
  onEntryLogged,
  className = '',
  embedded = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [range, setRange] = useState<'7D' | '14D' | '30D' | 'ALL'>('14D');
  const [activeMetric, setActiveMetric] = useState<'velocity' | 'hours'>('velocity');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Combine real plan entries with checkmarked tasks (LIVE DYNAMIC COMPLETIONS FROM STUDY PLAN)
  const combinedEntries = useMemo(() => {
    if (!initialEntries || initialEntries.length === 0) {
      // Fallback base schedule starting strictly from Sep 14 (Day 1)
      const baseDays: DailyProgressEntry[] = [];
      const startDate = new Date(2026, 8, 14); // Sep 14, 2026
      for (let i = 0; i < 55; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;
        baseDays.push({
          date: dateStr,
          assignedLessons: i % 7 === 6 ? 2 : 5,
          completedLessons: 0,
          hoursSpent: 0,
          isMilestone: dateStr === '2026-11-07',
          milestoneTitle: dateStr === '2026-11-07' ? 'SAT Exam Day' : undefined
        });
      }
      return baseDays;
    }

    return initialEntries;
  }, [initialEntries]);

  // 1. Data Model Calculations:
  // - Daily Progress Velocity (%): (completedLessons / assignedLessons) * 100. If 0 lessons completed, velocity is 0%.
  // - 7-Day Rolling Average: Dynamic moving average based on velocity.
  const processedData = useMemo(() => {
    // Ensure chronological sort ascending
    const sorted = [...combinedEntries].sort((a, b) => a.date.localeCompare(b.date));

    // First pass: compute velocity
    const withVelocity = sorted.map((entry) => {
      const assigned = Number(entry.assignedLessons) || 1;
      const completed = Number(entry.completedLessons) || 0;
      const hours = Number(entry.hoursSpent) || 0;

      let velocity = 0;
      if (completed <= 0) {
        velocity = 0; // If 0 lessons completed, velocity is 0%
      } else if (assigned > 0) {
        velocity = Math.round((completed / assigned) * 1000) / 10;
      } else {
        velocity = 100;
      }

      return {
        ...entry,
        assignedLessons: assigned,
        completedLessons: completed,
        hoursSpent: hours,
        velocity
      };
    });

    // Peak velocity identification
    const maxVelocity = Math.max(...withVelocity.map((e) => e.velocity), 0);

    // Second pass: compute 7-day rolling moving average
    return withVelocity.map((item, index) => {
      // 7-day window ending on current day
      const windowStart = Math.max(0, index - 6);
      const windowSlice = withVelocity.slice(windowStart, index + 1);
      const windowSum = windowSlice.reduce((sum, curr) => sum + curr.velocity, 0);
      const rollingAvg = Math.round((windowSum / windowSlice.length) * 10) / 10;

      const hoursSum = windowSlice.reduce((sum, curr) => sum + curr.hoursSpent, 0);
      const rollingHoursAvg = Math.round((hoursSum / windowSlice.length) * 10) / 10;

      // Peak highlight: peak velocity day (non-zero) or explicit milestone
      const isPeak =
        (maxVelocity > 0 && item.velocity === maxVelocity && item.velocity >= 75) ||
        !!item.isMilestone;

      // Clean date formatting
      const [year, month, day] = item.date.split('-');
      const dObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const shortDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const weekdayDate = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

      return {
        ...item,
        shortDate,
        weekdayDate,
        rollingAvg,
        rollingHoursAvg,
        isPeak
      };
    });
  }, [combinedEntries]);

  // Filtered by range pills: '7D', '14D', '30D', 'ALL'
  const visibleData = useMemo(() => {
    if (range === '7D') return processedData.slice(0, 7);
    if (range === '14D') return processedData.slice(0, 14);
    if (range === '30D') return processedData.slice(0, 30);
    return processedData;
  }, [processedData, range]);

  // Telemetry Metrics
  const telemetry = useMemo(() => {
    if (visibleData.length === 0) {
      return { activeDate: 'Sep 14', currentVelocity: 0, latest7dAvg: 0, totalHours: 0, peakVelocity: 0, lessonsDone: 0 };
    }
    // Find the latest day that has study activity or default to first day
    const activeEntriesWithStudy = visibleData.filter((d) => d.completedLessons > 0);
    const activeItem = activeEntriesWithStudy[activeEntriesWithStudy.length - 1] || visibleData[0];

    const totalHours = Math.round(visibleData.reduce((acc, d) => acc + d.hoursSpent, 0) * 10) / 10;
    const lessonsDone = visibleData.reduce((acc, d) => acc + d.completedLessons, 0);
    const peakVelocity = Math.max(...visibleData.map((d) => d.velocity), 0);

    return {
      activeDate: activeItem.shortDate,
      currentVelocity: activeItem.velocity,
      latest7dAvg: activeItem.rollingAvg,
      totalHours,
      peakVelocity,
      lessonsDone
    };
  }, [visibleData]);



  // Custom Dot component to mark peak days or milestones with magenta dot
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    if (payload.isPeak) {
      return (
        <g key={`peak-${payload.date}`}>
          {/* Subtle magenta halo ring */}
          <circle cx={cx} cy={cy} r={8.5} fill="none" stroke="#D946EF" strokeWidth={1.5} opacity={0.5} />
          {/* Magenta accent dot */}
          <circle
            cx={cx}
            cy={cy}
            r={5.5}
            fill="#D946EF"
            stroke="#FFFFFF"
            strokeWidth={2}
            className="cursor-pointer filter drop-shadow-[0_2px_4px_rgba(217,70,239,0.5)]"
          />
        </g>
      );
    }

    // Normal orange/amber data point
    return (
      <circle
        key={`dot-${payload.date}`}
        cx={cx}
        cy={cy}
        r={3.5}
        fill="#D97706"
        stroke="#FFFFFF"
        strokeWidth={1.5}
        className="cursor-pointer hover:r-[5px] transition-all"
      />
    );
  };

  // Custom Retro-Tech Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-[#122810] text-[#e5f0e1] border-2 border-[#a6c4a1] rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl min-w-[260px] max-w-[340px] space-y-2 pointer-events-none z-50">
        <div className="flex items-center justify-between border-b border-[#2d5626] pb-2">
          <div>
            <div className="text-xs font-mono font-bold text-emerald-300">
              {data.weekdayDate || data.date}
            </div>
            {data.phaseName && (
              <div className="text-[10px] font-bold text-emerald-200/80 font-mono">
                {data.phaseName}
              </div>
            )}
          </div>
          {data.isPeak && (
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D946EF]/20 text-[#F472B6] border border-[#D946EF]/50 font-mono flex items-center gap-1 shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              <span>PEAK</span>
            </span>
          )}
        </div>

        {data.milestoneTitle && (
          <div className="text-[11px] font-bold text-amber-300 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/30">
            ★ {data.milestoneTitle}
          </div>
        )}

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-200/70">Lessons Completed:</span>
            <span className="font-extrabold text-white">
              {data.completedLessons}/{data.assignedLessons} lessons
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>Progress Velocity:</span>
            </span>
            <span className="font-black text-amber-300 text-sm">
              {data.velocity}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-0.5 border-t border-dashed border-[#047857]" />
              <span>7-Day Trend:</span>
            </span>
            <span className="font-black text-emerald-300">
              {data.rollingAvg}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#2d5626]/80 text-[11px]">
            <span className="text-sky-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Hours Studied:</span>
            </span>
            <span className="font-bold text-sky-200">
              {data.hoursSpent} hrs
            </span>
          </div>
        </div>

        {/* Detailed Chapter/Lesson Breakdown */}
        {data.completedTaskTitles && data.completedTaskTitles.length > 0 ? (
          <div className="pt-2 border-t border-[#2d5626]/80 space-y-1">
            <div className="text-[10px] font-black uppercase text-emerald-300 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Completed Lessons ({data.completedTaskTitles.length}):</span>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-emerald-800">
              {data.completedTaskTitles.map((title: string, i: number) => (
                <div key={i} className="text-[10.5px] text-emerald-100 flex items-start gap-1.5 leading-snug">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span className="truncate">{title}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-1.5 border-t border-[#2d5626]/80 text-[10.5px] text-emerald-300/60 italic font-mono">
            0 lessons checkmarked • Study resting
          </div>
        )}

        {data.pendingTaskTitles && data.pendingTaskTitles.length > 0 && data.completedLessons > 0 && (
          <div className="pt-1 text-[10px] text-amber-200/70 font-mono">
            {data.pendingTaskTitles.length} lesson(s) remaining for 100% velocity
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl bg-[#EAF0E6] border-2 border-[#a6c4a1] text-[#122810] shadow-grave-card p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {/* Decorative Retro-Tech Grid Pattern Accent */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#122810 1px, transparent 1px), radial-gradient(#122810 1px, #EAF0E6 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* ==================================================================== */}
      {/* RETRO-TECH CARD HEADER & CONTROLS                                    */}
      {/* ==================================================================== */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b-2 border-[#bfd5bb] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#d2e4cd] text-[#1a3717] border border-[#a6c4a1] font-['JetBrains_Mono'] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>// REAL-TIME CURRICULUM TELEMETRY</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-900 border border-amber-500/30 font-['JetBrains_Mono']">
                SEP 14 KICKOFF &bull; NOV 7 EXAM
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <TrendingUp className="w-5 h-5 text-[#D97706]" />
              <h3 className="text-xl sm:text-2xl font-black text-[#122810] font-['Space_Grotesk'] tracking-tight">
                Daily Progress Velocity &amp; 7-Day Trend
              </h3>
            </div>
            <p className="text-xs text-[#2e5728] font-medium font-['Plus_Jakarta_Sans']">
              Live curriculum velocity calculated from actual completed lessons vs daily targets with dynamic 7-day rolling average.
            </p>
          </div>

          {/* Action Buttons: Log Today & Range Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Metric Toggle: Velocity (%) vs Hours */}
            <div className="flex items-center p-1 bg-[#d5e5cf] rounded-xl border border-[#a6c4a1] font-['JetBrains_Mono'] text-xs">
              <button
                type="button"
                onClick={() => setActiveMetric('velocity')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeMetric === 'velocity'
                    ? 'bg-[#1a3717] text-white shadow-xs'
                    : 'text-[#2a5024] hover:text-[#122810]'
                }`}
              >
                Velocity (%)
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('hours')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeMetric === 'hours'
                    ? 'bg-[#1a3717] text-white shadow-xs'
                    : 'text-[#2a5024] hover:text-[#122810]'
                }`}
              >
                Hours (hrs)
              </button>
            </div>

            {/* Range Toggle Pills: 7D, 14D, 30D, ALL */}
            <div className="flex items-center p-1 bg-[#d5e5cf] rounded-xl border border-[#a6c4a1] font-['JetBrains_Mono'] text-xs">
              {(['7D', '14D', '30D', 'ALL'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    range === r
                      ? 'bg-[#1a3717] text-white shadow-xs'
                      : 'text-[#2a5024] hover:text-[#122810]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* TELEMETRY STRIP & LEGEND                                             */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-[#dcedd9]/70 border border-[#a6c4a1] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#2e5728] font-['JetBrains_Mono'] block">
                Latest Active Velocity ({telemetry.activeDate})
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D97706] font-['Space_Grotesk']">
                {telemetry.currentVelocity}%
              </span>
            </div>
            <Zap className="w-5 h-5 text-[#D97706]" />
          </div>

          <div className="p-3 rounded-2xl bg-[#dcedd9]/70 border border-[#a6c4a1] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#2e5728] font-['JetBrains_Mono'] block">
                7-Day Rolling Trend
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#047857] font-['Space_Grotesk']">
                {telemetry.latest7dAvg}%
              </span>
            </div>
            <TrendingUp className="w-5 h-5 text-[#047857]" />
          </div>

          <div className="p-3 rounded-2xl bg-[#dcedd9]/70 border border-[#a6c4a1] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#2e5728] font-['JetBrains_Mono'] block">
                Lessons Completed
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D946EF] font-['Space_Grotesk']">
                {telemetry.lessonsDone}
              </span>
            </div>
            <Sparkles className="w-5 h-5 text-[#D946EF]" />
          </div>

          <div className="p-3 rounded-2xl bg-[#dcedd9]/70 border border-[#a6c4a1] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#2e5728] font-['JetBrains_Mono'] block">
                Hours Studied
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#1a3717] font-['Space_Grotesk']">
                {telemetry.totalHours}h
              </span>
            </div>
            <Clock className="w-5 h-5 text-[#15803d]" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-['JetBrains_Mono'] pt-1">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-amber-900 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#D97706] border border-white inline-block shadow-2xs" />
              <span>Primary: Daily Velocity (%)</span>
            </span>

            <span className="flex items-center gap-1.5 text-emerald-900 font-bold">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#047857] inline-block" />
              <span>Trendline: 7-Day Rolling Avg</span>
            </span>

            <span className="flex items-center gap-1.5 text-purple-900 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#D946EF] border border-white inline-block shadow-2xs" />
              <span>Peak Day / Milestone (Magenta)</span>
            </span>
          </div>

          <span className="text-[11px] text-[#2e5728] font-semibold">
            Showing <span className="font-black text-[#122810]">{visibleData.length} plan days</span> starting Sep 14
          </span>
        </div>

        {/* ==================================================================== */}
        {/* RECHARTS COMPOSED CHART (Area Gradient + Dashed Trendline + Peak Dots)*/}
        {/* ==================================================================== */}
        <div className="w-full h-72 sm:h-80 pt-2 min-w-0">
          {isMounted && visibleData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={visibleData}
                margin={{ top: 16, right: 16, left: -10, bottom: 4 }}
              >
                <defs>
                  {/* Retro-tech warm gradient fill underneath primary curve */}
                  <linearGradient id="velocityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.34} />
                    <stop offset="60%" stopColor="#D97706" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>

                  <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.34} />
                    <stop offset="60%" stopColor="#D97706" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#a6c4a1"
                  strokeOpacity={0.4}
                  vertical={false}
                />

                <XAxis
                  dataKey="shortDate"
                  stroke="#274624"
                  tickLine={false}
                  axisLine={{ stroke: '#a6c4a1', strokeWidth: 1.5 }}
                  tick={{
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    fill: '#1a3717'
                  }}
                  dy={6}
                />

                <YAxis
                  stroke="#274624"
                  tickLine={false}
                  axisLine={{ stroke: '#a6c4a1', strokeWidth: 1.5 }}
                  tick={{
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    fill: '#1a3717'
                  }}
                  domain={activeMetric === 'velocity' ? [0, 110] : [0, 'dataMax + 0.5']}
                  unit={activeMetric === 'velocity' ? '%' : 'h'}
                  dx={-2}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Primary Metric Line / Area with Gradient Fill underneath */}
                {activeMetric === 'velocity' ? (
                  <Area
                    type="monotone"
                    dataKey="velocity"
                    name="Daily Velocity"
                    stroke="#D97706"
                    strokeWidth={2.8}
                    fill="url(#velocityFill)"
                    dot={renderCustomDot}
                    activeDot={{
                      r: 6.5,
                      fill: '#D97706',
                      stroke: '#FFFFFF',
                      strokeWidth: 2.5
                    }}
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="hoursSpent"
                    name="Hours Studied"
                    stroke="#D97706"
                    strokeWidth={2.8}
                    fill="url(#hoursFill)"
                    dot={renderCustomDot}
                    activeDot={{
                      r: 6.5,
                      fill: '#D97706',
                      stroke: '#FFFFFF',
                      strokeWidth: 2.5
                    }}
                  />
                )}

                {/* Trendline: 7-Day Rolling Average (Dashed Line in Deep Green #047857) */}
                <Line
                  type="monotone"
                  dataKey={activeMetric === 'velocity' ? 'rollingAvg' : 'rollingHoursAvg'}
                  name="7-Day Rolling Avg"
                  stroke="#047857"
                  strokeWidth={2.4}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#047857',
                    stroke: '#FFFFFF',
                    strokeWidth: 2
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#2e5728]">
              Initializing telemetry rendering engine...
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DailyProgressChart;
