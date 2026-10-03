'use client';

import React from 'react';

export interface DomainMasteryItem {
  domain: string;
  totalSkills: number;
  masteredSkills: number;
  proficientSkills: number;
  colorClass: string;
}

interface DomainBatteryProps {
  domains: DomainMasteryItem[];
}

export const DomainBattery: React.FC<DomainBatteryProps> = ({ domains }) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            Domain Breakdown
          </span>
          <h2 className="text-xl font-extrabold text-stone-900 font-serif mt-0.5">
            Segmented Battery Indicators
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span>Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-200 inline-block" />
            <span>Proficient</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-200 inline-block" />
            <span>Unreached</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {domains.map((item) => {
          const blocksCount = Math.min(20, item.totalSkills);
          const ratio = blocksCount / Math.max(1, item.totalSkills);
          const filledMastered = Math.round(item.masteredSkills * ratio);
          const filledProficient = Math.round(item.proficientSkills * ratio);
          const percentage = Math.round(
            ((item.masteredSkills + item.proficientSkills) / Math.max(1, item.totalSkills)) * 100
          );

          return (
            <div key={item.domain} className="space-y-2">
              <div className="flex items-baseline justify-between text-xs font-mono">
                <span className="font-bold text-stone-800 text-sm font-sans">{item.domain}</span>
                <span className="text-stone-500">
                  <strong className="text-stone-900">{percentage}%</strong> ({item.masteredSkills + item.proficientSkills}/{item.totalSkills})
                </span>
              </div>

              {/* Segmented Battery Bar: Grid of discrete rounded blocks */}
              <div className="flex items-center gap-1.5 p-1.5 bg-[#f4f7f3] rounded-xl border border-stone-200">
                {Array.from({ length: blocksCount }).map((_, blockIdx) => {
                  let blockStyle = 'bg-stone-200/70 border border-stone-300/40';

                  if (blockIdx < filledMastered) {
                    blockStyle = `${item.colorClass} shadow-xs`;
                  } else if (blockIdx < filledMastered + filledProficient) {
                    blockStyle = 'bg-emerald-300 border border-emerald-400';
                  }

                  return (
                    <div
                      key={blockIdx}
                      className={`h-4 flex-1 rounded-sm transition-all duration-500 ${blockStyle}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
