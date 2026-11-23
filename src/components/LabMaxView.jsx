import React, { useState, useEffect } from 'react';
import { calculateMaxStats } from '../services/cocApi';
import { COC_ASSETS } from '../services/cocAssets';
import { Sparkles, Droplet, CheckCircle2, Zap, Calendar } from 'lucide-react';

export default function LabMaxView({ player }) {
  const stats = calculateMaxStats(player);

  const [labWorking, setLabWorking] = useState(() => {
    return localStorage.getItem('coc_lab_working') !== 'false';
  });
  const [now, setNow] = useState(Date.now());
  const [labTargetMs, setLabTargetMs] = useState(() => Date.now() + (stats?.labDays || 2310) * 86400000);

  useEffect(() => {
    setLabTargetMs(Date.now() + (stats?.labDays || 2310) * 86400000);
  }, [stats?.labDays]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdownUnits = (targetMs, isWorking) => {
    if (!isWorking) {
      const totalSecs = Math.floor(Math.max(0, targetMs - now) / 1000);
      const yrs = Math.floor(totalSecs / (365 * 86400));
      const remY = totalSecs % (365 * 86400);
      const mos = Math.floor(remY / (30 * 86400));
      const remM = remY % (30 * 86400);
      const days = Math.floor(remM / 86400);
      return { yrs, mos, days, hrs: 0, mins: 0, secs: 0 };
    }
    const diff = Math.max(0, targetMs - now);
    const totalSecs = Math.floor(diff / 1000);
    const yrs = Math.floor(totalSecs / (365 * 86400));
    const remY = totalSecs % (365 * 86400);
    const mos = Math.floor(remY / (30 * 86400));
    const remM = remY % (30 * 86400);
    const days = Math.floor(remM / 86400);
    const remD = remM % 86400;
    const hrs = Math.floor(remD / 3600);
    const remH = remD % 3600;
    const mins = Math.floor(remH / 60);
    const secs = remH % 60;
    return { yrs, mos, days, hrs, mins, secs };
  };

  const labUnits = getCountdownUnits(labTargetMs, labWorking);

  const calculateTargetDate = (daysRemaining) => {
    if (daysRemaining <= 0) return 'MAXED';
    const target = new Date(Date.now() + daysRemaining * 86400000);
    return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [activeFilter, setActiveFilter] = useState('all');

  if (!player) return null;

  const homeTroops = (player.troops || []).filter(t => t.village === 'home');
  const siegeNames = ['Wall Wrecker', 'Battle Blimp', 'Stone Slammer', 'Siege Barracks', 'Log Launcher', 'Flame Flinger', 'Battle Drill'];
  const petNames = ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn', 'Frosty', 'Diggy', 'Poison Lizard', 'Phoenix', 'Spirit Fox', 'Angry Jelly', 'Snoop'];
  
  const darkTroopNames = [
    'Minion', 'Hog Rider', 'Valkyrie', 'Golem', 'Witch', 'Lava Hound', 
    'Bowler', 'Ice Golem', 'Headhunter', 'Apprentice Warden', 'Druid'
  ];

  const darkTroops = homeTroops.filter(t => darkTroopNames.includes(t.name));
  const elixirTroops = homeTroops.filter(t => !darkTroopNames.includes(t.name) && !siegeNames.includes(t.name) && !petNames.includes(t.name) && !t.name.startsWith('Super'));
  const sieges = homeTroops.filter(t => siegeNames.includes(t.name));
  const spells = (player.spells || []).filter(s => s.village === 'home');

  const allLabItems = [
    ...darkTroops.map(t => ({ ...t, type: 'Dark Troop', category: 'dark', avgDays: 14 })),
    ...elixirTroops.map(t => ({ ...t, type: 'Elixir Troop', category: 'elixir', avgDays: 12 })),
    ...sieges.map(s => ({ ...s, type: 'Siege Machine', category: 'sieges', avgDays: 12 })),
    ...spells.map(s => ({ ...s, type: 'Spell', category: 'spells', avgDays: 10 })),
  ];

  const quickWins = allLabItems.filter(item => {
    const diff = item.maxLevel - item.level;
    return diff > 0 && diff <= 2;
  });

  const maxedItems = allLabItems.filter(item => item.level >= item.maxLevel);

  const filterButtons = [
    { id: 'all', label: 'All Lab', icon: Sparkles },
    { id: 'quickwins', label: `⚡ Quick Wins (${quickWins.length})`, icon: Zap, color: 'text-yellow-400' },
    { id: 'dark', label: `Dark Troops (${darkTroops.length})`, icon: Droplet, color: 'text-purple-400' },
    { id: 'elixir', label: `Elixir Troops (${elixirTroops.length})`, icon: Sparkles, color: 'text-pink-400' },
    { id: 'sieges', label: `Siege Machines (${sieges.length})`, icon: Zap, color: 'text-amber-400' },
    { id: 'spells', label: `Spells (${spells.length})`, icon: Sparkles, color: 'text-cyan-400' },
    { id: 'maxed', label: `🏆 Maxed (${maxedItems.length})`, icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const renderCountdownBoxes = (units, isWorking) => {
    const numColor = !isWorking ? 'text-gray-400' : 'text-purple-300';
    const secColor = !isWorking ? 'text-gray-500' : 'text-fuchsia-400';

    return (
      <div className="grid grid-cols-6 gap-1 text-center font-mono mt-2">
        <div className="bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5">
          <div className={`text-base font-black ${numColor}`}>{units.yrs}</div>
          <div className="text-[9px] text-gray-400 font-sans uppercase">YRS</div>
        </div>
        <div className="bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5">
          <div className={`text-base font-black ${numColor}`}>{units.mos}</div>
          <div className="text-[9px] text-gray-400 font-sans uppercase">MOS</div>
        </div>
        <div className="bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5">
          <div className={`text-base font-black ${numColor}`}>{units.days}</div>
          <div className="text-[9px] text-gray-400 font-sans uppercase">DAYS</div>
        </div>
        <div className="bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5">
          <div className={`text-base font-black ${numColor}`}>{units.hrs}</div>
          <div className="text-[9px] text-gray-400 font-sans uppercase">HRS</div>
        </div>
        <div className="bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5">
          <div className={`text-base font-black ${numColor}`}>{units.mins}</div>
          <div className="text-[9px] text-gray-400 font-sans uppercase">MINS</div>
        </div>
        <div className={`bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5 ${isWorking ? 'border-purple-500/30' : ''}`}>
          <div className={`text-base font-black ${secColor}`}>
            {units.secs < 10 ? '0' + units.secs : units.secs}
          </div>
          <div className={`text-[9px] font-sans uppercase ${secColor}`}>SECS</div>
        </div>
      </div>
    );
  };

  const renderItemCard = (name, level, maxLevel, category, avgDays = 10) => {
    const pct = Math.round((level / maxLevel) * 100);
    const remaining = maxLevel - level;
    const isMax = remaining <= 0;
    const estDays = remaining * avgDays;
    const etaDate = calculateTargetDate(estDays);

    let imgUrl = COC_ASSETS.troops?.[name] || COC_ASSETS.spells?.[name];

    return (
      <div
        key={name}
        className="bg-[#171e29] hover:bg-[#1f2838] p-3 rounded-xl border border-[#273244] transition flex items-center gap-3 shadow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-[#202937] p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
          {imgUrl ? (
            <img 
              src={imgUrl} 
              alt={name} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement.querySelector('.fallback-badge');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="fallback-badge w-full h-full flex items-center justify-center text-purple-400 font-bold text-xs bg-slate-800 rounded" 
            style={{ display: imgUrl ? 'none' : 'flex' }}
          >
            ⚗️
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold text-slate-100 tracking-wide truncate">{name}</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-gray-400">Lvl</span>
              <span className={`font-bold ${isMax ? 'text-emerald-400' : 'text-purple-300'}`}>
                {level}/{maxLevel}
              </span>
              {isMax ? (
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                  MAX
                </span>
              ) : (
                <span className="text-red-400 text-[10px]">(-{remaining})</span>
              )}
            </div>
          </div>

          <div className="w-full bg-[#111622] rounded-full h-1.5 overflow-hidden border border-white/5 mb-1.5">
            <div
              className={`h-full transition-all duration-500 ${
                isMax ? 'bg-emerald-400' : 'bg-gradient-to-r from-purple-500 to-indigo-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-purple-400/80" />
              <span>Target: <strong className="text-gray-200">{etaDate}</strong></span>
            </span>
            {!isMax && <span className="text-gray-500 font-mono">~{estDays}d left</span>}
          </div>
        </div>
      </div>
    );
  };

  const filteredItems = allLabItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'quickwins') {
      const diff = item.maxLevel - item.level;
      return diff > 0 && diff <= 2;
    }
    if (activeFilter === 'dark') return item.category === 'dark';
    if (activeFilter === 'elixir') return item.category === 'elixir';
    if (activeFilter === 'sieges') return item.category === 'sieges';
    if (activeFilter === 'spells') return item.category === 'spells';
    if (activeFilter === 'maxed') return item.level >= item.maxLevel;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal">
      
      {/* LABORATORY LIVE COUNTDOWN */}
      <div className="p-3.5 bg-[#131526] rounded-xl border border-purple-500/40 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${labWorking ? 'bg-purple-400 animate-pulse' : 'bg-red-500'}`}></span>
            <span>{labWorking ? 'LABORATORY: LIVE RESEARCH COUNTDOWN' : 'LABORATORY PAUSED (LAB IDLE)'}</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
            labWorking ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' : 'bg-red-950/80 text-red-400 border-red-500/30'
          }`}>
            {labWorking ? '⚡ RESEARCHING' : '⏸ LAB IDLE'}
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#181a30] p-2 rounded-lg mb-2 border border-white/5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">⚗️</span>
            <span className="text-[11px] font-semibold text-gray-300">Lab Research Status:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setLabWorking(true);
                localStorage.setItem('coc_lab_working', 'true');
              }}
              className={`px-3 h-6 rounded text-[11px] font-bold transition-all ${
                labWorking 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'bg-[#20293a] text-gray-400 hover:text-white'
              }`}
            >
              ⚡ Working
            </button>
            <button
              onClick={() => {
                setLabWorking(false);
                localStorage.setItem('coc_lab_working', 'false');
              }}
              className={`px-3 h-6 rounded text-[11px] font-bold transition-all ${
                !labWorking 
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30' 
                  : 'bg-[#20293a] text-gray-400 hover:text-red-400'
              }`}
            >
              ⏸ Idle
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-0.5 text-gray-300">
          <span className="font-semibold text-purple-300">Target: {calculateTargetDate(stats?.labDays || 0)}</span>
          <span className="font-mono text-gray-400">~{stats?.labDays || 0}d ({stats?.labRemainingLevels || 0} Upgrades Left)</span>
        </div>

        {renderCountdownBoxes(labUnits, labWorking)}
      </div>

      {/* Filter Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll pb-1">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeFilter === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                isActive
                  ? 'bg-purple-500 text-slate-950 font-bold border-purple-400 shadow-md shadow-purple-500/20'
                  : 'bg-[#18202d] text-gray-300 hover:text-white border-[#273244] hover:bg-[#20293a]'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-slate-950' : (btn.color || 'text-gray-400')} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid List */}
      <div className="space-y-2">
        {filteredItems.map(item => renderItemCard(item.name, item.level, item.maxLevel, item.category, item.avgDays))}
      </div>
    </div>
  );
}
