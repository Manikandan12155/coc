import React, { useState } from 'react';
import { calculateMaxStats } from '../services/cocApi';
import { COC_ASSETS } from '../services/cocAssets';
import { 
  Clock, Droplet, Hammer, ChevronDown, ChevronUp, 
  Sparkles, Shield, Crown, Wrench, Calendar, CheckCircle2, Zap, Flame, Building, Coins, Crosshair
} from 'lucide-react';

export default function MaxTracker({ player, onAskAI }) {
  const stats = calculateMaxStats(player);

  const [activeFilter, setActiveFilter] = useState('all');

  const [openSections, setOpenSections] = useState({
    quickWins: true,
    heroes: true,
    defenses: true,
    traps: false,
    buildings: false,
    economy: false,
    equipment: false,
    darkTroops: false,
    elixirTroops: false,
    spells: false,
    builderBase: false,
    maxed: false,
    guides: false,
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  if (!player) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-[#94a3b8]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs tracking-wider font-medium">Scouting Complete Village...</span>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  const calculateTargetDate = (daysRemaining) => {
    if (daysRemaining <= 0) return 'MAXED';
    const target = new Date(Date.now() + daysRemaining * 86400000);
    return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const homeTroops = (player.troops || []).filter(t => t.village === 'home');
  const darkTroopNames = [
    'Minion', 'Hog Rider', 'Valkyrie', 'Golem', 'Witch', 'Lava Hound', 
    'Bowler', 'Ice Golem', 'Headhunter', 'Apprentice Warden', 'Druid'
  ];
  const darkTroops = homeTroops.filter(t => darkTroopNames.includes(t.name));
  const elixirTroops = homeTroops.filter(t => !darkTroopNames.includes(t.name) && !t.name.startsWith('Super'));
  const builderTroops = (player.troops || []).filter(t => t.village === 'builderBase');

  const mainHeroes = (player.heroes || []).filter(h => h.village === 'home');
  const builderHeroes = (player.heroes || []).filter(h => h.village === 'builderBase');
  const heroEquipment = player.heroEquipment || [];
  const spells = player.spells || [];

  const allItems = [
    ...mainHeroes.map(h => ({ ...h, type: 'Hero', category: 'heroes', avgDays: 7 })),
    ...builderHeroes.map(h => ({ ...h, type: 'Builder Hero', category: 'builder', avgDays: 5 })),
    ...darkTroops.map(t => ({ ...t, type: 'Dark Troop', category: 'dark', avgDays: 14 })),
    ...elixirTroops.map(t => ({ ...t, type: 'Elixir Troop', category: 'elixir', avgDays: 12 })),
    ...spells.map(s => ({ ...s, type: 'Spell', category: 'spells', avgDays: 10 })),
    ...heroEquipment.map(e => ({ ...e, type: 'Equipment', category: 'equipment', avgDays: 4 }))
  ];

  const maxedItems = allItems.filter(item => item.level >= item.maxLevel);
  const quickWins = allItems.filter(item => {
    const diff = item.maxLevel - item.level;
    return diff > 0 && diff <= 2;
  });

  const filterButtons = [
    { id: 'all', label: 'All (A-Z)', icon: Sparkles },
    { id: 'quickwins', label: `⚡ Quick Wins (${quickWins.length})`, icon: Zap, color: 'text-yellow-400' },
    { id: 'heroes', label: 'Heroes', icon: Crown },
    { id: 'defenses', label: `Defenses (${COC_ASSETS.defenses.length})`, icon: Shield },
    { id: 'traps', label: `Traps (${COC_ASSETS.traps.length})`, icon: Crosshair, color: 'text-orange-400' },
    { id: 'buildings', label: `Army Buildings (${COC_ASSETS.buildings.length})`, icon: Building, color: 'text-blue-400' },
    { id: 'economy', label: `Resources (${COC_ASSETS.economy.length})`, icon: Coins, color: 'text-yellow-400' },
    { id: 'equipment', label: 'Equipment & Ores', icon: Wrench },
    { id: 'dark', label: 'Dark Troops', icon: Droplet, color: 'text-purple-400' },
    { id: 'elixir', label: 'Elixir Troops', icon: Sparkles, color: 'text-pink-400' },
    { id: 'builder', label: 'Builder Base', icon: Hammer, color: 'text-amber-400' },
    { id: 'maxed', label: `🏆 Maxed (${maxedItems.length})`, icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const renderItemCard = (name, level, maxLevel, category, avgDays = 7) => {
    const pct = Math.round((level / maxLevel) * 100);
    const remaining = maxLevel - level;
    const isMax = remaining <= 0;
    const estDays = remaining * avgDays;
    const etaDate = calculateTargetDate(estDays);

    let imgUrl = null;
    if (category === 'heroes' || category === 'builder') imgUrl = COC_ASSETS.heroes[name];
    else if (category === 'dark' || category === 'elixir') imgUrl = COC_ASSETS.troops[name];
    else if (category === 'spells') imgUrl = COC_ASSETS.spells[name];

    return (
      <div
        key={name}
        onClick={() => onAskAI(`${name} level ${level}/${maxLevel} la irukku. Idhai fast-ah max panna priority and tips solu.`)}
        className="bg-[#171e29] hover:bg-[#1f2838] p-3 rounded-xl border border-[#273244] transition cursor-pointer flex items-center gap-3 shadow-sm active:scale-[0.99]"
      >
        <div className="w-12 h-12 rounded-xl bg-[#202937] p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
          {imgUrl ? (
            <img src={imgUrl} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
          ) : (
            <span className="text-xl">⚔️</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold text-slate-100 tracking-wide truncate">{name}</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-amber-300 font-semibold">
                Lvl {level}/{maxLevel}
              </span>
              {isMax ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-medium border border-emerald-500/30">MAX</span>
              ) : (
                <span className="text-red-400 text-[10px] font-normal">(-{remaining})</span>
              )}
            </div>
          </div>

          <div className="w-full bg-[#0d1218] h-2 rounded-full overflow-hidden border border-white/5 mb-1.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMax ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-300'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-amber-400/80" />
              <span>Target: <strong className="text-gray-200">{etaDate}</strong></span>
            </span>
            {!isMax && <span className="text-gray-500 font-mono">~{estDays}d left</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal">
      
      {/* 🏰 Top Village Executive Banner */}
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

        {/* Dynamic Village 100% Finish Line Date */}
        <div className="p-3 bg-[#131822] rounded-xl border border-amber-400/30 flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-amber-400" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold">100% COMPLETE MAX PROJECTED DATE</div>
              <div className="text-sm font-bold text-amber-300 font-mono">
                {calculateTargetDate(stats?.estDaysWithFiveBuilders || 0)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-gray-200">~{stats?.estDaysWithFiveBuilders || 0} Days Remaining</div>
            <div className="text-[10px] text-gray-400">With 5 Active Builders (1 Kept Free for Walls / Exception)</div>
          </div>
        </div>

              <div className="text-sm font-semibold text-white font-mono">
                ~{stats?.estDaysWithThreeBuilders || 0} Days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏷️ Filter Pills Bar */}
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
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                  : 'bg-[#18202c] text-[#94a3b8] hover:text-white border-[#273244] hover:bg-[#202938]'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-amber-400' : btn.color || 'text-amber-400/70'} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* ⚡ Section: Quick Wins */}
      {(activeFilter === 'all' || activeFilter === 'quickwins') && quickWins.length > 0 && (
        <div className="coc-card p-4 border-amber-500/30">
          <button
            onClick={() => toggleSection('quickWins')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              <h3 className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">
                ⚡ Quick Wins - Finish These First ({quickWins.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">1-2 levels left</span>
              {openSections.quickWins ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.quickWins && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {quickWins.map(item => renderItemCard(item.name, item.level, item.maxLevel, item.category, item.avgDays))}
            </div>
          )}
        </div>
      )}

      {/* 👑 Section: Main Heroes */}
      {(activeFilter === 'all' || activeFilter === 'heroes') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('heroes')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-amber-400" />
              <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Main Heroes ({mainHeroes.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.heroes ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.heroes && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {mainHeroes.map(h => renderItemCard(h.name, h.level, h.maxLevel, 'heroes', 7))}
            </div>
          )}
        </div>
      )}

      {/* 🛡️ Section: All A-Z Defenses */}
      {(activeFilter === 'all' || activeFilter === 'defenses') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('defenses')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Village Defenses ({COC_ASSETS.defenses.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.defenses ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.defenses && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {COC_ASSETS.defenses.map((def) => {
                const estDays = def.avgDaysPerLvl * 2;
                return (
                  <div
                    key={def.name}
                    onClick={() => onAskAI(`${def.name} defense upgrade panna exact priority and strategy solu.`)}
                    className="bg-[#171e29] hover:bg-[#1e2736] p-3 rounded-xl border border-[#283344] transition cursor-pointer flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#202937] border border-white/10 p-1 flex items-center justify-center shrink-0">
                      <img src={def.img} alt={def.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-100">{def.name}</span>
                        <span className="text-amber-300 font-mono text-[11px]">Max Lvl {def.maxLvl}</span>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{def.desc}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                        <span>Target: <strong className="text-gray-200">{calculateTargetDate(estDays)}</strong></span>
                        <span className="text-amber-400/80 font-mono">Priority P{def.priority} • {def.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 🎯 Section: All A-Z Traps */}
      {(activeFilter === 'all' || activeFilter === 'traps') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('traps')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Crosshair size={18} className="text-orange-400" />
              <h3 className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
                Traps ({COC_ASSETS.traps.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.traps ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.traps && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {COC_ASSETS.traps.map((trap) => (
                <div
                  key={trap.name}
                  onClick={() => onAskAI(`${trap.name} trap upgrade strategy solu.`)}
                  className="bg-[#171e29] hover:bg-[#1e2736] p-3 rounded-xl border border-[#283344] transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#202937] border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img src={trap.img} alt={trap.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-100">{trap.name}</span>
                      <span className="text-amber-300 font-mono text-[11px]">Max Lvl {trap.maxLvl}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{trap.desc}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span>Target: <strong className="text-gray-200">{calculateTargetDate(trap.avgDaysPerLvl * 2)}</strong></span>
                      <span className="text-gray-400 font-mono">Trap</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🏛️ Section: All A-Z Army & Core Buildings */}
      {(activeFilter === 'all' || activeFilter === 'buildings') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('buildings')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Building size={18} className="text-blue-400" />
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Army & Core Buildings ({COC_ASSETS.buildings.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.buildings ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.buildings && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {COC_ASSETS.buildings.map((b) => (
                <div
                  key={b.name}
                  onClick={() => onAskAI(`${b.name} building upgrade value and tips solu.`)}
                  className="bg-[#171e29] hover:bg-[#1e2736] p-3 rounded-xl border border-[#283344] transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#202937] border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img src={b.img} alt={b.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-100">{b.name}</span>
                      <span className="text-amber-300 font-mono text-[11px]">Max Lvl {b.maxLvl}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{b.desc}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span>Target: <strong className="text-gray-200">{calculateTargetDate(b.avgDaysPerLvl * 2)}</strong></span>
                      <span className="text-blue-300 font-mono">P{b.priority} • {b.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 💰 Section: All A-Z Resources & Economy */}
      {(activeFilter === 'all' || activeFilter === 'economy') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('economy')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Coins size={18} className="text-yellow-400" />
              <h3 className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">
                Storages, Collectors & Walls ({COC_ASSETS.economy.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.economy ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.economy && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {COC_ASSETS.economy.map((eco) => (
                <div
                  key={eco.name}
                  onClick={() => onAskAI(`${eco.name} upgrade strategy and priority solu.`)}
                  className="bg-[#171e29] hover:bg-[#1e2736] p-3 rounded-xl border border-[#283344] transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#202937] border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img src={eco.img} alt={eco.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-100">{eco.name}</span>
                      <span className="text-amber-300 font-mono text-[11px]">Max Lvl {eco.maxLvl}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{eco.desc}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span>Target: <strong className="text-gray-200">{calculateTargetDate(eco.avgDaysPerLvl * 2)}</strong></span>
                      <span className="text-amber-300 font-mono">P{eco.priority} • {eco.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🧪 Section: Dark Elixir Troops */}
      {(activeFilter === 'all' || activeFilter === 'dark') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('darkTroops')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Droplet size={18} className="text-purple-400 fill-purple-400" />
              <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Dark Elixir Troops ({darkTroops.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.darkTroops ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.darkTroops && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {darkTroops.map(t => renderItemCard(t.name, t.level, t.maxLevel, 'dark', 14))}
            </div>
          )}
        </div>
      )}

      {/* 🍷 Section: Elixir Troops */}
      {(activeFilter === 'all' || activeFilter === 'elixir') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('elixirTroops')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-pink-400" />
              <h3 className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
                Elixir Army Troops ({elixirTroops.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.elixirTroops ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.elixirTroops && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {elixirTroops.map(t => renderItemCard(t.name, t.level, t.maxLevel, 'elixir', 12))}
            </div>
          )}
        </div>
      )}

      {/* ⚡ Section: Spells */}
      {(activeFilter === 'all' || activeFilter === 'elixir' || activeFilter === 'dark') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('spells')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              <h3 className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">
                Spells ({spells.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.spells ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.spells && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {spells.map(s => renderItemCard(s.name, s.level, s.maxLevel, 'spells', 10))}
            </div>
          )}
        </div>
      )}

      {/* 🔨 Section: Builder Base & BOB */}
      {(activeFilter === 'all' || activeFilter === 'builder') && (
        <div className="coc-card p-4">
          <button
            onClick={() => toggleSection('builderBase')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Hammer size={18} className="text-amber-400" />
              <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Builder Base & 6th Builder Quest
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">Toggle</span>
              {openSections.builderBase ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.builderBase && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              <div className="p-3 bg-[#131822] rounded-xl border border-amber-500/30 text-xs mb-2">
                <span className="font-bold text-amber-300">🔨 6th Builder Quest Target:</span> Battle Machine Level 28/35 (Innum 7 levels to unlock B.O.B!).
                <div className="text-[11px] text-gray-400 mt-1">
                  Target Unlock Date: <strong className="text-white">{calculateTargetDate(35)}</strong> (~35 days remaining)
                </div>
              </div>
              {builderHeroes.map(h => renderItemCard(h.name, h.level, h.maxLevel, 'builder', 5))}
            </div>
          )}
        </div>
      )}

      {/* 🏆 Section: Already Maxed Items */}
      {(activeFilter === 'all' || activeFilter === 'maxed') && (
        <div className="coc-card p-4 border-emerald-500/30">
          <button
            onClick={() => toggleSection('maxed')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                🏆 Already Maxed Items ({maxedItems.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[10px]">100% Finished</span>
              {openSections.maxed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {openSections.maxed && (
            <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
              {maxedItems.map(item => renderItemCard(item.name, item.level, item.maxLevel, item.category, 0))}
            </div>
          )}
        </div>
      )}

      {/* 📜 Legal Disclaimer Footer */}
      <div className="text-center text-[10px] text-gray-500 pt-2 pb-6 px-4 leading-relaxed font-normal">
        This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy: <span className="underline">supercell.com/en/fan-content-policy/</span>.
      </div>

    </div>
  );
}
