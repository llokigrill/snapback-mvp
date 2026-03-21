'use client';

import { useState } from 'react';
import { X, User, MapPin, Loader2, Save, Link as LinkIcon, Camera, Shield } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function EditProfileModal({ profile, onClose, onUpdated }: { profile: any, onClose: () => void, onUpdated: () => void }) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    school_team: profile?.school_team || '',
    location: profile?.location || '',
    avatar_url: profile?.avatar_url || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          school_team: formData.school_team,
          location: formData.location,
          avatar_url: formData.avatar_url,
        })
        .eq('id', profile.id);

      if (error) {
        alert('Failed to update profile: ' + error.message);
      } else {
        onUpdated(); // triggers a reload or local state update in the dashboard
      }
    } catch (err: any) {
      alert('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-black uppercase tracking-tighter text-white">Account Settings</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          
          <div className="flex flex-col items-center justify-center mb-4">
             <div className="relative group">
               {formData.avatar_url ? (
                 <img src={formData.avatar_url} className="w-24 h-24 rounded-full object-cover border-4 border-[#222] shadow-lg" />
               ) : (
                 <div className="w-24 h-24 rounded-full bg-[#222] border-4 border-black flex items-center justify-center">
                   <User className="w-10 h-10 text-gray-500" />
                 </div>
               )}
               <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent group-hover:border-sb-yellow">
                 <Camera className="w-6 h-6 text-white" />
               </div>
             </div>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-3">Avatar URL Image</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Display Name</label>
              <div className="relative">
                <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="E.g., Marcus Elite" />
                <User className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">{profile?.user_type === 'athlete' ? 'Program / Sport' : 'Creator Focus'}</label>
              <div className="relative">
                <input type="text" value={formData.school_team} onChange={e => setFormData({...formData, school_team: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder={profile?.user_type === 'athlete' ? 'PG • Basketball' : 'Graphic Designer'} />
                <Shield className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Location / Base</label>
              <div className="relative">
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="City, State" />
                <MapPin className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Public Avatar URL</label>
              <div className="relative">
                <input type="text" value={formData.avatar_url} onChange={e => setFormData({...formData, avatar_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-sb-yellow outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="https://..." />
                <LinkIcon className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-white/5 bg-black/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full font-bold uppercase text-xs tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-sb-yellow text-sb-black px-6 py-2.5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-yellow-400 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>

      </div>
    </div>
  );
}
