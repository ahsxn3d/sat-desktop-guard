'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Clock,
  Gamepad2,
  Globe,
  Plus,
  Trash2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  Radio,
  Sliders,
  Bell,
  Eye,
  Settings
} from 'lucide-react';
import { STUDY_PLAN_WEEKS } from '@/data/studyPlan';

const POPULAR_GAMES = [
  { id: 'cs2.exe', name: 'Counter-Strike 2', tag: 'CS2' },
  { id: 'steam.exe', name: 'Steam Client', tag: 'Steam' },
  { id: 'epicgameslauncher.exe', name: 'Epic Games', tag: 'Epic' },
  { id: 'valorant.exe', name: 'Valorant', tag: 'Riot' },
  { id: 'discord.exe', name: 'Discord', tag: 'Chat' },
  { id: 'telegram.exe', name: 'Telegram', tag: 'Chat' },
  { id: 'spotify.exe', name: 'Spotify', tag: 'Audio' },
  { id: 'robloxplayerbeta.exe', name: 'Roblox', tag: 'Game' },
  { id: 'minecraft.exe', name: 'Minecraft', tag: 'Game' },
];

const POPULAR_DOMAINS = [
  { id: 'youtube.com', name: 'YouTube (Home & Shorts)' },
  { id: 'reddit.com', name: 'Reddit' },
  { id: 'instagram.com', name: 'Instagram' },
  { id: 'tiktok.com', name: 'TikTok' },
  { id: 'twitter.com', name: 'X / Twitter' },
  { id: 'twitch.tv', name: 'Twitch' },
  { id: 'netflix.com', name: 'Netflix' },
];

