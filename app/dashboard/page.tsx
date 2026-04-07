'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FanDashboard } from '@/components/FanDashboard';
import { AthleteDashboard } from '@/components/AthleteDashboard';
import { BusinessDashboard } from '@/components/BusinessDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardRouter() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/signup';
        return;
      }
      
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setProfile(pData);
      setLoading(false);
    }
    
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin text-sb-yellow" />
      </div>
    );
  }

  // Branch explicitly based on the strict ENUM configured in the Supabase schema
  if (profile?.user_type === 'athlete') {
    return <AthleteDashboard profile={profile} />;
  }
  
  if (profile?.user_type === 'business') {
    return <BusinessDashboard profile={profile} />;
  }
  
  return <FanDashboard profile={profile} />;
}
