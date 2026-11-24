import React, { useState } from 'react';
import { 
  X, Sparkles, Crown, Hammer, FlaskConical, Heart, ShieldAlert, 
  CheckCircle2, AlertTriangle, Flame, ArrowRight, Zap, Target, BookOpen
} from 'lucide-react';

export default function TH18StrategyModal({ isOpen, onClose, player }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('overview'); // overview | buildings | lab | pets | heroes

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="w-full max-w-2xl bg-[#0e131d] border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#171f2e] via-[#20293d] to-[#171f2e] p-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#0e131d] rounded-2xl flex items-center justify-center text-2xl">
                🏰
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  TH {player?.townHallLevel || 18} Master Strategy Guide
                </h2>
                <span className="text-[10px] bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-black font-mono">
                  PRO META
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Next Upgrades Roadmap, Lab Priorities, Pet Ordering & Hero Decisions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#0a0d14] border-b border-white/5 overflow-x-auto custom-scroll shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: Zap },
            { id: 'buildings', label: '1. Buildings', icon: Hammer },
            { id: 'lab', label: '2. Lab & Spells', icon: FlaskConical },
            { id: 'pets', label: '3. Pets Priority', icon: Heart },
            { id: 'heroes', label: '4. Hero Decisions', icon: Crown },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4 text-xs text-gray-200">
          
          {/* ==================== 1. OVERVIEW ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Executive Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#151b27] to-[#151b27] border border-amber-500/30 space-y-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
                  Town Hall {player?.townHallLevel || 18} Core Golden Rule
                </span>
                <h3 className="text-sm font-black text-white">
                  "Offense First, Key Defenses Second, Never Sleep On Equipment"
                </h3>
                <p className="text-gray-300 leading-relaxed text-[11.5px]">
                  TH18-la namma main goal: War-la easy-ah 3-star edukka mudiyanum, at the same time defense-la opponent 2-star-oda thadukanum. Athukku keela irukra 4 pillars-ai correct sequence-la upgrade panna, time & resources 50% save aagum!
                </p>
              </div>

              {/* 4 Pillars Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setActiveTab('buildings')}
                  className="p-3 bg-[#131924] rounded-2xl border border-white/5 hover:border-amber-400/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Hammer size={14} /> Next Building To Put
                    </span>
                    <ArrowRight size={13} className="text-gray-500 group-hover:text-amber-400 transition" />
                  </div>
                  <div className="font-bold text-white text-xs">Monolith Lvl 3 & Merged Defenses</div>
                  <p className="text-[10.5px] text-gray-400 mt-1">
                    Clan Castle & Monolith tanks-ai melt pannum. Merged cannons give massive DPS.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('lab')}
                  className="p-3 bg-[#131924] rounded-2xl border border-white/5 hover:border-amber-400/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-blue-400 font-bold flex items-center gap-1.5">
                      <FlaskConical size={14} /> Next Lab Troop/Spell
                    </span>
                    <ArrowRight size={13} className="text-gray-500 group-hover:text-blue-400 transition" />
                  </div>
                  <div className="font-bold text-white text-xs">Root Rider & Overgrowth Spell</div>
                  <p className="text-[10.5px] text-gray-400 mt-1">
                    Meta ground attack backbone. Overgrowth freezes town hall giga weapons.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('pets')}
                  className="p-3 bg-[#131924] rounded-2xl border border-white/5 hover:border-amber-400/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-purple-400 font-bold flex items-center gap-1.5">
                      <Heart size={14} /> Next Pet To Max
                    </span>
                    <ArrowRight size={13} className="text-gray-500 group-hover:text-purple-400 transition" />
                  </div>
                  <div className="font-bold text-white text-xs">Spirit Fox (Must reach Lvl 10)</div>
                  <p className="text-[10.5px] text-gray-400 mt-1">
                    Royal Champion-ku invisible cloaking tharum. L.A.S.S.I-ai upgrade panna koodadhu!
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('heroes')}
                  className="p-3 bg-[#131924] rounded-2xl border border-white/5 hover:border-amber-400/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Crown size={14} /> Hero Max: Podalama Venama?
                    </span>
                    <ArrowRight size={13} className="text-gray-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <div className="font-bold text-white text-xs">Off-Season Only with Book of Heroes</div>
                  <p className="text-[10.5px] text-gray-400 mt-1">
                    CWL-la hero sleep aaga koodadhu! Ore equipment (Gauntlet) hero level-ai vida powerful.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ==================== 2. BUILDINGS ROADMAP ==================== */}
          {activeTab === 'buildings' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-medium">
                💡 <strong>Day 1 Rule:</strong> Town Hall upgrade aana udaney Clan Castle & Blacksmith-ai instant-ah Book of Building vechu mudikanum!
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#131924] rounded-xl border border-amber-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-1">
                    <span>Priority 1: Core High-Value Defenses</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Highest Defense ROI</span>
                  </div>
                  <ul className="space-y-1.5 text-[11.5px] text-gray-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Monolith (Level 3):</strong> Tank units-kku percentage damage kudukum. Root Rider & Golems-ai instant-ah clear pannum.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Ricochet Cannons & Multi-Archer Towers:</strong> 2 regular defenses-ai vida double damage & multiple targets hit pannum.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Scattershots (Level 5):</strong> Heavy splash damage — grouped troops and hero support troops-ai wipeout pannum.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-300 mb-1">
                    <span>Priority 2: Air Defenses & Key Traps</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Anti-Electro / Anti-Blimp</span>
                  </div>
                  <ul className="space-y-1.5 text-[11.5px] text-gray-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-blue-400 mt-0.5 shrink-0" />
                      <span><strong>Air Defenses & Air Sweepers:</strong> Dragons, E-Drags mattrum Battle Blimps-ai core reach aagura munna stop pannum.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-blue-400 mt-0.5 shrink-0" />
                      <span><strong>Tornado Trap (Max Lvl 3):</strong> War-la 1-star vs 3-star decide panradhu Tornado trap thaan!</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-red-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-red-300 mb-1">
                    <span>Priority 3: Point Defenses (Last Priority)</span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Do These Later</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Mortars, Single Cannons, mattrum Regular Archer Towers-kku builders spend panna vendam. Core defenses mudinjathukku aprom podunga.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. LAB & SPELLS ==================== */}
          {activeTab === 'lab' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[11px] text-blue-300 font-medium">
                🧪 <strong>Lab Secret:</strong> Weekly Trader shop-la 3x Research Potions (200 Raid Medals each) compulsory vangunga — ithu 9 days lab time-ai orey naalil reduce pannum!
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#131924] rounded-xl border border-blue-500/30">
                  <div className="text-xs font-bold text-blue-300 mb-1">Top Troops to Put in Lab First:</div>
                  <ul className="space-y-1.5 text-[11.5px] text-gray-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold font-mono">1.</span>
                      <span><strong>Root Rider:</strong> Present meta-la undisputed #1 ground troop. High HP + wall crushing capability.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold font-mono">2.</span>
                      <span><strong>Electro Titan:</strong> Ground aura surrounding skeletons and clan castle troops-ai melt pannum.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold font-mono">3.</span>
                      <span><strong>Apprentice Warden:</strong> Barbarian King & Queen-kku +28% HP aura buff tharum.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold font-mono">4.</span>
                      <span><strong>Healer:</strong> Queen Charge / Warden Walk consistency-kku level max pannanum.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-purple-500/30">
                  <div className="text-xs font-bold text-purple-300 mb-1">Top Spells Priority:</div>
                  <ul className="space-y-1.5 text-[11.5px] text-gray-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-purple-400 mt-0.5 shrink-0" />
                      <span><strong>Overgrowth Spell:</strong> Core base / Town Hall Giga weapon-ai 28 seconds freeze panni safe path create pannum.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-purple-400 mt-0.5 shrink-0" />
                      <span><strong>Rage Spell & Freeze Spell:</strong> Hero abilities and Siege blimps-kku compulsory maxed level thevai.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. PETS PRIORITY ==================== */}
          {activeTab === 'pets' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-[11px] text-purple-300 font-medium">
                🐾 <strong>Pet House Order:</strong> 10 Pets irundhaalum, just 4 meta pets-ai mattum max panna unga 4 main heroes unkillable aagiduvaanga!
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-[#131924] rounded-xl border border-amber-500/30 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold font-mono shrink-0">
                    #1
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Spirit Fox</span>
                      <span className="text-[9px] bg-red-600/30 text-red-300 px-1.5 py-0.2 rounded font-bold">MUST MAX FIRST</span>
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      <strong>Best Hero Pair:</strong> Royal Champion. Every few seconds RC-ai invisible pannum. Single-Inferno & Monolith direct attack-la irundhu RC 100% thappikkum!
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-white/10 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold font-mono shrink-0">
                    #2
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Diggy (Level 10)</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      <strong>Best Hero Pair:</strong> Grand Warden or Barbarian King. Defenses-ai stun panni heroes-ai direct damage-la irundhu protect pannum.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-white/10 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold font-mono shrink-0">
                    #3
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Phoenix (Level 10)</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      <strong>Best Hero Pair:</strong> Barbarian King. King die aana udaney rebirth aagi 8 seconds invulnerability tharum!
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-white/10 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center justify-center font-bold font-mono shrink-0">
                    #4
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Unicorn (Level 10)</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      <strong>Best Hero Pair:</strong> Archer Queen. Continuous ground healing support for Queen Charge attacks.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-red-950/30 border border-red-500/20 rounded-xl text-[10.5px] text-red-300">
                  ⛔ <strong>Pets to Avoid for Now:</strong> L.A.S.S.I, Poison Lizard, and Electro Owl-kku Dark Elixir waste panna vendam. First mela sonna 4 pets-ai Lvl 10 aakunga.
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. HEROES MAX: PODALAMA VENAMA? ==================== */}
          {activeTab === 'heroes' && (
            <div className="space-y-3">
              
              {/* The Million Dollar Answer Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#131a26] to-[#131a26] border border-emerald-500/40 space-y-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                  The Official Verdict
                </span>
                <h3 className="text-sm font-black text-white">
                  "Heroes-ai Max Podalama Venama? Eppo Podanum?"
                </h3>
                <p className="text-gray-300 leading-relaxed text-[11.5px]">
                  <strong>DIRECT ANSWER:</strong> Heroes-ai raw builder pottu 7 days sleep panna vidaatha bro! Clan War League (CWL)-la ungaloda 4 heroes illa na unga clan war score drop aagidum.
                </p>
              </div>

              {/* Actionable Rules */}
              <div className="space-y-2.5">
                <div className="p-3 bg-[#131924] rounded-xl border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-400" />
                    <span>Rule 1: Use Book of Heroes Only (Instant Finish)</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Dark Elixir storage full aana udaney, <strong>Book of Heroes</strong> (Trader shop 500 gems or Silver Pass reward) vechu instant-ah upgrade click panni 0 seconds-la mudinga. Zero war downtime!
                  </p>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-blue-500/30">
                  <div className="text-xs font-bold text-blue-300 mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-blue-400" />
                    <span>Rule 2: Equipment Level &gt; Hero Base Level</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Clash of Clans meta-la King level 90-la irundhalum, avanoda <strong>Giant Gauntlet (Epic) Level 18</strong> and <strong>Spiky Ball</strong> irundha 100-level king-oda adhigama damage kodupaan! Shiny & Glowy Ores-ai hero equipments-kku invest pannunga.
                  </p>
                </div>

                <div className="p-3 bg-[#131924] rounded-xl border border-red-500/30">
                  <div className="text-xs font-bold text-red-300 mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={13} className="text-red-400" />
                    <span>Rule 3: CWL Week (1st to 10th) Strict Lockdown</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Month-oda first 10 days CWL nadakkumbodhu oru single hero kooda upgrade-la irukka koodadhu. CWL mudinjathum (11th to 21st) mattum dark elixir overflow aana heroes podalaam.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Close Bar */}
        <div className="p-3 bg-[#0a0d14] border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-gray-400">
            Click anywhere or Close to return to village
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-yellow-300 active:scale-95 transition shadow-md"
          >
            Got It! Close Guide
          </button>
        </div>

      </div>

    </div>
  );
}
