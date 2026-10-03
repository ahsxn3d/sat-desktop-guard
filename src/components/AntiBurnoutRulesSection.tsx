import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, Coffee, AlertCircle, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const AntiBurnoutRulesSection: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section 
      id="section-rules"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="ios-glass-card rounded-3xl shadow-grave hover:shadow-grave-hover p-6 sm:p-7 space-y-5 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#bfd5bb] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 shadow-xs">
                Non-Negotiable
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-luxury">
                The Core Anti-Burnout Rules
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Strict rules to guarantee mental stamina, memory retention, and zero cognitive exhaustion.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-transparent hover:border-indigo-200 transition-all duration-150 flex items-center gap-1 self-start sm:self-center cursor-pointer"
        >
          <span>{expanded ? 'Hide Deep Science' : 'Why This Works (Science)'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Core Rule Cards with Deep Grave Shadows and Scroll Trigger Reveals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="p-5 rounded-2xl bg-indigo-50/75 backdrop-blur-md border-2 border-indigo-200/80 shadow-grave-card hover:shadow-grave-card-hover hover:border-indigo-400 smooth-card-hover flex flex-col justify-between cursor-default"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-800 text-xs font-black uppercase tracking-wider font-['JetBrains_Mono']">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Rule 1: ~2-Hr Door-to-Door Cap</span>
            </div>
            <h3 className="text-base font-bold text-slate-950 font-luxury">
              85m Study • 35m Protected Break
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              <strong>45m Math &bull; 15m Real Break &bull; 40m RW &bull; 10m Real Break &bull; 10m Tracker Log.</strong> Consistency of your start-time anchor trains the brain to switch into focus mode instantly. Close the laptop after 120 mins door-to-door.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-200/80 text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Strict zero overtime rule • Protected breaks</span>
          </div>
        </motion.div>

        {/* Rule 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-5 rounded-2xl bg-emerald-50/75 backdrop-blur-md border-2 border-emerald-200/80 shadow-grave-card hover:shadow-grave-card-hover hover:border-emerald-400 smooth-card-hover flex flex-col justify-between cursor-default"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-black uppercase tracking-wider font-['JetBrains_Mono']">
              <Coffee className="w-4 h-4 text-emerald-600" />
              <span>Rule 2: Buffer Sundays</span>
            </div>
            <h3 className="text-base font-bold text-slate-950 font-luxury">
              Zero Assigned Lessons
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              If Saturday targets are hit, Sunday is a <strong>100% guilt-free day off</strong>. Sleep in, hang out with friends, eat good food. It also serves as an emergency buffer for unexpected college tests.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed cognitive recovery</span>
          </div>
        </motion.div>
      </div>

      {/* Expanded Science Notes */}
      {expanded && (
        <div className="p-4 rounded-2xl bg-matcha-sub border-2 border-[#a6c4a1]/70 text-xs text-slate-800 space-y-2 leading-relaxed shadow-inner">
          <p>
            🧠 <strong>Working Memory Depletion:</strong> After ~45 minutes of heavy mathematical calculations, prefrontal cortex neurotransmitters are depleted. Trying to immediately do Reading comprehension leads to re-reading the same paragraph 4 times without comprehension.
          </p>
          <p>
            🌿 <strong>The 10-Minute Screen-Free Window:</strong> Looking at social media or YouTube during your break does not rest your brain. You must step away from light-emitting displays, drink cold water, and let your eyes relax on distant objects.
          </p>
          <p>
            🎯 <strong>Crescent Model Peak Stamina:</strong> On test day (Nov 7), test anxiety will elevate your cortisol. A student trained in 90-minute hyper-focused blocks maintains high cognitive speed without panic or brain fog.
          </p>
        </div>
      )}
    </motion.section>
  );
};
