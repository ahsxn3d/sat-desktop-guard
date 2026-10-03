import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Coffee, 
  AlertCircle, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Sparkles,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { DayPlan } from '../types';
import { getDayLoadDifficulty, cleanSkillLabel, getTaskKhanTier, getKhanTierBadge } from '../utils/difficulty';

interface DayCardProps {
  day: DayPlan;
  isToday: boolean;
  isTomorrow?: boolean;
  onToggleTask: (dayId: string, taskId: string) => void;
  onSaveNotes: (dayId: string, notes: string) => void;
  allPrecedingDaysCompleted?: boolean;
  onOpenStruggleModal?: (day: DayPlan) => void;
  strugglesCount?: number;
  onToggleBufferDay?: (dateStr: string) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  isToday,
  isTomorrow = false,
  onToggleTask,
  onSaveNotes,
  allPrecedingDaysCompleted = true,
  onOpenStruggleModal,
  strugglesCount = 0,
  onToggleBufferDay,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState(day.userNotes || '');

  const completedCount = day.tasks.filter((t) => t.completed).length;
  const isAllCompleted = day.tasks.length > 0 && completedCount === day.tasks.length;
  const isExamDay = day.dateStr === '2026-11-07';

  const handleNotesBlur = () => {
    onSaveNotes(day.id, notesText);
  };

  const mathCount = day.tasks.filter((t) => t.subject === 'math').length;
  const rwCount = day.tasks.filter((t) => t.subject === 'rw').length;
  const isWeekday = !['Sat', 'Sun'].includes(day.dayOfWeek);

  const diffConfig = getDayLoadDifficulty(day);

