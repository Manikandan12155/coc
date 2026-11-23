import React from 'react';
import { Award, Swords, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function WarClanView({ player, clan, onAskAI }) {
  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 pb-24 max-w-2xl mx-auto w-full space-y-4">
      
      {/* Clan Banner Card */}
      <div className="coc-card rounded-2xl p-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-900 border-2 border-blue-400 flex items-center justify-center text-2xl shadow-lg">
            🛡️
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-amber-300 flex items-center gap-2 coc-font">
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

        {/* War Statistics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#191f2b] p-3 rounded-xl border border-[#2e394c]">
            <div className="text-[#94a3b8] mb-1 flex items-center gap-1 font-semibold">
              <Swords size={14} className="text-amber-400" />
              <span>War Stars Won</span>
            </div>
            <div className="text-lg font-black text-yellow-300 coc-font">{player?.warStars || 0} ⭐</div>
          </div>

          <div className="bg-[#191f2b] p-3 rounded-xl border border-[#2e394c]">
            <div className="text-[#94a3b8] mb-1 flex items-center gap-1 font-semibold">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>War Status</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-1">
              {player?.warPreference === 'in' ? '🟢 Opted In (I\'m In)' : '🔴 Opted Out'}
            </div>
          </div>
        </div>
      </div>

      {/* CWL Medals Value Guide */}
      <div className="coc-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 coc-font">
            <Award size={16} className="text-amber-400" />
            <span>CWL League Medals (Shop Priority)</span>
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#191f2b] rounded-xl border border-[#2e394c] flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Hammer of Building (120 Medals)</div>
              <div className="text-[#94a3b8] text-[11px]">Instant 14-20 days upgrade bypass (Monolith, Eagle, Scatter)</div>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-yellow-300 font-black text-[10px] border border-amber-500/30">#1 Top Pick</span>
          </div>

          <div className="p-3 bg-[#191f2b] rounded-xl border border-[#2e394c] flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Hammer of Fighting (120 Medals)</div>
              <div className="text-[#94a3b8] text-[11px]">Instant max high-tier troops (Root Rider, Druid, Dragons)</div>
            </div>
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">#2 Priority</span>
          </div>
        </div>

        <button
          onClick={() => onAskAI("Clan War League (CWL) medals shop la enna vaanguradhu maximum value tharum? Hammer of Building ah illa Hammer of Fighting ah?")}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-xs transition text-center shadow-md"
        >
          Ask AI Best CWL Medals Strategy →
        </button>
      </div>

      {/* Raid Medals & Clan Capital */}
      <div className="coc-card rounded-2xl p-4 space-y-2">
        <h3 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5 coc-font">
          <span>⚔️ Raid Medals & Trader Shop Strategy</span>
        </h3>
        <p className="text-xs text-[#94a3b8] leading-relaxed font-medium">
          Every week Raid Medals-ah Trader shop-la <strong>3x Research Potions (600 Medals)</strong> and <strong>Pet Potions</strong> vaanga use pannunga. Idhu laboratory upgrade-ah 9 days fast-forward pannum!
        </p>
      </div>

    </div>
  );
}
