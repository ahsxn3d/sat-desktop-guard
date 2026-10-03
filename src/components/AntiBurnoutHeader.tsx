'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Shield,
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Coffee, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Trophy, 
  Target, 
  Flame,
  Calendar as CalendarIcon,
  LogIn,
  LogOut,
  Crown,
  User as UserIcon,
  Zap,
  Layers,
  MapPin,
  Calculator,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp
} from 'lucide-react';

interface NavPageItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  activeClass: string;
  inactiveClass: string;
  iconColor: string;
  activeIconColor: string;
}

const NAV_PAGES: NavPageItem[] = [
  { 
    id: 'focus-lock', 
    label: 'Focus Lock', 
    href: '/focus-lock', 
    icon: Shield,
    activeClass: 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400 border-rose-500 font-black',
    inactiveClass: 'text-rose-950 bg-rose-100/90 border-rose-300 hover:bg-rose-200 font-bold',
    iconColor: 'text-rose-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'progress', 
    label: 'Progress', 
    href: '/progress', 
    icon: TrendingUp,
    activeClass: 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-500 border-amber-500 font-black',
    inactiveClass: 'text-amber-950 bg-amber-100/90 border-amber-300 hover:bg-amber-200 font-bold',
    iconColor: 'text-amber-600 fill-amber-500',
    activeIconColor: 'text-slate-950'
  },
  { 
    id: 'all', 
    label: 'Home', 
    href: '/', 
    icon: Layers,
    activeClass: 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400 border-emerald-600',
    inactiveClass: 'text-emerald-950 bg-emerald-100/80 border-emerald-300 hover:bg-emerald-200/90',
    iconColor: 'text-emerald-700',
    activeIconColor: 'text-white'
  },
  { 
    id: 'calendar', 
    label: 'Calendar', 
    href: '/calendar', 
    icon: CalendarIcon,
    activeClass: 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400 border-blue-500',
    inactiveClass: 'text-blue-950 bg-blue-100/80 border-blue-300 hover:bg-blue-200/90',
    iconColor: 'text-blue-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'ai-copilot', 
    label: 'AI Co-Pilot', 
    href: '/ai-copilot', 
    icon: Bot,
    activeClass: 'bg-[#1a3717] text-white shadow-sm ring-2 ring-[#8ec284] border-[#1a3717] font-black',
    inactiveClass: 'text-emerald-950 bg-emerald-100/90 border-emerald-300 hover:bg-emerald-200 font-black ring-1 ring-emerald-400/50',
    iconColor: 'text-emerald-700',
    activeIconColor: 'text-emerald-300'
  },
  { 
    id: 'tomorrow', 
    label: 'Tomorrow', 
    href: '/tomorrow', 
    icon: Sparkles,
    activeClass: 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-500 border-amber-500 font-bold',
    inactiveClass: 'text-amber-950 bg-amber-100/90 border-amber-300 hover:bg-amber-200',
    iconColor: 'text-amber-600 fill-amber-500',
    activeIconColor: 'text-slate-950 fill-slate-950'
  },
  { 
    id: 'schedule', 
    label: 'Phase 1', 
    href: '/phase-1', 
    icon: Target,
    activeClass: 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400 border-purple-500',
    inactiveClass: 'text-purple-950 bg-purple-100/80 border-purple-300 hover:bg-purple-200/90',
    iconColor: 'text-purple-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'phase-2', 
    label: 'Phase 2', 
    href: '/phase-2', 
    icon: Trophy,
    activeClass: 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 border-indigo-500',
    inactiveClass: 'text-indigo-950 bg-indigo-100/80 border-indigo-300 hover:bg-indigo-200/90',
    iconColor: 'text-indigo-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'cheat-codes', 
    label: 'Core Info', 
    href: '/core-info', 
    icon: BookOpen,
    activeClass: 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400 border-amber-500 font-bold',
    inactiveClass: 'text-amber-950 bg-amber-100/90 border-amber-300 hover:bg-amber-200',
    iconColor: 'text-amber-600 fill-amber-500',
    activeIconColor: 'text-slate-950 fill-slate-950'
  },
  { 
    id: 'error-log', 
    label: 'Error Log', 
    href: '/error-log', 
    icon: BookOpen,
    activeClass: 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400 border-rose-500',
    inactiveClass: 'text-rose-950 bg-rose-100/80 border-rose-300 hover:bg-rose-200/90',
    iconColor: 'text-rose-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'crescent', 
    label: 'Test Center', 
    href: '/test-center', 
    icon: MapPin,
    activeClass: 'bg-red-600 text-white shadow-sm ring-2 ring-red-400 border-red-500',
    inactiveClass: 'text-red-950 bg-red-100/80 border-red-300 hover:bg-red-200/90',
    iconColor: 'text-red-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'rules', 
    label: 'Core Rules', 
    href: '/rules', 
    icon: ShieldCheck,
    activeClass: 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400 border-teal-600',
    inactiveClass: 'text-teal-950 bg-teal-100/80 border-teal-300 hover:bg-teal-200/90',
    iconColor: 'text-teal-600',
    activeIconColor: 'text-white'
  },
  { 
    id: 'exam-prep', 
    label: 'Exam Prep', 
    href: '/exam-prep', 
    icon: CheckCircle2,
    activeClass: 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400 border-amber-500 font-black',
    inactiveClass: 'text-amber-950 bg-amber-100/80 border-amber-300 hover:bg-amber-200/90',
    iconColor: 'text-amber-700',
    activeIconColor: 'text-slate-950'
  },
];

