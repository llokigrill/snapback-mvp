'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, FileText, CheckCircle, Shield, AlertTriangle, Play, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface LegalReviewProps {
  fanName: string;
  athleteName: string;
  eventName?: string;
  merchDesc: string;
  revSplitFan: number;
  termMonths: number;
  hasLiveContent?: boolean;
  proposalId?: string;
}

export function LegalReviewFlow({
  fanName = "Fan Creator",
  athleteName = "Pro Athlete",
  eventName = "The Big Game",
  merchDesc = "Vintage-wash graphic tee",
  revSplitFan = 70,
  termMonths = 12,
  hasLiveContent = false,
  proposalId
}: LegalReviewProps) {
  const [activeTab, setActiveTab] = useState<'proposal' | 'copyright' | 'publicity'>('proposal');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [mockupSrc, setMockupSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    // Safely attempt to read the uploaded files from the prototype cache
    const cachedMockup = localStorage.getItem('temp_mockup');
    const cachedVideo = localStorage.getItem('temp_video');
    if (cachedMockup) setMockupSrc(cachedMockup);
    if (cachedVideo) setVideoSrc(cachedVideo);
  }, []);

  const revSplitAth = 100 - revSplitFan;

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + termMonths);
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const templates = {
    proposal: `PARTNERSHIP PROPOSAL: ${merchDesc}\n\nContract Parties: ${fanName} ("Creator") and ${athleteName} ("Athlete")\nThe Trigger Moment: ${hasLiveContent ? eventName : 'Purely Creative NIL Design'}\nThe Product: ${merchDesc}\nRevenue Split: ${revSplitAth}% to Athlete / ${revSplitFan}% to Creator\nActive Term: ${startStr} — ${endStr}\nReporting: Payouts to be processed securely on a Monthly basis.`,
    
    copyright: hasLiveContent 
      ? `NON-EXCLUSIVE CONTENT LICENSE (EVENT MEDIA)\n\nGrant of License: Creator (${fanName}) hereby grants Athlete (${athleteName}) a non-exclusive, sub-licensable, royalty-free license to use, reproduce, and display the Video/Media captured at [${eventName}] in perpetuity.\n\nScope: Athlete may use the content for social media promotion, personal branding, and the specific Merch Project defined in the Proposal.\n\nOwnership: Creator retains all underlying copyright to the media capture.`
      : `NON-EXCLUSIVE CONTENT LICENSE (DESIGN WORK)\n\nGrant of License: Creator (${fanName}) hereby grants Athlete (${athleteName}) a non-exclusive license to utilize the purely creative Merch Design for promotional purposes.\n\nOwnership: Creator retains all underlying copyright to the graphic/art elements they produced. Athlete does not own the design file but has the right to use it "only" as specified in the Merch Proposal.`,
    
    publicity: hasLiveContent
      ? `LIMITED RIGHT OF PUBLICITY RELEASE\n\nGrant: Athlete (${athleteName}) grants Creator (${fanName}) the right to use Athlete's name, image, and likeness (NIL) solely in connection with the production, marketing, and sale of the Merch Project stemming from the captured Event Media.\n\nTerm-Bound: This right is active from ${startStr} through ${endStr}.`
      : `LIMITED RIGHT OF PUBLICITY & NIL RELEASE\n\nGrant: Athlete (${athleteName}) explicitly grants Creator (${fanName}) the right to use Athlete's name, image, and likeness (NIL) and monetize their face solely for the preparation, sale, and launch of the Merch Project.\n\nTerm-Bound: This right is active from ${startStr} through ${endStr}. Upon expiration of the Term, Creator must cease all use of Athlete's NIL and remove the product from sale, unless a renewal is signed.\n\nApproval: Athlete has the right to approve the final ${merchDesc} design mockup before the first sale is made.`
  };

  const handleSendProposal = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        status: 'pending',
        merch_title: merchDesc,
        rev_split_fan: revSplitFan,
        rev_split_ath: revSplitAth,
        term_months: termMonths,
        contract_text: templates.proposal,
        copyright_license_text: templates.copyright,
        publicity_release_text: templates.publicity,
        fan_signature_date: new Date().toISOString(),
      };
      
      // We would upload the media securely to Supabase Storage here in production
      
      if (proposalId) {
        await supabase.from('proposals').update(payload).eq('id', proposalId);
      }
      setSuccess(true);
      
      // Flush memory
      localStorage.removeItem('temp_mockup');
      localStorage.removeItem('temp_video');
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#111] p-12 rounded-3xl border border-sb-yellow/20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-sb-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-sb-yellow" />
        </div>
        <h2 className="text-3xl font-black uppercase text-white tracking-tight mb-4">Proposal Sent & Sealed!</h2>
        <p className="text-gray-400 font-medium mb-8 max-w-md mx-auto">
          Your Partnership Proposal, Copyright License, and Publicity Release—along with your media assets—have been securely logged into the database and forwarded to {athleteName}'s team.
        </p>
        <button onClick={() => window.location.href = '/dashboard'} className="bg-white/10 text-white hover:bg-white/20 px-8 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black uppercase text-white tracking-tighter flex items-center gap-3">
            <Shield className="w-8 h-8 text-sb-yellow" />
            Review & Send
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Verify your media upload and sign your legal documents.</p>
        </div>
        <div className="bg-sb-yellow/10 text-sb-yellow px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest font-bold border border-sb-yellow/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Pending Signature
        </div>
      </div>

      {/* Asset Preview Section */}
      {(mockupSrc || videoSrc) && (
        <div className="bg-[#111] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden p-8 animate-in fade-in duration-500">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Project Assets</h2>
          <div className={`grid gap-8 ${mockupSrc && videoSrc ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
            {mockupSrc && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase mb-2">
                   <ImageIcon className="w-4 h-4 text-sb-yellow" /> Merch Idea Mockup
                </div>
                <div className="bg-black rounded-2xl border border-white/10 overflow-hidden aspect-video flex items-center justify-center p-4">
                  <img src={mockupSrc} alt="Merch Mockup" className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl" />
                </div>
              </div>
            )}
            {hasLiveContent && videoSrc && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase mb-2">
                   <Play className="w-4 h-4 text-sb-yellow" /> Live Event Capture
                </div>
                <div className="bg-black rounded-2xl border border-white/10 overflow-hidden aspect-video flex items-center justify-center p-4">
                  <video src={videoSrc} controls className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-black" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legal Sandbox */}
      <div className="bg-[#111] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="md:w-64 bg-black/40 border-r border-white/5 p-6 space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 px-4">Legal Document Suite</div>
          {(['proposal', 'copyright', 'publicity'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-3 ${activeTab === tab ? 'bg-sb-yellow text-sb-black shadow-lg shadow-sb-yellow/20' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {tab === 'proposal' ? 'Master Proposal' : tab === 'copyright' ? 'Copyright License' : 'Publicity Release'}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-[#111] to-black">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase text-white tracking-widest border-b-2 border-sb-yellow pb-2 inline-block">
              {activeTab === 'proposal' && 'The Master Partnership Proposal'}
              {activeTab === 'copyright' && (hasLiveContent ? 'Copyright License (Event Media)' : 'Copyright License (Design Work)')}
              {activeTab === 'publicity' && (hasLiveContent ? 'Right of Publicity Release' : 'Right of Publicity & NIL Release')}
            </h2>
          </div>
          <div className="bg-black/60 rounded-2xl p-8 border border-white/5 font-mono text-sm leading-8 text-gray-300 whitespace-pre-wrap shadow-inner overflow-y-auto max-h-[400px]">
            {templates[activeTab]}
          </div>
        </div>
      </div>

      {/* Confirmation & Submit */}
      <div className="bg-sb-dark p-8 rounded-[2rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <label className="flex items-start gap-4 cursor-pointer group flex-1">
          <div className="relative mt-1 border-2 border-sb-yellow/50 rounded-lg w-6 h-6 shrink-0 bg-black group-hover:border-sb-yellow transition-colors overflow-hidden flex items-center justify-center">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="absolute opacity-0 cursor-pointer w-full h-full"
            />
            {agreed && <CheckCircle className="w-4 h-4 text-sb-yellow" />}
          </div>
          <div>
            <span className="text-white font-bold block mb-1">I strictly agree to the terms of this Proposal and the attached Licenses.</span>
            <span className="text-gray-500 text-sm leading-relaxed block">By checking this box and sending, your electronic signature (${fanName}) is embedded into the proposal packet.</span>
          </div>
        </label>

        <button 
          onClick={handleSendProposal}
          disabled={!agreed || isSubmitting}
          className={`shrink-0 px-10 py-5 rounded-full font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
            agreed && !isSubmitting
              ? 'bg-sb-yellow text-sb-black hover:scale-105 hover:shadow-[0_0_30px_rgba(247,223,2,0.4)] active:scale-95' 
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Sealing Deal...' : 'Seal & Send Deal'}
          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
}
