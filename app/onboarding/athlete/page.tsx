'use client';

import { useState } from 'react';
import { Shield, MapPin, GraduationCap, DollarSign, Camera, ArrowRight, Zap } from 'lucide-react';

export default function AthleteOnboarding() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // In production, this would UPDATE the profiles table where user_id = auth.uid()
    // and set is_searchable = true
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Complete Your Roster File</h1>
          <p className="text-gray-400 mt-2 font-medium">Verify your public metadata so Fans & Brands can scout you.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Profile Photo Placeholder */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 bg-black flex flex-col items-center justify-center group cursor-pointer hover:border-sb-yellow transition-colors">
              <Camera className="w-8 h-8 text-gray-500 group-hover:text-sb-yellow mb-2" />
              <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-sb-yellow">Upload Headshot</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Team / University
              </label>
              <input required type="text" placeholder="e.g. State University Football" 
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-white outline-none transition-all placeholder:text-gray-700 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> City, State
              </label>
              <input required type="text" placeholder="e.g. Los Angeles, CA" 
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-white outline-none transition-all placeholder:text-gray-700 font-medium" />
            </div>
          </div>

          <div className="relative z-10">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Short Bio / Pitch</label>
            <textarea required rows={3} placeholder="Tell brands your vibe, style, and what merch you love to rep..." 
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-white outline-none transition-all placeholder:text-gray-700 font-medium resize-none" />
          </div>

          <div className="relative z-10 bg-white/5 p-6 rounded-2xl border border-white/10">
            <label className="text-[10px] font-black uppercase text-white tracking-[0.2em] block mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" /> Minimum Deal Size / Standard Rate
            </label>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-gray-500">$</span>
              <input type="number" placeholder="500" 
                className="flex-1 bg-transparent border-b-2 border-white/20 px-2 py-2 text-3xl font-black text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-800" />
            </div>
            <p className="text-xs text-gray-500 mt-4 font-medium">This automatically filters out spam proposals under your target threshold.</p>
          </div>

          <button type="submit" disabled={isProcessing} className="w-full relative z-10 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] disabled:opacity-50 hover:-translate-y-1">
            {isProcessing ? 'Verifying Identity...' : 'Join Roster Directory'}
            {!isProcessing && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
