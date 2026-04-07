'use client';

import { useState, useEffect } from 'react';
import { Briefcase, ArrowLeft, Send, CheckCircle2, ChevronDown, Monitor, Store, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function BusinessDraftPage() {
  const [athleteName, setAthleteName] = useState('Prospect');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [campaignType, setCampaignType] = useState('commercial');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('athleteName')) {
      setAthleteName(params.get('athleteName') as string);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mocking B2B database dispatch
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }, 1500);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white text-center">
        <div className="animate-in zoom-in duration-500 fade-in flex flex-col items-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Pitch Dispatched.</h1>
          <p className="text-gray-400 font-medium">Your business offer has been securely routed to {athleteName}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-sb-yellow selection:text-sb-black">
      <div className="max-w-3xl mx-auto relative z-10">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-sb-yellow font-bold uppercase text-xs tracking-widest mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> CRM Dashboard
        </Link>
        
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sb-yellow/10 border border-sb-yellow/20 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] mb-4 text-sb-yellow">
            <Briefcase className="w-3 h-3" /> Business Proposal Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3">
            Drafting Pitch for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">{athleteName}</span>
          </h1>
          <p className="text-gray-400 font-medium">Outline your deliverables, required timeline, and upfront compensation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sb-yellow/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Campaign Scope / Flexibility Logic */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Business Objective</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'commercial', title: 'Local Commercial', icon: Monitor, desc: 'TV/Video Ads' },
                { id: 'appearance', title: 'On-Site Appearance', icon: Store, desc: 'Events/Signings' },
                { id: 'promo', title: 'Product Naming', icon: ShoppingBag, desc: 'Menu Items/Merch' },
              ].map(type => (
                 <div 
                   key={type.id} 
                   onClick={() => setCampaignType(type.id)}
                   className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${campaignType === type.id ? 'bg-sb-yellow/10 border-sb-yellow text-sb-yellow' : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30'}`}
                 >
                   <type.icon className="w-6 h-6" />
                   <div>
                     <div className="font-black uppercase text-xs tracking-widest">{type.title}</div>
                     <div className="text-[10px] opacity-70">{type.desc}</div>
                   </div>
                 </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">The Pitch Detail</label>
            <textarea 
              required
              placeholder={
                campaignType === 'commercial' 
                  ? "Example: We run a local car dealership and want to shoot a 30-second commercial script where you sit in our newest truck... " 
                  : campaignType === 'appearance' 
                  ? "Example: Looking for a 2-hour meet and greet appearance at our flagship store opening..."
                  : "Example: We want to name our new premium turkey sandwich after you for the summer..."}
              className="w-full h-32 bg-black border border-white/10 rounded-xl p-5 text-sm text-white focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow transition-all outline-none resize-none placeholder:text-gray-700 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Required Deliverables</label>
              <input type="text" required placeholder="e.g., 1 Video Shoot, 2 IG Posts" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 font-medium text-sm" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Timeline Limit / Expiry</label>
              <div className="relative">
                <input type="number" required placeholder="14" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 font-medium pl-14" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">Days</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center justify-between">
              <span>Financial Offer Structure</span>
              <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Base Escrow Standard</span>
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 font-black text-xl">$</span>
              <input type="text" required placeholder="5,000" className="w-full bg-black border border-white/10 rounded-xl px-10 py-5 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-gray-700 font-black text-xl tracking-widest pl-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-sb-yellow hover:bg-yellow-400 text-sb-black font-black uppercase tracking-widest py-5 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] mt-6 disabled:opacity-50">
            {loading ? 'Securing Contract Terms...' : 'Dispatch Binding Pitch'}
            {!loading && <Send className="w-5 h-5" />}
          </button>
        </form>

      </div>
    </div>
  );
}
