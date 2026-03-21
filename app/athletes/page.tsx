'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Search, Shield, MapPin, Zap, Flame, Frown, Award, Star, PenTool, CheckCircle, Image as ImageIcon, HardDrive, Share2, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Hardcoded Dummy Athletes for Buildathon UX Testing
const athletes = [
  {
    id: 1,
    name: 'Marcus Elite',
    team: 'State University',
    sport: 'SF • Basketball',
    location: 'Los Angeles, CA',
    minRate: 500,
    tags: ['Sneakerhead', 'Streetwear', 'High Engagement'],
    avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Sarah Sprinter',
    team: 'National Track Club',
    sport: '100m • Track',
    location: 'Austin, TX',
    minRate: 250,
    tags: ['Fitness Apparell', 'Nutrition', 'Olympian'],
    avatar: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Trey Quarterback',
    team: 'Southern Tech',
    sport: 'QB • Football',
    location: 'Atlanta, GA',
    minRate: 1500,
    tags: ['Varsity Jackets', 'Trading Cards', 'Premium'],
    avatar: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Chloe Setter',
    team: 'Pacific College',
    sport: 'S • Volleyball',
    location: 'San Diego, CA',
    minRate: 400,
    tags: ['Athleisure', 'Lifestyle', 'Gen-Z'],
    avatar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'Jax Fighter',
    team: 'Apex MMA Gym',
    sport: 'Welterweight • MMA',
    location: 'Las Vegas, NV',
    minRate: 800,
    tags: ['Fight Gear', 'Supplements', 'Intense'],
    avatar: 'https://images.unsplash.com/photo-1599552375127-142279144365?q=80&w=200&h=200&auto=format&fit=crop'
  }
];

