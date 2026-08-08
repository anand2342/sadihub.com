import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Sparkles, ArrowRight, Heart, Image as ImageIcon, MessageSquareHeart } from 'lucide-react';
import type { Wedding, EventItem } from '../../types';

import { useAuth } from '../../context/AuthContext';
import { getTimeRemaining, formatDate } from '../../lib/utils';

import { LuxuryCard } from '../common/LuxuryCard';
import type { NavTab } from './Sidebar';


interface HomeOverviewProps {
  wedding?: Wedding;
  events: EventItem[];
  onNavigate: (tab: NavTab) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({ wedding, events, onNavigate }) => {
  const { session } = useAuth();
  const userName = session?.profile?.full_name || 'Dear Relative';

  const [countdown, setCountdown] = useState(getTimeRemaining(wedding?.wedding_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeRemaining(wedding?.wedding_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [wedding?.wedding_date]);

  // Find next upcoming event
  const nextEvent = events[0] || null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden gold-border gold-shadow p-6 sm:p-10 bg-gradient-to-r from-stone-900/90 via-stone-900/80 to-stone-900/40 text-white min-h-[300px] flex flex-col justify-between">
        {wedding?.cover_image && (
          <img
            src={wedding.cover_image}
            alt="Wedding Cover"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 pointer-events-none"
          />
        )}

        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/25 backdrop-blur-md border border-amber-400/50 text-xs font-serif font-bold tracking-wider text-amber-200 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current animate-pulse" />
            <span>॥ श्री गणेशाय नमः ॥</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            Welcome, {userName}!
          </h2>

          <p className="text-sm sm:text-base text-stone-200 font-sans leading-relaxed">
            Welcome to the wedding portal for <strong className="font-semibold text-amber-300">{wedding?.groom_name || 'Groom'} & {wedding?.bride_name || 'Bride'}</strong>. Explore event schedules, photos, and wishes.
          </p>
        </div>



        {/* Live Wedding Countdown Banner */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/20 grid grid-cols-4 gap-2 sm:gap-4 max-w-lg text-center">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <span className="text-xl sm:text-3xl font-serif font-bold text-amber-300">{countdown.days}</span>
            <span className="block text-[10px] sm:text-xs text-stone-300 uppercase tracking-widest mt-0.5">Days</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <span className="text-xl sm:text-3xl font-serif font-bold text-amber-300">{countdown.hours}</span>
            <span className="block text-[10px] sm:text-xs text-stone-300 uppercase tracking-widest mt-0.5">Hours</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <span className="text-xl sm:text-3xl font-serif font-bold text-amber-300">{countdown.minutes}</span>
            <span className="block text-[10px] sm:text-xs text-stone-300 uppercase tracking-widest mt-0.5">Mins</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <span className="text-xl sm:text-3xl font-serif font-bold text-amber-300">{countdown.seconds}</span>
            <span className="block text-[10px] sm:text-xs text-stone-300 uppercase tracking-widest mt-0.5">Secs</span>
          </div>
        </div>
      </div>

      {/* GROOM FIRST COUPLE HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GROOM CARD FIRST */}
        <LuxuryCard className="flex items-center gap-4 sm:gap-5">
          <img
            src={wedding?.groom_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
            alt="Groom"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[var(--border-gold)] shrink-0 shadow-md"
          />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <span className="inline-block whitespace-nowrap text-[10px] font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-2.5 py-0.5 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
                The Groom
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] truncate">
              {wedding?.groom_name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
              {wedding?.groom_bio || ' Groom details'}
            </p>
            <button
              onClick={() => onNavigate('couple')}
              className="text-xs font-semibold text-[var(--gold-dark)] dark:text-[var(--gold-primary)] hover:underline inline-flex items-center gap-1 pt-0.5 cursor-pointer whitespace-nowrap"
            >
              View Groom Details <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </LuxuryCard>

        {/* BRIDE CARD SECOND */}
        <LuxuryCard className="flex items-center gap-4 sm:gap-5">
          <img
            src={wedding?.bride_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="Bride"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[var(--border-gold)] shrink-0 shadow-md"
          />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <span className="inline-block whitespace-nowrap text-[10px] font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-2.5 py-0.5 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
                The Bride
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] truncate">
              {wedding?.bride_name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
              {wedding?.bride_bio || 'Bride details'}
            </p>
            <button
              onClick={() => onNavigate('couple')}
              className="text-xs font-semibold text-[var(--gold-dark)] dark:text-[var(--gold-primary)] hover:underline inline-flex items-center gap-1 pt-0.5 cursor-pointer whitespace-nowrap"
            >
              View Bride Details <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </LuxuryCard>
      </div>

      {/* Upcoming Event Highlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LuxuryCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]" />
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                Next Upcoming Ceremony
              </h3>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-semibold hover:underline cursor-pointer"
            >
              View All Events ({events.length})
            </button>
          </div>

          {nextEvent ? (
            <div className="p-4 rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-accent)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] border border-[var(--border-gold)]">
                  {nextEvent.custom_type || nextEvent.event_type}
                </span>
                <h4 className="text-xl font-serif font-bold text-[var(--text-primary)]">
                  {nextEvent.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {nextEvent.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold-dark)]" />
                    {formatDate(nextEvent.event_date)}
                  </span>
                  {nextEvent.start_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold-dark)]" />
                      {nextEvent.start_time}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onNavigate('events')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-gradient text-white text-xs font-semibold shadow cursor-pointer shrink-0"
              >
                Event Details
              </button>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] italic">No events scheduled yet.</p>
          )}
        </LuxuryCard>

        {/* Quick Shortcuts */}
        <LuxuryCard className="space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-3">
              Family Quick Links
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('gallery')}
                className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-gold)] transition-all flex items-center justify-between text-xs font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[var(--gold-dark)]" />
                  <span>Upload Family Photo</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">Max 10</span>
              </button>

              <button
                onClick={() => onNavigate('wishes')}
                className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-gold)] transition-all flex items-center justify-between text-xs font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageSquareHeart className="w-4 h-4 text-[var(--gold-dark)]" />
                  <span>Write Wedding Wish</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Live Wall</span>
              </button>

              <button
                onClick={() => onNavigate('invitation')}
                className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-gold)] transition-all flex items-center justify-between text-xs font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[var(--gold-dark)]" />
                  <span>View Digital Invitation</span>
                </div>
                <span className="text-[10px] text-[var(--gold-dark)] font-bold">Printable</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] text-center font-serif">
            Venue: {wedding?.venue_name || 'The Royal Palace'}
          </div>
        </LuxuryCard>
      </div>
    </div>
  );
};
