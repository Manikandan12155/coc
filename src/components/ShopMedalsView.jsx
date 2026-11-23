import React, { useState } from 'react';
import { 
  Coins, Gem, Award, Sparkles, ShoppingBag, ArrowUpRight, 
  AlertTriangle, CheckCircle2, TrendingUp, Info, Zap, Flame, ShieldAlert, Edit2, Check
} from 'lucide-react';

export default function ShopMedalsView({ player }) {
  // Allow user to customize/update their live wallet balance, persisted in localStorage
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('coc_player_wallet');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      gems: 1450,
      raidMedals: 980,
      leagueMedals: 340,
      shinyOre: 12400,
      glowyOre: 780,
      starryOre: 65,
      eventMedals: 2100,
      bookOfHeroes: 1,
      bookOfBuilding: 1,
      hammerOfBuilding: 1,
      builderPotions: 3,
      researchPotions: 3,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempWallet, setTempWallet] = useState(wallet);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSaveWallet = () => {
    setWallet(tempWallet);
    localStorage.setItem('coc_player_wallet', JSON.stringify(tempWallet));
    setIsEditing(false);
  };

  const currencyCards = [
    {
      id: 'league',
      name: 'CWL League Medals',
      balance: wallet.leagueMedals,
      unit: 'Medals',
      icon: '🏅',
      color: 'from-amber-500/20 to-yellow-600/10 border-amber-500/40 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      earnSource: 'Monthly 7-Day Clan War League (1 to 8 stars for 100% rewards)',
      bestBuys: [
        { name: 'Hammer of Building', cost: '120 Medals', note: 'Saves 16 days TH18 Defense (Monolith / Eagle). Tier S Value.', status: 'best' },
        { name: 'Hammer of Fighting', cost: '120 Medals', note: 'Saves 14 days Lab research time.', status: 'best' },
        { name: 'Hammer of Spells', cost: '120 Medals', note: 'Saves 12 days Dark Spell research.', status: 'good' }
      ],
      traps: [
        { name: 'Resource / Builder Potions', note: '120 Medals gives 4 builder potions (36h only). A Hammer gives 384h (10x higher value!).' },
        { name: 'Gold / Elixir Fill', note: 'Never buy resources. Free to raid from regular multiplayer.' }
      ]
    },
    {
      id: 'raid',
      name: 'Raid Medals',
      balance: wallet.raidMedals,
      unit: 'Medals',
      icon: '🎖️',
      color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/40 text-purple-300',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      earnSource: 'Every Raid Weekend (6 attacks Friday to Monday = ~1,200 to 1,500+ Medals)',
      bestBuys: [
        { name: '3x Research Potions', cost: '600 Medals (200 ea)', note: 'Shaves off 72 hours (3 days) of Lab research every week!', status: 'best' },
        { name: '3x Pet Potions', cost: '375 Medals (125 ea)', note: 'Shaves off 72 hours of Pet House upgrade time.', status: 'best' },
        { name: 'Glowy / Starry Ores', cost: 'Variable', note: 'Crucial when Blacksmith equipment bottleneck occurs.', status: 'good' }
      ],
      traps: [
        { name: 'Standard Gold & Elixir', note: 'Worst conversion. Farm loot in multiplayer instead of burning Raid Medals.' },
        { name: 'Clock Tower Potions', note: 'Low value unless rushing 6th Builder B.O.B.' }
      ]
    },
    {
      id: 'gems',
      name: 'Gems',
      balance: wallet.gems,
      unit: 'Gems',
      icon: '💎',
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      earnSource: 'Obstacle clearing, Gem Mine, 54 In-game Achievements, Events',
      bestBuys: [
        { name: 'Missing Epic Equipment', cost: '1,500 Gems', note: 'Giant Gauntlet, Frozen Arrow, Fireball, Spiky Ball (Trader Shop).', status: 'best' },
        { name: 'Weekly Book of Heroes', cost: '500 Gems', note: 'Trader Shop Book of Heroes (Skip 8-day high level Hero sleep).', status: 'best' },
        { name: 'Goblin Builder Event', cost: '40 Gems/day', note: 'Extra 7th Builder during seasonal events.', status: 'good' }
      ],
      traps: [
        { name: 'Speeding up Army Training', note: 'Use Training Potions from Raid shop instead of direct Gems.' },
        { name: 'Buying Village Resources', note: 'Absolute waste of Gems.' }
      ]
    },
    {
      id: 'ores',
      name: 'Hero Ores (Shiny / Glowy / Starry)',
      balance: `${wallet.shinyOre} 🟣 / ${wallet.glowyOre} 🔵 / ${wallet.starryOre} ⭐`,
      unit: 'Ores',
      icon: '✨',
      color: 'from-blue-500/20 to-cyan-600/10 border-blue-500/40 text-cyan-300',
      badgeColor: 'bg-blue-500/20 text-cyan-300 border-blue-500/30',
      earnSource: 'Daily 4-Star Bonus + Clan War / CWL Wins (Starry Ore ONLY from Wars & CWL)',
      bestBuys: [
        { name: 'Giant Gauntlet (King)', cost: 'High Priority', note: 'Immunity + Area Splash damage (God tier).', status: 'best' },
        { name: 'Frozen Arrow (Queen)', cost: 'High Priority', note: 'Slows down defenses & enemy heroes on Queen Charge.', status: 'best' },
        { name: 'Eternal Tome (Warden)', cost: 'Max Lv 18', note: '100% invulnerability for 9.5s for whole army.', status: 'best' }
      ],
      traps: [
        { name: 'Spreading Ores Thinly', note: 'Do not upgrade 10 common equipment together. Max core 2 equipment per hero first.' }
      ]
    },
    {
      id: 'events',
      name: 'Temporary Event Medals (Seasonal / Mini-Pass)',
      balance: wallet.eventMedals,
      unit: 'Event Medals',
      icon: '🎟️',
      color: 'from-fuchsia-500/20 to-pink-600/10 border-fuchsia-500/40 text-fuchsia-300',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      earnSource: 'Destroying boosted Event Buildings in Multiplayer during monthly Supercell Event',
      bestBuys: [
        { name: 'Brand New Epic Equipment', cost: '3,100 Event Medals', note: 'First priority! If missed, it costs 1,500 Gems 1 year later in Trader.', status: 'best' },
        { name: 'Book of Everything / Ores', cost: 'Remaining Medals', note: 'Instant upgrade for any building or Starry Ore boost.', status: 'best' }
      ],
      traps: [
        { name: 'Cosmetic Obstacles / Sceneries First', note: 'Buy Epic Equipment FIRST before cosmetic decorations.' }
      ]
    }
  ];

  const filteredCards = currencyCards.filter(c => {
    if (activeCategory === 'all') return true;
    return c.id === activeCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal">
      
      {/* Executive Wallet Summary Header */}
      <div className="coc-card p-4 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-xl shadow-md border border-yellow-200">
              🛒
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-300 tracking-wide flex items-center gap-2">
                <span>CURRENCY & TRADER SHOP HUB</span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">Live Wallet Balances & High-ROI Spending Rules</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) handleSaveWallet();
              else {
                setTempWallet(wallet);
                setIsEditing(true);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
              isEditing 
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                : 'bg-[#20293a] text-gray-200 hover:text-white border border-white/10'
            }`}
          >
            {isEditing ? <><Check size={14} /> Save Balances</> : <><Edit2 size={13} /> Update Balances</>}
          </button>
        </div>

        {/* Live Wallet Balances Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {/* Gems */}
          <div className="bg-[#121620] p-2.5 rounded-xl border border-emerald-500/30">
            <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <span>💎</span> <span>GEMS</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={tempWallet.gems}
                onChange={e => setTempWallet({ ...tempWallet, gems: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1c2434] border border-emerald-500/40 rounded px-2 py-0.5 mt-1 text-sm text-emerald-300 font-mono font-bold"
              />
            ) : (
              <div className="text-base font-extrabold text-emerald-300 font-mono mt-0.5">
                {wallet.gems.toLocaleString()}
              </div>
            )}
          </div>

          {/* Raid Medals */}
          <div className="bg-[#121620] p-2.5 rounded-xl border border-purple-500/30">
            <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <span>🎖️</span> <span>RAID MEDALS</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={tempWallet.raidMedals}
                onChange={e => setTempWallet({ ...tempWallet, raidMedals: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1c2434] border border-purple-500/40 rounded px-2 py-0.5 mt-1 text-sm text-purple-300 font-mono font-bold"
              />
            ) : (
              <div className="text-base font-extrabold text-purple-300 font-mono mt-0.5">
                {wallet.raidMedals.toLocaleString()}
              </div>
            )}
          </div>

          {/* CWL League Medals */}
          <div className="bg-[#121620] p-2.5 rounded-xl border border-amber-500/30">
            <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <span>🏅</span> <span>CWL MEDALS</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={tempWallet.leagueMedals}
                onChange={e => setTempWallet({ ...tempWallet, leagueMedals: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1c2434] border border-amber-500/40 rounded px-2 py-0.5 mt-1 text-sm text-amber-300 font-mono font-bold"
              />
            ) : (
              <div className="text-base font-extrabold text-amber-300 font-mono mt-0.5">
                {wallet.leagueMedals.toLocaleString()}
              </div>
            )}
          </div>

          {/* Shiny Ore */}
          <div className="bg-[#121620] p-2.5 rounded-xl border border-blue-500/30">
            <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <span>🟣</span> <span>SHINY ORE</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={tempWallet.shinyOre}
                onChange={e => setTempWallet({ ...tempWallet, shinyOre: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1c2434] border border-blue-500/40 rounded px-2 py-0.5 mt-1 text-xs text-blue-300 font-mono font-bold"
              />
            ) : (
              <div className="text-sm font-bold text-blue-300 font-mono mt-0.5">
                {wallet.shinyOre.toLocaleString()}
              </div>
            )}
          </div>

          {/* Glowy Ore */}
          <div className="bg-[#121620] p-2.5 rounded-xl border border-cyan-500/30">
            <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <span>🔵</span> <span>GLOWY ORE</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={tempWallet.glowyOre}
                onChange={e => setTempWallet({ ...tempWallet, glowyOre: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1c2434] border border-cyan-500/40 rounded px-2 py-0.5 mt-1 text-xs text-cyan-300 font-mono font-bold"
              />
            ) : (
              <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                {wallet.glowyOre.toLocaleString()}
              </div>
            )}
          </div>

          {/* Event Medals */}
          <div className="bg-[#121620] p-2.5 rounded-xl border border-fuchsia-500/30">
            <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <span>🎟️</span> <span>EVENT MEDALS</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={tempWallet.eventMedals}
                onChange={e => setTempWallet({ ...tempWallet, eventMedals: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1c2434] border border-fuchsia-500/40 rounded px-2 py-0.5 mt-1 text-sm text-fuchsia-300 font-mono font-bold"
              />
            ) : (
              <div className="text-base font-extrabold text-fuchsia-300 font-mono mt-0.5">
                {wallet.eventMedals.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* ⚡ MAGIC ITEMS VAULT (Instant Upgrade Accelerator) */}
        <div className="mt-3.5 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span>
              <span>Magic Items Vault (Instant Time Reducers)</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">1-Click Skip</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {/* Book of Heroes */}
            <div className="bg-[#161c28] p-2.5 rounded-xl border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1">📖 Hero Book</span>
                  <span className="text-[10px] font-mono font-bold text-gray-300">x{wallet.bookOfHeroes || 1}</span>
                </div>
                <p className="text-[10px] text-gray-400">Instantly finishes any ongoing hero upgrade (-8 days saved).</p>
              </div>
              <button
                onClick={() => {
                  alert('Book of Heroes Used! 8 Hero Days skipped successfully.');
                  setWallet(prev => ({ ...prev, bookOfHeroes: Math.max(0, (prev.bookOfHeroes || 1) - 1) }));
                }}
                className="mt-2 w-full py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded text-[11px] border border-amber-500/40 transition"
              >
                Use (-8 Days)
              </button>
            </div>

            {/* Hammer of Building */}
            <div className="bg-[#161c28] p-2.5 rounded-xl border border-yellow-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-yellow-300 flex items-center gap-1">🔨 Building Hammer</span>
                  <span className="text-[10px] font-mono font-bold text-gray-300">x{wallet.hammerOfBuilding || 1}</span>
                </div>
                <p className="text-[10px] text-gray-400">Free cost + 0 time for TH18 defense (-16 days saved).</p>
              </div>
              <button
                onClick={() => {
                  alert('Hammer of Building Used! 16 Defense Days skipped successfully.');
                  setWallet(prev => ({ ...prev, hammerOfBuilding: Math.max(0, (prev.hammerOfBuilding || 1) - 1) }));
                }}
                className="mt-2 w-full py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold rounded text-[11px] border border-yellow-500/40 transition"
              >
                Use (-16 Days)
              </button>
            </div>

            {/* Builder Potion */}
            <div className="bg-[#161c28] p-2.5 rounded-xl border border-blue-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-300 flex items-center gap-1">🧪 Builder Potion</span>
                  <span className="text-[10px] font-mono font-bold text-gray-300">x{wallet.builderPotions || 3}</span>
                </div>
                <p className="text-[10px] text-gray-400">Boosts all 5 builders 10x for 1 hour (-45 hours saved).</p>
              </div>
              <button
                onClick={() => {
                  alert('Builder Potion Activated! 45 builder hours boosted across all builders.');
                  setWallet(prev => ({ ...prev, builderPotions: Math.max(0, (prev.builderPotions || 3) - 1) }));
                }}
                className="mt-2 w-full py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold rounded text-[11px] border border-blue-500/40 transition"
              >
                Use (-45 Hours)
              </button>
            </div>

            {/* Research Potion */}
            <div className="bg-[#161c28] p-2.5 rounded-xl border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-300 flex items-center gap-1">⚗️ Research Potion</span>
                  <span className="text-[10px] font-mono font-bold text-gray-300">x{wallet.researchPotions || 3}</span>
                </div>
                <p className="text-[10px] text-gray-400">Boosts Lab speed 24x for 1 hour (-23 hours saved in Lab).</p>
              </div>
              <button
                onClick={() => {
                  alert('Research Potion Activated! 23 Lab hours skipped.');
                  setWallet(prev => ({ ...prev, researchPotions: Math.max(0, (prev.researchPotions || 3) - 1) }));
                }}
                className="mt-2 w-full py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold rounded text-[11px] border border-purple-500/40 transition"
              >
                Use (-24h Lab)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll pb-1">
        {[
          { id: 'all', label: 'All Currencies', icon: '🌟' },
          { id: 'league', label: 'CWL Medals', icon: '🏅' },
          { id: 'raid', label: 'Raid Medals', icon: '🎖️' },
          { id: 'gems', label: 'Gems', icon: '💎' },
          { id: 'ores', label: 'Hero Ores', icon: '✨' },
          { id: 'events', label: 'Event Medals', icon: '🎟️' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-[#18202d] text-gray-300 hover:text-white border-[#273244]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Currency Guides Breakdown Cards */}
      <div className="space-y-3">
        {filteredCards.map(c => (
          <div key={c.id} className="coc-card rounded-2xl p-4 space-y-3 border border-white/10 bg-[#161c28]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{c.name}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">How to get: {c.earnSource}</p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold ${c.badgeColor}`}>
                {c.balance} {c.unit}
              </span>
            </div>

            {/* Top Recommended Buys */}
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Highest Value Items (BUY THESE)</span>
              </div>
              <div className="space-y-1.5">
                {c.bestBuys.map((b, idx) => (
                  <div key={idx} className="bg-[#121620] p-2 rounded-lg border border-emerald-500/20 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-semibold text-gray-100 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{b.name}</span>
                        {b.cost && <span className="text-[10px] bg-white/5 text-gray-300 px-1.5 py-0.2 rounded font-mono">{b.cost}</span>}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{b.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoided Trap Items */}
            {c.traps && (
              <div>
                <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle size={13} />
                  <span>Traps & Wasteful Items (DON'T BUY)</span>
                </div>
                <div className="space-y-1.5">
                  {c.traps.map((t, idx) => (
                    <div key={idx} className="bg-[#18151f] p-2 rounded-lg border border-red-500/20 flex items-start justify-between text-xs">
                      <div>
                        <div className="font-semibold text-red-300 flex items-center gap-1.5">
                          <span className="text-red-400 font-bold">✕</span>
                          <span>{t.name}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">{t.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

