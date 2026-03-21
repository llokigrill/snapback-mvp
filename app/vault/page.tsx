'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Image as ImageIcon, Video, Lock, CheckCircle, FolderUp, Camera, HardDrive, Plus, ArrowLeft } from 'lucide-react';

const MOCK_VAULT = [
  { 
    id: 1, 
    type: 'video', 
    name: 'Championship_Locker_Room_Raw.mp4', 
    size: '1.2 GB', 
    date: 'Mar 18, 2026', 
    access: 'Public to Network', 
    thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&h=300&fit=crop' 
  },
  { 
    id: 2, 
    type: 'photo', 
    name: 'Studio_Portrait_Session_A.raw', 
    size: '245 MB', 
    date: 'Feb 10, 2026', 
    access: 'Public to Network', 
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop' 
  },
  { 
    id: 3, 
    type: 'photo', 
    name: 'Game_Winning_Shot_HighRes.jpeg', 
    size: '18 MB', 
    date: 'Jan 22, 2026', 
    access: 'Locked (Request Only)', 
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop' 
  },
];

export default function AssetVault() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [athleteName, setAthleteName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsViewOnly(params.get('viewOnly') === 'true');
      setAthleteName(params.get('athleteName'));
    }
  }, []);

  const handleUploadClick = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('Asset successfully vaulted! (Mock Action)');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto mb-16">
        
        {/* Header Section */}
        {isViewOnly && (
           <Link href="/athletes" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Scout Roster
           </Link>
        )}
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
              <HardDrive className="w-10 h-10 text-sb-yellow shrink-0" />
              {isViewOnly && athleteName ? `${athleteName}'s Vault` : 'Asset Vault'}
            </h1>
            <p className="text-gray-400 mt-3 font-medium md:text-lg max-w-2xl">
              {isViewOnly 
                ? 'Browse verified media directly from the athlete to inspire your next pitch.'
                : 'Curate your exclusive media library to inspire the Creator Network. Fans pull directly from this vault to design your premium merchandise drops.'}
            </p>
          </div>
          {!isViewOnly && (
            <div className="flex gap-4 shrink-0">
               <div className="bg-[#111] border border-white/10 rounded-xl px-6 py-4 flex flex-col items-center justify-center shadow-lg hover:border-sb-yellow/50 transition-colors cursor-default">
                  <span className="text-2xl font-black text-sb-yellow">1.4 <span className="text-sm text-gray-400">GB</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Storage Used</span>
               </div>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 ${isViewOnly ? '' : 'lg:grid-cols-3'} gap-8`}>
          
          {/* Active Vault Gallery */}
          <div className={`${isViewOnly ? 'w-full' : 'lg:col-span-2'} space-y-6`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
              <FolderUp className="w-4 h-4" /> Indexed Library
            </h3>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isViewOnly ? 'md:grid-cols-3 xl:grid-cols-4' : ''} gap-6`}>
              {MOCK_VAULT.map((asset) => (
                <div key={asset.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-sb-yellow/30 transition-colors shadow-2xl">
                   <div className="h-48 relative overflow-hidden bg-black">
                     <img 
                       src={asset.thumbnail} 
                       alt={asset.name} 
                       className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                     />
                     <div className="absolute top-4 left-4">
                       {asset.type === 'video' ? (
                         <div className="bg-sb-yellow text-black px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                           <Video className="w-3 h-3" /> Video
                         </div>
                       ) : (
                         <div className="bg-purple-500 text-white px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                           <ImageIcon className="w-3 h-3" /> Photo
                         </div>
                       )}
                     </div>
                   </div>
                   
                   <div className="p-5 flex flex-col gap-3">
                     <h4 className="font-bold text-sm tracking-tight truncate" title={asset.name}>{asset.name}</h4>
                     
                     <div className="flex items-center justify-between border-t border-white/5 pt-3">
                       <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">{asset.size} • {asset.date}</span>
                       
                       {asset.access.includes('Locked') ? (
                         <span className="text-red-400 flex items-center gap-1 text-[10px] tracking-widest uppercase font-bold bg-red-400/10 px-2 py-1 rounded">
                           <Lock className="w-3 h-3" /> Restricted
                         </span>
                       ) : (
                         <span className="text-green-400 flex items-center gap-1 text-[10px] tracking-widest uppercase font-bold bg-green-400/10 px-2 py-1 rounded">
                           <CheckCircle className="w-3 h-3" /> Public
                         </span>
                       )}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Widget */}
          {!isViewOnly && (
            <div className="bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-[2rem] p-8 h-fit shadow-2xl flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Vault New Media</h3>
              <p className="text-sm font-medium text-gray-400 mb-8 px-4">Secure raw footage, game-day content, or lifestyle shoots for Creators.</p>
              
              <div 
                className={`w-full border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  dragActive ? 'border-sb-yellow bg-sb-yellow/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${dragActive ? 'text-sb-yellow' : 'text-gray-600'}`} />
                <p className="font-bold text-sm uppercase tracking-widest mb-1 text-white">Drag & Drop Files</p>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Supports RAW, MP4, JPEG, PNG</p>
                
                <button 
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="mt-8 bg-white text-black px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    'Uploading...'
                  ) : (
                    <><Plus className="w-4 h-4" /> Browse Files</>
                  )}
                </button>
              </div>
              
              <div className="mt-8 w-full bg-sb-yellow/10 border border-sb-yellow/20 rounded-xl p-4 flex items-start gap-3 text-left">
                <Camera className="w-5 h-5 text-sb-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-sb-yellow mb-1">Pro Tip</p>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">High-resolution unedited RAW files give Creators the most flexibility for premium apparel and poster designs.</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
