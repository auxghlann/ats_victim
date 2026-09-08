"use client";

import { useState } from "react";

interface ActivityDay {
  day: string;
  date: string;
  count: number;
  heightPct: number;
}

interface WeeklyActivityChartProps {
  data: ActivityDay[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalActions = data.reduce((acc, curr) => acc + curr.count, 0);
  const rawMax = Math.max(...data.map((d) => d.count), 1);
  // Calculate a clean ceiling for the Y axis (e.g. 4, 8, 12 or next multiple of 2/5)
  const maxVal = rawMax <= 4 ? 4 : Math.ceil(rawMax / 4) * 4;
  const midVal = Math.round(maxVal / 2);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-on-surface-variant">
            {totalActions} activities recorded this week
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-primary" />
            <span>Applications &amp; Updates</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas with Y-Axis */}
      <div className="flex-1 flex gap-2">
        {/* Y-Axis Column */}
        <div className="flex flex-col justify-between items-end pb-8 pt-2 text-[10px] font-semibold text-on-surface-variant/70 select-none w-8 shrink-0">
          <span>{maxVal}</span>
          <span>{midVal}</span>
          <span>0</span>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 min-h-[220px] bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col justify-between p-4 pb-2 relative select-none">
          {/* Horizontal Guide Lines */}
          <div className="absolute w-[calc(100%-2rem)] h-px bg-outline-variant/20 top-4 left-4 pointer-events-none" />
          <div className="absolute w-[calc(100%-2rem)] h-px bg-outline-variant/20 top-1/2 left-4 pointer-events-none" />
          <div className="absolute w-[calc(100%-2rem)] h-px bg-outline-variant/20 bottom-8 left-4 pointer-events-none" />

          {/* Bars Container */}
          <div className="flex-1 flex items-end justify-between relative z-10">
            {data.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const barHeightPct = item.count > 0 ? Math.max(12, Math.min(100, (item.count / maxVal) * 100)) : 6;
              return (
                <div
                  key={`${item.date}-${idx}`}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group px-1 sm:px-2"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                      <span className="font-bold">{item.day}</span> ({item.date}): {item.count} {item.count === 1 ? "action" : "actions"}
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${barHeightPct}%` }}
                    className={`w-full max-w-[36px] rounded-t-md transition-all duration-200 cursor-pointer ${
                      item.count > 0
                        ? isHovered
                          ? "bg-primary shadow-[0_0_12px_rgba(0,88,189,0.4)]"
                          : "bg-primary/80 hover:bg-primary"
                        : isHovered
                        ? "bg-outline-variant/50"
                        : "bg-outline-variant/25"
                    }`}
                  />

                  {/* Day Label */}
                  <span
                    className={`text-xs mt-3 transition-colors ${
                      isHovered ? "font-bold text-primary" : "text-on-surface-variant font-medium"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* X-Axis Label */}
          <div className="text-center pt-1 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
            Day of Week
          </div>
        </div>
      </div>
    </div>
  );
}
