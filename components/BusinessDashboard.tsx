'use client';

import { useState } from 'react';
import { Briefcase, ArrowRight, Search, CheckCircle2, ChevronDown, ChevronUp, FileText, CheckCircle, XCircle, Calendar, DollarSign, PieChart, Clock } from 'lucide-react';
import Link from 'next/link';

const MOCK_CAMPAIGNS = [
  { id: 1, athlete: 'Cameron Boozer', campaignTitle: 'Heritage Spring Game Promo', status: 'approved', deliverables: '2 IG Reels, 1 TikTok, Signed Jersey', offer: '$15,000', timelineDays: 14, date: 'Jan 15, 2026', thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop' },
  { id: 2, athlete: 'AJ Dybantsa', campaignTitle: 'Post-Season Apparel Launch', status: 'pending', deliverables: '1 Promo Video, 3 IG Stories', offer: '$8,500', timelineDays: 7, date: 'Mar 01, 2026', thumbnail: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=500&h=300&fit=crop' },
  { id: 3, athlete: 'Yaxel Lendeborg', campaignTitle: 'Local Dealership Appearance', status: 'rejected', deliverables: '2 Hour Autograph Session', offer: '$2,500', timelineDays: 1, date: 'Feb 10, 2026', thumbnail: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500&h=300&fit=crop' },
  { id: 4, athlete: 'Darryn Peterson', campaignTitle: 'Sneaker Campaign Shoot', status: 'draft', deliverables: 'Full Day Photo Shoot', offer: '$22,000', timelineDays: 30, date: 'Mar 19, 2026', thumbnail: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=500&h=300&fit=crop' },
];

export function BusinessDashboard({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState<'discover' | 'active' | 'drafts' | 'past'>('discover');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleExpand = (id: number) => setExpandedRow(prev => prev === id ? null : id);

  const activeCount = MOCK_CAMPAIGNS.filter(c => c.status === 'approved' || c.status === 'pending').length;
  const draftCount = MOCK_CAMPAIGNS.filter(c => c.status === 'draft').length;

  const activeList = MOCK_CAMPAIGNS.filter(c => c.status === 'approved' || c.status === 'pending');
  const pastList = MOCK_CAMPAIGNS.filter(c => c.status === 'rejected');
  const draftList = MOCK_CAMPAIGNS.filter(c => c.status === 'draft');

  const renderExpandedPanel = (campaign: any) => (
    <div className="w-full mt-4 p-6 border-t border-white/5 bg-black/40 rounded-b-2xl grid md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
      <div>
        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Contract Terms</h4>
        <ul className="space-y-3 text-sm font-medium text-gray-300">
          <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Athlete:</span> <span className="text-white">{campaign.athlete}</span></li>
          <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Offer Amount:</span> <span className="text-green-400 font-bold">{campaign.offer}</span></li>
          <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Deliverables:</span> <span className="text-white opacity-90">{campaign.deliverables}</span></li>
          <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Timeline:</span> <span>{campaign.timelineDays} Days</span></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Campaign Visuals</h4>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden border border-white/10 relative">
            <img src={campaign.thumbnail} className="object-cover w-full h-full opacity-60 hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-1 bg-black/80 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-sm">Moodboard</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sb-yellow/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sb-yellow/10 border border-sb-yellow/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.1)]">
              <Briefcase className="w-6 h-6 text-sb-yellow" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-widest">Business Portal</h1>
              <p className="text-xs text-gray-400 font-mono tracking-wider">{profile?.full_name || 'Brand Enterprise'} • CRM Data</p>
            </div>
          </div>
          
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 overflow-x-auto max-w-full">
            <button onClick={() => setActiveTab('discover')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'discover' ? 'bg-sb-yellow text-sb-black shadow-lg shadow-sb-yellow/20' : 'text-gray-400 hover:text-white'}`}>Discover</button>
            <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-sb-yellow text-sb-black shadow-lg shadow-sb-yellow/20' : 'text-gray-400 hover:text-white flex items-center gap-2'}`}>Active Deals {activeCount > 0 && <span className="bg-green-500 text-black px-1.5 py-0.5 rounded-full text-[10px] leading-none">{activeCount}</span>}</button>
            <button onClick={() => setActiveTab('drafts')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'drafts' ? 'bg-sb-yellow text-sb-black shadow-lg shadow-sb-yellow/20' : 'text-gray-400 hover:text-white flex items-center gap-2'}`}>Drafts {draftCount > 0 && <span className="bg-sb-yellow text-black px-1.5 py-0.5 rounded-full text-[10px] leading-none">{draftCount}</span>}</button>
            <button onClick={() => setActiveTab('past')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'past' ? 'bg-sb-yellow text-sb-black shadow-lg shadow-sb-yellow/20' : 'text-gray-400 hover:text-white'}`}>Past</button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 space-y-10">
        
        {/* NEW CRM WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-[#111] border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-sb-yellow/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" /> Deal Pipeline
              </h3>
            </div>
            <p className="text-4xl font-black text-white">$48,000</p>
            <p className="text-xs font-bold uppercase tracking-widest text-green-400 mt-2">Allocated Budget</p>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-sb-yellow/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sb-yellow/10 blur-[50px] rounded-full" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sb-yellow" /> Active Campaigns
              </h3>
            </div>
            <p className="text-4xl font-black text-white">{activeCount}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-sb-yellow mt-2">In Progress Deals</p>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-sb-yellow/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Next Deliverable
              </h3>
            </div>
            <p className="text-xl md:text-2xl font-black text-white tracking-tight line-clamp-1">April 14, 2026</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-2">AJ Dybantsa • Video Post</p>
          </div>
        </div>

        {/* Pending Action Box for Business */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group shadow-lg hover:border-white/20 transition-all">
          <div className="relative z-10 basis-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full font-bold uppercase text-xs tracking-widest mb-4 text-white">
               Business Objectives
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-tight mb-4">
              {draftCount > 0 ? 'Finalize Your Pitch' : 'Start a New Campaign'}
            </h2>
            <p className="text-gray-400 font-medium md:text-lg max-w-xl">
              {draftCount > 0 
                ? 'You have an unfinished $22k deal for Darryn Peterson. Lock in the deliverables and request signature.' 
                : 'Browse the athlete roster to find the perfect demographic match for your brand\'s next marketing push.'}
            </p>
          </div>
          <Link href={draftCount > 0 ? "/campaign/draft?athleteName=Darryn%20Peterson" : "/athletes"} className="relative z-10 shrink-0 bg-sb-yellow text-black px-8 py-4 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(247,223,2,0.3)]">
            {draftCount > 0 ? 'Edit Campaign' : 'Scout Roster'}
            <ArrowRight className="w-5 h-5 text-black" />
          </Link>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'discover' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter">Athletes Roster.</h2>
                  <p className="text-gray-400 font-medium">Find the perfect partner for your brand's next campaign.</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search by sport or school..." className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow transition-all w-full sm:w-72" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Marcus Elite', sport: 'Basketball • D1 Guard', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
                  { name: 'Sarah Velocity', sport: 'Track • Sprinter', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  { name: 'Trey Cannon', sport: 'Football • QB', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
                ].map((ath, i) => (
                  <div key={i} className="group relative bg-[#111] rounded-3xl border border-white/10 p-6 hover:border-sb-yellow/30 transition-all hover:-translate-y-1 overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />
                    
                    <div className="relative z-20 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden border-2 border-white/20 relative group-hover:border-sb-yellow/50 transition-colors">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${ath.name}`} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${ath.color}`}>
                            <CheckCircle2 className="w-3 h-3" /> Fully Vetted
                          </div>
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-1 group-hover:text-sb-yellow transition-colors">{ath.name}</h3>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">{ath.sport}</p>
                      </div>
                      
                      <Link href={`/campaign/draft?athleteName=${encodeURIComponent(ath.name)}`} className="w-full mt-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-sb-yellow text-white hover:text-black border border-white/10 hover:border-sb-yellow py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                        Draft Pitch <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black tracking-tighter mb-6">Active & Pending Deals</h2>
              {activeList.map(campaign => (
                <div key={campaign.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-sb-yellow/30 transition-colors">
                  <div onClick={() => toggleExpand(campaign.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10">
                    <div className="w-full md:w-16 h-16 bg-black rounded-xl border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                       <CheckCircle className={`w-8 h-8 ${campaign.status === 'approved' ? 'text-green-500' : 'text-sb-yellow animate-pulse'}`} />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-black uppercase tracking-tight">{campaign.campaignTitle}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{campaign.athlete} • {campaign.offer}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                      <span className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border ${campaign.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-sb-yellow/10 text-sb-yellow border-sb-yellow/30'}`}>
                        {campaign.status}
                      </span>
                      {expandedRow === campaign.id ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
                    </div>
                  </div>
                  {expandedRow === campaign.id && renderExpandedPanel(campaign)}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black tracking-tighter mb-6">Unsaved Drafts</h2>
              {draftList.map(campaign => (
                <div key={campaign.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-sb-yellow/30 transition-colors">
                  <div onClick={() => toggleExpand(campaign.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10">
                    <div className="w-full md:w-16 h-16 bg-black rounded-xl border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                       <FileText className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-black uppercase tracking-tight">{campaign.campaignTitle}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Target: {campaign.athlete}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                      <Link href={`/campaign/draft?athleteName=${encodeURIComponent(campaign.athlete)}`} className="text-xs font-bold uppercase tracking-widest text-sb-yellow border border-sb-yellow/20 hover:bg-sb-yellow hover:text-sb-black px-6 py-3 rounded-full transition-all">
                        Edit Draft
                      </Link>
                      {expandedRow === campaign.id ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
                    </div>
                  </div>
                  {expandedRow === campaign.id && renderExpandedPanel(campaign)}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black tracking-tighter mb-6">Historical Campaigns</h2>
              {pastList.map(campaign => (
                <div key={campaign.id} className="bg-black border border-white/5 rounded-2xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                  <div onClick={() => toggleExpand(campaign.id)} className="p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative z-10">
                    <div className="w-full md:w-16 h-16 bg-black rounded-xl border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                       <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-black uppercase tracking-tight text-gray-300">{campaign.campaignTitle}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Passed by: {campaign.athlete}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                      <span className="px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border bg-red-500/10 text-red-500 border-red-500/30">
                        Rejected
                      </span>
                      {expandedRow === campaign.id ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
                    </div>
                  </div>
                  {expandedRow === campaign.id && renderExpandedPanel(campaign)}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
