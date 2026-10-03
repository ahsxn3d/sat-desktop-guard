'use client';

import React from 'react';
import { FocusLockSection } from '../../components/FocusLockSection';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function FocusLockPage() {
  return (
    <div className="min-h-screen bg-[#f4faf2] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#a6c4a1] text-xs font-bold text-[#122810] hover:bg-[#e4ede1] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            href="/focus-lock/active"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase font-['JetBrains_Mono'] shadow-md transition active:scale-98"
          >
            <Lock className="w-4 h-4" />
            <span>Start Active Lockout Session</span>
          </Link>
        </div>

        <FocusLockSection />
      </div>
    </div>
  );
}
