import React, { useState, useEffect } from 'react';
import { calculateMaxStats } from '../services/cocApi';
import { COC_ASSETS } from '../services/cocAssets';
import { 
  Hammer, ChevronDown, ChevronUp, Sparkles, Shield, Crown, Wrench, Calendar, CheckCircle2, Zap, Building, Coins, Crosshair
} from 'lucide-react';

export default function MaxTracker({ player }) {
  const stats = calculateMaxStats(player);
  const totalRemainingDays = stats?.estDaysWithFiveBuilders || 808;

  const [activeBuilders, setActiveBuilders] = useState(() => {
    return parseInt(localStorage.getItem('coc_active_builders') || '5', 10);
  });
  const [now, setNow] = useState(Date.now());
  const [builderTargetMs, setBuilderTargetMs] = useState(() => Date.now() + totalRemainingDays * 86400000);

  useEffect(() => {
    localStorage.setItem('coc_active_builders', activeBuilders.toString());
    if (activeBuilders === 0) return;
    const daysAdjusted = Math.round((stats?.totalBuilderDays || 4040) / activeBuilders);
    setBuilderTargetMs(Date.now() + daysAdjusted * 86400000);
  }, [totalRemainingDays, activeBuilders]);

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

  const builderUnits = getCountdownUnits(builderTargetMs, activeBuilders > 0);

  const calculateTargetDate = (daysRemaining) => {
    if (daysRemaining <= 0) return 'MAXED';
    const target = new Date(Date.now() + daysRemaining * 86400000);
    return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [activeFilter, setActiveFilter] = useState('all');

  const [openSections, setOpenSections] = useState({
    quickWins: false,
    heroes: false,
    defenses: false,
    traps: false,
    buildings: false,
    economy: false,
    equipment: false,
    builderBase: false,
    maxed: false,
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  if (!player) return null;

  const mainHeroes = (player.heroes || []).filter(h => h.village === 'home');
  const builderHeroes = (player.heroes || []).filter(h => h.village === 'builderBase');
  const heroEquipment = player.heroEquipment || [];

  const allVillageItems = [
    ...mainHeroes.map(h => ({ ...h, type: 'Hero', category: 'heroes', avgDays: 7 })),
    ...builderHeroes.map(h => ({ ...h, type: 'Builder Hero', category: 'builder', avgDays: 5 })),
    ...heroEquipment.map(e => ({ ...e, type: 'Equipment', category: 'equipment', avgDays: 4 }))
  ];

  const quickWins = allVillageItems.filter(item => {
    const diff = item.maxLevel - item.level;
    return diff > 0 && diff <= 2;
  });

  const maxedItems = allVillageItems.filter(item => item.level >= item.maxLevel);

  const filterButtons = [
    { id: 'all', label: 'All Village', icon: Sparkles },
    { id: 'quickwins', label: `⚡ Quick Wins (${quickWins.length})`, icon: Zap, color: 'text-yellow-400' },
    { id: 'heroes', label: 'Heroes', icon: Crown },
    { id: 'defenses', label: `Defenses (${COC_ASSETS.defenses.length})`, icon: Shield },
    { id: 'traps', label: `Traps (${COC_ASSETS.traps.length})`, icon: Crosshair, color: 'text-orange-400' },
    { id: 'buildings', label: `Army Buildings (${COC_ASSETS.buildings.length})`, icon: Building, color: 'text-blue-400' },
    { id: 'economy', label: `Resources (${COC_ASSETS.economy.length})`, icon: Coins, color: 'text-yellow-400' },
    { id: 'equipment', label: 'Equipment & Ores', icon: Wrench },
    { id: 'builder', label: 'Builder Base', icon: Hammer, color: 'text-amber-400' },
    { id: 'maxed', label: `🏆 Maxed (${maxedItems.length})`, icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const renderCountdownBoxes = (units, isWorking) => {
    const numColor = !isWorking ? 'text-gray-400' : 'text-amber-300';
    const secColor = !isWorking ? 'text-gray-500' : 'text-emerald-400';

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
        <div className={`bg-[#18202d] py-1.5 px-1 rounded-lg border border-white/5 ${isWorking ? 'border-emerald-500/30' : ''}`}>
          <div className={`text-base font-black ${secColor}`}>
            {units.secs < 10 ? '0' + units.secs : units.secs}
          </div>
          <div className={`text-[9px] font-sans uppercase ${secColor}`}>SECS</div>
        </div>
      </div>
    );
  };


  const HERO_META_LOADOUTS = {
    'Barbarian King': [
      { name: 'Giant Gauntlet', tier: 'Epic', desc: 'Immunity + Area Splash damage' },
      { name: 'Spiky Ball', tier: 'Epic', desc: 'Destroys 5 defense buildings across map' }
    ],
    'Archer Queen': [
      { name: 'Frozen Arrow', tier: 'Epic', desc: 'Slows single targets by 75%' },
      { name: 'Invisibility Vial', tier: 'Common', desc: 'Invisibility + 880 DPS burst' }
    ],
    'Grand Warden': [
      { name: 'Eternal Tome', tier: 'Common', desc: '9.5s Total Army Invulnerability' },
      { name: 'Healing Tome', tier: 'Common', desc: 'Rapid heal over time for main smash group' }
    ],
    'Royal Champion': [
      { name: 'Haste Vial', tier: 'Common', desc: 'Extreme DPS and attack speed' },
      { name: 'Rocket Boots', tier: 'Epic', desc: 'Jumps straight into core defenses' }
    ],
    'Minion Prince': [
      { name: 'Dark Orb', tier: 'Special', desc: 'Air splash curse' }
    ]
  };

  const renderItemCard = (name, level, maxLevel, category, avgDays = 7) => {
    const pct = Math.round((level / maxLevel) * 100);
    const remaining = maxLevel - level;
    const isMax = remaining <= 0;
    const estDays = remaining * avgDays;
    const etaDate = calculateTargetDate(estDays);

    let imgUrl = null;
    if (category === 'heroes' || category === 'builder') imgUrl = COC_ASSETS.heroes[name];
    else if (category === 'equipment') imgUrl = COC_ASSETS.equipment?.[name];

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
            className="fallback-badge w-full h-full flex items-center justify-center text-amber-400 font-bold text-xs bg-slate-800 rounded" 
            style={{ display: imgUrl ? 'none' : 'flex' }}
          >
            ⚔️
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold text-slate-100 tracking-wide truncate">{name}</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-gray-400">Lvl</span>
              <span className={`font-bold ${isMax ? 'text-emerald-400' : 'text-amber-300'}`}>
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
                isMax ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-amber-400/80" />
              <span>Target: <strong className="text-gray-200">{etaDate}</strong></span>
            </span>
            {!isMax && <span className="text-gray-500 font-mono">~{estDays}d left</span>}
          </div>

          {/* Best Pro Meta Equipment Combos for Heroes */}
          {category === 'heroes' && HERO_META_LOADOUTS[name] && (
            <div className="mt-2 pt-1.5 border-t border-white/5 flex flex-wrap items-center gap-1 text-[10px]">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Sparkles size={11} /> Meta Loadout:
              </span>
              {HERO_META_LOADOUTS[name].map((eq, i) => (
                <span key={i} className="bg-[#111622] text-gray-200 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
                  {eq.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGenericStaticCard = (item) => {
    return (
      <div
        key={item.name}
        className="bg-[#171e29] hover:bg-[#1f2838] p-3 rounded-xl border border-[#273244] transition flex items-center gap-3 shadow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-[#202937] p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
          <img 
            src={item.img} 
            alt={item.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement.querySelector('.fallback-badge');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="fallback-badge w-full h-full hidden items-center justify-center text-amber-400 font-bold text-xs bg-slate-800 rounded">
            🛡️
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold text-slate-100 tracking-wide truncate">{item.name}</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-gray-400">Target</span>
              <span className="font-bold text-amber-300">Max Lv {item.maxLvl}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 line-clamp-1 mb-1 font-medium">{item.desc}</p>
          <div className="flex justify-between items-center text-[10px] text-gray-500">
            <span>Priority: <strong className="text-amber-400">Tier {item.priority || 3}</strong></span>
            <span className="font-mono">~{item.avgDaysPerLvl || 14}d / upgrade</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal">
      
      {/* Top Village Executive Banner */}
      <div className="coc-card p-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600/30 to-yellow-400/20 p-0.5 border border-yellow-400/30 flex items-center justify-center text-xl">
              🏰
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
                <span>{player.name}</span>
                <span className="bg-amber-400/20 text-amber-300 font-medium px-2 py-0.5 rounded text-[11px] border border-amber-400/30">
                  TH {player.townHallLevel}
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                {player.clan?.name || 'No Clan'} • Lvl {player.expLevel} • 🏆 {player.trophies}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400 font-mono">{stats?.overallVillagePct || 0}%</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">VILLAGE COMPLETE</div>
          </div>
        </div>

        {/* 1. BUILDER COUNTDOWN */}
        <div className="p-3.5 bg-[#111622] rounded-xl border border-amber-500/40 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeBuilders > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></span>
              <span>{activeBuilders > 0 ? `BUILDERS: LIVE COUNTDOWN (${activeBuilders} ACTIVE)` : 'COUNTDOWN PAUSED (ALL BUILDERS IDLE)'}</span>
            </span>
            <span className="text-[10px] bg-emerald-950/70 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Auto-Sync: 2m
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#161c28] p-2 rounded-lg mb-2 border border-white/5 text-xs">
            <div className="flex items-center gap-1.5">
              <Hammer size={14} className={activeBuilders > 0 ? 'text-amber-400' : 'text-gray-500'} />
              <span className="text-[11px] font-semibold text-gray-300">Active Working Builders:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveBuilders(6)}
                className={`px-1.5 h-6 rounded text-[11px] font-bold transition-all flex items-center gap-0.5 ${
                  activeBuilders === 6
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                    : 'bg-[#20293a] text-amber-400/80 hover:text-amber-300'
                }`}
                title="6 Builders (5 Home + 1 B.O.B 6th Builder)"
              >
                <span>🤖 6</span>
              </button>
              {[5, 4, 3, 2, 1].map(n => (
                <button
                  key={n}
                  onClick={() => setActiveBuilders(n)}
                  className={`w-5 sm:w-6 h-6 rounded text-xs font-bold transition-all ${
                    activeBuilders === n
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#20293a] text-gray-400 hover:text-white'
                  }`}
                  title={`${n} Builders Working`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setActiveBuilders(0)}
                className={`px-1.5 h-6 rounded text-[11px] font-bold transition-all ${
                  activeBuilders === 0
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-[#20293a] text-gray-400 hover:text-red-400'
                }`}
                title="Pause Countdown (All Builders Idle)"
              >
                ⏸ Idle
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-0.5 text-gray-300">
            <span className="font-semibold text-amber-300">Target: {calculateTargetDate(stats?.estDaysWithFiveBuilders || 0)}</span>
            <span className="font-mono text-gray-400">~{Math.round((stats?.totalBuilderDays || 4040) / Math.max(1, activeBuilders))}d left ({activeBuilders} Builders)</span>
          </div>

          {renderCountdownBoxes(builderUnits, activeBuilders > 0)}
        </div>
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
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-[#18202d] text-gray-300 hover:text-white border-[#273244] hover:bg-[#20293a]'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-slate-950' : (btn.color || 'text-gray-400')} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Categorized Accordion Sections */}
      {activeFilter === 'all' && (
        <div className="space-y-3">
          {/* Quick Wins */}
          {quickWins.length > 0 && (
            <div className="border border-yellow-500/30 rounded-xl overflow-hidden bg-[#161c28]">
              <button
                onClick={() => toggleSection('quickWins')}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500/10 to-transparent flex items-center justify-between text-left text-xs font-bold text-yellow-400"
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} />
                  <span>QUICK WINS - FINISH THESE FIRST ({quickWins.length})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                  <span>1-2 levels left</span>
                  {openSections.quickWins ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>
              {openSections.quickWins && (
                <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                  {quickWins.map(item => renderItemCard(item.name, item.level, item.maxLevel, item.category, item.avgDays))}
                </div>
              )}
            </div>
          )}

          {/* Main Heroes */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161c28]">
            <button
              onClick={() => toggleSection('heroes')}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-amber-400" />
                <span>MAIN HEROES ({mainHeroes.length})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                <span>Toggle</span>
                {openSections.heroes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {openSections.heroes && (
              <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                {mainHeroes.map(h => renderItemCard(h.name, h.level, h.maxLevel, 'heroes', 8))}
              </div>
            )}
          </div>

          {/* Defenses */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161c28]">
            <button
              onClick={() => toggleSection('defenses')}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-blue-400" />
                <span>VILLAGE DEFENSES ({COC_ASSETS.defenses.length})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                <span>Toggle</span>
                {openSections.defenses ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {openSections.defenses && (
              <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                {COC_ASSETS.defenses.map(d => renderGenericStaticCard(d))}
              </div>
            )}
          </div>

          {/* Traps */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161c28]">
            <button
              onClick={() => toggleSection('traps')}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Crosshair size={14} className="text-orange-400" />
                <span>TRAPS ({COC_ASSETS.traps.length})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                <span>Toggle</span>
                {openSections.traps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {openSections.traps && (
              <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                {COC_ASSETS.traps.map(t => renderGenericStaticCard(t))}
              </div>
            )}
          </div>

          {/* Army Buildings */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161c28]">
            <button
              onClick={() => toggleSection('buildings')}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Building size={14} className="text-blue-400" />
                <span>ARMY BUILDINGS ({COC_ASSETS.buildings.length})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                <span>Toggle</span>
                {openSections.buildings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {openSections.buildings && (
              <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                {COC_ASSETS.buildings.map(b => renderGenericStaticCard(b))}
              </div>
            )}
          </div>

          {/* Economy Resources */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161c28]">
            <button
              onClick={() => toggleSection('economy')}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Coins size={14} className="text-yellow-400" />
                <span>RESOURCES & WALLS ({COC_ASSETS.economy.length})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                <span>Toggle</span>
                {openSections.economy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>
            {openSections.economy && (
              <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                {COC_ASSETS.economy.map(e => renderGenericStaticCard(e))}
              </div>
            )}
          </div>

          {/* Equipment */}
          {heroEquipment.length > 0 && (
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161c28]">
              <button
                onClick={() => toggleSection('equipment')}
                className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <Wrench size={14} className="text-indigo-400" />
                  <span>HERO EQUIPMENT ({heroEquipment.length})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-[11px] font-normal font-mono">
                  <span>Toggle</span>
                  {openSections.equipment ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>
              {openSections.equipment && (
                <div className="p-3 border-t border-white/5 space-y-2 bg-[#121620]">
                  {heroEquipment.map(eq => renderItemCard(eq.name, eq.level, eq.maxLevel, 'equipment', 4))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filtered Flat Grid List */}
      {activeFilter !== 'all' && (
        <div className="space-y-2">
          {activeFilter === 'quickwins' && quickWins.map(item => renderItemCard(item.name, item.level, item.maxLevel, item.category, item.avgDays))}
          {activeFilter === 'heroes' && mainHeroes.map(h => renderItemCard(h.name, h.level, h.maxLevel, 'heroes', 8))}
          {activeFilter === 'defenses' && COC_ASSETS.defenses.map(d => renderGenericStaticCard(d))}
          {activeFilter === 'traps' && COC_ASSETS.traps.map(t => renderGenericStaticCard(t))}
          {activeFilter === 'buildings' && COC_ASSETS.buildings.map(b => renderGenericStaticCard(b))}
          {activeFilter === 'economy' && COC_ASSETS.economy.map(e => renderGenericStaticCard(e))}
          {activeFilter === 'equipment' && heroEquipment.map(eq => renderItemCard(eq.name, eq.level, eq.maxLevel, 'equipment', 4))}
          {activeFilter === 'builder' && builderHeroes.map(h => renderItemCard(h.name, h.level, h.maxLevel, 'builder', 5))}
          {activeFilter === 'maxed' && maxedItems.map(item => renderItemCard(item.name, item.level, item.maxLevel, item.category, item.avgDays))}
        </div>
      )}
    </div>
  );
}
