import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatView from './components/ChatView';
import MaxTracker from './components/MaxTracker';
import WarClanView from './components/WarClanView';
import EventsView from './components/EventsView';
import { fetchCoCPlayerData, fetchClanData } from './services/cocApi';
import { RefreshCw, Search, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [playerTag, setPlayerTag] = useState(() => {
    return localStorage.getItem('coc_player_tag') || '#L9R2LJ9RG';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputTag, setInputTag] = useState('');
  const [player, setPlayer] = useState(null);
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (tagToFetch = playerTag) => {
    setLoading(true);
    try {
      const p = await fetchCoCPlayerData(tagToFetch);
      setPlayer(p);
      setPlayerTag(tagToFetch);
      localStorage.setItem('coc_player_tag', tagToFetch);
      if (p.clan?.tag) {
        const c = await fetchClanData(p.clan.tag);
        setClan(c);
      }
    } catch (err) {
      console.error(err);
      alert(`Player Tag find panna mudiyala bro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (!inputTag.trim()) return;
    let clean = inputTag.trim().toUpperCase();
    if (!clean.startsWith('#')) clean = '#' + clean;
    loadData(clean);
    setIsSearchOpen(false);
    setInputTag('');
  };

  const handleAskAI = (prompt) => {
    setActiveTab('chat');
  };

  return (
    <div className="bg-[#14171d] text-[#f1f5f9] h-[100dvh] flex flex-col justify-between overflow-hidden">
      
      {/* Authentic CoC Banner Top Header */}
      <header className="h-14 border-b-2 border-[#2b3545] bg-[#1a202c]/95 backdrop-blur px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-sm shadow-md border border-yellow-200">
            ⚔️
          </div>
          <div>
            <h1 className="text-sm font-black coc-font tracking-wider text-amber-300 flex items-center gap-1.5 leading-none">
              <span>{player?.name || 'CHIEF'}</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wide">
              {playerTag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Switch Player Tag Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="px-2.5 py-1.5 rounded-lg bg-[#242c3b] hover:bg-[#2d3748] border border-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1 transition shadow-sm"
          >
            <Search size={13} />
            <span className="hidden sm:inline">Change</span> Tag
          </button>

          {/* Town Hall Badge */}
          <div className="px-2 py-1 rounded-lg bg-gradient-to-b from-blue-600 to-indigo-900 border border-blue-400/50 shadow-inner flex items-center gap-1 text-xs font-black text-white coc-font">
            <span className="text-yellow-300 text-[10px]">TH</span>
            <span>{player?.townHallLevel || 18}</span>
          </div>

          <button
            onClick={() => loadData(playerTag)}
            disabled={loading}
            title="Reload live CoC data"
            className="p-1.5 text-gray-300 hover:text-white rounded-lg bg-[#273142] hover:bg-[#323e52] border border-white/10 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-amber-400' : ''} />
          </button>
        </div>
      </header>

      {/* Floating Tag Search Modal Bar */}
      {isSearchOpen && (
        <div className="bg-[#1b2230] border-b-2 border-amber-500/40 px-4 py-3 z-30 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleTagSubmit} className="max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-amber-400 font-bold text-xs font-mono">#</span>
              <input
                type="text"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                placeholder="Enter Player Tag (e.g. L9R2LJ9RG)"
                autoFocus
                className="w-full bg-[#121620] border border-[#333f54] rounded-xl pl-7 pr-3 py-2 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl coc-btn-gold text-slate-950 font-black text-xs shadow-md"
            >
              Load
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {activeTab === 'chat' && <ChatView player={player} onAskSpecific={handleAskAI} />}
        {activeTab === 'progress' && <MaxTracker player={player} onAskAI={handleAskAI} />}
        {activeTab === 'clan' && <WarClanView player={player} clan={clan} onAskAI={handleAskAI} />}
        {activeTab === 'events' && <EventsView onAskAI={handleAskAI} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
