'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Shield, Briefcase, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('fan');

  useEffect(() => {
    // Read the parameter without triggering Next.js Suspense boundary requirements
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'athlete') {
      setActiveRole('athlete');
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    const userType = activeRole;

    // 1. Sign up
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setErrorMsg(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Update user_type explicitly after creation (trigger sets it to 'fan' by default)
    if (authData.user) {
      await supabase.from('profiles').update({
        user_type: userType
      }).eq('id', authData.user.id);

      // 3. Redirect to Dashboard
      window.location.href = '/dashboard';
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#111] max-w-xl w-full rounded-3xl border border-white/10 p-10 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sb-yellow/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="mb-10 text-center relative z-10">
          <h1 className="text-3xl font-black uppercase text-white tracking-tighter">In sports and business, it pays to win.</h1>
          <p className="text-gray-400 font-medium mt-3">
            Join <span className="font-black text-white"><span className="lowercase">million</span><span className="text-green-500">$</span>NIL</span> and execute modern business.
          </p>
        </div>

        {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center mb-6 relative z-10 font-bold text-sm">
               {errorMsg}
            </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <label className="cursor-pointer group" onClick={() => setActiveRole('fan')}>
              <input type="radio" name="user_type" value="fan" className="peer sr-only" checked={activeRole === 'fan'} readOnly />
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-black/50 hover:bg-white/5 transition-all peer-checked:border-sb-yellow peer-checked:bg-sb-yellow/10 flex flex-col items-center gap-3 text-center h-full">
                <User className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500 peer-checked:text-sb-yellow transition-colors" />
                <div>
                  <div className="text-white font-bold uppercase text-xs tracking-widest mb-1">I am a Fan</div>
                  <div className="text-gray-500 text-[10px] leading-tight">Draft proposals and secure athlete partnerships.</div>
                </div>
              </div>
            </label>

            <label className="cursor-pointer group" onClick={() => setActiveRole('athlete')}>
              <input type="radio" name="user_type" value="athlete" className="peer sr-only" checked={activeRole === 'athlete'} readOnly />
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-black/50 hover:bg-white/5 transition-all peer-checked:border-sb-yellow peer-checked:bg-sb-yellow/10 flex flex-col items-center gap-3 text-center h-full">
                <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500 peer-checked:text-sb-yellow transition-colors" />
                <div>
                  <div className="text-white font-bold uppercase text-xs tracking-widest mb-1">I am an Athlete</div>
                  <div className="text-gray-500 text-[10px] leading-tight">Accept deals, sign merch, and monetize your NIL.</div>
                </div>
              </div>
            </label>
            
            <label className="cursor-pointer group" onClick={() => setActiveRole('business')}>
              <input type="radio" name="user_type" value="business" className="peer sr-only" checked={activeRole === 'business'} readOnly />
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-black/50 hover:bg-white/5 transition-all peer-checked:border-sb-yellow peer-checked:bg-sb-yellow/10 flex flex-col items-center gap-3 text-center h-full">
                <Briefcase className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500 peer-checked:text-sb-yellow transition-colors" />
                <div>
                  <div className="text-white font-bold uppercase text-[10px] sm:text-xs tracking-widest mb-1 text-balance">I'm a Business, man</div>
                  <div className="text-gray-500 text-[10px] leading-tight">Propose high-value verified brand campaigns.</div>
                </div>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Stage Name / Full Name</label>
              <input name="full_name" required placeholder={activeRole === 'fan' ? "Jordan Fan" : activeRole === 'business' ? "Acme Sports Inc." : "Marcus Elite"} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white hover:border-white/20 focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow outline-none transition-all placeholder:text-gray-700 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Email Address</label>
              <input name="email" type="email" required placeholder="scout@millionsnil.com" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white hover:border-white/20 focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow outline-none transition-all placeholder:text-gray-700 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Password</label>
              <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white hover:border-white/20 focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow outline-none transition-all placeholder:text-gray-700 tracking-widest font-mono" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-sb-yellow hover:bg-yellow-400 text-sb-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-sb-yellow/20 mt-4 disabled:opacity-50 disabled:pointer-events-none">
            {loading ? 'Authenticating...' : 'Enter the Portal'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
