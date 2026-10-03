'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogIn, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Trophy, 
  Mail, 
  User,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (e) {
      console.error('Google sign in error', e);
      setErrorMessage('Could not initialize Google authentication. Please use scholar sign-in below.');
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
      const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'muhammadahsanjaved09@gmail.com').toLowerCase();
      const isAdmin = targetEmail.toLowerCase() === adminEmail || targetEmail.toLowerCase() === 'admin@gmail.com';
      const result = await signIn('credentials', {
        email: targetEmail,
        name: fullName.trim() || (isAdmin ? 'Admin Organizer' : 'SAT Scholar'),
        redirect: true,
        callbackUrl: '/',
      });

      if (result?.error) {
        setErrorMessage('Authentication error: ' + result.error);
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Sign in error', e);
      setErrorMessage('Unexpected sign-in failure. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#d7e5d2] text-[#122810] flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      {/* Ambient Matcha Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 hover:bg-white border border-[#a6c4a1] text-xs sm:text-sm font-black text-[#122810] hover:shadow-xs transition active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800" />
          <span>← Back to Dashboard</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#264e22] text-[#f2f8f0] border border-[#3b6e35] font-['JetBrains_Mono'] shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>Encrypted Session Sync</span>
        </div>
      </header>

      {/* Main Full-Window Authentication Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 ios-glass-card rounded-3xl border-2 border-[#a6c4a1] bg-[#e5f0e1]/90 backdrop-blur-xl shadow-grave overflow-hidden">
          
          {/* Left Column: Brand, Mission & Milestones */}
          <div className="lg:col-span-5 bg-[#d8e8d3]/85 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#a6c4a1]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300 shadow-xs font-['JetBrains_Mono']">
                <Trophy className="w-3.5 h-3.5 text-amber-800" />
                <span>Crescent Model Exam • Nov 7</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#122810] font-['Space_Grotesk'] leading-tight">
                SAT Tracker Account Sign In
              </h1>

              <p className="text-xs sm:text-sm text-[#274624] leading-relaxed font-medium">
                Log in to seamlessly synchronize your 57-day study milestones, Desmos speed drill logs, mistake autopsies, and pacing telemetry.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-[#1a3717] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Automatic Cloud Sync:</strong> All checked tasks and notes persist across devices.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#1a3717] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Error Log Autopsy:</strong> Diagnose mistake patterns before full-length tests.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#1a3717] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Anti-Burnout Rulebook:</strong> Strict 90-minute daily timer pacing.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#a6c4a1]/60 text-[11px] text-[#3b6e35] font-mono font-bold">
              The Anti-Burnout Rulebook &bull; 800-Level Execution
            </div>
          </div>

          {/* Right Column: Sign In Forms */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-center bg-[#e5f0e1]/70">
            
            {/* Google OAuth One-Click Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#122810] font-black text-sm flex items-center justify-center gap-3 transition-all duration-150 shadow-xs hover:shadow-md border-2 border-[#a6c4a1] hover:border-[#264e22] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#a6c4a1]/70" />
                <span className="text-[11px] font-black uppercase text-[#2e5d29] font-['JetBrains_Mono']">or scholar email</span>
                <div className="flex-1 h-px bg-[#a6c4a1]/70" />
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Credentials / Scholar Email Form */}
            <form onSubmit={(e) => handleCredentialsSignIn(e)} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-[#1a3717] font-['JetBrains_Mono'] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border-2 border-[#a6c4a1] text-[#122810] placeholder:text-slate-400 focus:outline-none focus:border-[#264e22] text-sm font-semibold transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-[#1a3717] font-['JetBrains_Mono'] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Full Name (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name or Nickname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border-2 border-[#a6c4a1] text-[#122810] placeholder:text-slate-400 focus:outline-none focus:border-[#264e22] text-sm font-semibold transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#264e22] hover:bg-[#1a3717] text-[#f2f8f0] font-black text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 text-emerald-300" />
                <span>{isLoading ? 'Authenticating...' : 'Sign In as Scholar'}</span>
              </button>
            </form>

            {/* Quick Demo Presets */}
            <div className="pt-2 border-t border-[#a6c4a1]/60 space-y-2">
              <span className="text-[11px] font-black uppercase text-[#2e5d29] font-['JetBrains_Mono'] block">
                Quick 1-Click Access Presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCredentialsSignIn(undefined, 'student@sat.edu')}
                  className="p-2.5 rounded-xl bg-[#d2e4cd] hover:bg-[#c3d9bd] border border-[#a6c4a1] text-xs font-black text-[#122810] transition text-left flex items-center justify-between cursor-pointer active:scale-95 shadow-xs"
                >
                  <span className="truncate">🎓 Demo Scholar</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCredentialsSignIn(undefined, 'muhammadahsanjaved09@gmail.com')}
                  className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-xs font-black text-amber-950 transition text-left flex items-center justify-between cursor-pointer active:scale-95 shadow-xs"
                >
                  <span className="truncate">👑 Admin Organizer</span>
                  <Crown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-4 text-xs text-[#3b6e35] font-mono font-semibold">
        Digital SAT Preparation Tracker &bull; 90-Minute Daily Anti-Burnout Protocol
      </footer>
    </div>
  );
}
