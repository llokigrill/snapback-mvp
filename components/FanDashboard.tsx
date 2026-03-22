'use client';

import { useState } from 'react';
import { ArrowRight, FileText, CheckCircle, Shield, AlertTriangle, Users, Target, Activity, Zap, Play, Image as ImageIcon, XCircle, Clock, Video, PieChart, ChevronDown, ChevronUp, Bell, Settings, HardDrive, X } from 'lucide-react';
import Link from 'next/link';
import { EditProfileModal } from './EditProfileModal';

// Dummy data for analytics and detailed tracking including optional AI variations
const MOCK_DEALS = [
  { id: 1, athlete: 'Cameron Boozer', product: 'The C00ZER Heritage Collection', status: 'approved', type: 'Event Video', event: 'Duke Tournament Run', revSplit: 85, termRemaining: '4 Months', date: 'Jan 15, 2026', revenue: '$22,400', thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop', aiDesign: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&h=300&fit=crop' },
  { id: 2, athlete: 'AJ Dybantsa', product: 'BYU Post-Season Hoodie', status: 'approved', type: 'Design Only', event: null, revSplit: 70, termRemaining: '11 Months', date: 'Mar 01, 2026', revenue: '$14,320', thumbnail: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=500&h=300&fit=crop' },
  { id: 3, athlete: 'Yaxel Lendeborg', product: 'Wolverines Highlight Tee', status: 'rejected', type: 'Event Video', event: 'Michigan Elite Eight', revSplit: 50, termRemaining: null, date: 'Feb 10, 2026', revenue: '$0', thumbnail: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500&h=300&fit=crop', aiDesign: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&h=300&fit=crop' },
  { id: 4, athlete: 'Darryn Peterson', product: 'Kansas Graphic Longsleeve', status: 'draft', type: 'Design Only', event: null, revSplit: 65, termRemaining: null, date: 'Mar 19, 2026', revenue: '$0', thumbnail: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=500&h=300&fit=crop' },
  { id: 5, athlete: 'Terrence Hill Jr.', product: 'VCU Upset Varsity Jacket', status: 'draft', type: 'Event Video', event: 'VCU vs UNC', revSplit: 70, termRemaining: null, date: 'Mar 20, 2026', revenue: '$0', thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500&h=300&fit=crop' }
];

const MOCK_INBOUND_REQUESTS = [
  { 
    id: 301, athleteName: 'Tarris Reed Jr.', sport: 'UConn • Center', date: 'Just now', 
    message: "Hey, I saw your pristine vintage designs. I just dropped 31 points and 27 rebounds in the tourney. I'd love to partner up on exclusive walkout merch for the next round. Please pitch me an official proposal.", 
    avatar: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=200&h=200&auto=format&fit=crop',
    vault: [
      { id: 1, title: '31-Point Game Highlights', type: 'Event Video', thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&h=300&fit=crop' },
      { id: 2, title: 'Locker Room Celebration', type: 'Photography', thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500&h=300&fit=crop' }
    ]
  },
  { 
    id: 302, athleteName: 'Pryce Sandfort', sport: 'Nebraska • Guard', date: '2 hrs ago', 
    message: "Love the sleek aesthetic of your merchandise! Send me a pitch for some Gen-Z lifestyle hoodies I can promote to my audience after my 23-point breakout game.", 
    avatar: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?q=80&w=200&h=200&auto=format&fit=crop',
    vault: [
      { id: 1, title: 'Breakaway Dunk', type: 'Event Video', thumbnail: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500&h=300&fit=crop' }
    ]
  }
];

export function FanDashboard({ profile }: { profile: any }) {
  const [activeView, setActiveView] = useState<'current' | 'past' | 'drafts' | 'vault' | 'inbound'>('inbound');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeVaultAthlete, setActiveVaultAthlete] = useState<any | null>(null);

  const toggleExpand = (id: number) => setExpandedRow(prev => prev === id ? null : id);

  // Computed metrics for Analytics Section
  const approvedCount = MOCK_DEALS.filter(d => d.status === 'approved').length;
  const rejectedCount = MOCK_DEALS.filter(d => d.status === 'rejected').length;
  const draftCount = MOCK_DEALS.filter(d => d.status === 'draft').length;

  const currentDeals = MOCK_DEALS.filter(d => d.status === 'approved');
  const pastDeals = MOCK_DEALS.filter(d => d.status === 'rejected');
  const draftsList = MOCK_DEALS.filter(d => d.status === 'draft');
  const contentVault = MOCK_DEALS.filter(d => d.type === 'Event Video');

  const getEndDate = (startDateStr: string, termLengthDesc: string | null) => {
    if (!startDateStr) return 'TBD';
    const months = parseInt(termLengthDesc || '12') || 12;
    try {
      const date = new Date(startDateStr);
      date.setMonth(date.getMonth() + months);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'TBD';
    }
  };

  const renderExpandedPanel = (deal: any) => (
    <div className="w-full mt-4 p-6 border-t border-white/5 bg-black/40 rounded-b-2xl grid md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
      <div>
        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Contract Protocol</h4>
        <ul className="space-y-3 text-sm font-medium text-gray-300">
          <li className="flex justify-between border-b border-white/5 pb-2">
             <span className="text-gray-500">Contract Parties:</span> 
             <span className="text-white flex items-center gap-1.5"><Shield className="w-3 h-3 text-sb-yellow" /> {profile?.full_name || 'Creator'} <span className="text-gray-600 font-bold">x</span> {deal.athlete}</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Revenue Split:</span> <span className="text-sb-yellow font-bold">{deal.revSplit}% Creator / {100 - deal.revSplit}% Athlete</span></li>
          <li className="flex justify-between border-b border-white/5 pb-2">
             <span className="text-gray-500">Active Term:</span>
             <span className="text-white opacity-90">{deal.date} — {getEndDate(deal.date, deal.termRemaining)}</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Content Trigger:</span> <span>{deal.event || 'None (Base NIL)'}</span></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Project Media Stack</h4>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden border border-white/10 relative group">
            <img src={deal.thumbnail} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-1 bg-black/80 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-sm">Source</span>
          </div>
          {deal.aiDesign ? (
            <div className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden border border-sb-yellow/50 relative shadow-[0_0_20px_rgba(247,223,2,0.1)] group">
              <img src={deal.aiDesign} className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
              <span className="absolute bottom-1 left-1 bg-sb-yellow px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-sb-black shadow-lg">AI Generated</span>
            </div>
          ) : (
            <div className="w-24 h-24 bg-black/50 border border-dashed border-white/10 rounded-xl flex items-center justify-center p-2 text-center">
              <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">No AI Design</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sb-yellow selection:text-sb-black pb-20">
      
      <main className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Personalized Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover border-2 border-sb-yellow shadow-[0_0_15px_rgba(247,223,2,0.15)]" />
             ) : (
               <div className="w-16 h-16 rounded-full bg-[#111] border-2 border-sb-yellow flex items-center justify-center shadow-[0_0_15px_rgba(247,223,2,0.15)]">
                 <Shield className="w-6 h-6 text-sb-yellow" />
               </div>
             )}
             <div>
               <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Welcome, {profile?.full_name || 'Creator'}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-sb-black bg-sb-yellow px-2 py-0.5 rounded">Verified Creator</span>
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{profile?.school_team || 'Digital Apparel'}</span>
               </div>
             </div>
          </div>
          <button onClick={() => setIsEditingProfile(true)} className="flex items-center justify-center gap-2 bg-[#111] border border-white/10 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all shadow-xl">
            <Settings className="w-4 h-4 text-sb-yellow shrink-0" /> Account Settings
          </button>
        </div>
        
        {/* Analytics Section */}
        <div className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Lifetime Proposal Analytics
          </h2>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <p className="text-4xl font-black text-white">{approvedCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-green-400 mt-2">Approved</p>
            </div>
            <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <p className="text-4xl font-black text-white">{rejectedCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mt-2">Rejected</p>
            </div>
            <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <p className="text-4xl font-black text-white">{draftCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-sb-yellow mt-2">In Draft</p>
            </div>
          </div>
        </div>

        {/* Pending Action Box (The Draft Callout) */}
        <div className="bg-sb-yellow rounded-[2rem] p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group shadow-lg">
          <div className="relative z-10 basis-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full font-bold uppercase text-xs tracking-widest mb-4 text-sb-black">
              {draftCount > 0 ? (
                <><AlertTriangle className="w-4 h-4" /> Next Step Required</>
              ) : (
                <><Zap className="w-4 h-4" /> Monetization Ready</>
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-sb-black tracking-tighter leading-tight mb-4">
              {draftCount > 0 ? 'Finish Your Draft Proposal' : 'Start a New Proposal'}
            </h2>
            <p className="text-sb-black/70 font-medium md:text-lg max-w-xl">
              {draftCount > 0 
                ? 'You have an unfinished arrangement waiting for Terrence Hill Jr.. Lock in your margins, upload your media, and dispatch the contract for signature.' 
                : 'You currently have zero unfinished drafts. Head over to the athlete roster directory to scout verified talent and start modeling your next lucrative partnership.'}
            </p>
          </div>
          <Link href={draftCount > 0 ? "/proposals/draft?athleteName=Terrence%20Hill%20Jr" : "/athletes"} className="relative z-10 shrink-0 bg-sb-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
            {draftCount > 0 ? 'Edit Proposal' : 'Scout Directory'}
            <ArrowRight className="w-5 h-5 text-sb-yellow" />
          </Link>
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        </div>

        {/* Database Explorer Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: 'inbound', label: 'Inbound Pitches', icon: Bell, count: MOCK_INBOUND_REQUESTS.length },
            { id: 'current', label: 'Current Proposals', icon: CheckCircle },
            { id: 'past', label: 'Past Proposals', icon: XCircle },
            { id: 'drafts', label: 'Proposal Drafts', icon: FileText },
            { id: 'vault', label: 'Content Panel', icon: Video },
          ].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => { setActiveView(tab.id as any); setExpandedRow(null); }}
              className={`px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${
                activeView === tab.id 
                  ? 'bg-sb-yellow text-sb-black shadow-[0_0_20px_rgba(247,223,2,0.2)]' 
                  : 'bg-[#111] text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full leading-none shadow-md">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          
          <Link href="/proposals/draft" className="ml-auto bg-white/5 border border-white/10 hover:bg-white text-white hover:text-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all shrink-0">
             Start Fresh Draft <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Space Based on Tab Selection */}
        <div className="space-y-4">
          
          {/* INBOUND REQUESTS */}
          {activeView === 'inbound' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pl-2">
                <div className="flex items-center gap-4">
                  <Bell className="w-8 h-8 text-sb-yellow animate-bounce" />
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Inbound Pitch Requests</h3>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Select an athlete and construct a proposal based on their requirements.</p>
                  </div>
                </div>
              </div>

              {MOCK_INBOUND_REQUESTS.map(req => (
                <div key={req.id} className="bg-[#111] border border-white/10 rounded-3xl p-8 hover:border-sb-yellow/50 transition-colors flex flex-col md:flex-row gap-8 items-start group">
                  <div className="relative shrink-0">
                    <img src={req.avatar} className="w-24 h-24 rounded-full border-4 border-black shadow-2xl object-cover" />
                    <div className="absolute -bottom-2 -right-2 bg-red-500 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-sb-yellow transition-colors">{req.athleteName}</h4>
                        <span className="text-xs font-bold text-gray-500">{req.date}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sb-yellow bg-sb-yellow/10 px-3 py-1 rounded-full">{req.sport}</span>
                    </div>
                    
                    <p className="text-gray-300 font-medium italic border-l-2 border-white/10 pl-4 py-1 text-sm">
                      "{req.message}"
                    </p>
                  </div>

                  <div className="shrink-0 w-full md:w-auto flex flex-col md:items-end self-center pt-4 md:pt-0 border-t border-white/10 md:border-transparent mt-4 md:mt-0 gap-3">
                    <button 
                      onClick={() => setActiveVaultAthlete(req)} 
                      className="w-full md:w-auto bg-[#111] hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-xl flex items-center justify-center gap-2 hover:border-sb-yellow transition-all"
                    >
                      <HardDrive className="w-3 h-3" /> Inspect Asset Vault
                    </button>
                    <Link href={`/proposals/draft?athleteName=${encodeURIComponent(req.athleteName)}`} className="w-full md:w-auto bg-sb-yellow hover:bg-yellow-400 text-sb-black font-black uppercase text-xs tracking-widest px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(247,223,2,0.15)] hover:shadow-[0_10px_40px_rgba(247,223,2,0.3)] hover:-translate-y-1 transition-all">
                      Draft Proposal <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CURRENT PROPOSALS */}
          {activeView === 'current' && currentDeals.map(deal => (
            <div key={deal.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-sb-yellow/30 transition-colors">
              <div onClick={() => toggleExpand(deal.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10 bg-[#111]">
                <div className="w-full md:w-16 h-16 bg-black rounded-xl border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                   <Shield className="w-8 h-8 text-gray-700" />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-black uppercase tracking-tight">{deal.product}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
                     <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-gray-300">Active Deal • {deal.athlete}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  {expandedRow === deal.id ? <ChevronUp className="w-6 h-6 text-sb-yellow" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
                </div>
              </div>
              {expandedRow === deal.id && renderExpandedPanel(deal)}
            </div>
          ))}

          {/* PAST PROPOSALS */}
          {activeView === 'past' && [...pastDeals, ...currentDeals].map(deal => (
            <div key={deal.id} className={`border rounded-2xl overflow-hidden transition-all ${deal.status === 'approved' ? 'bg-[#111] border-white/10' : 'bg-black border-white/5 opacity-80'}`}>
              <div onClick={() => toggleExpand(deal.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10">
                <div className="w-full md:w-16 h-16 bg-black rounded-xl flex items-center justify-center shrink-0">
                  {deal.status === 'approved' ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-black uppercase tracking-tight text-gray-300 line-clamp-1">{deal.product}</h3>
                  <p className="text-gray-500 text-sm font-medium">Historical Pitch to: {deal.athlete}</p>
                </div>
                <div className="text-center md:text-right shrink-0 flex items-center gap-4">
                  <span className={`font-bold uppercase tracking-widest px-4 py-2 rounded text-[10px] border ${deal.status === 'approved' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-red-500/30 text-red-500 bg-red-500/10'}`}>
                    {deal.status}
                  </span>
                  {expandedRow === deal.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </div>
              </div>
              {expandedRow === deal.id && renderExpandedPanel(deal)}
            </div>
          ))}

          {/* DRAFTS */}
          {activeView === 'drafts' && draftsList.map(deal => (
            <div key={deal.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
              <div onClick={() => toggleExpand(deal.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10 hover:bg-white/5 transition-colors">
                <div className="w-full md:w-16 h-16 bg-black rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                  <FileText className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-lg font-black uppercase tracking-tight text-gray-200">{deal.product}</h3>
                   <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-800 text-gray-400 inline-block mt-2">
                     Unsaved Draft • {deal.athlete}
                   </span>
                </div>
                <div className="shrink-0 flex items-center gap-4">
                  <Link href={`/proposals/draft?athleteName=${encodeURIComponent(deal.athlete)}`} className="text-xs font-bold uppercase tracking-widest text-sb-yellow border border-sb-yellow/20 hover:bg-sb-yellow hover:text-sb-black px-6 py-3 rounded-full transition-all inline-block">
                    Edit Proposal
                  </Link>
                  {expandedRow === deal.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </div>
              </div>
              {expandedRow === deal.id && renderExpandedPanel(deal)}
            </div>
          ))}

          {/* CONTENT VAULT */}
          {activeView === 'vault' && (
            <div className="bg-black border border-white/5 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <Video className="w-10 h-10 text-sb-yellow" />
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white">Uploaded Content Panel</h3>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Verify if your attendance-based IP is currently tied to an active contract.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {contentVault.map(deal => (
                  <div key={deal.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group">
                    <div className="aspect-video bg-black relative flex items-center justify-center border-b border-white/5">
                      <Play className="w-12 h-12 text-white/30 relative z-10" />
                      {deal.status === 'approved' && (
                         <div className="absolute top-4 right-4 bg-green-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1 shadow-lg">
                           <Shield className="w-3 h-3 border-transparent" /> IP Approved
                         </div>
                      )}
                      {deal.status === 'rejected' && (
                         <div className="absolute top-4 right-4 bg-red-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1">
                           <XCircle className="w-3 h-3" /> Rejected
                         </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="text-md font-black uppercase tracking-tight text-white mb-2 line-clamp-1">{deal.event} Event Media</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gray-500">Asset Targeted To:</span>
                          <span className="text-gray-300">{deal.athlete}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gray-500">Contract Attachment:</span>
                          <span className="text-gray-300">{deal.product}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      
      {isEditingProfile && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditingProfile(false)} 
          onUpdated={() => window.location.reload()} 
        />
      )}

      {/* Vault Inspection Lightbox */}
      {activeVaultAthlete && (
        <div className="fixed inset-0 z-[100] bg-black/95 p-6 animate-in fade-in duration-200 overflow-y-auto">
           <button onClick={() => setActiveVaultAthlete(null)} className="absolute top-6 right-6 text-white hover:text-sb-yellow bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors z-10">
             <X className="w-6 h-6" />
           </button>
           
           <div className="max-w-7xl mx-auto pt-12 pb-24 relative z-0">
              <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8">
                 <img src={activeVaultAthlete.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.15)] object-cover" />
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">{activeVaultAthlete.athleteName}</h2>
                    <p className="text-sb-yellow font-bold uppercase tracking-widest text-xs mt-3 flex items-center gap-2"><HardDrive className="w-4 h-4" /> Secure Asset Vault Sandbox</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {activeVaultAthlete.vault?.map((item: any) => (
                   <div key={item.id} className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden group shadow-2xl hover:border-white/30 transition-all cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden relative border-b border-white/10 bg-black">
                         <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                         {item.type.includes('Video') && (
                           <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                 <Play className="w-5 h-5 text-white ml-1" />
                              </div>
                           </div>
                         )}
                      </div>
                      <div className="p-6">
                         <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2 line-clamp-1 group-hover:text-sb-yellow transition-colors">{item.title}</h4>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded inline-block">
                           {item.type}
                         </span>
                      </div>
                   </div>
                 ))}
                 
                 {(!activeVaultAthlete.vault || activeVaultAthlete.vault.length === 0) && (
                   <div className="col-span-full py-20 flex items-center justify-center text-gray-500 font-black uppercase tracking-widest">
                     No Assets Inside Vault.
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
