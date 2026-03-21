'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Zap, Flame, ShoppingBag, Search, ChevronDown, ChevronUp, Image as ImageIcon, Play, Target, PenTool, X, ZoomIn, ZoomOut } from 'lucide-react';

const PLAYMAKERS_DATA = [
  {
    id: 1,
    creatorName: 'Varsity Customs',
    athleteName: 'Trey Quarterback',
    dropTitle: 'The Championship Varsity Collection',
    merchDesc: 'A premium, limited-edition varsity jacket celebrating the back-to-back championship run. Engineered with high-quality wool and genuine leather sleeves. A perfect blend of vintage aesthetics and modern athletic triumph.',
    school: 'State University',
    sport: 'Football',
    event: 'National Championship 2026',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
    capturedContent: 'https://images.unsplash.com/photo-1517436073-3b1b116030ab?q=80&w=800&auto=format&fit=crop', 
    storeLink: '#'
  },
  {
    id: 2,
    creatorName: 'CourtSide Captures',
    athleteName: 'Marcus Elite',
    dropTitle: 'Final Four Graphic Series',
    merchDesc: 'A gritty, streetwear-inspired graphic tee line highlighting the precise buzzer-beater moment that sent the team to the national finals. Printed on heavyweight 100% organic cotton.',
    school: 'UConn',
    sport: 'Basketball',
    event: 'Final Four 2026',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=800&auto=format&fit=crop',
    capturedContent: null,
    storeLink: '#'
  },
  {
    id: 3,
    creatorName: 'Retro Gridiron Hub',
    athleteName: 'Sarah Sprinter',
    dropTitle: 'Gold Medal Gold Rush',
    merchDesc: 'Vintage-styled heavy cotton hoodie honoring Sarah\'s Olympic trials qualifying sprint. Features an oversized drop-shoulder fit and distressed graphic detailing for an authentic 90s aesthetic.',
    school: 'Oregon Track & Field',
    sport: 'Track & Field',
    event: 'Olympic Trials',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
    capturedContent: 'https://images.unsplash.com/photo-1599552375127-142279144365?q=80&w=800&auto=format&fit=crop',
    storeLink: '#'
  }
];

