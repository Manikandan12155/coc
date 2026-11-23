import React, { useState } from 'react';
import { 
  Award, Swords, TrendingUp, Calendar, Clock, Gift, Flame, Trophy, Shield, 
  CheckCircle2, Play, Video, Sparkles, Filter, ChevronRight, X
} from 'lucide-react';
import officialMediaData from '../data/cocOfficialMedia.json';

export default function WarClanView({ player, clan }) {
  const [activeMediaFilter, setActiveMediaFilter] = useState('all'); // all, video, short
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filter only items <= 14 days old (2 weeks strictly)
  const recentMedia = (officialMediaData || []).filter(item => item.daysAgo <= 14);

  const filteredMedia = recentMedia.filter(item => {
    if (activeMediaFilter === 'video') return item.type === 'video';
    if (activeMediaFilter === 'short') return item.type === 'short';
    return true;
  });

  const recurringEvents = [
    {
      title: "Clan War League (CWL)",
      date: "1st - 10th of Every Month",
      status: "Upcoming",
      tag: "Major League",
      color: "border-amber-400 text-amber-300 bg-amber-500/20",
      desc: "Earn massive League Medals for Hammer of Building & Hero upgrades."
    },
    {
      title: "Clan Games",
      date: "22nd - 28th of Every Month",
      status: "Monthly",
      tag: "Free Books",
      color: "border-emerald-400 text-emerald-300 bg-emerald-500/20",
      desc: "Score 4,000 points to unlock top-tier reward (Book of Building / Rune of DE)."
    },
    {
      title: "Raid Weekend",
      date: "Every Friday 12:30 PM - Monday",
      status: "Weekly",
      tag: "Raid Medals",
      color: "border-purple-400 text-purple-300 bg-purple-500/20",
      desc: "Execute 6 capital attacks to earn 1,000 - 1,500+ Raid Medals for research."
    },
    {
      title: "Trader Cycle Refresh",
      date: "Every Tuesday 05:30 AM",
      status: "Weekly",
      tag: "Free Ores",
      color: "border-blue-400 text-blue-300 bg-blue-500/20",
      desc: "Weekly free potions, glowy ores & starry ores in Trader shop."
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

      {/* Official Supercell Live Videos & Shorts (Past 2 Weeks Strictly) */}
      <div className="coc-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
              <Video size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Official CoC Live Media</span>
                <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded font-semibold uppercase">
                  Last 2 Weeks Only
                </span>
              </h3>
              <p className="text-[10px] text-gray-400">Official YouTube Videos & Shorts released in last 14 days</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#121620] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveMediaFilter('all')}
              className={`px-2 py-0.5 text-[10px] rounded font-semibold transition ${
                activeMediaFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({recentMedia.length})
            </button>
            <button
              onClick={() => setActiveMediaFilter('video')}
              className={`px-2 py-0.5 text-[10px] rounded font-semibold transition ${
                activeMediaFilter === 'video' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveMediaFilter('short')}
              className={`px-2 py-0.5 text-[10px] rounded font-semibold transition ${
                activeMediaFilter === 'short' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Shorts
            </button>
          </div>
        </div>

        {/* Video Player Modal/Banner if Selected */}
        {selectedVideo && (
          <div className="p-3 bg-[#121620] rounded-xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1 truncate max-w-[80%]">
                <Play size={12} className="text-amber-400 fill-amber-400" />
                {selectedVideo.title}
              </span>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X size={15} />
              </button>
            </div>
            
            {/* Embedded Iframe Player */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#2e394c] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-[11px] text-gray-400 flex items-center justify-between">
              <span>Released: <strong className="text-gray-200">{selectedVideo.timeAgo}</strong></span>
              <span className="text-[10px] bg-red-600/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                Official Supercell Release
              </span>
            </div>
          </div>
        )}

        {/* Media Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filteredMedia.map((m) => {
            const isPlaying = selectedVideo?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedVideo(m)}
                className={`group cursor-pointer rounded-xl bg-[#191f2b] border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                  isPlaying 
                    ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-lg' 
                    : 'border-[#2e394c] hover:border-amber-500/50 hover:bg-[#1f2737]'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={m.thumbnail} 
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-black/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={14} className="fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Badge */}
                  <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-[9px] font-mono px-1.5 py-0.5 rounded text-white border border-white/10">
                    {m.type === 'short' ? '⚡ Short' : '🎬 Video'}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-2 flex flex-col flex-1 justify-between">
                  <h4 className="text-[11px] font-medium text-gray-200 line-clamp-2 leading-snug group-hover:text-amber-300 transition">
                    {m.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 pt-1 border-t border-white/5">
                    <span className="font-mono text-amber-400/90">{m.timeAgo}</span>
                    <span className="text-[9px] text-gray-500">Supercell</span>
                  </div>
                </div>
              </div>
            );
          })}
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
          {recurringEvents.map((e, idx) => (
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