export const FocusLockSection: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [blockedEvents, setBlockedEvents] = useState<Array<{ process: string; timestamp: string }>>([]);

  // Config State
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('21:15');
  const [autoLockOnSchedule, setAutoLockOnSchedule] = useState(true);
  const [blockGames, setBlockGames] = useState(true);
  const [blockWebsites, setBlockWebsites] = useState(true);

  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([
    'cs2.exe',
    'steam.exe',
    'valorant.exe',
    'discord.exe',
    'telegram.exe',
  ]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'youtube.com',
    'reddit.com',
    'instagram.com',
    'tiktok.com',
  ]);

  const [customProcessInput, setCustomProcessInput] = useState('');
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [customProcesses, setCustomProcesses] = useState<string[]>([]);
  const [customDomains, setCustomDomains] = useState<string[]>([]);

  // Task Completion status
  const [todayCompletedSkills, setTodayCompletedSkills] = useState(0);
  const [todayTotalSkills, setTodayTotalSkills] = useState(5);
  const [todayDateStr, setTodayDateStr] = useState('2026-10-01');

  // Check desktop runtime & register listeners
  useEffect(() => {
    // Check if running inside Electron window
    const desktopApi = (window as any).desktopGuard;
    if (desktopApi) {
      setIsDesktop(true);

      desktopApi.getStatus().then((status: any) => {
        setIsLocked(status.isLocked);
        setBlockedCount(status.blockedCount);
        setBlockedEvents(status.blockedEvents || []);
        if (status.config) {
          setStartTime(status.config.startTime || '18:30');
          setEndTime(status.config.endTime || '21:15');
          setAutoLockOnSchedule(status.config.autoLockOnSchedule ?? true);
          setBlockGames(status.config.blockGames ?? true);
          setBlockWebsites(status.config.blockWebsites ?? true);
          setSelectedProcesses(status.config.blockedProcesses || []);
          setSelectedDomains(status.config.blockedDomains || []);
          setCustomProcesses(status.config.customProcesses || []);
          setCustomDomains(status.config.customDomains || []);
        }
      });

      const removeUpdateListener = desktopApi.onGuardUpdate((status: any) => {
        setIsLocked(status.isLocked);
        setBlockedCount(status.blockedCount);
        setOvertimeSeconds(status.overtimeSeconds || 0);
        setBlockedEvents(status.blockedEvents || []);
      });

      const removeBlockedListener = desktopApi.onProcessBlocked((event: any) => {
        setBlockedEvents((prev) => [event, ...prev].slice(0, 20));
      });

      return () => {
        if (removeUpdateListener) removeUpdateListener();
        if (removeBlockedListener) removeBlockedListener();
      };
    } else {
      setIsDesktop(false);
    }
  }, []);

  // Fetch today's study progress from localStorage / DB
  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem('sat_completed_tasks');
      const completedMap: Record<string, boolean> = storedProgress ? JSON.parse(storedProgress) : {};

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      setTodayDateStr(todayStr);

      const allDays = STUDY_PLAN_WEEKS.flatMap((w) => w.days);
      const matchedDay = allDays.find((d) => d.dateStr === todayStr) || allDays.find((d) => d.dayNumber === 8);

      if (matchedDay) {
        const curriculumTasks = matchedDay.tasks.filter((t) => t.subject === 'math' || t.subject === 'rw');
        setTodayTotalSkills(curriculumTasks.length || 5);
        const doneCount = curriculumTasks.filter((t) => completedMap[t.id]).length;
        setTodayCompletedSkills(doneCount);
      }
    } catch (e) {
      console.warn('Progress load fallback:', e);
    }
  }, []);

  const handleToggleProcess = (proc: string) => {
    const next = selectedProcesses.includes(proc)
      ? selectedProcesses.filter((p) => p !== proc)
      : [...selectedProcesses, proc];
    setSelectedProcesses(next);
    saveConfigChanges({ blockedProcesses: next });
  };

  const handleToggleDomain = (domain: string) => {
    const next = selectedDomains.includes(domain)
      ? selectedDomains.filter((d) => d !== domain)
      : [...selectedDomains, domain];
    setSelectedDomains(next);
    saveConfigChanges({ blockedDomains: next });
  };

  const handleAddCustomProcess = () => {
    let clean = customProcessInput.trim().toLowerCase();
    if (!clean) return;
    if (!clean.endsWith('.exe')) clean += '.exe';
    if (!customProcesses.includes(clean)) {
      const next = [...customProcesses, clean];
      setCustomProcesses(next);
      saveConfigChanges({ customProcesses: next });
    }
    setCustomProcessInput('');
  };

  const handleAddCustomDomain = () => {
    let clean = customDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!clean) return;
    if (!customDomains.includes(clean)) {
      const next = [...customDomains, clean];
      setCustomDomains(next);
      saveConfigChanges({ customDomains: next });
    }
    setCustomDomainInput('');
  };

  const saveConfigChanges = (partial: any) => {
    const desktopApi = (window as any).desktopGuard;
    if (desktopApi) {
      desktopApi.saveConfig(partial);
    }
  };

  const handleStartLock = async () => {
    const desktopApi = (window as any).desktopGuard;
    if (desktopApi) {
      await desktopApi.startLock({
        startTime,
        endTime,
        blockedProcesses: selectedProcesses,
        blockedDomains: selectedDomains,
        customProcesses,
        customDomains,
        blockGames,
        blockWebsites,
      });
    }
    setIsLocked(true);
  };

  const handleStopLock = async () => {
    const desktopApi = (window as any).desktopGuard;
    if (desktopApi) {
      await desktopApi.stopLock('user_completed_all');
    }
    setIsLocked(false);
  };

  const allSkillsCompleted = todayCompletedSkills >= todayTotalSkills && todayTotalSkills > 0;

  const formatOvertime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `+${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Status */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border-2 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 shadow-2xl ${
          isLocked
            ? 'bg-gradient-to-br from-[#270c10]/95 via-[#18080a]/90 to-[#0d0405]/95 border-rose-500/60 shadow-rose-950/50'
            : 'bg-gradient-to-br from-[#06243f]/95 via-[#0b3b64]/90 to-[#026aa2]/85 border-sky-400/40 shadow-sky-950/40'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border font-['JetBrains_Mono'] ${
                isLocked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              }`}>
                {isLocked ? '🔒 Focus Shield Active' : '🛡️ Focus Shield Standby'}
              </span>
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30 font-['JetBrains_Mono']">
                {isDesktop ? 'Native Windows Desktop App' : 'Web Preview Mode'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-luxury flex items-center gap-3">
              {isLocked ? (
                <>
                  <ShieldAlert className="w-8 h-8 text-rose-400 animate-bounce" />
                  <span>Lockdown Protocol Engaged</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <span>Desktop App Blocker & Focus Guard</span>
                </>
              )}
            </h1>

            <p className="text-sm text-slate-200/90 max-w-2xl leading-relaxed">
              Enforce zero distractions during your SAT study hours. Automatically closes CS2, Steam, Discord, and blocks YouTube home feeds until today’s curriculum lessons are 100% verified.
            </p>
          </div>

          {/* Action Trigger Card */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[280px]">
            {isLocked ? (
              <div className="space-y-3">
                {allSkillsCompleted ? (
                  <button
                    onClick={handleStopLock}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Unlock className="w-5 h-5" />
                    <span>ALL SKILLS DONE! UNLOCK PC</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold text-xs uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Locked</span>
                    </div>
                    <p className="text-xs text-rose-200/90 font-medium">
                      Finish today's lessons ({todayCompletedSkills}/{todayTotalSkills} done) to activate completion unlock.
                    </p>
                  </div>
                )}

                {/* Overtime Penalty Display */}
                {overtimeSeconds > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                      Overtime Penalty:
                    </span>
                    <span className="font-black text-sm font-['JetBrains_Mono'] text-amber-300">
                      {formatOvertime(overtimeSeconds)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleStartLock}
                className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-5 h-5 text-slate-950" />
                <span>ENGAGE FOCUS LOCK NOW</span>
              </button>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Skills Done</span>
                <span className="text-sm font-black text-white font-['JetBrains_Mono']">
                  {todayCompletedSkills}/{todayTotalSkills}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Blocked Attempts</span>
                <span className="text-sm font-black text-rose-400 font-['JetBrains_Mono']">
                  {blockedCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Controls & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Study Hours & Rules */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white font-luxury">Scheduled Study Hours</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">Study Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    saveConfigChanges({ startTime: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-['JetBrains_Mono'] text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">Scheduled End Time (Deadline)</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    saveConfigChanges({ endTime: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-['JetBrains_Mono'] text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-200 font-medium">
                  <input
                    type="checkbox"
                    checked={autoLockOnSchedule}
                    onChange={(e) => {
                      setAutoLockOnSchedule(e.target.checked);
                      saveConfigChanges({ autoLockOnSchedule: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-600"
                  />
                  <span>Auto-Lock at {startTime} Daily</span>
                </label>
                <p className="text-[11px] text-slate-400 pl-6">
                  Automatically launches process protection when your study time begins.
                </p>
              </div>

              {/* Strict Whitelist Notice */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs uppercase text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Whitelisted & Always Allowed</span>
                </div>
                <ul className="text-[11px] text-emerald-300/80 space-y-1 list-disc pl-4 font-mono">
                  <li>Google Chrome / Microsoft Edge</li>
                  <li>Windows File Explorer (explorer.exe)</li>
                  <li>AI Assistant Apps (ChatGPT, Claude, Gemini)</li>
                  <li>Official Bluebook Testing App</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kill Log / Recent Interceptions */}
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live Interceptions</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Total: {blockedCount}</span>
            </div>

            {blockedEvents.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No distractions attempted yet. Great focus!
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs font-mono">
                {blockedEvents.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-rose-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      {ev.process}
                    </span>
                    <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: App & Domain Blocklists (Span 2) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Game & Application Blocker Card */}
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Gamepad2 className="w-6 h-6 text-sky-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-luxury">Game & Desktop App Blocker</h3>
                  <p className="text-xs text-slate-400">Automatically terminates processes on launch</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={blockGames}
                  onChange={(e) => {
                    setBlockGames(e.target.checked);
                    saveConfigChanges({ blockGames: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-800 border-slate-600"
                />
                <span>Enable Process Guard</span>
              </label>
            </div>

            {/* Popular Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POPULAR_GAMES.map((game) => {
                const isSelected = selectedProcesses.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => handleToggleProcess(game.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500/60 text-white shadow-xs'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{game.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{game.id}</span>
                    </div>
                    {isSelected && <Lock className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Executable */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 block">Add Any Other App or Game (.exe)</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. gta5.exe, obs64.exe, discord.exe"
                  value={customProcessInput}
                  onChange={(e) => setCustomProcessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomProcess()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-['JetBrains_Mono'] focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  onClick={handleAddCustomProcess}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exe</span>
                </button>
              </div>

              {customProcesses.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {customProcesses.map((proc) => (
                    <span
                      key={proc}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-900/40 border border-rose-500/40 text-rose-200 text-xs font-mono"
                    >
                      <span>{proc}</span>
                      <button
                        onClick={() => {
                          const next = customProcesses.filter((p) => p !== proc);
                          setCustomProcesses(next);
                          saveConfigChanges({ customProcesses: next });
                        }}
                        className="text-rose-400 hover:text-white"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Website & Domain Blocker Card */}
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Globe className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-luxury">Website & Distraction Blocker</h3>
                  <p className="text-xs text-slate-400">Routes distracting domains to local offline lock</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={blockWebsites}
                  onChange={(e) => {
                    setBlockWebsites(e.target.checked);
                    saveConfigChanges({ blockWebsites: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-600"
                />
                <span>Enable Web Lock</span>
              </label>
            </div>

            {/* Popular Domains */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POPULAR_DOMAINS.map((site) => {
                const isSelected = selectedDomains.includes(site.id);
                return (
                  <button
                    key={site.id}
                    onClick={() => handleToggleDomain(site.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-xs'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{site.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{site.id}</span>
                    </div>
                    {isSelected && <Lock className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Domain */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 block">Add Any Other Website</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. animepahe.ru, 9gag.com"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomDomain()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-['JetBrains_Mono'] focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={handleAddCustomDomain}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add URL</span>
                </button>
              </div>

              {customDomains.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {customDomains.map((dom) => (
                    <span
                      key={dom}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono"
                    >
                      <span>{dom}</span>
                      <button
                        onClick={() => {
                          const next = customDomains.filter((d) => d !== dom);
                          setCustomDomains(next);
                          saveConfigChanges({ customDomains: next });
                        }}
                        className="text-emerald-400 hover:text-white"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
