'use client';

import { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, Clock, Zap, Target, DollarSign, PenTool, Image as ImageIcon, ChevronDown, ChevronUp, Star, Award, Search, Users, FileText, Loader2, X, ZoomIn, ZoomOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { EditProfileModal } from './EditProfileModal';

const MOCK_CREATORS = [
  { id: 1, name: 'Retro Gridiron Hub', focus: 'Vintage Apparel Design', dealsDone: 14, rating: 4.9, location: 'Chicago, IL', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
  { id: 2, name: 'Courtside Captures', focus: 'Live Event Photography', dealsDone: 8, rating: 4.8, location: 'Los Angeles, CA', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 3, name: 'HypeEdits 2026', focus: 'Video Edits & Highlight Reels', dealsDone: 3, rating: 4.5, location: 'Atlanta, GA', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 4, name: 'Varsity Customs', focus: 'Premium Varsity Jackets', dealsDone: 29, rating: 5.0, location: 'New York, NY', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
];

const MOCK_INBOX = [
  { id: 101, fan: 'Retro Gridiron Hub', product: 'Tournament Run Tee', status: 'pending', revSplit: 40, termRemaining: '4 Months', date: 'Mar 20, 2026', type: 'Design Only', thumbnail: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=500&h=300&fit=crop', aiDesign: null },
  { id: 102, fan: 'Courtside Captures', product: 'Buzzer Beater Poster', status: 'pending', revSplit: 50, termRemaining: '12 Months', date: 'Mar 19, 2026', type: 'Event Video', thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop', aiDesign: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&h=300&fit=crop' },
];

const MOCK_ACTIVE_DEALS = [
  { id: 201, fan: 'Varsity Customs', product: 'Championship Varsity Jacket', status: 'active', revSplit: 30, termRemaining: '10 Months', revenue: '$3,450', thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500&h=300&fit=crop' },
];

export function AthleteDashboard({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'active' | 'creators'>('inbox');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [requestedPitches, setRequestedPitches] = useState<Record<number, boolean>>({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Execution states
  const [signingId, setSigningId] = useState<number | null>(null);
  const [legalChecked, setLegalChecked] = useState<Record<number, boolean>>({});

  // Media inspection states
  const [enlargedMedia, setEnlargedMedia] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // NIL Calculator state
  const [showNilCalculator, setShowNilCalculator] = useState(false);
  const [nilSocialFollowing, setNilSocialFollowing] = useState('');
  const [nilGameDate, setNilGameDate] = useState('');
  const [nilTelevised, setNilTelevised] = useState(false);
  const [nilInterviewed, setNilInterviewed] = useState(false);
  const [nilEstimate, setNilEstimate] = useState<string | null>(null);

  const calculateNilEstimate = () => {
    const following = parseInt(nilSocialFollowing.replace(/[^0-9]/g, '') || '0');
    let baseValue = following * 0.05;
    if (nilTelevised) baseValue *= 1.5;
    if (nilInterviewed) baseValue *= 1.5;
    if (nilGameDate) {
      const gDate = new Date(nilGameDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - gDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) baseValue *= 1.2;
    }
    const lowEnd = Math.max(10, Math.floor(baseValue * 0.8));
    const highEnd = Math.floor(baseValue * 1.2);
    setNilEstimate(`$${lowEnd.toLocaleString()} - $${highEnd.toLocaleString()}`);
  };

  const toggleExpand = (id: number) => setExpandedRow(prev => prev === id ? null : id);

  const totalEscrow = MOCK_ACTIVE_DEALS.reduce((acc, deal) => acc + parseInt(deal.revenue.replace(/[^0-9]/g, '')), 0);
  
  const filteredCreators = MOCK_CREATORS.filter(c => {
    const q = creatorSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || 
           c.focus.toLowerCase().includes(q) ||
           c.location.toLowerCase().includes(q);
  });

  const handleSignAndAccept = async (deal: any) => {
    if (!legalChecked[deal.id]) {
      alert("You must verify and agree to the legal contracts before signing.");
      return;
    }
    
    setSigningId(deal.id);
    try {
      const res = await fetch('/api/send-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dealId: deal.id,
          fanName: deal.fan,
          athleteName: profile?.full_name || 'Athlete Partner',
          athleteEmail: profile?.email,
          fanEmail: 'llokigrill@gmail.com', // Explicitly acting as the Creator's destination inbox for prototyping
          productName: deal.product,
          termLength: deal.termRemaining,
          dealType: deal.type,
          fanSplit: deal.revSplit,
          thumbnailUrl: deal.thumbnail,
          aiDesignUrl: deal.aiDesign
        })
      });
      
      if (res.ok) {
        alert("Contract Fully Executed! A finalized, legally binding copy has just been emailed to your agent and the Creator.");
        setExpandedRow(null);
      } else {
        const errData = await res.json();
        alert(`Action failed: ${errData.error || 'Server rejected the request.'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network Error during execution.");
    } finally {
      setSigningId(null);
    }
  };

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

  const renderDealDetails = (deal: any, isPending = false) => (
    <div className="w-full mt-4 p-6 border-t border-white/5 bg-black/40 rounded-b-2xl animate-in slide-in-from-top-2 duration-300">
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <div>
          <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Contract Protocol</h4>
          <ul className="space-y-3 text-sm font-medium text-gray-300">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-500">Contract Parties:</span> 
              <span className="text-white flex items-center gap-1.5"><Shield className="w-3 h-3 text-sb-yellow" /> {deal.fan} <span className="text-gray-600 font-bold">x</span> {profile?.full_name || 'Athlete'}</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-500">Your Target Revenue Split:</span> 
              <span className="text-green-400 font-bold">{100 - deal.revSplit}% (Athlete) / {deal.revSplit}% (Fan)</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-500">Active Term:</span>
              <span className="text-white opacity-90">{deal.date || 'TBD'} — {getEndDate(deal.date, deal.termRemaining)}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Project Media Pack</h4>
          <div className="flex gap-4">
            <div 
              onClick={() => { setEnlargedMedia(deal.thumbnail); setZoomLevel(1); }}
              className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden border border-white/10 relative group cursor-pointer"
            >
              <img src={deal.thumbnail} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-1 left-1 bg-black/80 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-white">Source</span>
            </div>
            {deal.aiDesign && (
              <div 
                onClick={() => { setEnlargedMedia(deal.aiDesign); setZoomLevel(1); }}
                className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden border border-sb-yellow/50 relative shadow-[0_0_20px_rgba(247,223,2,0.1)] group cursor-pointer"
              >
                <img src={deal.aiDesign} className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-sb-yellow" />
                </div>
                <span className="absolute bottom-1 left-1 bg-sb-yellow px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-sb-black shadow-lg">AI Pitch Variant</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPending && (
        <div className="border-t border-white/10 pt-8 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-sb-yellow" />
            <h4 className="text-sm font-black uppercase text-white tracking-widest">Review Legal Specifications</h4>
          </div>
          
          <div className="bg-black border border-white/5 rounded-2xl p-6 h-48 overflow-y-auto font-mono text-xs text-gray-400 space-y-8 mb-6">
            <div>
              <p className="font-bold text-gray-200 uppercase mb-4 border-b border-white/10 pb-2 tracking-widest text-[10px]">I. Master Proposal Agreement</p>
              <p className="leading-8 whitespace-pre-wrap">PARTNERSHIP PROPOSAL: {deal.product}

Parties: {deal.fan} ("Creator") and Athlete
The Trigger Moment: {deal.type === 'Event Video' ? 'Live Event Content' : 'Purely Creative NIL Design'}
The Product: {deal.product}
Revenue Split: {100 - deal.revSplit}% to Athlete / {deal.revSplit}% to Creator
Term: This partnership is active for {deal.termRemaining} from the date of first sale.
Reporting: Payouts to be processed securely on a Monthly basis.</p>
            </div>
            <div>
              <p className="font-bold text-gray-200 uppercase mb-4 border-b border-white/10 pb-2 tracking-widest text-[10px]">II. Right of Publicity Partial Release</p>
              <p className="leading-8 whitespace-pre-wrap">{deal.type === 'Event Video' ? `LIMITED RIGHT OF PUBLICITY RELEASE\n\nGrant: Athlete grants Creator (${deal.fan}) the right to use Athlete's name, image, and likeness (NIL) solely in connection with the production, marketing, and sale of the Merch Project stemming from the captured Event Media.\n\nTerm-Bound: This right is strictly limited to ${deal.termRemaining}.` : `LIMITED RIGHT OF PUBLICITY & NIL RELEASE\n\nGrant: Athlete explicitly grants Creator (${deal.fan}) the right to use Athlete's name, image, and likeness (NIL) and monetize their face solely for the preparation, sale, and launch of the Merch Project.\n\nTerm-Bound: This right is strictly limited to ${deal.termRemaining}. Upon expiration of the Term, Creator must cease all use of Athlete's NIL and remove the product from sale, unless a renewal is signed.\n\nApproval: Athlete has the right to approve the final ${deal.product} design mockup before the first sale is made.`}</p>
            </div>
            <div>
              <p className="font-bold text-gray-200 uppercase mb-4 border-b border-white/10 pb-2 tracking-widest text-[10px]">III. Fan Copyright License</p>
              <p className="leading-8 whitespace-pre-wrap">{deal.type === 'Event Video' ? `NON-EXCLUSIVE CONTENT LICENSE (EVENT MEDIA)\n\nGrant of License: Creator (${deal.fan}) hereby grants Athlete a non-exclusive, sub-licensable, royalty-free license to use, reproduce, and display the Video/Media captured in perpetuity.\n\nScope: Athlete may use the content for social media promotion, personal branding, and the specific Merch Project defined in the Proposal.\n\nOwnership: Creator retains all underlying copyright to the media capture.` : `NON-EXCLUSIVE CONTENT LICENSE (DESIGN WORK)\n\nGrant of License: Creator (${deal.fan}) hereby grants Athlete a non-exclusive license to utilize the purely creative Merch Design for promotional purposes.\n\nOwnership: Creator retains all underlying copyright to the graphic/art elements they produced. Athlete does not own the design file but has the right to use it "only" as specified in the Merch Proposal.`}</p>
            </div>
          </div>

          <label className="flex items-start gap-4 p-4 border border-white/10 bg-white/5 rounded-xl cursor-pointer hover:border-sb-yellow transition-colors mb-6 group">
            <div className="pt-1">
              <input 
                type="checkbox" 
                checked={!!legalChecked[deal.id]} 
                onChange={() => setLegalChecked(prev => ({...prev, [deal.id]: !prev[deal.id]}))}
                className="w-5 h-5 accent-sb-yellow bg-black border-white/20 rounded cursor-pointer" 
              />
            </div>
            <p className="text-sm text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors">
              I rigorously stipulate that I have reviewed the Master Proposal, Right of Publicity Release, and all related Licenses above. I acknowledge that clicking 'Sign & Accept' acts as my irrevocable and legally binding Electronic Signature executing this partnership.
            </p>
          </label>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <button 
              onClick={() => handleSignAndAccept(deal)}
              disabled={signingId === deal.id || !legalChecked[deal.id]} 
              className="w-full md:flex-1 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all text-sm disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              {signingId === deal.id ? <><Loader2 className="w-5 h-5 animate-spin" /> Executing Contracts...</> : 'Sign & Accept Partnership'}
            </button>
            <button 
              disabled={signingId === deal.id}
              className="w-full md:w-auto px-8 bg-transparent hover:bg-red-500/10 text-gray-500 hover:text-red-500 font-bold uppercase tracking-widest py-4 border border-white/5 hover:border-red-500/30 rounded-xl transition-all text-xs"
            >
              Reject Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sb-yellow selection:text-sb-black pb-20">

      <main className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Personalized Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
             ) : (
               <div className="w-16 h-16 rounded-full bg-[#111] border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                 <Target className="w-6 h-6 text-white" />
               </div>
             )}
             <div>
               <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Welcome, {profile?.full_name || 'Athlete'}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded">Pro Roster</span>
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{profile?.school_team || 'NIL Verified'}</span>
               </div>
             </div>
          </div>
          <button onClick={() => setIsEditingProfile(true)} className="flex items-center justify-center gap-2 bg-[#111] border border-white/10 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all shadow-xl">
            <Settings className="w-4 h-4 text-white shrink-0" /> Account Settings
          </button>
        </div>

        {/* Analytics Section */}
        <div className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Lifetime Earnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Earnings Cleared</p>
              <p className="text-4xl font-black text-white">${totalEscrow.toLocaleString()}</p>
            </div>
            <div className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-sb-yellow mb-2">Pending Offers</p>
              <p className="text-4xl font-black text-white">{MOCK_INBOX.length}</p>
            </div>
            <div 
              className="bg-[#111] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-sb-yellow/50 transition-colors group relative overflow-hidden" 
              onClick={() => setShowNilCalculator(true)}
            >
               <Target className="w-8 h-8 text-sb-yellow mb-2 opacity-80 group-hover:scale-110 transition-transform" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 text-center">NIL Estimate</p>
               <p className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">Calculate Value <ChevronDown className="w-4 h-4 -rotate-90 text-sb-yellow" /></p>
            </div>
          </div>
        </div>

        {/* The Action Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: 'inbox', label: 'Offer Inbox', icon: ShieldAlert, count: MOCK_INBOX.length },
            { id: 'active', label: 'Active Monies', icon: CheckCircle, count: MOCK_ACTIVE_DEALS.length },
            { id: 'creators', label: 'Scout Creator Network', icon: Target, count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setExpandedRow(null); }}
              className={`px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-[#111] text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" /> 
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* INBOX (Pending Deals) */}
          {activeTab === 'inbox' && (
            MOCK_INBOX.length > 0 ? MOCK_INBOX.map(deal => (
              <div key={deal.id} className="bg-[#111] border border-sb-yellow/20 rounded-2xl overflow-hidden hover:border-sb-yellow/50 transition-colors shadow-[0_0_15px_rgba(247,223,2,0.05)]">
                <div onClick={() => toggleExpand(deal.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10">
                  <div className="w-full md:w-16 h-16 bg-sb-yellow/10 rounded-xl flex items-center justify-center shrink-0">
                    <PenTool className="w-6 h-6 text-sb-yellow animate-pulse" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{deal.product}</h3>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-black px-2 py-1 rounded inline-flex items-center gap-1">
                       <Shield className="w-3 h-3 text-sb-yellow" /> Originator: {deal.fan}
                     </span>
                  </div>
                  <div className="text-center md:text-right shrink-0 flex items-center gap-6">
                     <div className="text-right hidden md:block">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Revenue Cut</div>
                        <div className="text-lg font-black text-green-400">{100 - deal.revSplit}%</div>
                     </div>
                     {expandedRow === deal.id ? <ChevronUp className="w-6 h-6 text-sb-yellow" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
                  </div>
                </div>
                {expandedRow === deal.id && renderDealDetails(deal, true)}
              </div>
            )) : (
              <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center">
                <Shield className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">Inbox Zero</h3>
                <p className="text-gray-600 font-medium text-sm">You have no pending pitches. Scout the Creator Network to invite pitches.</p>
              </div>
            )
          )}

          {/* ACTIVE DEALS */}
          {activeTab === 'active' && MOCK_ACTIVE_DEALS.map(deal => (
            <div key={deal.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-colors">
              <div onClick={() => toggleExpand(deal.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10">
                <div className="w-full md:w-16 h-16 bg-black rounded-xl border border-white/5 flex items-center justify-center shrink-0">
                   <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">{deal.product}</h3>
                  <div className="mt-1">
                     <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-gray-300">Partner: {deal.fan}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Gross Paid Out</div>
                    <div className="text-2xl font-black text-white">{deal.revenue}</div>
                  </div>
                  {expandedRow === deal.id ? <ChevronUp className="w-6 h-6 text-gray-400 ml-4" /> : <ChevronDown className="w-6 h-6 text-gray-600 ml-4" />}
                </div>
              </div>
              {expandedRow === deal.id && renderDealDetails(deal, false)}
            </div>
          ))}

          {/* CREATOR NETWORK SCOUTING (Marketplace) */}
          {activeTab === 'creators' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-sb-yellow/10 to-transparent border border-sb-yellow/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                   <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2 flex items-center gap-2">
                     <Target className="w-6 h-6 text-sb-yellow" /> Expand Your Endorsements
                   </h3>
                   <p className="text-gray-400 font-medium text-sm max-w-xl">
                     Turn your NIL into a scalable machine. Scout top-rated Fans & Brands specializing in different merchandise styles and invite them to pitch you a legally binding proposal.
                   </p>
                 </div>
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={creatorSearchQuery}
                      onChange={(e) => setCreatorSearchQuery(e.target.value)}
                      placeholder="Search creators..." 
                      className="w-full bg-black border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">
                {filteredCreators.length > 0 ? filteredCreators.map(creator => (
                  <div key={creator.id} className="bg-[#111] border border-white/10 hover:border-sb-yellow/50 transition-all rounded-[2rem] p-6 group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex gap-4 items-center">
                        <img src={creator.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-black shadow" />
                        <div>
                          <h4 className="text-lg font-black uppercase tracking-tight text-white mb-1 group-hover:text-sb-yellow transition-colors">{creator.name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-sb-black bg-sb-yellow px-2 py-0.5 rounded">{creator.focus}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        {creator.dealsDone} Deals Closed
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <Star className="w-4 h-4 text-sb-yellow fill-sb-yellow" />
                        {creator.rating}
                      </div>
                    </div>

                    <button 
                      onClick={() => setRequestedPitches(prev => ({...prev, [creator.id]: true}))}
                      disabled={requestedPitches[creator.id]}
                      className={`w-full mt-6 font-black uppercase tracking-widest py-3 rounded-xl transition-all text-xs border ${
                        requestedPitches[creator.id] 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                          : 'bg-white/5 hover:bg-white text-gray-300 hover:text-black border-white/5 hover:border-transparent'
                      }`}
                    >
                      {requestedPitches[creator.id] ? (
                        <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Pitch Requested</span>
                      ) : (
                        'Request a Pitch'
                      )}
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-[#111] border border-white/5 rounded-[2rem]">
                    <Target className="w-12 h-12 text-gray-800 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-2">No Creators Found</h3>
                    <p className="text-gray-500 font-medium text-sm">Expand your search to discover new talent.</p>
                  </div>
                )}
              </div>
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

      {isEditingProfile && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditingProfile(false)} 
          onUpdated={() => window.location.reload()} 
        />
      )}

      {showNilCalculator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
           <button 
             onClick={() => { setShowNilCalculator(false); setNilEstimate(null); }} 
             className="absolute md:top-8 md:right-8 top-4 right-4 text-white hover:text-sb-yellow bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors z-10"
           >
             <X className="w-6 h-6" />
           </button>
           <div className="bg-[#111] border border-white/10 p-8 rounded-[2rem] max-w-md w-full relative">
              <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-6">NIL Value Calculator</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Current Social Following</label>
                  <input type="number" placeholder="e.g. 15000" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sb-yellow outline-none" value={nilSocialFollowing} onChange={e => setNilSocialFollowing(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Date of Last Game</label>
                  <input type="date" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sb-yellow outline-none [color-scheme:dark]" value={nilGameDate} onChange={e => setNilGameDate(e.target.value)} />
                </div>
                <div className="flex items-center justify-between bg-black border border-white/10 rounded-xl p-4 cursor-pointer" onClick={() => setNilTelevised(!nilTelevised)}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer">Was it televised?</label>
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${nilTelevised ? 'bg-sb-yellow' : 'bg-gray-800'}`}>
                    <div className={`w-4 h-4 rounded-full bg-black absolute transition-all ${nilTelevised ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-black border border-white/10 rounded-xl p-4 cursor-pointer" onClick={() => setNilInterviewed(!nilInterviewed)}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer">Were you interviewed?</label>
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${nilInterviewed ? 'bg-sb-yellow' : 'bg-gray-800'}`}>
                    <div className={`w-4 h-4 rounded-full bg-black absolute transition-all ${nilInterviewed ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
              </div>

              <button onClick={calculateNilEstimate} className="w-full bg-sb-yellow hover:bg-yellow-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all text-sm mb-4 shrink-0 shadow-[0_0_20px_rgba(247,223,2,0.1)]">
                Calculate Estimate
              </button>

              {nilEstimate && (
                <div className="mt-6 pt-6 border-t border-white/10 text-center animate-in slide-in-from-bottom-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Estimated Value Per Deal</p>
                  <p className="text-4xl font-black text-green-400">{nilEstimate}</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