interface AntiBurnoutHeaderProps {
  completedCount: number;
  totalTasks: number;
  examDateStr: string;
  onOpenTimer: () => void;
  onOpenCalendar: () => void;
  onOpenPacking: () => void;
  onOpenCheatCodes?: () => void;
  adminEmailConfigured?: string;
  activeSection?: string;
  onSelectSection?: (section: any) => void;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export const AntiBurnoutHeader: React.FC<AntiBurnoutHeaderProps> = ({
  completedCount,
  totalTasks,
  onOpenTimer,
  onOpenCalendar,
  onOpenPacking,
  onOpenCheatCodes,
  adminEmailConfigured = 'admin@gmail.com',
  activeSection = 'all',
  onSelectSection,
  onToggleSidebar,
  sidebarCollapsed = false,
}) => {
  const { data: session } = useSession();
  const [showRulesDetail, setShowRulesDetail] = useState(false);

  const userEmail = session?.user?.email?.toLowerCase();
  const isAdmin =
    (session?.user as any)?.role === 'ADMIN' ||
    (userEmail && userEmail === adminEmailConfigured.toLowerCase());

  // Target SAT Exam Date: Saturday, November 7, 2026
  const targetDate = new Date(2026, 10, 7); // Month index 10 = November
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-header shadow-grave relative z-20"
    >
      <div className="max-w-[1740px] w-full mx-auto px-3 sm:px-5 lg:px-7 py-3 sm:py-4 space-y-3.5">
        
        {/* ============================================================ */}
        {/* TOP FULL HEADING ON THE WEBSITE: SAT Tracker                 */}
        {/* ============================================================ */}
        <div className="text-center pt-2 pb-1 space-y-1.5">
          <div className="inline-flex items-center gap-3 sm:gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="relative w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl overflow-hidden shadow-grave border-2 border-emerald-600/50 bg-gradient-to-br from-[#1b3d18] to-[#0c1f0a] p-0.5"
            >
              <img
                src="/logo.png"
                alt="SAT Tracker Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
              <div className="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-amber-400/30 pointer-events-none" />
            </motion.div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#122810] font-['Space_Grotesk']">
              SAT Tracker
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm font-semibold text-[#274624]">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#264e22] text-[#f2f8f0] shadow-xs border border-[#3b6e35]">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>EXAM: SATURDAY NOV 7 ({diffDays}d left)</span>
            </span>
            <span className="hidden sm:inline text-slate-400">&bull;</span>
            <span className="font-extrabold text-[#1a3717] font-['JetBrains_Mono']">Sep 14 – Nov 7, 2026</span>
            <span className="hidden sm:inline text-slate-400">&bull;</span>
            <span className="font-bold text-rose-900 underline decoration-amber-500 decoration-2">Crescent Model School</span>
            <span className="hidden sm:inline text-slate-400">&bull;</span>
            <span className="font-['JetBrains_Mono'] font-black text-emerald-800">
              {completedCount}/{totalTasks} Skills ({percentage}%)
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COZY LITTLE SMALL ROUND EDGES HEADER (Page Names Short Words) */}
        {/* ============================================================ */}
        <div className="ios-glass-nav rounded-2xl p-1 sm:p-1.5 shadow-grave-card border border-[#a6c4a1]/75 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            
            {/* Page Navigation Tabs - Strictly in ONE clean single row with ample breathing room for outlines */}
            <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto scrollbar-none py-2 px-1 min-w-0">
              {onToggleSidebar && (
                <button
                  type="button"
                  id="header-sidebar-toggle-btn"
                  onClick={onToggleSidebar}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-[#1a3717] text-white hover:bg-[#285724] border border-[#a6c4a1] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs active:scale-95"
                  title={sidebarCollapsed ? "Expand Sidebar (All Names)" : "Collapse Sidebar (Icons Only)"}
                >
                  {sidebarCollapsed ? (
                    <PanelLeftOpen className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <PanelLeftClose className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                  <span className="text-[11px] font-mono hidden sm:inline">
                    {sidebarCollapsed ? "Sidebar" : "Collapse"}
                  </span>
                </button>
              )}

              {NAV_PAGES.map((page) => {
                const isActive = activeSection === page.id;
                const Icon = page.icon;
                return (
                  <Link
                    key={page.id}
                    href={page.href}
                    id={`cozy-nav-${page.id}-btn`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSection?.(page.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-1.5 cursor-pointer active:scale-95 select-none whitespace-nowrap shrink-0 border ${
                      isActive
                        ? `${page.activeClass} shadow-xs`
                        : `${page.inactiveClass} hover:shadow-xs`
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? page.activeIconColor : page.iconColor}`} />
                    <span>{page.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side: Account / Sign In & Rules Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap py-0.5 pl-1 border-l border-[#a6c4a1]/50">
              {/* Authentication & Admin Button Group */}
              {session?.user ? (
                <div className="inline-flex items-center gap-1.5 p-1 bg-[#d2e4cd] border border-[#a6c4a1] rounded-xl shadow-xs whitespace-nowrap shrink-0">
                  {/* User Avatar & Name */}
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-6 h-6 rounded-lg object-cover border border-[#a6c4a1]"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-matcha-sub border border-[#a6c4a1] flex items-center justify-center text-slate-700 text-xs font-bold">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="text-xs font-black text-[#122810] max-w-[90px] truncate hidden md:inline">
                      {session.user.name?.split(' ')[0] || 'Student'}
                    </span>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-200 text-amber-950 rounded text-[9px] font-black uppercase font-['JetBrains_Mono'] border border-amber-400">
                        <Crown className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    title="Sign Out"
                    className="p-1 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-100 transition duration-150 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  id="header-auth-btn"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black text-[#122810] bg-[#d2e4cd] hover:bg-[#c3d9bd] hover:shadow-xs active:scale-[0.98] transition-all duration-150 border border-[#a6c4a1] cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Toggle 3 Core Rules Drawer */}
              <button
                id="header-toggle-rules-btn"
                onClick={() => setShowRulesDetail(!showRulesDetail)}
                className="p-1.5 rounded-xl text-[#122810] bg-[#d2e4cd] hover:bg-[#c3d9bd] border border-[#a6c4a1] cursor-pointer active:scale-95 transition shrink-0"
                title={showRulesDetail ? 'Hide Quick Rules' : 'Show Quick Rules'}
              >
                {showRulesDetail ? (
                  <ChevronUp className="w-4 h-4 text-[#1a3717]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#1a3717]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Quick Rules Ribbon */}
        {showRulesDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#d2e4cd]/90 border border-[#a6c4a1] shadow-inner text-xs">
              <div className="p-2.5 rounded-xl bg-matcha-sub/90 border border-[#a6c4a1]/70 flex items-start gap-2">
                <span className="font-mono font-black text-emerald-800 text-sm">#1</span>
                <div>
                  <span className="font-black text-[#122810] block">Rule 1: ~2-Hr Door-to-Door Cap</span>
                  <span className="text-slate-700 text-[11px] font-medium leading-tight block mt-0.5">
                    85m study with 35m protected breaks. Hard cutoff stops burnout.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-matcha-sub/90 border border-[#a6c4a1]/70 flex items-start gap-2">
                <span className="font-mono font-black text-emerald-800 text-sm">#2</span>
                <div>
                  <span className="font-black text-[#122810] block">Rule 2: Buffer Sundays</span>
                  <span className="text-slate-700 text-[11px] font-medium leading-tight block mt-0.5">
                    Zero assigned lessons. 100% guilt-free rest or emergency buffer.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};
