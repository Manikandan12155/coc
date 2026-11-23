import React from 'react';
import { Shield, Sparkles, Heart, ShoppingBag, Swords } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'progress', label: 'Village', icon: Shield },
    { id: 'lab', label: 'Laboratory', icon: Sparkles },
    { id: 'pets', label: 'Hero Pets', icon: Heart },
    { id: 'shop', label: 'Shop & Medals', icon: ShoppingBag },
    { id: 'war', label: 'War & Events', icon: Swords },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#171b24]/95 backdrop-blur-md border-t-2 border-[#2f394a] px-2 py-1.5 max-w-md mx-auto sm:max-w-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#facc15] font-bold scale-105'
                  : 'text-[#8b98ad] hover:text-[#cbd5e1]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  isActive
                    ? 'bg-[#facc15]/15 border border-[#facc15]/40 shadow-sm'
                    : ''
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-semibold tracking-wide uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
