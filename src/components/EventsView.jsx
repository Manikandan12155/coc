import React from 'react';
import { Calendar, Clock, Gift, Flame, Trophy } from 'lucide-react';

export default function EventsView({ onAskAI }) {
  const events = [
    {
      title: "Clan War League (CWL)",
      date: "1st - 10th of Every Month",
      status: "Upcoming",
      tag: "Major Event",
      color: "border-amber-400 text-amber-300 bg-amber-500/20",
      desc: "Earn massive League Medals for Hammer of Building and Hammers."
    },
    {
      title: "Clan Games",
      date: "22nd - 28th of Every Month",
      status: "Monthly",
      tag: "Free Books",
      color: "border-emerald-400 text-emerald-300 bg-emerald-500/20",
      desc: "Reach 4000 points to unlock top-tier reward (Book of Building / Rune of DE)."
    },
    {
      title: "Raid Weekend",
      date: "Every Friday 12:30 PM - Monday",
      status: "Active / Recurring",
      tag: "Weekly",
      color: "border-purple-400 text-purple-300 bg-purple-500/20",
      desc: "Complete 6 attacks to earn 1000 - 1500+ Raid Medals for research potions."
    },
    {
      title: "Trader Cycle Refresh",
      date: "Every Tuesday 05:30 AM",
      status: "Weekly",
      tag: "Shop",
      color: "border-blue-400 text-blue-300 bg-blue-500/20",
      desc: "Weekly free potions and ores refresh in Trader shop."
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 pb-24 max-w-2xl mx-auto w-full space-y-4">
      
      <div>
        <h2 className="text-base font-black text-amber-300 flex items-center gap-2 coc-font">
          <Calendar size={18} className="text-amber-400" />
          <span>CoC Official Events Calendar</span>
        </h2>
        <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">Recurring event cycle & preparation targets</p>
      </div>

      <div className="space-y-3">
        {events.map((ev, i) => (
          <div
            key={i}
            className="coc-card rounded-2xl p-4 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${ev.color}`}>
                {ev.tag}
              </span>
              <span className="text-xs text-[#94a3b8] flex items-center gap-1 font-semibold">
                <Clock size={12} />
                <span>{ev.date}</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-white coc-font tracking-wide">{ev.title}</h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed font-medium">{ev.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onAskAI("Clan Games and CWL ku enna armies and preparation theva fast-ah points mudikka?")}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-slate-950 font-black text-xs transition text-center shadow-lg uppercase tracking-wide coc-font"
      >
        Ask AI Event Preparation Strategy →
      </button>

    </div>
  );
}
