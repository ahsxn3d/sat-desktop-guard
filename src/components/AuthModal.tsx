'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { X, LogIn, Sparkles, Crown, Zap, Mail, User, ShieldCheck } from 'lucide-react';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmailConfigured?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  adminEmailConfigured = 'muhammadahsanjaved09@gmail.com',
}) => {
  useModalScrollLock(isOpen);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (e) {
      console.error('Google sign in error', e);
      setErrorMessage('Google authentication unavailable. Please use scholar sign-in below.');
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e?: React.FormEvent, presetEmail?: string) => {
    if (e) e.preventDefault();
    const targetEmail = presetEmail || email.trim();
    if (!targetEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const isAdmin = targetEmail.toLowerCase() === adminEmailConfigured.toLowerCase();
      const result = await signIn('credentials', {
        email: targetEmail,
        name: fullName.trim() || (isAdmin ? 'Admin Organizer' : 'SAT Scholar'),
        redirect: false,
      });

      setIsLoading(false);
      if (!result?.error) {
        onClose();
        window.location.reload();
      } else {
        setErrorMessage('Sign-in failed: ' + result.error);
      }
    } catch (e) {
      console.error('Sign in error', e);
      setErrorMessage('Sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#122810]/45 backdrop-blur-md overflow-y-auto overscroll-contain"
        onClick={onClose}
        data-lenis-prevent="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="ios-glass-card rounded-3xl border-2 border-[#a6c4a1] bg-[#e5f0e1]/95 text-[#122810] shadow-grave max-w-md w-full overflow-hidden relative select-none overscroll-contain"
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
        >
          {/* Header Banner - Matching Matcha Forest Palette */}
          <div className="bg-gradient-to-r from-[#264e22] to-[#1a3717] text-[#f2f8f0] p-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close sign in dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#3b6e35] text-amber-300 border border-[#528a4a] mb-2 font-['JetBrains_Mono'] shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Personal Study Sync</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Space_Grotesk'] leading-tight">
              Sign In to SAT Tracker
            </h3>
            <p className="mt-1 text-xs text-[#d2e4cd] leading-relaxed">
              Persist your 57-day milestones, pacing telemetry, and mistake autopsies across all devices.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-[#a6c4a1] hover:border-[#264e22] text-[#122810] font-black text-xs sm:text-sm shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-[#a6c4a1]/60 w-full" />
              <span className="bg-[#e5f0e1] px-3 text-[10px] font-black uppercase text-[#2e5d29] font-['JetBrains_Mono'] absolute">
                or scholar email
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Email & Name Form */}
            <form onSubmit={(e) => handleCredentialsSignIn(e)} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#1a3717] font-['JetBrains_Mono'] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border-2 border-[#a6c4a1] focus:border-[#264e22] focus:outline-none text-xs font-bold text-[#122810] placeholder:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#1a3717] font-['JetBrains_Mono'] mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Your Name or Nickname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border-2 border-[#a6c4a1] focus:border-[#264e22] focus:outline-none text-xs font-bold text-[#122810] placeholder:text-slate-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#264e22] hover:bg-[#1a3717] disabled:opacity-50 text-[#f2f8f0] font-black text-xs shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Signing In...' : 'Sign In as Scholar'}</span>
              </button>
            </form>

            {/* Quick 1-Click Access Presets */}
            <div className="pt-2 border-t border-[#a6c4a1]/50 space-y-2">
              <span className="text-[10px] font-black uppercase text-[#2e5d29] font-['JetBrains_Mono'] block">
                Quick 1-Click Access:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCredentialsSignIn(undefined, 'student@sat.edu')}
                  className="p-2 rounded-xl bg-[#d2e4cd] hover:bg-[#c3d9bd] border border-[#a6c4a1] text-xs font-black text-[#122810] flex items-center justify-between cursor-pointer active:scale-95 transition"
                >
                  <span className="truncate">🎓 Demo Scholar</span>
                  <Zap className="w-3 h-3 text-emerald-700 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCredentialsSignIn(undefined, adminEmailConfigured)}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-xs font-black text-amber-950 flex items-center justify-between cursor-pointer active:scale-95 transition"
                >
                  <span className="truncate">👑 Admin Organizer</span>
                  <Crown className="w-3 h-3 text-amber-700 shrink-0" />
                </button>
              </div>
            </div>

            {/* Link to Full Login Page if preferred */}
            <div className="pt-2 text-center">
              <Link
                href="/login"
                onClick={onClose}
                className="text-[11px] font-bold text-[#2e5d29] hover:text-[#122810] hover:underline"
              >
                Prefer full-window sign-in page? Click here →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
