'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getUserStreakState, UserStreakState } from '@/lib/streakEngine';
import { getEnergyPointsState, OFFICIAL_BADGES, EnergyPointsState, BadgeInfo } from '@/lib/energyPoints';
import { getAllSkillMasteries, calculateMasteryPercentage, SkillMasteryState } from '@/lib/masteryEngine';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS } from '@/data/khanAcademyCatalog';
import { Flame, Zap, Award, BookOpen, Shield, Calendar, CheckCircle2, ArrowRight, Clock, Target } from 'lucide-react';

export default function StudentProfilePage() {
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

  useEffect(() => {
    setStreakState(getUserStreakState());
    setEnergyState(getEnergyPointsState());
    setSkillMasteries(getAllSkillMasteries());
  }, []);

  // Compute overall course progress
  const mathSkillCodes = useMemo(() => KHAN_MATH_UNITS.flatMap((u) => u.lessons.map((l) => l.code)), []);
  const rwSkillCodes = useMemo(() => KHAN_RW_UNITS.flatMap((u) => u.lessons.map((l) => l.code)), []);

  const mathMastery = useMemo(() => calculateMasteryPercentage(mathSkillCodes), [mathSkillCodes, skillMasteries]);
  const rwMastery = useMemo(() => calculateMasteryPercentage(rwSkillCodes), [rwSkillCodes, skillMasteries]);

  // Generate GitHub-style contribution grid for the past 12 weeks (84 days)
  const heatmapCells = useMemo(() => {
    const cells = [];
    const today = new Date();

    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const sessions = streakState.activityHistory[dateStr] || 0;
      cells.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        sessions
      });
    }
    return cells;
  }, [streakState.activityHistory]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#122810] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#122810] text-[#e8f2e6] border-b border-emerald-900/60 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              ← SAT Suite
            </Link>
            <div className="h-4 w-px bg-emerald-800" />
            <span className="text-sm font-bold text-white">Student Dashboard & Profile</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/focus-lock"
              className="text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Focus Blocker</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Stats Section */}
      <section className="bg-gradient-to-b from-[#122810] via-[#1a3818] to-[#234b20] text-white pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-xl">
                <div className="w-full h-full bg-[#102413] rounded-[22px] flex items-center justify-center text-2xl font-black text-white font-mono">
                  🎓
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
                    Official SAT Candidate
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 font-mono">
                  Anti-Burnout Rulebook • Khan Academy Assessment Pipeline
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Daily Streak */}
              <div className="bg-[#0b180d]/80 border border-emerald-800/50 rounded-2xl p-4 backdrop-blur-sm min-w-[130px]">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Daily Streak</span>
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {streakState.currentStreak} <span className="text-xs font-normal text-stone-400">days</span>
                </div>
                <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                  Best: {streakState.longestStreak} days
                </div>
              </div>

              {/* Energy Points */}
              <div className="bg-[#0b180d]/80 border border-emerald-800/50 rounded-2xl p-4 backdrop-blur-sm min-w-[130px]">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Energy Points</span>
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {energyState.totalPoints.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                  {energyState.unlockedBadgeIds.length} badges unlocked
                </div>
              </div>

              {/* Weekly Habit Indicator */}
              <div className="bg-[#0b180d]/80 border border-emerald-800/50 rounded-2xl p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-teal-400 font-mono font-bold">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Active This Week</span>
                </div>
                <div className="flex items-center gap-1 mt-2.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                    const isActive = streakState.activeDaysThisWeek[idx];
                    return (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center ${
                          isActive
                            ? 'bg-emerald-500 text-stone-950 font-black'
                            : 'bg-stone-800/80 text-stone-500 border border-stone-700/60'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Section 1: Enrolled Courses & Quick Resume */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900 font-serif">
            Enrolled Digital SAT Course Syllabi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Math Course Card */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Math Syllabus
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {mathMastery.proficientCount + mathMastery.masteredCount} / {mathMastery.totalSkills} Skills
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-serif">
                  Digital SAT Math (Units 2–13)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Algebra, Advanced Math, Problem-Solving & Data Analysis, Geometry & Trigonometry.
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-stone-500">Mastery Progress</span>
                    <span className="font-bold text-emerald-700">{mathMastery.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${mathMastery.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500">
                  {mathMastery.masteredCount} Mastered Badges
                </span>
                <Link
                  href="/course/sat-math"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <span>Resume Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Reading & Writing Course Card */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Reading & Writing Syllabus
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {rwMastery.proficientCount + rwMastery.masteredCount} / {rwMastery.totalSkills} Skills
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-serif">
                  Digital SAT Reading & Writing (Units 2–12)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Craft & Structure, Information & Ideas, Standard English Conventions, Expression of Ideas.
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-stone-500">Mastery Progress</span>
                    <span className="font-bold text-blue-700">{rwMastery.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${rwMastery.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500">
                  {rwMastery.masteredCount} Mastered Badges
                </span>
                <Link
                  href="/course/sat-reading-writing"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <span>Resume Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: GitHub-Style Activity Heatmap Grid */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">
                Activity Heatmap
              </h2>
              <p className="text-xs text-stone-500">
                Daily and weekly study consistency tracked over the past 12 weeks.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <span>Less</span>
              <div className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-200" />
              <div className="w-3 h-3 rounded-xs bg-emerald-200" />
              <div className="w-3 h-3 rounded-xs bg-emerald-400" />
              <div className="w-3 h-3 rounded-xs bg-emerald-600" />
              <span>More</span>
            </div>
          </div>

          {/* Grid display */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5">
              {heatmapCells.map((cell, idx) => {
                let cellColor = 'bg-stone-100 border border-stone-200/60';
                if (cell.sessions >= 3) {
                  cellColor = 'bg-emerald-600 shadow-xs shadow-emerald-600/30';
                } else if (cell.sessions === 2) {
                  cellColor = 'bg-emerald-400';
                } else if (cell.sessions === 1) {
                  cellColor = 'bg-emerald-200';
                }

                return (
                  <div
                    key={idx}
                    title={`${cell.date}: ${cell.sessions} active session(s)`}
                    className={`w-3.5 h-3.5 rounded-xs transition-colors hover:scale-125 cursor-pointer ${cellColor}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Official Badge Cabinet */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">
                Official Badge Cabinet
              </h2>
              <p className="text-xs text-stone-500">
                Earn Energy Points across video completions, theory readings, practice sets, and high-stakes tests.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⚡ {energyState.totalPoints.toLocaleString()} Energy Points
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {OFFICIAL_BADGES.map((badge: BadgeInfo) => {
              const isUnlocked = energyState.totalPoints >= badge.pointsRequired;
              const progressPct = Math.min(100, Math.round((energyState.totalPoints / badge.pointsRequired) * 100));

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 transition-all ${
                    isUnlocked
                      ? 'bg-white border-amber-300 shadow-sm shadow-amber-500/10'
                      : 'bg-stone-50/70 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="space-y-2 text-center">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="font-bold text-sm text-stone-900">{badge.name}</div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                      {badge.tier.replace('_', ' ')}
                    </div>
                    <p className="text-xs text-stone-500 leading-snug">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-stone-500">
                        {isUnlocked ? 'Unlocked' : `${progressPct}%`}
                      </span>
                      <span className="font-bold text-stone-700">
                        {badge.pointsRequired.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked ? 'bg-amber-500' : 'bg-stone-400'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
