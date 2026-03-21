'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setErrorMsg(signInError.message);
      setLoading(false);
      return;
    }

    // Redirect to Dashboard on success
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#111] max-w-xl w-full rounded-3xl border border-white/10 p-10 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sb-yellow/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="mb-10 text-center relative z-10">
          <div className="w-16 h-16 bg-sb-yellow/20 text-sb-yellow rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tighter">Enter The Portal</h1>
          <p className="text-gray-400 font-medium mt-2">Welcome back to AthleteConnect.</p>
        </div>

        {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center mb-6 relative z-10 font-bold text-sm">
              {errorMsg}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Email Address</label>
              <input name="email" type="email" required placeholder="scout@athleteconnect.com" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white hover:border-white/20 focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow outline-none transition-all placeholder:text-gray-700 font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Password</label>
              <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white hover:border-white/20 focus:border-sb-yellow focus:ring-1 focus:ring-sb-yellow outline-none transition-all placeholder:text-gray-700 tracking-widest font-mono" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-sb-yellow hover:bg-yellow-400 text-sb-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-sb-yellow/20 mt-4 disabled:opacity-50 disabled:pointer-events-none">
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <Link href="/signup" className="text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            Need an account? Draft here.
          </Link>
        </div>
      </div>
    </div>
  );
}
