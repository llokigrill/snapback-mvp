'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Trophy, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export function GlobalNav({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const [role, setRole] = useState<'fan' | 'athlete' | null>(null);

  // The publicly accessible URLs without authentication
  const publicRoutes = ['/', '/login', '/signup', '/drops', '/athletes'];

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const checkSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      setSession(activeSession);
      
      if (activeSession) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', activeSession.user.id)
          .single();
        if (profile) setRole(profile.user_type === 'athlete' ? 'athlete' : 'fan');
      }

      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isPublicRoute = publicRoutes.includes(pathname);

  // If loading, just return a flat layout to prevent flash
  if (loading) return <div className="min-h-screen bg-black" />;

  // The BLOCKER Screen - Intercept unauthorized routing attempts
  if (!session && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sb-yellow/10 via-black to-black font-sans selection:bg-sb-yellow selection:text-sb-black">
        <div className="w-24 h-24 bg-[#111] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl animate-in zoom-in duration-500">
          <Lock className="w-10 h-10 text-sb-yellow" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          Restricted Zone
        </h1>
        <p className="text-gray-400 font-medium md:text-lg max-w-md text-center mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          The Roster Directory and Deal Engine are strictly reserved for verified Creators and Pro Athletes. Drop into the ecosystem to gain immediate access.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Link href="/signup" className="flex-1 bg-sb-yellow text-sb-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-sb-yellow/20">
            Create Account
          </Link>
          <Link href="/" className="flex-1 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/10 hover:border-transparent px-8 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
            Home Playbook
          </Link>
        </div>
      </div>
    );
  }

  // We hide the GlobalNav on explicit auth pages as the pages build their own bespoke UI.
  // We keep it on '/' (Home) but normally landing pages can have their own custom transparent one. Let's merge it out for simplicity.
  const isBespokePage = pathname === '/login' || pathname === '/signup' || pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {!isBespokePage && (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111]/80 backdrop-blur-xl font-sans text-white">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-px font-black tracking-tighter uppercase text-white hover:scale-105 transition-transform">
              <span className="text-2xl lowercase">million</span>
              <span className="text-2xl text-green-500">$</span>
              <span className="text-2xl">NIL</span>
            </Link>
            
            {/* Core Global Links */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-400">
              <Link href="/drops" className={`hover:text-white transition-colors flex items-center gap-2 ${pathname === '/drops' ? 'text-sb-yellow' : ''}`}>Playmakers</Link>
              <Link href="/athletes" className={`hover:text-white transition-colors flex items-center gap-2 ${pathname === '/athletes' ? 'text-sb-yellow' : ''}`}>
                <ShieldCheck className="w-4 h-4" /> {role === 'athlete' ? 'Fan Network' : 'View Rosters'}
              </Link>
              
              {session && role !== 'athlete' && <Link href="/proposals/draft" className={`hover:text-white transition-colors ${pathname.includes('/proposals') ? 'text-sb-yellow' : ''}`}>Deal Engine</Link>}
              {session && role === 'athlete' && <Link href="/vault" className={`hover:text-white transition-colors ${pathname.includes('/vault') ? 'text-sb-yellow' : ''}`}>Asset Vault</Link>}
            </nav>
            
            <div className="flex items-center gap-4">
              {!session ? (
                <>
                  <Link href="/login" className="hidden md:block font-bold uppercase text-[10px] md:text-xs tracking-widest text-gray-300 hover:text-white transition-colors">
                    Log In
                  </Link>
                  <Link href="/signup" className="bg-sb-yellow text-sb-black px-5 py-2.5 md:px-6 md:py-3 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest hover:scale-105 hover:shadow-[0_0_15px_rgba(247,223,2,0.2)] transition-all">
                    Get Access
                  </Link>
                </>
              ) : (
                <>
                  {pathname !== '/dashboard' && (
                    <Link href="/dashboard" className="hidden md:flex bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all focus:outline-none items-center gap-2">
                      Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <button 
                    onClick={async () => { 
                      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
                      await supabase.auth.signOut(); 
                      window.location.href = '/login'; 
                    }} 
                    className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors ml-2"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
      )}
      
      {/* Route Content Payload */}
      <div className="flex-1 flex flex-col">
          {children}
      </div>
    </div>
  );
}
