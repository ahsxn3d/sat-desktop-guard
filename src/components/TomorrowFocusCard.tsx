import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Coffee, 
  BookOpen, 
  ShieldCheck,
  Zap,
  RotateCcw,
  Calendar,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { DayPlan, TaskItem } from '../types';
import { getTaskKhanTier, getKhanTierBadge } from '../utils/difficulty';

interface TomorrowFocusCardProps {
  tomorrowDay: DayPlan;
  completedTaskIds?: Record<string, boolean>;
  onToggleTask: (dayId: string, taskId: string) => void;
  onOpenDesmos: () => void;
  onOpenErrorLog: () => void;
  onSaveNotes: (dayId: string, notes: string) => void;
  notes: string;
  onOpenDedicatedDay?: (dateStr: string) => void;
  currentTrackerDate?: string;
  tomorrowDateStr?: string;
  onSelectTomorrowDate?: (dateStr: string) => void;
  allDays?: DayPlan[];
  onToggleBufferDay?: (dateStr: string) => void;
}

export const TomorrowFocusCard: React.FC<TomorrowFocusCardProps> = ({
  tomorrowDay,
  completedTaskIds = {},
  onToggleTask,
  onOpenDesmos,
  onOpenErrorLog,
  onSaveNotes,
  notes,
  onOpenDedicatedDay,
  currentTrackerDate = '2026-09-12',
  tomorrowDateStr = '2026-09-13',
  onSelectTomorrowDate,
  allDays = [],
  onToggleBufferDay,
}) => {
  const isTaskDone = (id: string) => !!completedTaskIds[id];
  const completedTasks = tomorrowDay.tasks.filter((t) => isTaskDone(t.id)).length;
  const totalTasks = tomorrowDay.tasks.length;
  const isAllDone = totalTasks > 0 && completedTasks === totalTasks;
  const percentDone = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const carriedTasks = tomorrowDay.tasks.filter((t) => t.isCarriedOver);
  const nativeTasks = tomorrowDay.tasks.filter((t) => !t.isCarriedOver);

  const yesterdayDateStr = React.useMemo(() => {
    try {
      const [y, m, d] = currentTrackerDate.split('-').map(Number);
      const prev = new Date(y, m - 1, d - 1);
      const py = prev.getFullYear();
      const pm = String(prev.getMonth() + 1).padStart(2, '0');
      const pd = String(prev.getDate()).padStart(2, '0');
      return `${py}-${pm}-${pd}`;
    } catch {
      return '';
    }
  }, [currentTrackerDate]);

  const isExactTomorrow = tomorrowDay.dateStr === tomorrowDateStr;
  const isToday = tomorrowDay.dateStr === currentTrackerDate;
  const isYesterday = tomorrowDay.dateStr === yesterdayDateStr;

  // Find next buffer day after this day
  const nextBufferDay = allDays.find((d) => d.dateStr > tomorrowDay.dateStr && d.isBuffer);

  return (
    <motion.section 
      id="section-tomorrow" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl !border-indigo-600 shadow-grave hover:shadow-grave-hover overflow-hidden transition-all duration-300"
    >
      {/* High-visibility Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-7 border-b-2 border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md font-['JetBrains_Mono'] hover:scale-105 transition-transform duration-200 cursor-default">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 animate-spin-slow" />
                <span>
                  {isExactTomorrow 
                    ? `Tomorrow • ${tomorrowDay.formattedDate}` 
                    : isToday 
                    ? `Today • ${tomorrowDay.formattedDate}`
                    : isYesterday
                    ? `Yesterday • ${tomorrowDay.formattedDate}`
                    : `Focus Day • ${tomorrowDay.formattedDate}`}
                </span>
              </span>
              <span className="text-xs font-black text-indigo-200 uppercase tracking-wider font-['JetBrains_Mono']">
                {tomorrowDay.isBuffer ? 'Buffer & Rest Window' : `Week ${tomorrowDay.weekNumber || 1} • ${tomorrowDay.tasks.length} Scheduled Tasks`}
              </span>
              {carriedTasks.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-500 text-slate-950 font-['JetBrains_Mono']">
                  <RotateCcw className="w-3 h-3" />
                  <span>{carriedTasks.length} Carried Over</span>
                </span>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-luxury">
              {tomorrowDay.isBuffer
                ? `${isYesterday ? "Yesterday's" : isToday ? "Today's" : "Tomorrow's"} Mission: Guaranteed Buffer Rest Day`
                : `${isYesterday ? "Yesterday's" : isToday ? "Today's" : "Tomorrow's"} Mission: ${tomorrowDay.formattedDate} Focus`}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-200 font-semibold max-w-2xl leading-relaxed">
              {tomorrowDay.specialInstructions || 
                'Strict 90-minute daily cap with screen-free breaks. Work with high intensity, then shut down completely.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onToggleBufferDay && tomorrowDay.dateStr !== '2026-11-07' && !tomorrowDay.isTestDay && (
              <button
                onClick={() => onToggleBufferDay(tomorrowDay.dateStr)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-150 min-h-[44px] cursor-pointer shadow-xs active:scale-95 ${
                  tomorrowDay.isBuffer
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                }`}
                title={tomorrowDay.isBuffer ? 'Restore as a regular study day' : 'Too exhausted? Convert into a Buffer Day'}
              >
                {tomorrowDay.isBuffer ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                    <span>Restore Study Day</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-slate-950" />
                    <span>Mark as Buffer Day</span>
                  </>
                )}
              </button>
            )}

            {onOpenDedicatedDay && (
              <button
                onClick={() => onOpenDedicatedDay(tomorrowDay.dateStr)}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:shadow-sm active:scale-[0.98] transition-all duration-150 min-h-[44px] cursor-pointer"
              >
                <span>Inspect Day Details &rarr;</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-7 space-y-6">
        
        {/* Date Switcher Quick Chips */}
        {onSelectTomorrowDate && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 border-b border-[#a6c4a1]/50 pb-3">
            <span className="text-[11px] font-black uppercase text-slate-700 font-['JetBrains_Mono'] shrink-0 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview Date:</span>
            </span>
            
            {/* 1. Yesterday (Previous Day) */}
            {yesterdayDateStr && (
              <button
                onClick={() => onSelectTomorrowDate(yesterdayDateStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  tomorrowDay.dateStr === yesterdayDateStr
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500'
                    : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
                }`}
              >
                Yesterday ({new Date(yesterdayDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
              </button>
            )}

            {/* 2. Today */}
            <button
              onClick={() => onSelectTomorrowDate(currentTrackerDate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                tomorrowDay.dateStr === currentTrackerDate
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              Today ({new Date(currentTrackerDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
            </button>

            {/* 3. Exact Tomorrow */}
            <button
              onClick={() => onSelectTomorrowDate(tomorrowDateStr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                tomorrowDay.dateStr === tomorrowDateStr
                  ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-500'
                  : 'bg-white/80 text-slate-800 hover:bg-white border border-[#a6c4a1]'
              }`}
            >
              ⭐ Exact Tomorrow ({new Date(tomorrowDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
            </button>
          </div>
        )}

        {/* Dynamic Task Agenda Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-['JetBrains_Mono'] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>
              {tomorrowDay.isBuffer
                ? `Buffer Day Recovery Plan (${tomorrowDay.formattedDate})`
                : `${isYesterday ? "Yesterday's" : isToday ? "Today's" : "Tomorrow's"} 90-Minute Daily Structure (${tomorrowDay.formattedDate})`}
            </span>
          </h3>
          <span className="text-xs font-black font-['JetBrains_Mono'] text-indigo-900 bg-indigo-100 border border-indigo-300 px-3 py-1 rounded-xl self-start sm:self-auto shadow-xs">
            Progress: {completedTasks}/{totalTasks} ({percentDone}%)
          </span>
        </div>

        {/* Dynamic Task Rendering */}
        {tomorrowDay.isBuffer && carriedTasks.length === 0 ? (
          /* Buffer Rest Day with Zero Leftovers */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 shadow-grave-card flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-600 text-white font-['JetBrains_Mono']">
                  Guaranteed Buffer Rest
                </span>
                <span className="text-xs font-black text-emerald-900 font-['JetBrains_Mono']">
                  0 ASSIGNED LESSONS
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-950 font-luxury flex items-center gap-2">
                <Coffee className="w-5 h-5 text-emerald-700" />
                <span>Zero Work Required Tomorrow ({tomorrowDay.formattedDate})</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl leading-relaxed">
                Rest is a productive weapon. Sleep in, take screen breaks, eat nutritious meals, and let your brain consolidate learned math and reading rules into long-term memory.
              </p>
            </div>

            {tomorrowDay.tasks[0] && (
              <button
                onClick={() => onToggleTask(tomorrowDay.id, tomorrowDay.tasks[0].id)}
                className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 hover:shadow-md active:scale-95 transition-all duration-150 shrink-0 cursor-pointer ${
                  isTaskDone(tomorrowDay.tasks[0].id)
                    ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                    : 'bg-emerald-200 text-emerald-950 hover:bg-emerald-300 border border-emerald-400'
                }`}
              >
                {isTaskDone(tomorrowDay.tasks[0].id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rest Day Taken &bull; Complete</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-emerald-700" />
                    <span>Mark Rest Day Taken</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        ) : (
          /* Active Study Day OR Buffer Day with Rollover Leftovers */
          <div className="space-y-4">
            {tomorrowDay.isBuffer && (
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-slate-900 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">
                  <strong>Buffer Recovery Window:</strong> Tomorrow is officially a rest day with zero new lessons, but you have <strong>{carriedTasks.length} carried-over task{carriedTasks.length > 1 ? 's' : ''}</strong> from earlier. Tackle them at a relaxed pace without any stress!
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {tomorrowDay.tasks.map((task: TaskItem, index: number) => {
                const isDone = isTaskDone(task.id);
                const isCarried = task.isCarriedOver;

                // Color themes based on subject & rollover status
                const cardTheme = isCarried
                  ? 'bg-amber-50/90 border-amber-300 hover:border-amber-500'
                  : task.subject === 'math'
                  ? 'bg-blue-50/70 border-blue-200 hover:border-blue-400'
                  : task.subject === 'rw'
                  ? 'bg-purple-50/70 border-purple-200 hover:border-purple-400'
                  : task.subject === 'test'
                  ? 'bg-rose-50/80 border-rose-300 hover:border-rose-400'
                  : 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-400';

                const badgeBg = isCarried
                  ? 'bg-amber-600 text-white'
                  : task.subject === 'math'
                  ? 'bg-blue-600 text-white'
                  : task.subject === 'rw'
                  ? 'bg-purple-600 text-white'
                  : task.subject === 'test'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white';

                const estimatedTime = task.durationMinutes
                  ? `${task.durationMinutes} Mins`
                  : task.subject === 'math'
                  ? '25 Mins'
                  : task.subject === 'rw'
                  ? '20 Mins'
                  : task.subject === 'test'
                  ? '144 Mins'
                  : 'Recovery';

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`task-check-card calendar-date-neon-hover p-4 rounded-2xl border-2 shadow-grave-card flex flex-col justify-between cursor-default ${cardTheme}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] shadow-xs ${badgeBg}`}>
                            Step {index + 1} &bull; {estimatedTime}
                          </span>
                          {task.subject !== 'buffer' && (
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border font-['JetBrains_Mono'] ${getKhanTierBadge(getTaskKhanTier(task)).badgeClass}`}>
                              {getKhanTierBadge(getTaskKhanTier(task)).label}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-black uppercase font-['JetBrains_Mono'] text-slate-800">
                          {task.subject}
                        </span>
                      </div>

                      {/* Prominent Rollover Badge */}
                      {isCarried && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase font-['JetBrains_Mono']">
                          <RotateCcw className="w-3 h-3" />
                          <span>↩ Rollover from {task.originalFormattedDate || 'Previous Day'}</span>
                        </div>
                      )}

                      <h4 className="mt-2.5 text-base font-bold text-slate-950 font-luxury line-clamp-2">
                        {task.code ? `${task.code}: ${task.topic || task.label}` : task.label}
                      </h4>

                      {task.timeSlot && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-black/5 px-2 py-0.5 rounded-lg font-['JetBrains_Mono']">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span>{task.timeSlot}</span>
                        </div>
                      )}

                      <p className="mt-1 text-xs text-slate-700 font-semibold leading-relaxed line-clamp-3">
                        {task.topic ? `Topic focus: ${task.topic}. Complete practice drill and log any questions missed.` : task.label}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => onToggleTask(tomorrowDay.id, task.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 transition-all duration-150 min-h-[44px] cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-matcha-input text-slate-900 border-2 border-slate-300 hover:bg-white hover:border-indigo-500'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <span className="task-check-dot"><CheckCircle2 className="w-4 h-4" /></span>
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <span className="task-check-dot"><Circle className="w-4 h-4 text-slate-500" /></span>
                            <span>Mark as Done</span>
                          </>
                        )}
                      </button>

                      <div
                        className="py-2.5 px-3 rounded-xl border border-[#a6c4a1] bg-[#d2e4cd]/60 text-[#1a3717] font-black text-xs flex items-center justify-center gap-1.5 min-h-[44px] shadow-xs select-none"
                        title={`Allocated timing window: ${task.durationMinutes || 20} minutes`}
                      >
                        <Clock className="w-3.5 h-3.5 text-[#1a3717]" />
                        <span>{task.durationMinutes || 20}m</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Screen-Free Break Card (Rule #1) inserted for active study days */}
              {!tomorrowDay.isBuffer && tomorrowDay.tasks.length >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 shadow-grave-card hover:shadow-grave-card-hover hover:border-emerald-500 smooth-card-hover flex flex-col justify-between cursor-default"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-['JetBrains_Mono'] shadow-xs">
                        Rule #1 &bull; 10 Mins
                      </span>
                      <span className="text-xs font-black text-emerald-800 font-['JetBrains_Mono']">BREAK</span>
                    </div>
                    <h4 className="mt-2.5 text-base font-bold text-slate-950 font-luxury flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-emerald-700" />
                      <span>Screen-Free Cognitive Break</span>
                    </h4>
                    <p className="mt-1 text-xs text-slate-700 font-semibold leading-relaxed">
                      Mandatory 10-min interval between sections. Hydrate, rest eyes, clear working memory before shifting subjects.
                    </p>
                  </div>

                  <div className="mt-4 py-2.5 px-3 rounded-xl text-xs font-black text-center bg-emerald-200 text-emerald-950 border border-emerald-300 font-['JetBrains_Mono'] shadow-xs">
                    Recovery Protocol Active
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Incentive & Tools Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          
          {/* Buffer Guarantee Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={`p-4 rounded-2xl border-2 shadow-grave-card hover:shadow-grave-card-hover transition-all duration-200 ${
              isAllDone 
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950' 
                : 'bg-matcha-sub border-[#a6c4a1]/70 text-slate-900 hover:border-emerald-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-5 h-5 ${isAllDone ? 'text-emerald-700' : 'text-slate-700'}`} />
              <h4 className="text-xs font-black uppercase tracking-wider font-['JetBrains_Mono']">
                Buffer Day Protection
              </h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed font-semibold">
              {tomorrowDay.isBuffer ? (
                <span>
                  🎉 <strong className="font-extrabold">{tomorrowDay.formattedDate} is your Buffer Day!</strong> Take the day completely off with zero guilt, or tackle carried-over tasks at your own pace.
                </span>
              ) : isAllDone ? (
                <span className="text-emerald-950">
                  🎉 <strong className="font-extrabold">All Tasks for {tomorrowDay.formattedDate} Complete!</strong> You are 100% on pace for your next buffer rest day{nextBufferDay ? ` on ${nextBufferDay.formattedDate}` : ''}!
                </span>
              ) : (
                <span className="text-slate-700">
                  Finish tomorrow&apos;s scheduled work to protect your next buffer day{nextBufferDay ? ` on ${nextBufferDay.formattedDate}` : ''} as a guilt-free rest day!
                </span>
              )}
            </p>
          </motion.div>

          {/* Quick Helper Tools */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-4 rounded-2xl bg-matcha-sub border-2 border-[#a6c4a1]/70 shadow-grave-card hover:shadow-grave-card-hover hover:border-indigo-400 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-['JetBrains_Mono']">
                Speed & Error Tools
              </h4>
              <p className="mt-1 text-xs text-slate-700 font-semibold">
                Shortcuts and mistake tracking for {tomorrowDay.formattedDate}:
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <a
                href="/cheat-codes"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenDesmos) onOpenDesmos();
                  else if (typeof window !== 'undefined') window.location.href = '/cheat-codes';
                }}
                className="task-check-card calendar-date-neon-hover group flex-1 p-2.5 sm:px-3 sm:py-3 rounded-2xl border-2 bg-white/95 border-[#a6c4a1] flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer shadow-xs select-none active:scale-95"
                title="Go directly to Tactical Cheat Codes & Desmos area"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="block text-xs font-black text-slate-900 group-hover:text-emerald-950 truncate font-['Space_Grotesk']">
                      Desmos Speed
                    </span>
                    <span className="block text-[10px] font-bold text-slate-500 group-hover:text-emerald-800 truncate font-['JetBrains_Mono']">
                      Cheat Codes &rarr;
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              </a>

              <a
                href="/error-log"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenErrorLog) onOpenErrorLog();
                  else if (typeof window !== 'undefined') window.location.href = '/error-log';
                }}
                className="task-check-card calendar-date-neon-hover group flex-1 p-2.5 sm:px-3 sm:py-3 rounded-2xl border-2 bg-white/95 border-[#a6c4a1] flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer shadow-xs select-none active:scale-95"
                title="Go directly to Mistake Autopsy & Error Log area"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="block text-xs font-black text-slate-900 group-hover:text-indigo-950 truncate font-['Space_Grotesk']">
                      Error Log
                    </span>
                    <span className="block text-[10px] font-bold text-slate-500 group-hover:text-indigo-800 truncate font-['JetBrains_Mono']">
                      Autopsy &rarr;
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              </a>
            </div>
          </motion.div>

          {/* Tomorrow's Notes Scratchpad */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-4 rounded-2xl bg-matcha-sub border-2 border-[#a6c4a1]/70 shadow-grave-card hover:shadow-grave-card-hover hover:border-indigo-400 transition-all duration-200"
          >
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-['JetBrains_Mono']">
              {tomorrowDay.formattedDate} Notes Scratchpad
            </h4>
            <textarea
              value={notes}
              onChange={(e) => onSaveNotes(tomorrowDay.id, e.target.value)}
              placeholder={`Record formulas, questions stumbled upon, or Khan Academy notes for ${tomorrowDay.formattedDate}...`}
              className="mt-2 w-full h-18 text-xs p-2.5 rounded-xl bg-matcha-input border border-[#a6c4a1]/70 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none font-medium text-slate-900 placeholder:text-slate-500 hover:border-[#a6c4a1] transition"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
