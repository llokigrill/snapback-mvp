'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, FileVideo, Image as ImageIcon, ArrowRight, Zap, Loader2, Wand2, Search, CheckCircle } from 'lucide-react';

export default function DraftProposalPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    athleteName: '',
    merchDesc: '',
    revSplitFan: 70,
    termMonths: 12,
    hasLiveContent: false,
    eventName: '',
    eventLocation: '',
    athleteAction: '',
  });

  const [isRecipientLocked, setIsRecipientLocked] = useState(false);

  // Automatically pre-populate the form if navigating directly from the Athlete Directory
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const incomingName = params.get('athleteName');
      if (incomingName) {
        setFormData(prev => ({ ...prev, athleteName: incomingName }));
        setIsRecipientLocked(true);
      }
    }
  }, []);

  const [mockupName, setMockupName] = useState<string | null>(null);
  const [mockupPreview, setMockupPreview] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  
  // AI Generation State
  const [aiCredits, setAiCredits] = useState(3);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiDesign, setGeneratedAiDesign] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'mockup' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'mockup') setMockupName(file.name);
    if (type === 'video') setSourceName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data === 'string') {
        localStorage.setItem(`temp_${type}`, base64data);
        if (type === 'mockup') setMockupPreview(base64data);
      }
    };
    reader.readAsDataURL(file);
  };

  const DEMO_AI_VARIANTS = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'https://images.unsplash.com/photo-1588143890834-fe5458142340?w=800&q=80',
    'https://images.unsplash.com/photo-1572973415112-985834d8cc38?w=800&q=80',
    'https://images.unsplash.com/photo-1627483262268-9c2b5b02900a?w=800&q=80'
  ];

  const handleGenerateAi = () => {
    if (aiCredits <= 0) return;
    
    setIsGeneratingAi(true);

    setTimeout(() => {
      // Use deterministic high-quality assets to guarantee functional demo UI state without risking API blocks
      const aiUrl = DEMO_AI_VARIANTS[Math.floor(Math.random() * DEMO_AI_VARIANTS.length)];
      setGeneratedAiDesign(aiUrl);
      setAiCredits(prev => prev - 1);
      setIsGeneratingAi(false);
      localStorage.setItem('temp_aidesign', aiUrl);
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const params = new URLSearchParams({
      athleteName: formData.athleteName,
      merchDesc: formData.merchDesc,
      revSplitFan: formData.revSplitFan.toString(),
      termMonths: formData.termMonths.toString(),
      eventName: formData.hasLiveContent ? formData.eventName : 'N/A',
      hasLiveContent: formData.hasLiveContent.toString(),
    });

    setTimeout(() => {
        router.push(`/proposals/review?${params.toString()}`);
    }, 800);
  };

  // Hide AI features for demo
  const showAiPanel = false; // mockupName !== null || sourceName !== null;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 border-b border-white/10 pb-6 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Zap className="w-8 h-8 text-sb-yellow" />
              Draft New Deal
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Structure your partnership and upload your media assets.</p>
          </div>
          {/* AI Credits hidden for demo */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Step 1: The Core Deal */}
          <div className="bg-[#111] p-8 md:p-12 rounded-[2rem] border border-white/5 space-y-8">
            <h2 className="text-xl font-black uppercase text-sb-yellow tracking-widest border-b border-white/10 pb-4">1. The Partnership</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center justify-between text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-2">
                  <span>Target Athlete <span className="text-red-500">*</span></span>
                  {isRecipientLocked && <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> VERIFIED</span>}
                </label>
                {isRecipientLocked ? (
                  <div className="w-full bg-sb-yellow/5 border border-sb-yellow/20 rounded-xl px-4 py-3 flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black overflow-hidden border border-sb-yellow/30 shadow-lg flex items-center justify-center">
                        <span className="text-sb-yellow font-black uppercase text-sm tracking-widest">{formData.athleteName.substring(0, 2)}</span>
                      </div>
                      <div>
                        <div className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-1">
                          {formData.athleteName} <Shield className="w-3 h-3 text-sb-yellow" />
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Official Roster Match</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => { setIsRecipientLocked(false); setFormData(p => ({...p, athleteName: ''})); }} className="text-[10px] uppercase font-bold text-gray-500 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md">
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input required type="text" placeholder="Search official roster by name..." 
                      value={formData.athleteName} onChange={e => setFormData({...formData, athleteName: e.target.value})}
                      onBlur={() => {
                        if (formData.athleteName.length > 3) {
                          // Mock verifying the input if they typed a long enough name manually
                          setIsRecipientLocked(true);
                        }
                      }}
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 pl-12 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 font-medium" />
                    <Search className="w-5 h-5 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Merch Idea / Title</label>
                <input required type="text" placeholder="e.g., The Buzzer Beater Tee" 
                  value={formData.merchDesc} onChange={e => setFormData({...formData, merchDesc: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Revenue Split (Your Cut %)</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="99" value={formData.revSplitFan} onChange={e => setFormData({...formData, revSplitFan: parseInt(e.target.value)})}
                    className="w-full accent-sb-yellow" />
                  <span className="font-mono font-bold text-sb-yellow text-xl">{formData.revSplitFan}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest">{100 - formData.revSplitFan}% goes to Athlete</div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Term Length (Months)</label>
                <input required type="number" min="1" placeholder="12" 
                  value={formData.termMonths} onChange={e => setFormData({...formData, termMonths: parseInt(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700" />
              </div>
            </div>
          </div>

          {/* Step 2: Content Assets & Legal Triggers */}
          <div className="bg-[#111] p-8 md:p-12 rounded-[2rem] border border-white/5 space-y-8">
            <h2 className="text-xl font-black uppercase text-sb-yellow tracking-widest border-b border-white/10 pb-4">2. Intellectual Property</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Always Required: The Mockup */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block">Merch Content Idea (Image)</label>
                <label 
                  className={`border-2 border-dashed ${mockupName ? 'border-sb-yellow bg-sb-yellow/5' : 'border-white/20 bg-black'} rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-sb-yellow transition-colors relative overflow-hidden h-[180px] group`}
                >
                  <input type="file" accept="image/*" required className="hidden" onChange={(e) => handleFileUpload(e, 'mockup')} />
                  
                  {mockupPreview && (
                    <img src={mockupPreview} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <ImageIcon className={`w-10 h-10 ${mockupName ? 'text-sb-yellow' : 'text-gray-600'}`} />
                    <div className="text-center">
                      <span className="font-bold text-sm block mb-1 text-white line-clamp-1">{mockupName ? mockupName : 'Upload Design Mockup'}</span>
                      <span className="text-xs text-gray-400">{mockupName ? 'Stored securely for review.' : 'JPG, PNG, WEBP'}</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Conditional Event Capture */}
              <div className="space-y-4 border-l border-white/5 pl-8">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-4">Did you capture live event content?</label>
                
                <div className="flex bg-black p-1 rounded-xl border border-white/10 mb-6 w-full">
                  <button type="button" onClick={() => setFormData({...formData, hasLiveContent: false})} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${!formData.hasLiveContent ? 'bg-[#222] text-white shadow' : 'text-gray-500 hover:text-white'}`}>No, Just Design</button>
                  <button type="button" onClick={() => setFormData({...formData, hasLiveContent: true})} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${formData.hasLiveContent ? 'bg-sb-yellow text-sb-black shadow' : 'text-gray-500 hover:text-white'}`}>Yes, I Have Video</button>
                </div>

                {formData.hasLiveContent ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Event Title</label>
                      <input required type="text" placeholder="e.g. UConn vs SDSU - Final Four" 
                        value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Event Location / Stadium</label>
                      <input required type="text" placeholder="e.g. Madison Square Garden" 
                        value={formData.eventLocation} onChange={e => setFormData({...formData, eventLocation: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Key Athlete Action Captured</label>
                      <input required type="text" placeholder="e.g. Game-winning 3-pointer buzzer beater" 
                        value={formData.athleteAction} onChange={e => setFormData({...formData, athleteAction: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700" />
                    </div>
                    <label 
                      className={`border-2 border-dashed ${sourceName ? 'border-sb-yellow bg-sb-yellow/5' : 'border-white/20 bg-black'} rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-sb-yellow transition-colors mt-6`}
                    >
                      <input type="file" accept="video/*" required className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                      <FileVideo className={`w-8 h-8 ${sourceName ? 'text-sb-yellow' : 'text-gray-600'}`} />
                      <div className="text-center">
                        <span className="font-bold text-xs block mb-1 text-white line-clamp-1">{sourceName ? sourceName : 'Upload Event Video'}</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center animate-in fade-in duration-300">
                    <div className="bg-black/50 border border-white/5 rounded-2xl p-6 text-center">
                      <Shield className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Since you did not capture live content, your proposal will dynamically route legal language requiring the athlete to explicitly sign over Right of Publicity & NIL solely for your creative design setup.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Generator Panel (Appears after an upload) */}
            {showAiPanel && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-in slide-in-from-top-4 duration-500">
                 <div className="bg-gradient-to-r from-sb-yellow/10 to-transparent border border-sb-yellow/20 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
                   <div className="flex-1">
                     <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2 flex items-center gap-2">
                       <Wand2 className="w-5 h-5 text-sb-yellow" /> AI Style Enhancer
                     </h3>
                     <p className="text-gray-400 text-sm font-medium">Use 1 AI Credit to automatically generate a highly stylized, commercial variation based on your uploaded source media.</p>
                   </div>
                   
                   {!generatedAiDesign ? (
                     <button type="button" onClick={handleGenerateAi} disabled={isGeneratingAi || aiCredits <= 0} className="shrink-0 bg-sb-yellow hover:bg-yellow-400 text-sb-black font-black uppercase tracking-widest px-6 py-4 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50">
                       {isGeneratingAi ? <><Loader2 className="w-5 h-5 animate-spin" /> Abstracting...</> : 'Generate AI Variant'}
                     </button>
                   ) : (
                     <div className="shrink-0 flex items-center gap-4">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-sb-yellow bg-sb-yellow/10 px-3 py-1.5 rounded-full border border-sb-yellow/20">Success</span>
                       <div className="w-16 h-16 rounded-xl border-2 border-sb-yellow/50 overflow-hidden shadow-[0_0_20px_rgba(247,223,2,0.2)]">
                          <img src={generatedAiDesign} className="w-full h-full object-cover" />
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={isProcessing || !mockupName} className="w-full bg-sb-yellow hover:bg-yellow-400 text-sb-black font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0 shadow-[0_10px_40px_rgba(247,223,2,0.2)] disabled:opacity-50 disabled:pointer-events-none">
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Packaging Assets...
              </>
            ) : (
              <>
                Generate Legal Contracts & Review
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
