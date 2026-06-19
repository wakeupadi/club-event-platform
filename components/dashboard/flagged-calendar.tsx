"use client";

import { useMemo } from "react";

type FlaggedCalendarProps = {
  suggestions: any[];
  flags: any[];
  onSelectDate: (dateStr: string) => void;
};

export function FlaggedCalendar({ suggestions, flags, onSelectDate }: FlaggedCalendarProps) {
  // Generate a 90-day grid starting from today
  const days = useMemo(() => {
    const list = [];
    const today = new Date();
    
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      let type = "available"; // default
      let label = "";

      // Check if it's a flag
      for (const flag of flags) {
        if (dateStr >= flag.startDate && dateStr <= flag.endDate) {
          type = flag.type.toLowerCase(); // 'exam' or 'holiday'
          label = flag.title;
          break;
        }
      }

      // Check if it's a suggestion
      const isSuggestion = suggestions.some(s => s.date === dateStr);
      if (isSuggestion && type !== 'exam') {
        type = "suggested";
      }

      list.push({
        dateStr,
        dayNum: d.getDate(),
        month: d.toLocaleString('en-US', { month: 'short' }),
        type,
        label,
        dayOfWeek: d.getDay()
      });
    }
    return list;
  }, [suggestions, flags]);

  return (
    <div className="mt-4 p-4 bg-card/80 backdrop-blur-xl shadow-2xl rounded-xl border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Availability Calendar</h3>
      
      {/* Legend */}
      <div className="flex gap-4 mb-4 text-[10px] uppercase font-bold text-zinc-500">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-zinc-800"></div> Available</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div> Suggested</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div> Exam</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/50"></div> Holiday</div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-1">
            {day}
          </div>
        ))}

        {/* Padding for first day of grid */}
        {Array.from({ length: days[0]?.dayOfWeek || 0 }).map((_, i) => (
          <div key={`pad-${i}`} className="h-12 bg-transparent rounded-lg"></div>
        ))}

        {days.map((d, i) => {
          let bgClass = "bg-zinc-800/50 hover:bg-zinc-700/80 cursor-pointer text-zinc-300";
          let badge = null;

          if (d.type === "exam") {
            bgClass = "bg-red-500/10 border border-red-500/30 text-red-400 cursor-not-allowed";
            badge = "EXAM";
          } else if (d.type === "holiday") {
            bgClass = "bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 cursor-pointer";
          } else if (d.type === "suggested") {
            bgClass = "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]";
            badge = "BEST";
          }

          return (
            <div 
              key={d.dateStr}
              onClick={() => d.type !== "exam" && onSelectDate(d.dateStr)}
              className={`relative flex flex-col items-center justify-center h-12 rounded-lg transition-all ${bgClass}`}
              title={d.label || d.dateStr}
            >
              <span className="text-[10px] opacity-70 leading-none mb-0.5">{d.month}</span>
              <span className="font-bold text-sm leading-none">{d.dayNum}</span>
              {badge && (
                <span className="absolute -bottom-1 text-[8px] font-black tracking-widest uppercase">
                  {badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
