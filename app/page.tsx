'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-sb-dark font-sans text-sb-text dark:text-gray-200 selection:bg-sb-yellow selection:text-sb-black">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-sb-dark/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-px text-2xl font-black tracking-tighter uppercase text-sb-black dark:text-white">
            <span className="lowercase">million</span>
            <span className="text-green-500">$</span>
            <span>NIL</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wide text-sb-black dark:text-gray-300">
            <Link href="/athletes" className="hover:text-sb-yellow transition-colors">View Rosters</Link>
            <Link href="#how-it-works" className="hover:text-sb-yellow transition-colors">How It Works</Link>
            <Link href="/drops" className="hover:text-sb-yellow transition-colors">The Playmakers</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block font-bold uppercase text-sm tracking-wide text-sb-black dark:text-white hover:text-sb-yellow transition-colors">Log In</Link>
            <Link href="/signup" className="bg-sb-yellow text-sb-black px-6 py-3 rounded-full font-black uppercase text-sm tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(247,223,2,0.4)] transition-all active:scale-95 duration-200">
              Get Access
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-sb-black text-white py-32 lg:py-48">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sb-dark via-sb-black to-sb-black" />
          <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sb-yellow/30 bg-sb-yellow/10 text-sb-yellow font-bold text-xs uppercase tracking-widest mb-8">
              <Zap className="w-4 h-4" />
              <span>The Official NIL Business Portal</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Do Business With <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sb-yellow to-yellow-500">
                Your Favorite Athletes
              </span>
            </h1>
            <p className="max-w-2xl text-gray-400 text-lg md:text-xl md:leading-relaxed mb-4 font-medium">
              Bypass the agents and traditional red tape. Connect directly with elite athletes for brand partnerships, appearances, and exclusive business deals.
            </p>
            <p className="max-w-xl text-gray-300 text-lg md:text-xl md:leading-relaxed mb-12 font-bold bg-white/5 border border-white/10 px-6 py-3 rounded-xl inline-block">
              Entrepreneurial fans and athletes connect for NIL deals. Create an account to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/signup?role=fan" className="bg-sb-yellow text-sb-black px-8 py-4 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(247,223,2,0.3)] transition-all active:scale-95 duration-300">
                I am a Fan
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/signup?role=athlete" className="px-8 py-4 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-white/20 hover:border-white transition-all active:scale-95 duration-300">
                I am an Athlete
              </Link>
            </div>
          </div>
          
          {/* Decorative graphic elements */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sb-yellow/20 rounded-full blur-[120px]" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        </section>

        {/* How It Works */}
        <section className="py-32 bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-white/5" id="how-it-works">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-sb-black dark:text-white mb-4">The Direct Playbook</h2>
              <p className="text-gray-500 font-medium max-w-xl mx-auto">Skip the noise and get straight to business in three simple steps.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white dark:bg-sb-dark p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 relative group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-sb-yellow/20 text-sb-yellow flex items-center justify-center mb-8 border border-sb-yellow/30 group-hover:scale-110 group-hover:bg-sb-yellow group-hover:text-sb-black transition-all">
                  <span className="text-2xl font-black italic">1</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-sb-black dark:text-white mb-3">Scout the Rosters</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Browse our verified networks of professional athletes and creative fans ready for business opportunities across major leagues and platforms.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-sb-dark p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 relative group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-sb-yellow/20 text-sb-yellow flex items-center justify-center mb-8 border border-sb-yellow/30 group-hover:scale-110 group-hover:bg-sb-yellow group-hover:text-sb-black transition-all">
                  <span className="text-2xl font-black italic">2</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-sb-black dark:text-white mb-3">Pitch Your Idea</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Draft a contract for appearances, social media campaigns, equity partnerships, or custom merch drops directly to the target's team.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-sb-dark p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 relative group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-sb-yellow/20 text-sb-yellow flex items-center justify-center mb-8 border border-sb-yellow/30 group-hover:scale-110 group-hover:bg-sb-yellow group-hover:text-sb-black transition-all">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase text-sb-black dark:text-white mb-3">Secure the Deal</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Contracts and partnership terms are generated automatically and explicitly dispatched to all parties for verified electronic signature via email.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sb-black text-white/50 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-px text-lg mb-4 md:mb-0 grayscale opacity-50 font-black tracking-tighter uppercase text-white">
            <span className="lowercase">million</span>
            <span className="text-green-500">$</span>
            <span>NIL</span>
          </div>
          <div className="text-sm font-medium">
            © {new Date().getFullYear()} million$NIL. Built for the grind.
          </div>
        </div>
      </footer>
    </div>
  );
}
