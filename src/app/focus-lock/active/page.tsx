'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, Lock, Unlock, Clock, AlertTriangle, Flame, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ActiveFocusLockoutPage() {
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60); // 25 min default
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [blockedKillsCount, setBlockedKillsCount] = useState(0);
  const [emergencyCooldown, setEmergencyCooldown] = useState(60); // 60s cooldown to prevent impulsive quit
  const [isEmergencyUnlocked, setIsEmergencyUnlocked] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Active countdown
  useEffect(() => {
    if (isPaused || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, secondsRemaining]);

  // Desktop process kill listener if in Electron
  useEffect(() => {
    const desktopApi = (window as any).desktopGuard;
    if (desktopApi) {
      desktopApi.getStatus().then((status: any) => {
        if (status) setBlockedKillsCount(status.blockedCount || 0);
      });

      const removeBlockedListener = desktopApi.onProcessBlocked(() => {
        setBlockedKillsCount((prev) => prev + 1);
      });

      return () => {
        if (removeBlockedListener) removeBlockedListener();
      };
    }
  }, []);

  // Emergency cooldown timer
  useEffect(() => {
    if (!emergencyActive || emergencyCooldown <= 0) {
      if (emergencyCooldown === 0) setIsEmergencyUnlocked(true);
      return;
    }
    const interval = setInterval(() => {
      setEmergencyCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [emergencyActive, emergencyCooldown]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPct = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  return (
    <div className="min-h-screen bg-[#071521] text-white flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Lock className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-rose-400 font-['JetBrains_Mono']">
              STRICT HARDCORE LOCKOUT ACTIVE
            </div>
            <h1 className="text-xl font-black text-white font-['Space_Grotesk']">
              Distraction-Free Deep Study Session
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-['JetBrains_Mono']">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-400">Blocked Apps Killed: </span>
            <span className="font-bold text-rose-400">{blockedKillsCount}</span>
          </div>
          <Link
            href="/focus-lock"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Setup</span>
          </Link>
        </div>
      </div>

      {/* Main Circular Countdown Timer */}
      <div className="flex flex-col items-center justify-center my-auto py-8 z-10 text-center">
        <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
          {/* Radial SVG Circle */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="105"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="120"
              cy="120"
              r="105"
              stroke="#22c55e"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * (1 - progressPct / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time Inside */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-['Space_Grotesk']">
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold font-['JetBrains_Mono'] mt-1">
              {secondsRemaining === 0 ? 'SESSION COMPLETE! 🏆' : 'DEEP WORK FOCUS'}
            </span>
          </div>
        </div>

        {/* Motivational Focus Rule */}
        <div className="mt-8 max-w-lg p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-emerald-200/90 leading-relaxed font-medium">
          "The obstacle in your path is not the test; it is the urge to distract your mind. Stay inside the arena."
        </div>
      </div>

      {/* Bottom Emergency Unlock Protocol */}
      <div className="w-full max-w-xl p-4 rounded-3xl bg-black/40 border border-white/10 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-['JetBrains_Mono'] text-xs">
        <div>
          <span className="font-bold text-slate-300 block">Impulse-Protection Lock:</span>
          <span className="text-[11px] text-slate-400">
            Prevents quitting during emotional friction.
          </span>
        </div>

        {!isEmergencyUnlocked ? (
          !emergencyActive ? (
            <button
              onClick={() => setEmergencyActive(true)}
              className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold transition cursor-pointer"
            >
              Request Emergency Break
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-rose-400 font-bold animate-pulse">
                Breathing Cooldown: {emergencyCooldown}s
              </span>
            </div>
          )
        ) : (
          <Link
            href="/"
            className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition"
          >
            Exit Lockout to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
