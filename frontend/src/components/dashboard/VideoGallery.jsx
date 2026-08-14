import React from 'react';
import { Video, Play, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LuxuryCard } from '../common/LuxuryCard';
import { EmptyState } from '../common/EmptyState';
export const VideoGallery = ({ videos, onDeleteVideo, onToast }) => {
    const { session } = useAuth();
    const isFamilyAdmin = session?.roles.includes('family_admin') || session?.roles.includes('super_admin');
    if (!videos || videos.length === 0) {
        return (<EmptyState icon={Video} title="No Wedding Videos Published" description="Pre-wedding film teasers, Sangeet performances, and live streams will be uploaded here by your Family Admin."/>);
    }
    return (<div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          Cinema & Highlights
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
          Wedding Videos & Films
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Watch pre-wedding teasers, ceremony highlights, and live streams
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid) => (<LuxuryCard key={vid.id} className="p-0 overflow-hidden space-y-4 flex flex-col justify-between">
            <div className="relative aspect-video bg-black overflow-hidden">
              {vid.video_url.includes('youtube.com') || vid.video_url.includes('youtu.be') ? (<iframe src={vid.video_url} title={vid.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>) : (<div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-stone-900 to-black">
                  <Play className="w-12 h-12 text-[var(--gold-primary)] mb-2 animate-pulse"/>
                  <p className="text-xs text-stone-300 font-medium">{vid.title}</p>
                  <a href={vid.video_url} target="_blank" rel="noreferrer" className="mt-3 px-4 py-2 rounded-xl bg-gold-gradient text-xs text-white font-semibold">
                    Open Video Stream
                  </a>
                </div>)}
            </div>

            <div className="p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                  {vid.category || 'Highlight'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[var(--text-primary)] mt-1">
                  {vid.title}
                </h3>
              </div>

              {isFamilyAdmin && onDeleteVideo && (<button onClick={() => {
                    onDeleteVideo(vid.id);
                    onToast('Video deleted.', 'info');
                }} className="text-red-500/60 hover:text-red-500 p-2 rounded-xl cursor-pointer" title="Delete Video">
                  <Trash2 className="w-4 h-4"/>
                </button>)}
            </div>
          </LuxuryCard>))}
      </div>
    </div>);
};
