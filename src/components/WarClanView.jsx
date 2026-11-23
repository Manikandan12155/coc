import React, { useState } from 'react';
import { 
  Award, Swords, TrendingUp, Calendar, Clock, Gift, Flame, Trophy, Shield, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function WarClanView({ player, clan }) {
  const [activeSection, setActiveSection] = useState('all');

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
    <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal">
      
      {/* Clan Banner Card */}
      <div className="coc-card rounded-2xl p-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-900 border-2 border-blue-400 flex items-center justify-center text-2xl shadow-lg">
            🛡️
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <span>{player?.clan?.name || 'Tamil Aadukalam'}</span>
              <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-2 py-0.5 rounded font-black">
                {player?.clan?.clanLevel ? `Lvl ${player.clan.clanLevel}` : 'Clan'}
              </span>
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">
              Role: <strong className="text-white capitalize">{player?.role || 'Member'}</strong> • Tag: {player?.clan?.tag || 'N/A'}
            </p>
          </div>
        </div>

        {/* War Statistics & Raid Contributions */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-[#191f2b] p-2.5 rounded-xl border border-[#2e394c]">
            <div className="text-[#94a3b8] mb-1 flex items-center gap-1 font-semibold text-[11px]">
              <Swords size={13} className="text-amber-400" />
              <span>War Stars</span>
            </div>
            <div className="text-base font-black text-yellow-300 font-mono">{player?.warStars || 0} ⭐</div>
          </div>

          <div className="bg-[#191f2b] p-2.5 rounded-xl border border-[#2e394c]">
            <div className="text-[#94a3b8] mb-1 flex items-center gap-1 font-semibold text-[11px]">
              <TrendingUp size={13} className="text-emerald-400" />
              <span>War Status</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
              {player?.warPreference === 'in' ? '🟢 Opted In' : '🔴 Opted Out'}
            </div>
          </div>

          <div className="bg-[#191f2b] p-2.5 rounded-xl border border-[#2e394c]">
            <div className="text-[#94a3b8] mb-1 flex items-center gap-1 font-semibold text-[11px]">
              <Trophy size={13} className="text-purple-400" />
              <span>Capital Loot</span>
            </div>
            <div className="text-sm font-bold text-purple-300 font-mono mt-0.5">
              {(player?.clanCapitalContributions || 0).toLocaleString()} 🏛️
            </div>
          </div>
        </div>
      </div>

      {/* CWL Performance & Rules */}
      <div className="coc-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award size={15} className="text-amber-400" />
            <span>Clan War League (CWL) Performance</span>
          </h3>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-500/30">
            Monthly Season
          </span>
        </div>

        <div className="p-3 bg-[#191f2b] rounded-xl border border-[#2e394c] flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-gray-200">CWL 8-Star Reward Rule</div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Score 8 stars during the 7 war days to guarantee 100% full CWL medal payout.
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-amber-300 font-mono">8+ Stars = 100%</span>
          </div>
        </div>
      </div>

      {/* Official Events Calendar Section */}
      <div className="coc-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={15} className="text-amber-400" />
            <span>Official Events Calendar</span>
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">Live Cycles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {events.map((e, idx) => (
            <div key={idx} className="bg-[#191f2b] p-3 rounded-xl border border-[#2e394c] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-xs">{e.title}</h4>
                  <span className={`text-[9px] px-2 py-0.2 rounded font-bold border ${e.color}`}>{e.tag}</span>
                </div>
                <div className="text-[11px] text-amber-400 font-mono font-medium mb-1">{e.date}</div>
                <p className="text-[11px] text-gray-400">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
