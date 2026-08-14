import React from 'react';
import { Sparkles, Heart, Users, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onOpenAuth: (tab: 'signin' | 'join' | 'create') => void;
  onOpenBootstrap?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenAuth, onOpenBootstrap }) => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-4">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--gold-light)]/40 to-amber-200/20 rounded-full blur-3xl pointer-events-none dark:from-[var(--gold-dark)]/20 dark:to-amber-900/10" />

      <div className="relative max-w-5xl mx-auto text-center z-10 space-y-8">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-gold)] bg-[var(--bg-card)]/80 backdrop-blur-md shadow-sm">
          <Sparkles className="w-4 h-4 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] animate-spin-slow" />
          <span className="text-xs sm:text-sm font-medium tracking-wide uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
            A little corner made just for your family
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-[var(--text-primary)] leading-[1.15] tracking-tight">
          Keep your family close, <br />
          <span className="gold-text-gradient font-serif italic font-normal">no matter the distance</span>
        </h1>

        {/* Emotional Subtitle */}
        <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-sans leading-relaxed">
          Create a private, heartwarming digital space for your family. Share memories, view event details, write blessings, and celebrate love together.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onOpenAuth('create')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient font-medium text-base text-white shadow-xl hover:opacity-95 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer gold-shadow"
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>Create Family Wedding</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth('join')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] font-medium text-base hover:bg-[var(--bg-accent)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Users className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]" />
            <span>Join Your Family</span>
          </button>

          <button
            onClick={() => onOpenAuth('signin')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] font-medium text-base hover:bg-[var(--bg-accent)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <LogIn className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]" />
            <span>Sign In to Account</span>
          </button>
        </div>

        {/* Key Selling Points / Features Badges */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-[var(--border-subtle)]">
          <div className="flex flex-col items-center p-4">
            <ShieldCheck className="w-6 h-6 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] mb-2" />
            <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">100% Private</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">Isolated family data & password protection</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <Heart className="w-6 h-6 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] mb-2" />
            <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">Groom & Bride Space</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">Dedicated couple story & event details</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <Sparkles className="w-6 h-6 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] mb-2" />
            <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">Photo Gallery</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">Up to 10 photos per member with likes & comments</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <Users className="w-6 h-6 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] mb-2" />
            <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">Family Approval</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">Family Admin moderation for total safety</p>
          </div>
        </div>

        {/* First Time Bootstrap Super Admin Link */}
        {onOpenBootstrap && (
          <div className="pt-6">
            <button
              onClick={onOpenBootstrap}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--gold-dark)] dark:hover:text-[var(--gold-primary)] underline transition-colors"
            >
              First-time setup? Claim Super Admin access
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