export default function DropsShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [enlargedMedia, setEnlargedMedia] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const filteredPlaymakers = PLAYMAKERS_DATA.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.athleteName.toLowerCase().includes(q) ||
      p.creatorName.toLowerCase().includes(q) ||
      p.school.toLowerCase().includes(q) ||
      p.sport.toLowerCase().includes(q) ||
      p.event.toLowerCase().includes(q) ||
      p.dropTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sb-yellow selection:text-sb-black">
      
      {/* Header Section */}
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sb-yellow/10 via-black to-black" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full font-bold uppercase text-xs tracking-widest text-sb-yellow mb-8 shadow-2xl shadow-sb-yellow/10">
            <Flame className="w-4 h-4" /> Official Public Showcase
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sb-yellow to-yellow-500">Playmakers</span>
          </h1>
          <p className="text-gray-400 font-medium md:text-xl max-w-2xl mx-auto mb-10">
            Broadcasting the most dominant partnerships on the platform. Verify and shop exclusive collaborations between elite Creators and Pro Athletes.
          </p>

          <div className="relative max-w-2xl mx-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search by Athlete, Fan, School, Sport, or Event..." 
               className="w-full bg-[#111] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-600 shadow-xl" 
             />
          </div>
        </div>
      </div>

      {/* List View */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_40px] gap-6 text-xs font-black uppercase tracking-widest text-gray-400 mb-6 px-8 select-none">
           <div className="flex items-center gap-2 text-white">
             <PenTool className="w-4 h-4 text-purple-400" /> Fan
             <span className="text-gray-600">x</span>
             <Zap className="w-4 h-4 text-sb-yellow" /> Athlete
           </div>
           <div>Collab Title</div>
           <div>Program / Sport</div>
           <div>Event</div>
           <div></div>
        </div>

        <div className="space-y-4">
          {filteredPlaymakers.length > 0 ? filteredPlaymakers.map(drop => (
            <div key={drop.id} className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-sb-yellow/30 transition-all shadow-xl group">
              
              {/* Row Banner */}
              <div onClick={() => toggleExpand(drop.id)} className="p-6 md:p-8 flex flex-col md:grid md:grid-cols-[2fr_2fr_1.5fr_1fr_40px] items-start md:items-center gap-6 cursor-pointer relative z-10 hover:bg-white/5 transition-colors">
                 
                 {/* Playmakers */}
                 <div className="flex flex-col gap-1 w-full">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Playmakers</span>
                    <div className="flex items-center gap-2 text-white font-black text-sm md:text-base uppercase tracking-tight truncate">
                       <PenTool className="w-4 h-4 text-purple-400 shrink-0" /> <span className="truncate">{drop.creatorName}</span> <span className="text-gray-600 mx-1 shrink-0">x</span> <Zap className="w-4 h-4 text-sb-yellow shrink-0" /> <span className="truncate">{drop.athleteName}</span>
                    </div>
                 </div>

                 {/* Merch */}
                 <div className="w-full">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Merch</span>
                    <span className="text-gray-300 font-bold tracking-wide">{drop.dropTitle}</span>
                 </div>

                 {/* Program */}
                 <div className="w-full flex md:flex-col gap-2 md:gap-1 items-center md:items-start text-sm font-medium text-gray-400">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-gray-500">Program</span>
                    <span>{drop.school}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white">{drop.sport}</span>
                 </div>

                 {/* Event */}
                 <div className="w-full">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Event</span>
                    <span className="text-gray-400 text-sm font-medium">{drop.event}</span>
                 </div>

                 {/* Expander */}
                 <div className="hidden md:flex justify-end w-full">
                   {expandedId === drop.id ? <ChevronUp className="w-6 h-6 text-sb-yellow" /> : <ChevronDown className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />}
                 </div>
              </div>

              {/* Expanded Payload */}
              {expandedId === drop.id && (
                <div className="p-6 md:p-10 border-t border-white/5 bg-black/40 grid lg:grid-cols-2 gap-12 animate-in slide-in-from-top-2 fade-in duration-300">
                   
                   {/* Left Col: Details & Shop CTA */}
                   <div className="space-y-8 flex flex-col h-full">
                     <div>
                       <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">About this Collaboration</h4>
                       <p className="text-gray-400 leading-relaxed text-sm md:text-base">{drop.merchDesc}</p>
                     </div>

                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-green-400" />
                          <span className="font-bold uppercase text-xs tracking-widest text-white">Verified Authentic IP</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">This product was created via a legally verified NIL agreement specifically structured and tracked on the AthleteConnect Engine.</p>
                     </div>

                     <Link href={drop.storeLink} className="mt-auto w-full bg-sb-yellow hover:bg-yellow-400 text-sb-black transition-all font-black uppercase tracking-widest px-8 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(247,223,2,0.15)] hover:shadow-[0_10px_40px_rgba(247,223,2,0.3)] hover:-translate-y-1">
                        <ShoppingBag className="w-5 h-5" /> Shop Official Collection
                     </Link>
                   </div>

                   {/* Right Col: Media Payload */}
                   <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-sb-yellow flex items-center gap-2">
                           <ImageIcon className="w-4 h-4" /> Official Design
                        </div>
                        <div 
                          onClick={() => { setEnlargedMedia(drop.image); setZoomLevel(1); }}
                          className="bg-black rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl hover:border-white/30 transition-colors relative group cursor-pointer"
                        >
                           <img src={drop.image} alt={drop.dropTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                           </div>
                        </div>
                      </div>
                      
                      {drop.capturedContent && (
                        <div className="space-y-3">
                          <div className="text-[10px] font-black uppercase tracking-widest text-sb-yellow flex items-center gap-2">
                             <Play className="w-4 h-4" /> Source Media
                          </div>
                          <div 
                            onClick={() => { setEnlargedMedia(drop.capturedContent || ''); setZoomLevel(1); }}
                            className="bg-black rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl relative group hover:border-white/30 transition-colors cursor-pointer"
                          >
                             <img src={drop.capturedContent} alt="Captured Event Media" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500" />
                             <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                   <Play className="w-5 h-5 text-white ml-1" />
                                </div>
                             </div>
                             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-6 h-6 text-white drop-shadow-lg" />
                             </div>
                          </div>
                        </div>
                      )}
                   </div>

                </div>
              )}
            </div>
          )) : (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-[#111] border border-white/5 rounded-[2rem]">
               <Target className="w-16 h-16 text-gray-800 mb-6" />
               <h3 className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-2">No Playmakers Found</h3>
               <p className="text-gray-500 font-medium md:text-lg max-w-sm mx-auto">Try adjusting your filters or searching for a different school or program.</p>
            </div>
          )}
        </div>
      </main>

      {/* Media Inspection Lightbox */}
      {enlargedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
           <button 
             onClick={() => { setEnlargedMedia(null); setZoomLevel(1); }} 
             className="absolute md:top-8 md:right-8 top-4 right-4 text-white hover:text-sb-yellow bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors z-10"
           >
             <X className="w-6 h-6" />
           </button>
           
           <div className="absolute bottom-12 flex gap-8 bg-black/50 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 z-10 items-center shadow-2xl">
             <button disabled={zoomLevel <= 0.5} onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))} className="text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors">
               <ZoomOut className="w-6 h-6" />
             </button>
             <span className="text-sb-yellow font-black font-mono text-xs min-w-[3rem] text-center tracking-widest uppercase">
               {Math.round(zoomLevel * 100)}%
             </span>
             <button disabled={zoomLevel >= 3} onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))} className="text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors">
               <ZoomIn className="w-6 h-6" />
             </button>
           </div>
           
           <div className="w-full h-full flex items-center justify-center overflow-auto">
             <img 
               src={enlargedMedia} 
               style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }} 
               className="max-w-5xl max-h-[85vh] object-contain cursor-zoom-in drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
               draggable="false"
               onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
             />
           </div>
        </div>
      )}

    </div>
  );
}