  return (
    <div
      id={`day-${day.id}`}
      className={`rounded-2xl border-2 overflow-hidden shadow-grave-card hover:shadow-grave-card-hover smooth-card-hover transition-all duration-300 ${
        isExamDay
          ? 'bg-gradient-to-br from-amber-50/90 via-rose-50/80 to-white/90 border-amber-500 ring-2 ring-amber-400'
          : day.isBuffer && diffConfig.type === 'rest'
          ? 'bg-slate-50/80 backdrop-blur-md border-slate-300 hover:border-slate-400'
          : isToday
          ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-300'
          : isAllCompleted
          ? 'bg-emerald-50/70 border-emerald-400'
          : diffConfig.type === 'foundations'
          ? 'bg-emerald-50/70 backdrop-blur-md border-emerald-300 hover:border-emerald-500'
          : diffConfig.type === 'medium'
          ? 'bg-amber-50/70 backdrop-blur-md border-amber-300 hover:border-amber-500'
          : diffConfig.type === 'challenge'
          ? 'bg-purple-50/70 backdrop-blur-md border-purple-300 hover:border-purple-500'
          : diffConfig.type === 'advanced'
          ? 'bg-rose-50/70 backdrop-blur-md border-rose-300 hover:border-rose-500'
          : diffConfig.type === 'test'
          ? 'bg-sky-50/80 backdrop-blur-md border-sky-300 hover:border-sky-500'
          : 'bg-[#e5f0e1]/65 backdrop-blur-md border-[#a6c4a1] hover:border-emerald-600'
      }`}
    >
      {/* Day Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          isExamDay
            ? 'border-amber-200 bg-amber-100/70'
            : day.isBuffer && diffConfig.type === 'rest'
            ? 'border-slate-200 bg-slate-100/60'
            : isToday
            ? 'border-indigo-200 bg-indigo-100/60'
            : diffConfig.type === 'foundations'
            ? 'border-emerald-200 bg-emerald-100/60'
            : diffConfig.type === 'medium'
            ? 'border-amber-200 bg-amber-100/60'
            : diffConfig.type === 'challenge'
            ? 'border-purple-200 bg-purple-100/60'
            : diffConfig.type === 'advanced'
            ? 'border-rose-200 bg-rose-100/60'
            : diffConfig.type === 'test'
            ? 'border-sky-200 bg-sky-100/60'
            : 'border-[#a6c4a1]/50 bg-[#d2e4cd]/50'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-bold text-sm sm:text-base font-luxury ${
              isExamDay
                ? 'text-rose-950'
                : isToday
                ? 'text-indigo-950'
                : 'text-slate-950'
            }`}
          >
            {day.formattedDate}
          </span>

          {isExamDay && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white font-['JetBrains_Mono'] flex items-center gap-1 shadow-xs">
              <Trophy className="w-3 h-3 text-amber-300" />
              SAT Paper Day
            </span>
          )}

          {isToday && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white tracking-wide font-['JetBrains_Mono']">
              Today
            </span>
          )}

          {isTomorrow && !isToday && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold tracking-wide font-['JetBrains_Mono'] shadow-xs">
              Tomorrow
            </span>
          )}

          {/* Color Difficulty Badge (Rest, Light, Standard, Sprint, Mock) */}
          {!isExamDay && !isToday && !isTomorrow && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 font-['JetBrains_Mono'] ${diffConfig.badgeClass}`}>
              {diffConfig.badgeText}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Buffer Shift Toggle */}
          {!isExamDay && !day.isTestDay && onToggleBufferDay && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBufferDay(day.dateStr);
              }}
              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 font-['JetBrains_Mono'] transition-all cursor-pointer shadow-2xs active:scale-95 ${
                day.isBuffer
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                  : 'bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
              }`}
              title={day.isBuffer ? 'Restore this day as a regular study day' : 'Convert this day into a Buffer Day (shifts syllabus forward)'}
            >
              {day.isBuffer ? (
                <>
                  <RotateCcw className="w-2.5 h-2.5 text-amber-800" />
                  <span>Restore</span>
                </>
              ) : (
                <>
                  <Coffee className="w-2.5 h-2.5 text-emerald-800" />
                  <span>Buffer</span>
                </>
              )}
            </button>
          )}

          {/* Completion Badge */}
          <span
            className={`text-xs font-['JetBrains_Mono'] font-black px-2 py-0.5 rounded-md border ${
              isAllCompleted
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-matcha-input text-slate-800 border-slate-300'
            }`}
          >
            {completedCount}/{day.tasks.length}
          </span>
        </div>
      </div>

      {/* Special exam day reminder */}
      {isExamDay && (
        <div className="p-3 text-xs text-rose-950 bg-amber-100/60 border-b border-amber-300 flex items-start gap-2 font-bold">
          <Trophy className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>🎯 SAT Official Paper Day at Crescent Model School. Gates close 7:45 AM.</span>
        </div>
      )}

      {/* Buffer Special Instructions */}
      {day.isBuffer && !isExamDay && (
        <div className="p-3 text-xs text-emerald-950 bg-emerald-100/60 border-b border-emerald-200 flex items-start gap-2 font-semibold">
          <Coffee className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block">
              {day.dayOfWeek === 'Sun'
                ? (allPrecedingDaysCompleted ? 'Targets Hit! Sunday is 100% Free 🌿' : 'Weekly Buffer Catch-up Window 🔄')
                : 'Anti-Burnout Buffer Day (Recovery & Reset) 🌿'}
            </span>
            <span className="text-emerald-900 font-medium">
              {day.specialInstructions ||
                'Rest, recharge, or catch up on life without guilt. Anti-Burnout Rule #1: Recovery prevents cognitive fatigue.'}
            </span>
          </div>
        </div>
      )}

      {/* Special instructions for test days / packing days */}
      {!day.isBuffer && !isExamDay && day.specialInstructions && (
        <div className="p-3 text-xs text-indigo-950 bg-indigo-50 border-b border-indigo-200 flex items-start gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{day.specialInstructions}</span>
        </div>
      )}

      {/* Tasks List */}
      <div className="p-3.5 space-y-2">
        {day.tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(day.id, task.id)}
            className={`group task-check-card calendar-date-neon-hover flex items-start gap-3 p-2.5 rounded-xl border-2 cursor-pointer select-none min-h-[44px] ${
              task.completed
                ? 'bg-emerald-50/60 border-emerald-300 text-slate-600'
                : 'bg-matcha-input border-[#a6c4a1]/60 text-slate-900 shadow-xs'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {task.completed ? (
                <span className="task-check-dot">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </span>
              ) : (
                <span className="task-check-dot">
                  <Circle className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Subject Chip */}
                {task.subject === 'math' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-['JetBrains_Mono']">
                    Math
                  </span>
                )}
                {task.subject === 'rw' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-['JetBrains_Mono']">
                    RW
                  </span>
                )}
                {task.subject === 'test' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200 font-['JetBrains_Mono']">
                    Test
                  </span>
                )}
                {task.subject === 'drill' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-200 font-['JetBrains_Mono']">
                    Drill
                  </span>
                )}
                {task.subject === 'review' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200 font-['JetBrains_Mono']">
                    Autopsy
                  </span>
                )}
                {task.subject === 'logistics' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-matcha-sub-dark text-slate-900 border border-[#a6c4a1]/60 font-['JetBrains_Mono']">
                    Prep
                  </span>
                )}

                {/* Khan Academy Difficulty Tier Chip */}
                {task.subject !== 'buffer' && (
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border font-['JetBrains_Mono'] ${getKhanTierBadge(getTaskKhanTier(task)).badgeClass}`}>
                    {getKhanTierBadge(getTaskKhanTier(task)).label}
                  </span>
                )}

                {task.isCarriedOver && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-['JetBrains_Mono'] flex items-center gap-1 shadow-xs">
                    <RotateCcw className="w-2.5 h-2.5 text-amber-700" />
                    <span>Rollover from {task.originalFormattedDate}</span>
                  </span>
                )}

                {/* Timing Badge in front of skill */}
                {task.timeSlot ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0d3b66]/10 text-[#0d3b66] border border-[#0d3b66]/20 font-['JetBrains_Mono'] text-[11px] font-black shrink-0">
                    <Clock className="w-3 h-3 text-[#0d3b66] shrink-0" />
                    <span>{task.timeSlot}</span>
                    {task.durationMinutes && (
                      <span className="text-[10px] font-bold text-[#0d3b66]/80">({task.durationMinutes}m)</span>
                    )}
                  </span>
                ) : task.durationMinutes ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-['JetBrains_Mono'] text-[11px] font-black shrink-0">
                    <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{task.durationMinutes}m</span>
                  </span>
                ) : null}

                <span
                  className={`text-xs font-bold ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-950'
                  }`}
                >
                  {cleanSkillLabel(task.label)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer toolbar: Pacing check + Day reflection notes / Log Struggle */}
      <div className="px-4 py-2.5 bg-matcha-sub border-t border-[#a6c4a1]/50 flex items-center justify-between text-xs text-slate-700 font-semibold gap-2">
        <div className="flex items-center gap-1.5 font-['JetBrains_Mono']">
          {isWeekday && (mathCount > 0 || rwCount > 0) && (
            <span className="text-[11px] text-slate-700 font-bold">
              Pacing: {mathCount}M &bull; {rwCount}RW
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenStruggleModal && !day.isBuffer && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStruggleModal(day);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                strugglesCount > 0
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                  : 'bg-matcha-input text-slate-800 border border-[#a6c4a1] hover:bg-rose-50 hover:text-rose-900 hover:border-rose-300'
              }`}
              title="Log stuck concept, trap, or formula struggle"
            >
              <AlertCircle className={`w-3.5 h-3.5 ${strugglesCount > 0 ? 'text-rose-600 fill-rose-100' : 'text-slate-500'}`} />
              <span>{strugglesCount > 0 ? `Struggles (${strugglesCount})` : 'Log Struggle'}</span>
            </button>
          )}

          <button
            onClick={() => setShowNotes(!showNotes)}
            className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-950 transition font-bold cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>{notesText ? 'Notes (1)' : 'Note'}</span>
            {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Note Expandable Area */}
      {showNotes && (
        <div className="p-3 bg-matcha-sub border-t border-[#a6c4a1]/60 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono']">
            <span className="font-bold text-[#122810]">Personal Reflection</span>
            <span className="text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-1.5 py-0.5 rounded font-black">
              ⚡ Dual-syncs to Error Log
            </span>
          </div>
          <textarea
            rows={2}
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Reflections, missed questions, or key takeaways (auto-saves to Error Log)..."
            className="w-full text-xs bg-matcha-input border border-[#a6c4a1] rounded-xl p-2.5 font-medium text-[#122810] placeholder:text-[#3d5a39] focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
          />
        </div>
      )}
    </div>
  );
};
