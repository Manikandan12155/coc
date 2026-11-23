import React from 'react';
import { Shield, Sparkles, Heart, ShoppingBag, Swords, Newspaper } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'progress', label: 'Village', icon: Shield },
    { id: 'lab', label: 'Lab', icon: Sparkles },
    { id: 'pets', label: 'Pets', icon: Heart },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'war', label: 'War', icon: Swords },
    { id: 'updates', label: 'Updates', icon: Newspaper, isNew: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#171b24]/95 backdrop-blur-md border-t-2 border-[#2f394a] px-1 sm:px-2 py-1 max-w-md mx-auto sm:max-w-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#facc15] font-bold scale-105'
                  : 'text-[#8b98ad] hover:text-[#cbd5e1]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition relative ${
                  isActive
                    ? 'bg-[#facc15]/15 border border-[#facc15]/40 shadow-sm'
                    : ''
                }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.isNew && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span className="text-[9.5px] sm:text-[10px] mt-0.5 font-semibold tracking-wide uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
