'use client';

import React from 'react';

interface ProgressRingsProps {
  overallPercentage: number;
  masteredCount: number;
  totalSkillsCount: number;
  dailyCompletedCount: number;
  dailyTargetCount: number;
}

export const ProgressRings: React.FC<ProgressRingsProps> = ({
  overallPercentage,
  masteredCount,
  totalSkillsCount,
  dailyCompletedCount,
  dailyTargetCount
}) => {
  // Master Radial Gauge geometry
  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  // Daily Fuel Ring geometry
  const dailyRadius = 48;
  const dailyStroke = 8;
  const dailyNormalizedRadius = dailyRadius - dailyStroke * 2;
  const dailyCircumference = dailyNormalizedRadius * 2 * Math.PI;
  const dailyPct = Math.min(100, Math.round((dailyCompletedCount / Math.max(1, dailyTargetCount)) * 100));
  const dailyDashoffset = dailyCircumference - (dailyPct / 100) * dailyCircumference;
  const isDailyComplete = dailyCompletedCount >= dailyTargetCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Overall Readiness Radial Gauge */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 flex items-center gap-6 shadow-xs hover:border-emerald-300 transition">
        <div className="relative flex items-center justify-center shrink-0">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              stroke="#e7ede5"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Animated progress ring */}
            <circle
              stroke="#10b981"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute text-center select-none">
            <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
              {overallPercentage}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            Overall Readiness
          </span>
          <h3 className="text-lg font-black font-serif text-stone-900">
            {masteredCount} / {totalSkillsCount} Mastered
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Strict Khan Academy mastery state machine formula. Not started and familiar contribute zero.
          </p>
        </div>
      </div>

      {/* 2. Daily Fuel Ring */}
      <div className={`bg-white rounded-3xl border p-6 flex items-center gap-6 shadow-xs transition ${
        isDailyComplete ? 'border-emerald-400 bg-emerald-50/20' : 'border-stone-200/80 hover:border-emerald-300'
      }`}>
        <div className="relative flex items-center justify-center shrink-0">
          <svg height={dailyRadius * 2} width={dailyRadius * 2} className="transform -rotate-90">
            <circle
              stroke="#e7ede5"
              fill="transparent"
              strokeWidth={dailyStroke}
              r={dailyNormalizedRadius}
              cx={dailyRadius}
              cy={dailyRadius}
            />
            <circle
              stroke={isDailyComplete ? '#059669' : '#f59e0b'}
              fill="transparent"
              strokeWidth={dailyStroke}
              strokeDasharray={`${dailyCircumference} ${dailyCircumference}`}
              style={{ strokeDashoffset: dailyDashoffset }}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${isDailyComplete ? 'animate-pulse' : ''}`}
              r={dailyNormalizedRadius}
              cx={dailyRadius}
              cy={dailyRadius}
            />
          </svg>
          <div className="absolute text-center select-none">
            <span className="text-lg font-black font-mono text-stone-900 tracking-tight">
              {dailyCompletedCount}/{dailyTargetCount}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
              Daily Target Ring
            </span>
            {isDailyComplete && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Completed
              </span>
            )}
          </div>
          <h3 className="text-lg font-black font-serif text-stone-900">
            {dailyCompletedCount} of {dailyTargetCount} Lessons
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {isDailyComplete
              ? 'Daily focus goal accomplished. Pacing on track with zero cognitive burnout.'
              : `${dailyTargetCount - dailyCompletedCount} more exercise set required to fulfill today's study cap.`}
          </p>
        </div>
      </div>
    </div>
  );
};
