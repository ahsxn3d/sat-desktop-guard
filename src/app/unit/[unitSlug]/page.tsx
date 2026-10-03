'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS, KhanUnitInfo, KhanLessonItem } from '@/data/khanAcademyCatalog';
import { getAllSkillMasteries, calculateMasteryPercentage, SkillMasteryState } from '@/lib/masteryEngine';
import { getUserStreakState } from '@/lib/streakEngine';

export default function UnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.unitSlug as string) || 'math-2';
  
  // Parse slug e.g. "math-2", "rw-3", "math-u5"
  const isMath = !rawSlug.toLowerCase().startsWith('rw');
  const unitNumMatches = rawSlug.match(/\d+/);
  const targetUnitNumber = unitNumMatches ? parseInt(unitNumMatches[0], 10) : 2;

  const catalog = isMath ? KHAN_MATH_UNITS : KHAN_RW_UNITS;
  const currentUnit = catalog.find((u) => u.unitNumber === targetUnitNumber) || catalog[0];

  const [skillMasteries, setSkillMasteries] = useState<Record<string, SkillMasteryState>>({});
  const [streakCount, setStreakCount] = useState<number>(1);

  useEffect(() => {
    setSkillMasteries(getAllSkillMasteries());
    const streak = getUserStreakState();
    setStreakCount(streak.currentStreak || 1);
  }, []);

  const unitSkillCodes = currentUnit.lessons.map((l) => l.code);
  const unitMastery = calculateMasteryPercentage(unitSkillCodes);

  const getSkillState = (code: string) => {
    const clean = code.trim().toLowerCase();
    return skillMasteries[clean]?.level || 'not_started';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Mastered (High-Stakes Tested)
          </span>
        );
      case 'proficient':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Proficient (100% Practice)
          </span>
        );
      case 'familiar':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Familiar (70-75%)
          </span>
        );
      case 'attempted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            Attempted (&lt;70%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
            Not started
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#122810] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#122810] text-[#e8f2e6] border-b border-emerald-900/60 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={isMath ? '/course/sat-math' : '/course/sat-reading-writing'}
              className="text-xs uppercase tracking-widest font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              ← Back to {isMath ? 'SAT Math' : 'SAT Reading & Writing'}
            </Link>
            <div className="h-4 w-px bg-emerald-800" />
            <span className="text-sm font-bold text-white">Unit {currentUnit.unitNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 font-bold text-xs">
              <span>🔥</span>
              <span>{streakCount} {streakCount === 1 ? 'day' : 'days'}</span>
            </div>
            <Link
              href="/profile"
              className="bg-emerald-800/60 hover:bg-emerald-700/80 px-3 py-1 rounded-full text-white font-medium text-xs transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Unit Hero & Mastery Summary */}
      <section className="bg-gradient-to-b from-[#122810] via-[#1a3818] to-[#234b20] text-white pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Unit {currentUnit.unitNumber} • {currentUnit.tier.toUpperCase()} TIER
                </span>
                <span className="text-xs text-emerald-300/80 capitalize">
                  Domain: {currentUnit.domain.replace('-', ' ')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                {currentUnit.title}
              </h1>
              <p className="mt-2 text-sm text-emerald-200/80 max-w-2xl">
                {currentUnit.description}
              </p>
            </div>

            {/* Unit Mastery Card */}
            <div className="bg-[#0c1a0b]/80 border border-emerald-700/40 rounded-2xl p-5 min-w-[280px] shadow-xl backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-semibold">
                  Unit Mastery
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  {unitMastery.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 h-3 bg-stone-800/80 rounded-full overflow-hidden p-0.5 border border-emerald-900/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${unitMastery.percentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-emerald-300/80 font-mono">
                <span>{unitMastery.proficientCount + unitMastery.masteredCount} of {unitMastery.totalSkills} skills</span>
                <span className="text-amber-300 font-bold">{unitMastery.masteredCount} Mastered</span>
              </div>

              {/* Checkpoint Gateway Actions */}
              <div className="mt-4 pt-3 border-t border-emerald-900/50 grid grid-cols-2 gap-2">
                <Link
                  href={`/assessment/${isMath ? 'math' : 'rw'}-u${currentUnit.unitNumber}-quiz`}
                  className="text-center py-2 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-600 transition"
                >
                  ⚡ Start Quiz
                </Link>
                <Link
                  href={`/assessment/${isMath ? 'math' : 'rw'}-u${currentUnit.unitNumber}-test`}
                  className="text-center py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  🏆 Unit Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Itemized Breakdown of All Skills */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 font-mono">
              Itemized Skill Syllabus ({currentUnit.lessons.length} Core Skills)
            </h2>
            <span className="text-xs text-stone-500">
              4 Questions per Practice Set
            </span>
          </div>

          <div className="divide-y divide-stone-200/70">
            {currentUnit.lessons.map((lesson: KhanLessonItem, idx: number) => {
              const skillState = getSkillState(lesson.code);
              const skillSlug = lesson.code.toLowerCase().replace(/[^a-z0-9]/g, '-');

              return (
                <div
                  key={lesson.code}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/60 transition"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-500">
                          {lesson.code}
                        </span>
                        <span className="text-xs text-stone-400">• {lesson.recommendedMinutes} min practice</span>
                      </div>
                      <h3 className="font-bold text-base text-stone-900 mt-0.5">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 max-w-xl">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                    {getLevelBadge(skillState)}

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/a/${skillSlug}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
                      >
                        📄 Article
                      </Link>
                      <Link
                        href={`/v/${skillSlug}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
                      >
                        🎬 Video
                      </Link>
                      <Link
                        href={`/exercise/${skillSlug}`}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        ✏️ Practice
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
