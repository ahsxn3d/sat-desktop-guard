'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getUserStreakState, UserStreakState } from '@/lib/streakEngine';
import { getEnergyPointsState, EnergyPointsState } from '@/lib/energyPoints';
import { getAllSkillMasteries, calculateMasteryPercentage, SkillMasteryState } from '@/lib/masteryEngine';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS } from '@/data/khanAcademyCatalog';
import { ProgressRings } from '@/components/profile/ProgressRings';
import { DomainBattery, DomainMasteryItem } from '@/components/profile/DomainBattery';
import { Flame, Calendar, Settings, ArrowRight, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export default function ProfileHubPage() {
  const [streakState, setStreakState] = useState<UserStreakState>({
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: '',
    activeDaysThisWeek: [false, false, false, false, false, false, false],
    totalActiveDaysCount: 1,
    activityHistory: {}
  });

  const [energyState, setEnergyState] = useState<EnergyPointsState>({
    totalPoints: 350,
    unlockedBadgeIds: ['badge-meteorite-1'],
    history: []
  });

  const [skillMasteries, setSkillMasteries] = useState<Record<string, SkillMasteryState>>({});
  const [targetExamDate, setTargetExamDate] = useState('2026-11-07');
  const [targetScore, setTargetScore] = useState(1550);
  const [dailyTargetCount, setDailyTargetCount] = useState(4);

  useEffect(() => {
    setStreakState(getUserStreakState());
    setEnergyState(getEnergyPointsState());
    setSkillMasteries(getAllSkillMasteries());

    // Load custom target settings from localStorage if present
    const savedDate = localStorage.getItem('sat_target_exam_date');
    if (savedDate) setTargetExamDate(savedDate);
    const savedScore = localStorage.getItem('sat_target_score');
    if (savedScore) setTargetScore(parseInt(savedScore, 10));
    const savedDaily = localStorage.getItem('sat_daily_target_count');
    if (savedDaily) setDailyTargetCount(parseInt(savedDaily, 10));
  }, []);

  // Compute countdown to target exam date
  const daysUntilExam = useMemo(() => {
    const target = new Date(targetExamDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [targetExamDate]);

  // Compute overall course readiness
  const allMathCodes = useMemo(() => KHAN_MATH_UNITS.flatMap((u) => u.lessons.map((l) => l.code)), []);
  const allRwCodes = useMemo(() => KHAN_RW_UNITS.flatMap((u) => u.lessons.map((l) => l.code)), []);
  const allCodes = useMemo(() => [...allMathCodes, ...allRwCodes], [allMathCodes, allRwCodes]);
  const overallMastery = useMemo(() => calculateMasteryPercentage(allCodes), [allCodes, skillMasteries]);

  // Compute domain breakdowns for segmented battery bars
  const domainData: DomainMasteryItem[] = useMemo(() => {
    const domainsConfig = [
      { name: 'Algebra', keyword: 'algebra', color: 'bg-emerald-600', maxSkills: 20 },
      { name: 'Advanced Math', keyword: 'advanced', color: 'bg-teal-600', maxSkills: 20 },
      { name: 'Problem Solving & Data Analysis', keyword: 'problem-solving', color: 'bg-cyan-600', maxSkills: 18 },
      { name: 'Geometry & Trigonometry', keyword: 'geometry', color: 'bg-amber-600', maxSkills: 20 }
    ];

    return domainsConfig.map((cfg) => {
      const units = KHAN_MATH_UNITS.filter((u) => u.domain.includes(cfg.keyword) || u.tier.includes(cfg.keyword));
      const codes = units.flatMap((u) => u.lessons.map((l) => l.code));
      const stats = calculateMasteryPercentage(codes);

      return {
        domain: cfg.name,
        totalSkills: codes.length > 0 ? codes.length : cfg.maxSkills,
        masteredSkills: stats.masteredCount,
        proficientSkills: stats.proficientCount,
        colorClass: cfg.color
      };
    });
  }, [skillMasteries]);

  // Compute daily target lessons completed today
  const dailyCompletedCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = Object.values(skillMasteries).filter((s) => s.lastPracticedAt.startsWith(today)).length;
    return Math.min(dailyTargetCount, Math.max(1, completedToday));
  }, [skillMasteries, dailyTargetCount]);

  // Recent completed milestones (last 4 exercises)
  const recentMilestones = useMemo(() => {
    const list = Object.values(skillMasteries)
      .filter((s) => s.totalAttempts > 0)
      .sort((a, b) => new Date(b.lastPracticedAt).getTime() - new Date(a.lastPracticedAt).getTime())
      .slice(0, 4);

    if (list.length === 0) {
      return [
        { title: 'Linear Equation Systems', status: 'Proficient', xp: 100, time: 'Recent' },
        { title: 'Quadratic Formula Mastery', status: 'Mastered', xp: 250, time: 'Recent' },
        { title: 'Percentages & Unit Conversions', status: 'Proficient', xp: 100, time: 'Recent' },
        { title: 'Scatterplots & Trendlines', status: 'Familiar', xp: 50, time: 'Recent' }
      ];
    }

    return list.map((item) => ({
      title: item.title || item.skillId.toUpperCase(),
      status: item.level.toUpperCase(),
      xp: item.level === 'mastered' ? 250 : item.level === 'proficient' ? 100 : 50,
      time: 'Completed'
    }));
  }, [skillMasteries]);

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#122810] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#122810] text-[#e8f2e6] border-b border-emerald-900/60 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              Back to Roadmap
            </Link>
            <div className="h-4 w-px bg-emerald-800" />
            <span className="text-sm font-bold text-white">Personal Profile Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-emerald-900/80 transition flex items-center gap-1.5 text-xs font-mono font-bold"
              title="Settings Control Panel"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* 1. Header Card: Avatar, Target, Countdown, Streak */}
        <section className="bg-gradient-to-br from-[#122810] via-[#173315] to-[#1e421c] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-[#0a180c] rounded-[14px] flex items-center justify-center text-3xl font-black">
                  🎓
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
                  Ahsan Javed
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/80 font-mono">
                  Official SAT Scholar: Target Score {targetScore}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Candidate
                  </span>
                </div>
              </div>
            </div>

            {/* Target Exam Badge & Streak Flame */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Countdown Badge */}
              <div className="bg-[#08150a]/80 border border-emerald-800/60 rounded-2xl px-4 py-3 min-w-[140px] text-center">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Exam</span>
                </div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">
                  {daysUntilExam} <span className="text-xs font-normal text-stone-400">days left</span>
                </div>
                <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                  Exam Date: {targetExamDate}
                </div>
              </div>

              {/* Streak Flame Badge */}
              <div className="bg-[#08150a]/80 border border-amber-500/30 rounded-2xl px-4 py-3 min-w-[120px] text-center">
                <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daily Streak</span>
                </div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">
                  {streakState.currentStreak} <span className="text-xs font-normal text-stone-400">days</span>
                </div>
                <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                  Personal Record: {streakState.longestStreak}d
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Visual Loaders: Master Radial Gauge & Daily Fuel Ring */}
        <section>
          <ProgressRings
            overallPercentage={overallMastery.percentage}
            masteredCount={overallMastery.masteredCount}
            totalSkillsCount={overallMastery.totalSkills}
            dailyCompletedCount={dailyCompletedCount}
            dailyTargetCount={dailyTargetCount}
          />
        </section>

        {/* 3. Domain Mastery Segmented Battery Bars */}
        <section>
          <DomainBattery domains={domainData} />
        </section>

        {/* 4. Recent Completed Milestones */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
                Recent Completed Milestones
              </span>
              <h2 className="text-lg font-bold text-stone-900 font-serif mt-0.5">
                Last 4 Practiced Objectives
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500 font-bold">
              +{energyState.totalPoints} Total XP
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {recentMilestones.map((m, idx) => (
              <div
                key={idx}
                className="py-3.5 first:pt-1 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-stone-50/60 transition px-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-stone-800">{m.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    m.status === 'MASTERED'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : m.status === 'PROFICIENT'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {m.status}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    +{m.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
