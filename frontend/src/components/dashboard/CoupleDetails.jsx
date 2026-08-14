import React from 'react';
import { Heart } from 'lucide-react';
import { LuxuryCard } from '../common/LuxuryCard';
import { EmptyState } from '../common/EmptyState';
export const CoupleDetails = ({ wedding }) => {
    if (!wedding) {
        return (<EmptyState title="No Couple Details Found" description="Your Family Admin hasn't added the Groom & Bride details yet."/>);
    }
    return (<div className="space-y-10 animate-fade-in">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          The Blessed Couple
        </span>
        {/* GROOM FIRST ORDERING TITLE */}
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text-primary)]">
          Groom & Bride
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
          Two loving families uniting as one for a lifetime of happiness.
        </p>
      </div>

      {/* GROOM FIRST DISPLAY CARDS */}
      <div className="space-y-8">
        {/* 1. GROOM CARD FIRST */}
        <LuxuryCard className="overflow-hidden p-0 border border-[var(--border-gold)] gold-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="relative h-72 md:h-full min-h-[300px]">
              <img src={wedding.groom_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'} alt={wedding.groom_name} className="w-full h-full object-cover"/>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  The Groom
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:col-span-2 space-y-4 flex flex-col justify-center">
              <div>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
                  {wedding.groom_name}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mt-2 font-medium">
                  {wedding.groom_father && (<span>Son of: <strong className="text-[var(--text-primary)]">{wedding.groom_father}</strong></span>)}
                  {wedding.groom_mother && (<span>& <strong className="text-[var(--text-primary)]">{wedding.groom_mother}</strong></span>)}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                  About the Groom
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  {wedding.groom_bio || 'A wonderful soul blessed by family traditions and modern aspirations.'}
                </p>
              </div>
            </div>
          </div>
        </LuxuryCard>

        {/* 2. BRIDE CARD SECOND */}
        <LuxuryCard className="overflow-hidden p-0 border border-[var(--border-gold)] gold-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="relative h-72 md:h-full min-h-[300px] md:order-last">
              <img src={wedding.bride_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} alt={wedding.bride_name} className="w-full h-full object-cover"/>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  The Bride
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:col-span-2 space-y-4 flex flex-col justify-center">
              <div>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
                  {wedding.bride_name}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mt-2 font-medium">
                  {wedding.bride_father && (<span>Daughter of: <strong className="text-[var(--text-primary)]">{wedding.bride_father}</strong></span>)}
                  {wedding.bride_mother && (<span>& <strong className="text-[var(--text-primary)]">{wedding.bride_mother}</strong></span>)}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                  About the Bride
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  {wedding.bride_bio || 'A graceful heart who brings endless joy and warmth wherever she goes.'}
                </p>
              </div>
            </div>
          </div>
        </LuxuryCard>
      </div>

      {/* Love Story Section */}
      <LuxuryCard className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
            <Heart className="w-5 h-5 fill-current"/>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
              Our Love Story
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">How our journey of togetherness began</p>
          </div>
        </div>

        <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans italic p-4 rounded-2xl bg-[var(--bg-accent)] border border-[var(--border-gold)]">
          "{wedding.love_story || 'Our story is one of shared dreams, laughter, and family blessings. We look forward to celebrating our wedding day with all our loved ones!'}"
        </p>
      </LuxuryCard>
    </div>);
};
