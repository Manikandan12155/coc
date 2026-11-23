import React, { useState } from 'react';
import { 
  Sparkles, Newspaper, Play, Video, Calendar, Clock, BookOpen, 
  ChevronRight, ExternalLink, Flame, Shield, ArrowLeft, Share2, Tag, CheckCircle2, Filter
} from 'lucide-react';
import blogsData from '../data/cocOfficialBlogs.json';
import mediaData from '../data/cocOfficialMedia.json';

export default function UpdatesView() {
  const [activeSubTab, setActiveSubTab] = useState('blogs'); // 'blogs' | 'videos' | 'shorts'
  const [timeFilter, setTimeFilter] = useState('14'); // '14' (2 Weeks) | '30' (This Month) | 'all' (All)
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter media based on time selection
  const filteredByTimeMedia = (mediaData || []).filter(item => {
    if (timeFilter === '14') return item.daysAgo <= 14;
    if (timeFilter === '30') return item.daysAgo <= 30;
    return true;
  });

  const videosOnly = filteredByTimeMedia.filter(item => item.type === 'video');
  const shortsOnly = filteredByTimeMedia.filter(item => item.type === 'short');

  const categories = ['All', 'Major Update', 'Strategy & Guide', 'Esports & Worlds', 'Skins & Scenery'];

  const filteredBlogs = blogsData.filter(blog => {
    if (selectedCategory === 'All') return true;
    return blog.category === selectedCategory;
  });

  // Handle detailed blog article view
  if (selectedBlog) {
    return (
      <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedBlog(null)}
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-[#191f2b] border border-[#2e394c] px-3 py-1.5 rounded-xl hover:bg-[#232c3d] transition"
        >
          <ArrowLeft size={14} /> Back to Updates
        </button>

        <article className="coc-card rounded-2xl overflow-hidden border border-amber-500/30">
          {/* Article Banner Header */}
          <div className="relative aspect-video w-full bg-slate-900">
            <img 
              src={selectedBlog.banner} 
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/50 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 space-y-1.5">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${selectedBlog.badgeColor}`}>
                {selectedBlog.category}
              </span>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                {selectedBlog.title}
              </h1>
            </div>
          </div>

          {/* Article Meta Bar */}
          <div className="p-4 space-y-4 text-xs text-gray-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-300">{selectedBlog.author}</span>
                <span>•</span>
                <span>{selectedBlog.timeAgo}</span>
              </div>
              <span className="flex items-center gap-1 font-mono text-gray-400">
                <Clock size={12} /> {selectedBlog.readTime}
              </span>
            </div>

            <p className="text-xs text-amber-200/90 italic font-medium leading-relaxed bg-[#10141d] p-3 rounded-xl border border-white/5">
              "{selectedBlog.subtitle}"
            </p>

            {/* Embedded video preview if available */}
            {selectedBlog.videoId && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#2e394c] bg-black my-3">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedBlog.videoId}?rel=0`}
                  title={selectedBlog.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            )}

            {/* Article Body Content */}
            <div className="space-y-3 leading-relaxed text-gray-200 text-xs">
              {selectedBlog.content.map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-sm font-bold text-amber-300 mt-4 mb-1 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-[11.5px] leading-snug">{paragraph.replace('- ', '')}</span>
                    </div>
                  );
                }
                return <p key={idx} className="text-[12px] text-gray-300">{paragraph}</p>;
              })}
            </div>

            {/* Article Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
              {selectedBlog.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] bg-[#1a212e] text-gray-300 border border-[#2e394c] px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Tag size={10} className="text-amber-400" /> {t}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scroll px-3 sm:px-4 py-4 pb-28 max-w-2xl mx-auto w-full space-y-4 font-normal">
      
      {/* Top Newsroom Header */}
      <div className="coc-card rounded-2xl p-4 bg-gradient-to-r from-[#171d29] via-[#1a2233] to-[#171d29] border border-amber-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Newspaper size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span>Official Clash News & Blogs</span>
                <span className="text-[9px] bg-red-600/30 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                  LIVE
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">Authentic Supercell updates, sneak peeks & videos</p>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation (Blogs, Videos, Shorts) */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <button
            onClick={() => setActiveSubTab('blogs')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'blogs'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'bg-[#121620] text-gray-400 hover:text-white border border-[#2e394c]'
            }`}
          >
            <BookOpen size={13} />
            <span>Articles</span>
          </button>
          <button
            onClick={() => setActiveSubTab('videos')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'videos'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'bg-[#121620] text-gray-400 hover:text-white border border-[#2e394c]'
            }`}
          >
            <Video size={13} className="text-red-400" />
            <span>Videos ({videosOnly.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('shorts')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'shorts'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'bg-[#121620] text-gray-400 hover:text-white border border-[#2e394c]'
            }`}
          >
            <Flame size={13} className="text-orange-400" />
            <span>Shorts ({shortsOnly.length})</span>
          </button>
        </div>
      </div>

      {/* ===================== TIME FILTER BAR (For Videos & Shorts) ===================== */}
      {(activeSubTab === 'videos' || activeSubTab === 'shorts') && (
        <div className="flex items-center justify-between bg-[#141923] p-2 rounded-xl border border-[#263143] text-xs">
          <div className="flex items-center gap-1.5 text-gray-300 font-semibold text-[11px]">
            <Clock size={13} className="text-amber-400" />
            <span>Time Range:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTimeFilter('14')}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition ${
                timeFilter === '14'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-[#1a212e] text-gray-400 hover:text-white border border-[#2e394c]'
              }`}
            >
              🔥 2 Weeks (Fresh)
            </button>
            <button
              onClick={() => setTimeFilter('30')}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition ${
                timeFilter === '30'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-[#1a212e] text-gray-400 hover:text-white border border-[#2e394c]'
              }`}
            >
              📅 30 Days (Season)
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition ${
                timeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-[#1a212e] text-gray-400 hover:text-white border border-[#2e394c]'
              }`}
            >
              All
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 1: BLOGS & ARTICLES ===================== */}
      {activeSubTab === 'blogs' && (
        <div className="space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition border ${
                  selectedCategory === c
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400 font-bold'
                    : 'bg-[#191f2b] text-gray-400 border-[#2e394c] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured Hero Blog Card */}
          {filteredBlogs.find(b => b.isFeatured) && selectedCategory === 'All' && (
            <div 
              onClick={() => setSelectedBlog(filteredBlogs.find(b => b.isFeatured))}
              className="coc-card rounded-2xl overflow-hidden cursor-pointer group border border-amber-500/40 hover:border-amber-400 transition-all duration-300 shadow-xl"
            >
              <div className="relative aspect-video w-full bg-slate-900">
                <img 
                  src={filteredBlogs.find(b => b.isFeatured).banner} 
                  alt="Featured blog"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                  ★ Featured Story
                </div>
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    {filteredBlogs.find(b => b.isFeatured).category} • {filteredBlogs.find(b => b.isFeatured).timeAgo}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition leading-snug">
                    {filteredBlogs.find(b => b.isFeatured).title}
                  </h3>
                </div>
              </div>
              <div className="p-3 bg-[#171d29] flex items-center justify-between text-xs text-gray-400 border-t border-white/5">
                <p className="line-clamp-1 text-[11px] text-gray-300">{filteredBlogs.find(b => b.isFeatured).subtitle}</p>
                <span className="text-amber-400 font-bold text-[11px] shrink-0 flex items-center gap-0.5 ml-2">
                  Read Article <ChevronRight size={13} />
                </span>
              </div>
            </div>
          )}

          {/* Grid of Other Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredBlogs.filter(b => selectedCategory !== 'All' || !b.isFeatured).map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBlog(b)}
                className="coc-card rounded-xl overflow-hidden cursor-pointer group border border-[#2e394c] hover:border-amber-400/60 transition flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-900">
                  <img 
                    src={b.banner} 
                    alt={b.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${b.badgeColor}`}>
                      {b.category}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                      <span>{b.author}</span>
                      <span>•</span>
                      <span className="font-mono text-amber-400">{b.timeAgo}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                      {b.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={11} /> {b.readTime}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      Read <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ===================== TAB 2: VIDEOS ONLY ===================== */}
      {activeSubTab === 'videos' && (
        <div className="space-y-3">
          {/* Active Video Player */}
          {selectedVideo && selectedVideo.type === 'video' && (
            <div className="p-3 bg-[#121620] rounded-xl border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 truncate max-w-[85%] flex items-center gap-1.5">
                  <Play size={12} className="fill-amber-400 text-amber-400" />
                  {selectedVideo.title}
                </span>
                <button onClick={() => setSelectedVideo(null)} className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/5">
                  Close
                </button>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-[#2e394c] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videosOnly.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVideo(v)}
                className="coc-card rounded-xl overflow-hidden cursor-pointer group border border-[#2e394c] hover:border-amber-400/60 transition"
              >
                <div className="relative aspect-video w-full bg-slate-900">
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                    <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play size={16} className="fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] px-1.5 py-0.5 rounded text-white font-mono">
                    {v.timeAgo}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {v.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                    <span className="text-amber-400 font-mono">Clash of Clans Official</span>
                    <span className="text-gray-500">{v.daysAgo} days ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: SHORTS ONLY ===================== */}
      {activeSubTab === 'shorts' && (
        <div className="space-y-3">
          {/* Active Short Player */}
          {selectedVideo && selectedVideo.type === 'short' && (
            <div className="p-3 bg-[#121620] rounded-xl border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 truncate max-w-[85%] flex items-center gap-1.5">
                  <Play size={12} className="fill-amber-400 text-amber-400" />
                  {selectedVideo.title}
                </span>
                <button onClick={() => setSelectedVideo(null)} className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/5">
                  Close
                </button>
              </div>
              <div className="relative aspect-[9/16] max-w-xs mx-auto rounded-xl overflow-hidden border border-[#2e394c] bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {shortsOnly.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedVideo(s)}
                className="coc-card rounded-xl overflow-hidden cursor-pointer group border border-[#2e394c] hover:border-amber-400/60 transition flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full bg-slate-900">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Flame size={14} className="fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1.5 py-0.5 rounded text-white font-mono">
                    ⚡ Short
                  </div>
                </div>
                <div className="p-2 flex-1 flex flex-col justify-between">
                  <h4 className="text-[11px] font-medium text-gray-200 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {s.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 pt-1 border-t border-white/5">
                    <span className="text-amber-400 font-mono">{s.timeAgo}</span>
                    <span className="text-gray-500">Official</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
