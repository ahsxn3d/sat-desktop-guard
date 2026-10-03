'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS, KhanUnitInfo, KhanLessonItem } from '@/data/khanAcademyCatalog';
import { getAllSkillMasteries, calculateMasteryPercentage, SkillMasteryState } from '@/lib/masteryEngine';
import { getUserStreakState } from '@/lib/streakEngine';
import { getEnergyPointsState } from '@/lib/energyPoints';

export default function CourseDashboardPage() {
  const params = useParams();
  const rawSlug = (params?.courseSlug as string) || 'sat-math';
  const isMath = !rawSlug.toLowerCase().includes('reading') && !rawSlug.toLowerCase().includes('rw');
  
  const courseTitle = isMath ? 'Official Digital SAT Math' : 'Official Digital SAT Reading & Writing';
  const courseUnits: KhanUnitInfo[] = isMath ? KHAN_MATH_UNITS : KHAN_RW_UNITS;
  const courseId = isMath ? 'sat-math' : 'sat-rw';

  const [expandedUnit, setExpandedUnit] = useState<number | null>(courseUnits[0]?.unitNumber || 2);
  const [skillMasteries, setSkillMasteries] = useState<Record<string, SkillMasteryState>>({});
  const [streakCount, setStreakCount] = useState<number>(1);
  const [energyPoints, setEnergyPoints] = useState<number>(0);

  useEffect(() => {
    setSkillMasteries(getAllSkillMasteries());
    const streak = getUserStreakState();
    setStreakCount(streak.currentStreak || 1);
    const pts = getEnergyPointsState();
    setEnergyPoints(pts.totalPoints || 0);
  }, []);

  // Collect all skill codes across the entire course
  const allCourseSkillCodes = courseUnits.flatMap((u) => u.lessons.map((l) => l.code));
  const courseMastery = calculateMasteryPercentage(allCourseSkillCodes);

  const getSkillState = (code: string) => {
    const clean = code.trim().toLowerCase();
    return skillMasteries[clean]?.level || 'not_started';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Mastered
          </span>
        );
      case 'proficient':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Proficient
          </span>
        );
      case 'familiar':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Familiar
          </span>
        );
      case 'attempted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            Attempted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
            Not started
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#122810] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Banner & Navigation Header */}
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
            <span className="text-sm font-bold tracking-tight text-white">{courseTitle}</span>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 font-bold">
              <span>🔥</span>
              <span>{streakCount} {streakCount === 1 ? 'day' : 'days'} streak</span>
            </div>

            {/* Energy Points */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-300 font-bold font-mono">
              <span>⚡</span>
              <span>{energyPoints.toLocaleString()} pts</span>
            </div>

            {/* Profile Link */}
            <Link
              href="/profile"
              className="bg-emerald-800/60 hover:bg-emerald-700/80 px-3 py-1 rounded-full text-white font-medium transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Course Hero & Mastery Progress Overview */}
      <section className="bg-gradient-to-b from-[#122810] via-[#1a3818] to-[#234b20] text-white pt-8 pb-12 px-4 sm:px-6 shadow-inner">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Khan Academy Official Syllabus
                </span>
                <span className="text-xs text-emerald-400/80 font-mono">
                  {courseUnits.length} Units • {allCourseSkillCodes.length} Skills
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">
                {courseTitle}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-200/80 max-w-2xl">
                Master individual micro-skills through step-by-step practice sets, validate checkpoints with quizzes, and lock in Mastered status on unit tests.
              </p>
            </div>

            {/* Mastery Stats Card */}
            <div className="bg-[#0c1a0b]/80 border border-emerald-700/40 rounded-2xl p-5 min-w-[280px] shadow-xl backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-semibold">
                  Course Mastery
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  {courseMastery.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 h-3 bg-stone-800/80 rounded-full overflow-hidden p-0.5 border border-emerald-900/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${courseMastery.percentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-emerald-300/80 font-mono">
                <span>{courseMastery.proficientCount + courseMastery.masteredCount} of {courseMastery.totalSkills} skills</span>
                <span className="text-amber-300 font-bold">{courseMastery.masteredCount} Mastered</span>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/50 flex gap-2">
                <Link
                  href={`/assessment/${courseId}-challenge`}
                  className="w-full text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  ⚡ Take Course Challenge (30 Qs)
                </Link>
              </div>
            </div>
          </div>

          {/* Switch Course Quick Bar */}
          <div className="mt-8 flex gap-3 border-b border-emerald-800/50 pb-3">
            <Link
              href="/course/sat-math"
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                isMath
                  ? 'bg-emerald-500 text-[#0c1a0b] shadow'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/70'
              }`}
            >
              Math Units (2–13)
            </Link>
            <Link
              href="/course/sat-reading-writing"
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                !isMath
                  ? 'bg-emerald-500 text-[#0c1a0b] shadow'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/70'
              }`}
            >
              Reading & Writing Units (2–12)
            </Link>
          </div>
        </div>
      </section>

      {/* Course Content: Vertical List of Unit Cards */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {courseUnits.map((unit) => {
          const unitSkillCodes = unit.lessons.map((l) => l.code);
          const unitMastery = calculateMasteryPercentage(unitSkillCodes);
          const isExpanded = expandedUnit === unit.unitNumber;

          return (
            <div
              key={unit.unitNumber}
              className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:border-emerald-300"
            >
              {/* Unit Card Header */}
              <div
                onClick={() => setExpandedUnit(isExpanded ? null : unit.unitNumber)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-50/50 to-white hover:bg-emerald-50/20 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Unit {unit.unitNumber}
                    </span>
                    <span className="text-xs font-medium text-stone-500 capitalize">
                      {unit.tier} Tier • {unit.lessons.length} Skills
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 mt-1 font-serif">
                    {unit.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                {/* Unit Mastery Stats & Action */}
                <div className="flex items-center gap-4 sm:gap-6 self-start md:self-center">
                  <div className="text-right min-w-[120px]">
                    <div className="text-xs font-mono font-bold text-stone-700">
                      {unitMastery.proficientCount + unitMastery.masteredCount} / {unitMastery.totalSkills} Mastered
                    </div>
                    <div className="w-32 h-2.5 bg-stone-100 rounded-full overflow-hidden mt-1.5 border border-stone-200">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${unitMastery.percentage}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                      {unitMastery.percentage}% Unit Mastery
                    </div>
                  </div>

                  <span className="text-stone-400 text-lg font-mono">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Expandable Lesson Accordion */}
              {isExpanded && (
                <div className="border-t border-stone-200/70 bg-stone-50/30 p-4 sm:p-6 space-y-4">
                  {/* Action Gateway Buttons: Quiz & Unit Test */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-900/5 rounded-xl border border-emerald-900/10">
                    <span className="text-xs font-semibold text-emerald-950">
                      High-Stakes Checkpoints for Unit {unit.unitNumber}:
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/assessment/${isMath ? 'math' : 'rw'}-u${unit.unitNumber}-quiz`}
                        className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 shadow-sm transition"
                      >
                        ⚡ Checkpoint Quiz (6 Qs)
                      </Link>
                      <Link
                        href={`/assessment/${isMath ? 'math' : 'rw'}-u${unit.unitNumber}-test`}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        🏆 High-Stakes Unit Test (12 Qs)
                      </Link>
                    </div>
                  </div>

                  {/* Itemized Skill Rows */}
                  <div className="divide-y divide-stone-200/60 bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
                    {unit.lessons.map((lesson: KhanLessonItem) => {
                      const skillState = getSkillState(lesson.code);
                      const skillSlug = lesson.code.toLowerCase().replace(/[^a-z0-9]/g, '-');

                      return (
                        <div
                          key={lesson.code}
                          className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <span className="text-xs font-mono font-bold text-stone-400 w-20 flex-shrink-0">
                              {lesson.code}
                            </span>
                            <div>
                              <div className="font-semibold text-sm text-stone-800">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-stone-500 mt-0.5">
                                {lesson.description}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            {getLevelBadge(skillState)}

                            {/* Resource Links: Article, Video, Practice */}
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/a/${skillSlug}`}
                                title="Read Theory Article"
                                className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs font-bold border border-stone-200"
                              >
                                📄 Article
                              </Link>
                              <Link
                                href={`/v/${skillSlug}`}
                                title="Watch Video Lesson"
                                className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs font-bold border border-stone-200"
                              >
                                🎬 Video
                              </Link>
                              <Link
                                href={`/exercise/${skillSlug}`}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
                              >
                                ✏️ Practice (4 Qs)
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
