'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  Calendar,
  Target,
  Clock,
  Shield,
  Volume2,
  Lock,
  Download,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
  User,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  // 1. Exam Target & Pace state
  const [targetExamDate, setTargetExamDate] = useState('2026-11-07');
  const [targetScore, setTargetScore] = useState(1550);
  const [dailyTarget, setDailyTarget] = useState(4);

  // 2. Focus & Blocker state
  const [isBlockerActive, setIsBlockerActive] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  // 3. Account state
  const [displayName, setDisplayName] = useState('Ahsan Javed');
  const [email] = useState('muhammadahsanjaved09@gmail.com');

  // Modals & Feedback
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  useEffect(() => {
    // Load local storage values if present
    const savedDate = localStorage.getItem('sat_target_exam_date');
    if (savedDate) setTargetExamDate(savedDate);
    const savedScore = localStorage.getItem('sat_target_score');
    if (savedScore) setTargetScore(parseInt(savedScore, 10));
    const savedDaily = localStorage.getItem('sat_daily_target_count');
    if (savedDaily) setDailyTarget(parseInt(savedDaily, 10));
    const savedStrict = localStorage.getItem('sat_strict_mode');
    if (savedStrict) setStrictMode(savedStrict === 'true');
    const savedSound = localStorage.getItem('sat_sound_effects');
    if (savedSound) setSoundEffects(savedSound !== 'false');

    // Check desktop electron blocker status
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      setIsBlockerActive(true);
    }
  }, []);

  const handleSaveSettings = async () => {
    localStorage.setItem('sat_target_exam_date', targetExamDate);
    localStorage.setItem('sat_target_score', String(targetScore));
    localStorage.setItem('sat_daily_target_count', String(dailyTarget));
    localStorage.setItem('sat_strict_mode', String(strictMode));
    localStorage.setItem('sat_sound_effects', String(soundEffects));

    try {
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-student-session',
          displayName,
          targetDate: targetExamDate,
          targetScore,
          dailyTarget,
          strictMode,
          soundEffects
        })
      });
    } catch (e) {
      // Fallback
    }

    setSaveStatus('Settings updated successfully');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/user/export?userId=usr-student-session');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sat-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not generate export file. Please try again.');
    }
  };

  const handleResetProgress = async () => {
    setIsProcessingAction(true);
    try {
      await fetch('/api/user/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr-student-session' })
      });
      localStorage.removeItem('khan_mastery_state_machine_v2');
      setShowResetModal(false);
      alert('Course progress has been reset to zero.');
      window.location.reload();
    } catch (e) {
      alert('Failed to reset progress.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput.trim() !== 'DELETE') {
      alert('You must type DELETE exactly to confirm.');
      return;
    }
    setIsProcessingAction(true);
    try {
      await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-student-session',
          confirmation: 'DELETE'
        })
      });
      localStorage.clear();
      signOut({ callbackUrl: '/' });
    } catch (e) {
      alert('Account deletion failed.');
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#122810] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#122810] text-[#e8f2e6] border-b border-emerald-900/60 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              Back to Roadmap
            </Link>
            <div className="h-4 w-px bg-emerald-800" />
            <span className="text-sm font-bold text-white">Settings Control Panel</span>
          </div>

          <Link
            href="/profile"
            className="text-xs font-mono font-bold text-stone-300 hover:text-white bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800 transition"
          >
            View Profile
          </Link>
        </div>
      </header>

      {/* Main Settings Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {saveStatus && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Card 1: Exam Target & Pace */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">1. Exam Target & Pace</h2>
              <p className="text-xs text-stone-500">Configure target test date, score goal, and daily study commitment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Exam Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-stone-700 uppercase">Target Exam Date</label>
              <input
                type="date"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
                className="w-full bg-[#f4f7f3] border border-stone-300 rounded-xl p-3 text-xs sm:text-sm font-mono text-stone-900 outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-stone-400">Drives countdown badge on profile.</span>
            </div>

            {/* Target Score */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-stone-700 uppercase">Target Score</label>
              <select
                value={targetScore}
                onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
                className="w-full bg-[#f4f7f3] border border-stone-300 rounded-xl p-3 text-xs sm:text-sm font-mono text-stone-900 outline-none focus:border-emerald-500"
              >
                <option value={1400}>1400 (Top 5%)</option>
                <option value={1500}>1500 (Top 1%)</option>
                <option value={1550}>1550+ (Ivy League Target)</option>
                <option value={1600}>1600 (Perfect Score)</option>
              </select>
              <span className="text-[11px] text-stone-400">Score expectation threshold.</span>
            </div>

            {/* Daily Commitment */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-stone-700 uppercase">Daily Commitment</label>
              <select
                value={dailyTarget}
                onChange={(e) => setDailyTarget(parseInt(e.target.value, 10))}
                className="w-full bg-[#f4f7f3] border border-stone-300 rounded-xl p-3 text-xs sm:text-sm font-mono text-stone-900 outline-none focus:border-emerald-500"
              >
                <option value={2}>2 lessons/day (Gentle Pace)</option>
                <option value={4}>4 lessons/day (Standard Anti-Burnout)</option>
                <option value={6}>6 lessons/day (Intensive Sprint)</option>
              </select>
              <span className="text-[11px] text-stone-400">Daily Fuel Ring target.</span>
            </div>
          </div>
        </section>

        {/* Card 2: Focus & App Blocker Sync */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">2. Focus & Blocker Integration</h2>
              <p className="text-xs text-stone-500">Coordinate native desktop app blocking and runner strictness.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Blocker Status Indicator */}
            <div className="flex items-center justify-between p-4 bg-[#f4f7f3] rounded-2xl border border-stone-200">
              <div>
                <div className="text-sm font-bold text-stone-900">Desktop Background Blocker Client</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Monitors and suppresses games, Discord, and streaming services during active timers.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isBlockerActive
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-stone-200 text-stone-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isBlockerActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  <span>{isBlockerActive ? 'Daemon Active' : 'Standby'}</span>
                </span>
                <Link
                  href="/focus-lock"
                  className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Configure
                </Link>
              </div>
            </div>

            {/* Strict Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
              <div>
                <div className="text-sm font-bold text-stone-900">Strict Lockout Mode</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Disables runner exit buttons until all 4 practice questions or exam sets are completed.
                </div>
              </div>
              <input
                type="checkbox"
                checked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Sound & Confetti Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
              <div>
                <div className="text-sm font-bold text-stone-900">Sound Cues & Confetti Celebrations</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Play subtle audio feedback on correct answers and trigger celebratory confetti bursts.
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Card 3: Account & Security */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">3. Account & Security</h2>
              <p className="text-xs text-stone-500">Manage display identity, linked authentication, and active sessions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-stone-700 uppercase">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#f4f7f3] border border-stone-300 rounded-xl p-3 text-xs sm:text-sm font-medium text-stone-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-stone-700 uppercase">Email Address (Read-Only)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-stone-100 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm font-mono text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#f4f7f3] rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-stone-700 font-bold">Google Cloud OAuth Connected</span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold rounded-xl transition"
            >
              Log Out From All Sessions
            </button>
          </div>
        </section>

        {/* Card 4: Data & Privacy (GDPR Compliance) */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">4. Data & Privacy (GDPR Essentials)</h2>
              <p className="text-xs text-stone-500">Download data archive, reset mastery states, or permanently delete account.</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#f4f7f3] rounded-2xl border border-stone-200">
              <div>
                <div className="text-sm font-bold text-stone-900">Export All Progress Data</div>
                <div className="text-xs text-stone-500">Download complete mastery records, test scores, and history in a JSON file.</div>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-orange-50/40 rounded-2xl border border-orange-200">
              <div>
                <div className="text-sm font-bold text-orange-950">Reset Course Progress</div>
                <div className="text-xs text-orange-800/80">Wipe all skill mastery statuses back to Not started while preserving account.</div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Progress</span>
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-200">
              <div>
                <div className="text-sm font-bold text-rose-950">Delete Account & Purge Data</div>
                <div className="text-xs text-rose-800/80">Permanently delete your profile and all associated test rows from PostgreSQL.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmationInput('');
                  setShowDeleteModal(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </section>

        {/* Global Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
          >
            Save All Settings
          </button>
        </div>
      </main>

      {/* Modal: Confirm Progress Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">Reset Course Progress to Zero?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              This action will reset all skill masteries to Not started status across both Math and Reading & Writing modules. This cannot be undone.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                disabled={isProcessingAction}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-sm"
              >
                {isProcessingAction ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Permanent Account Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">Permanently Delete Account?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              This action immediately purges your user ID, test attempts, streaks, and settings from the database. Type <strong>DELETE</strong> below to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-mono text-stone-900 outline-none focus:border-rose-500"
            />
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationInput.trim() !== 'DELETE' || isProcessingAction}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white shadow-sm"
              >
                {isProcessingAction ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
