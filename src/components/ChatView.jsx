import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { ArrowUp, Sparkles, Swords } from 'lucide-react';
import { askAI } from '../services/aiService';

export default function ChatView({ player, onAskSpecific }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
  };

  const handleSend = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const newMsgs = [...messages, { role: 'user', content: prompt }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const reply = await askAI(prompt, player, newMsgs);
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: `⚠️ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPills = [
    "👑 Hero upgrade priority enna?",
    "🔨 Fast-ah max panna next enna pannanum?",
    "💰 Best loot farm army comp solu",
    "🛡️ 6th Builder speed up panna tip kudu"
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto pt-6 pb-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 border-2 border-yellow-200 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
              ⚔️
            </div>
            <div>
              <h2 className="text-base font-extrabold text-amber-300 coc-font">VILLAGE STRATEGIST</h2>
              <p className="text-xs text-[#94a3b8] mt-1 font-medium">
                Live Analysis for <strong>{player?.name || 'Chief'}</strong> (TH{player?.townHallLevel || 18})
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              {quickPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(pill)}
                  className="text-left px-3.5 py-2.5 rounded-xl bg-[#242c3a] hover:bg-[#2d3748] border border-[#3b475c] text-xs text-slate-200 font-medium transition shadow-sm"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto w-full pb-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {m.role === 'user' ? (
                  <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] text-[13.5px] leading-relaxed break-words shadow-md border border-yellow-200/50">
                    {m.content}
                  </div>
                ) : (
                  <div className="w-full bg-[#1e2533] border border-[#323d4f] rounded-2xl p-4 shadow-md">
                    <div
                      className="text-[#e2e8f0] text-[14px] leading-relaxed prose break-words"
                      dangerouslySetInnerHTML={{ __html: marked.parse(m.content) }}
                    />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 py-2 text-amber-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2">Chief, consulting the grand builders...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* Bottom Floating Bar */}
      <div className="p-3 pb-20 max-w-2xl mx-auto w-full shrink-0">
        <div className="relative bg-[#1c2330] border-2 border-[#333f54] rounded-2xl p-1.5 pl-4 flex items-end shadow-xl focus-within:border-amber-400/80 transition">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask village strategy, hero upgrades..."
            className="w-full bg-transparent text-sm text-white placeholder-[#64748b] focus:outline-none py-2 pr-2 max-h-28 custom-scroll leading-relaxed resize-none font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl coc-btn-gold text-slate-950 font-black flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition mb-0.5"
          >
            <ArrowUp size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