// Expanded Dummy Creators for Athlete Scouting
const creators = [
  { 
    id: 1, 
    name: 'Retro Gridiron Hub', 
    focus: 'Vintage Apparel Design', 
    dealsDone: 14, 
    rating: 4.9, 
    location: 'Chicago, IL', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    tags: ['Nostalgia', 'Heavyweight', 'Cut & Sew'],
    previousCollabs: ['Trey Q. Championship Varsity', 'State Final Four Tees'],
    merchPreview: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&h=300&fit=crop',
    portfolio: [
      { img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&fit=crop', athlete: 'Trey Quarterback', title: 'Championship Varsity', event: 'State Finals' },
      { img: 'https://images.unsplash.com/photo-1588143890834-fe5458142340?w=800&fit=crop', athlete: 'Marcus Elite', title: 'State Final Four Tees', event: 'NCAA Circuit' }
    ]
  },
  { 
    id: 2, 
    name: 'Courtside Captures', 
    focus: 'Live Event Photography', 
    dealsDone: 8, 
    rating: 4.8, 
    location: 'Los Angeles, CA', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    tags: ['Sony A7SIII', 'Dynamic Edits', 'Posters'],
    previousCollabs: ['Marcus Elite Buzzer Beater Frame'],
    merchPreview: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=500&h=300&fit=crop',
    portfolio: [
      { img: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&fit=crop', athlete: 'Marcus Elite', title: 'Buzzer Beater Frame', event: 'Elite 8' },
      { img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&fit=crop', athlete: 'Chloe Setter', title: 'Game Winner Post', event: 'Volleyball Nationals' }
    ]
  },
  { 
    id: 3, 
    name: 'HypeEdits 2026', 
    focus: 'Video Edits & Highlight Reels', 
    dealsDone: 3, 
    rating: 4.5, 
    location: 'Atlanta, GA', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    tags: ['TikTok Viral', 'Sound Design', 'Storytelling'],
    previousCollabs: ['Sarah S. Olympic Qualifier Promo'],
    merchPreview: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&h=300&fit=crop',
    portfolio: [
      { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&fit=crop', athlete: 'Sarah Sprinter', title: 'Olympic Qualifier Promo', event: 'Olympic Trials 2026' }
    ]
  },
  { 
    id: 4, 
    name: 'Varsity Customs', 
    focus: 'Premium Varsity Jackets', 
    dealsDone: 29, 
    rating: 5.0, 
    location: 'New York, NY', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    tags: ['Leather', 'Embroidery', 'Boutique Pricing'],
    previousCollabs: ['National Champs Limited Line'],
    merchPreview: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop',
    portfolio: [
      { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&fit=crop', athlete: 'Trey Quarterback', title: 'National Champs Limited Line', event: 'Rose Bowl 2026' }
    ]
  },
];

export default function ScoutDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<'fan' | 'athlete' | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestedPitches, setRequestedPitches] = useState<Record<number, boolean>>({});
  const [inviteInput, setInviteInput] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // Athlete Workflow States
  const [activePitchCreator, setActivePitchCreator] = useState<any | null>(null);
  const [pitchMessage, setPitchMessage] = useState('');
  const [activePortfolioCreator, setActivePortfolioCreator] = useState<any | null>(null);

  const handleInviteSubmit = () => {
    if (!inviteInput) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteInput('');
      setInviteSent(false);
    }, 4000);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setRole(profile.user_type === 'athlete' ? 'athlete' : 'fan');
        } else {
          setRole('fan');
        }
      } else {
        setRole('fan');
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  const filteredAthletes = athletes.filter(a => {
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || 
           a.sport.toLowerCase().includes(q) || 
           a.team.toLowerCase().includes(q) || 
           a.location.toLowerCase().includes(q) ||
           a.tags.some(t => t.toLowerCase().includes(q));
  });

  const filteredCreators = creators.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || 
           c.focus.toLowerCase().includes(q) || 
           c.location.toLowerCase().includes(q) ||
           c.tags.some(t => t.toLowerCase().includes(q));
  });

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center">...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 font-sans selection:bg-sb-yellow selection:text-sb-black">
      
      {/* Header & Search */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
              <Target className="w-10 h-10 text-sb-yellow" />
              {role === 'athlete' ? 'Scout Creator Network' : 'Scout The Roster'}
            </h1>
            <p className="text-gray-400 mt-3 font-medium md:text-lg">
              {role === 'athlete' 
                ? 'Discover elite Fans & Brands ready to execute your NIL into premium merchandise.' 
                : 'Discover verifiable athletes ready for immediate NIL partnership pitches.'}
            </p>
          </div>
          
          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${role === 'athlete' ? 'creators' : 'athletes'}...`} 
              className="w-full bg-[#111] border border-white/10 rounded-full pl-12 pr-6 py-4 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-600 font-medium shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Grid Router (Displays Fan or Athlete data based on Auth Role) */}
      <div className="max-w-7xl mx-auto">
        
        {/* === ATHLETE SCOUTING CREATORS === */}
        {role === 'athlete' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCreators.length > 0 ? filteredCreators.map(creator => (
              <div key={creator.id} className="bg-gradient-to-b from-[#111] to-black border border-white/10 hover:border-sb-yellow/50 transition-all shadow-2xl rounded-[2rem] p-6 lg:p-8 group flex flex-col justify-between h-full relative">
                
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex gap-4 items-center">
                      <img src={creator.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-black shadow-lg" />
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-1 group-hover:text-sb-yellow transition-colors">{creator.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-sb-black bg-sb-yellow px-2 py-0.5 rounded flex items-center gap-1"><PenTool className="w-3 h-3" /> {creator.focus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Detail Payload */}
                  <div className="flex flex-col gap-6 mb-8">
                     
                     {/* Tags & Location */}
                     <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-white/5 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {creator.tags.map(tag => (
                            <span key={tag} className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">{tag}</span>
                          ))}
                        </div>
                        <span className="flex items-center gap-1 shrink-0"><MapPin className="w-3 h-3" /> {creator.location}</span>
                     </div>

                     {/* Stats */}
                     <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-sb-yellow" />
                          <span className="text-white">{creator.dealsDone} Deals Closed</span>
                        </div>
                        <div className="flex items-center gap-1 text-white">
                          <Star className="w-4 h-4 text-sb-yellow fill-sb-yellow" />
                          {creator.rating}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        {/* Merch Preview */}
                        <div 
                          onClick={() => setActivePortfolioCreator(creator)}
                          className="bg-black border border-white/10 rounded-xl overflow-hidden aspect-[4/3] relative group/preview cursor-pointer"
                        >
                           <img src={creator.merchPreview} className="w-full h-full object-cover opacity-80 group-hover/preview:scale-105 group-hover/preview:opacity-100 transition-all duration-500" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-black uppercase tracking-widest text-[10px] bg-white/20 px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-md flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> View Portfolio
                              </span>
                           </div>
                           <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 flex items-center gap-1 rounded text-[8px] font-black uppercase tracking-widest text-sb-yellow shadow-lg transition-opacity group-hover/preview:opacity-0">
                             <ImageIcon className="w-3 h-3" /> Portfolio
                           </div>
                        </div>
                        {/* Previous Collabs */}
                        <div className="flex flex-col gap-2">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10 pb-2">Recent Collabs</h5>
                           <ul className="space-y-2">
                              {creator.previousCollabs.map(collab => (
                                <li key={collab} className="text-xs font-medium text-gray-300 leading-tight">"{collab}"</li>
                              ))}
                           </ul>
                        </div>
                     </div>

                  </div>
                </div>

                <button 
                  onClick={() => !requestedPitches[creator.id] && setActivePitchCreator(creator)}
                  disabled={requestedPitches[creator.id]}
                  className={`w-full font-black uppercase tracking-widest py-4 rounded-xl transition-all text-sm shadow-xl flex items-center justify-center gap-2 ${
                    requestedPitches[creator.id] 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-white text-black hover:bg-gray-200 hover:-translate-y-1'
                  }`}
                >
                  {requestedPitches[creator.id] ? (
                    <><CheckCircle className="w-5 h-5" /> Pitch Actively Requested</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Request a Pitch</>
                  )}
                </button>
              </div>
            )) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-[#111] border border-white/5 rounded-[2rem]">
                <Target className="w-12 h-12 text-gray-800 mb-4" />
                <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-2">No Creators Found</h3>
                <p className="text-gray-500 font-medium text-sm">Expand your search to discover new talent.</p>
              </div>
            )}
          </div>
        )}

        {/* === FAN SCOUTING ATHLETES === */}
        {(role === 'fan' || role === null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.length > 0 ? filteredAthletes.map(athlete => (
              <div key={athlete.id} className="bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-[2rem] overflow-hidden group hover:border-sb-yellow/50 transition-all hover:shadow-[0_0_40px_rgba(247,223,2,0.1)] hover:-translate-y-1 relative">
                
                <div className="p-8 pb-0 relative z-10 flex gap-6">
                  <img 
                    src={athlete.avatar} 
                    alt={athlete.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-black shadow-2xl"
                  />
                  <div className="pt-2">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{athlete.name}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sb-yellow mt-1">
                      <Flame className="w-3 h-3" /> {athlete.sport}
                    </div>
                  </div>
                </div>

                <div className="p-8 pb-28 space-y-6 relative z-10">
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-4">
                    <span className="flex items-center gap-2 text-gray-400 font-medium"><MapPin className="w-4 h-4" /> {athlete.location}</span>
                    <span className="font-bold text-white px-3 py-1 bg-white/5 rounded-md">${athlete.minRate}+</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {athlete.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-gray-500 bg-black border border-white/10 px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 flex gap-2">
                  <Link href={`/vault?athleteName=${encodeURIComponent(athlete.name)}&viewOnly=true`} className="flex-1 bg-[#222] text-white py-4 rounded-xl font-black uppercase text-[10px] xl:text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors shadow-2xl">
                    <HardDrive className="w-4 h-4 shrink-0" /> Vault
                  </Link>
                  <Link href={`/proposals/draft?athleteName=${encodeURIComponent(athlete.name)}`} className="flex-[1.5] bg-sb-yellow text-sb-black w-full py-4 rounded-xl font-black uppercase text-[10px] xl:text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors shadow-2xl">
                    <Zap className="w-4 h-4 shrink-0" /> Pitch
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <Frown className="w-16 h-16 text-gray-800 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-2">No Athletes Found</h3>
                <p className="text-gray-600 font-medium">Try adjusting your search filters or exploring different sports.</p>
              </div>
            )}
            
            {/* Network Expansion Call to Action (Fan view only) */}
            <div className="bg-gradient-to-b from-[#111] to-black border-2 border-dashed border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group transition-all hover:border-sb-yellow/20 lg:col-span-1 md:col-span-2 shadow-2xl">
                <Share2 className="w-12 h-12 text-sb-yellow mb-6" />
                <h3 className="text-xl font-black uppercase text-white tracking-widest mb-2">Can't Find Your Athlete?</h3>
                <p className="text-gray-400 font-medium text-sm mb-8 max-w-sm">We're expanding fast. Invite an athlete directly to Snapback and gain priority pitching access once they officially verify.</p>
                
                {inviteSent ? (
                  <div className="bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Official Invite Dispatched
                  </div>
                ) : (
                  <div className="flex w-full max-w-xs relative bg-black rounded-full p-1 border border-white/10 focus-within:border-sb-yellow transition-colors">
                    <input 
                      type="text" 
                      placeholder="Athlete's Email or Phone..." 
                      className="w-full bg-transparent pl-4 pr-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 font-medium"
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                    />
                    <button 
                      onClick={handleInviteSubmit}
                      className="bg-white text-black px-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-colors shadow-lg"
                    >
                      Invite
                    </button>
                  </div>
                )}
            </div>

          </div>
        )}

      </div>
      
      {/* Portfolio Lightbox */}
      {activePortfolioCreator && (
        <div className="fixed inset-0 z-[100] bg-black/95 p-6 animate-in fade-in duration-200 overflow-y-auto">
           <button onClick={() => setActivePortfolioCreator(null)} className="absolute top-6 right-6 text-white hover:text-sb-yellow bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors z-10">
             <X className="w-6 h-6" />
           </button>
           
           <div className="max-w-7xl mx-auto pt-12 pb-24 relative z-0">
              <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8">
                 <img src={activePortfolioCreator.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.15)] object-cover" />
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">{activePortfolioCreator.name}</h2>
                    <p className="text-sb-yellow font-bold uppercase tracking-widest text-xs mt-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Verified Portfolio Array</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {activePortfolioCreator.portfolio?.map((item: any, idx: number) => (
                   <div key={idx} className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden group shadow-2xl hover:border-white/30 transition-all">
                      <div className="aspect-[4/3] overflow-hidden relative border-b border-white/10">
                         <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                      </div>
                      <div className="p-6 md:p-8">
                         <h4 className="text-xl font-black uppercase tracking-tight text-white mb-6 line-clamp-1">{item.title}</h4>
                         <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 pt-5">
                           <span className="text-gray-500 flex justify-between">Athlete <span className="text-sb-yellow">{item.athlete}</span></span>
                           <span className="text-gray-500 flex justify-between">Event <span className="text-white">{item.event}</span></span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Request Pitch Modal */}
      {activePitchCreator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-gradient-to-b from-[#111] to-black border border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl p-8 relative">
              <button 
                onClick={() => { setActivePitchCreator(null); setPitchMessage(''); }} 
                className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-sb-yellow/10 flex items-center justify-center border border-sb-yellow/20">
                   <Zap className="w-6 h-6 text-sb-yellow" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">Request Pitch</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-400 mt-1">Direct Secure Line</p>
                 </div>
              </div>
              
              <p className="text-sm font-medium text-gray-400 mb-8 leading-relaxed border-b border-white/10 pb-6">
                Send a direct request to <span className="text-white font-bold">{activePitchCreator.name}</span> to rapidly prototype a merchandising partnership utilizing your NIL.
              </p>
              
              <div className="mb-8">
                 <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2 mb-3">
                    <PenTool className="w-3 h-3" /> Minimum Requirements / Message
                 </label>
                 <textarea 
                   rows={5}
                   value={pitchMessage}
                   onChange={e => setPitchMessage(e.target.value)}
                   placeholder="E.g., I have a massive fight coming up in Vegas next month. I need a sick walkout tee design. I've got high quality locker room footage we can use. Pitch me a concept..."
                   className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 font-medium resize-none shadow-inner"
                 />
              </div>

              <button 
                onClick={() => {
                  setRequestedPitches(p => ({...p, [activePitchCreator.id]: true}));
                  setActivePitchCreator(null);
                  setPitchMessage('');
                }}
                disabled={!pitchMessage.trim()}
                className="w-full bg-white text-black py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-gray-200 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-xl"
              >
                 <Zap className="w-5 h-5 fill-black" /> Dispatch Request Payload
              </button>
           </div>
        </div>
      )}

    </div>
  );
}
