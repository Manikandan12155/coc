import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatView from './components/ChatView';
import MaxTracker from './components/MaxTracker';
import WarClanView from './components/WarClanView';
import EventsView from './components/EventsView';
import { fetchCoCPlayerData, fetchClanData } from './services/cocApi';
import { RefreshCw, Shield, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [player, setPlayer] = useState(null);
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await fetchCoCPlayerData();
      setPlayer(p);
      if (p.clan?.tag) {
        const c = await fetchClanData(p.clan.tag);
        setClan(c);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAskAI = (prompt) => {
    setActiveTab('chat');
  };

  return (
    <div className="bg-[#14171d] text-[#f1f5f9] h-[100dvh] flex flex-col justify-between overflow-hidden">
      
      {/* Authentic CoC Banner Top Header */}
      <header className="h-14 border-b-2 border-[#2b3545] bg-[#1a202c]/95 backdrop-blur px-4 flex items-center justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-sm shadow-md border border-yellow-200">
            ⚔️
          </div>
          <div>
            <h1 className="text-sm font-black coc-font tracking-wider text-amber-300 flex items-center gap-1.5 leading-none">
              <span>{player?.name || 'CHIEF'}</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wide">
              {player?.clan?.name || 'Clash of Clans'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Town Hall Badge */}
          <div className="px-2.5 py-1 rounded-lg bg-gradient-to-b from-blue-600 to-indigo-900 border border-blue-400/50 shadow-inner flex items-center gap-1 text-xs font-black text-white coc-font">
            <span className="text-yellow-300 text-[11px]">TH</span>
            <span>{player?.townHallLevel || 18}</span>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            title="Reload live CoC data"
            className="p-2 text-gray-300 hover:text-white rounded-lg bg-[#273142] hover:bg-[#323e52] border border-white/10 transition"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-amber-400' : ''} />
          </button>
        </div>
      </header>

      {/* Main Screen Content - Flex 1 and proper scroll isolation */}
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
