import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { LuxuryCard } from '../common/LuxuryCard';
import { EmptyState } from '../common/EmptyState';
export const EventSchedule = ({ events }) => {
    if (!events || events.length === 0) {
        return (<EmptyState icon={Calendar} title="No Wedding Events Scheduled" description="Event schedules (Haldi, Mehendi, Sangeet, Tilak, Wedding, Reception) will be published here by your Family Admin."/>);
    }
    const getEventBadgeColor = (type) => {
        switch (type) {
            case 'haldi': return 'bg-amber-400/20 text-amber-600 border-amber-400/40';
            case 'mehendi': return 'bg-emerald-400/20 text-emerald-600 border-emerald-400/40';
            case 'sangeet': return 'bg-purple-400/20 text-purple-600 border-purple-400/40';
            case 'wedding': return 'bg-rose-400/20 text-rose-600 border-rose-400/40';
            case 'reception': return 'bg-blue-400/20 text-blue-600 border-blue-400/40';
            default: return 'bg-[var(--gold-light)] text-[var(--gold-dark)] border-[var(--border-gold)]';
        }
    };
    return (<div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          Celebration Timeline
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
          Wedding Events & Rituals
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Join us in celebrating every sacred ceremony and joyful occasion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
            // Display label: custom_type if event_type === 'other', else event_type uppercase
            const badgeLabel = (evt.event_type === 'other' && evt.custom_type)
                ? evt.custom_type
                : evt.event_type.toUpperCase();
            return (<LuxuryCard key={evt.id} className="flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getEventBadgeColor(evt.event_type)}`}>
                    {badgeLabel}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold-dark)]"/>
                    {formatDate(evt.event_date)}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] leading-tight">
                  {evt.title}
                </h3>

                {evt.description && (<p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                    {evt.description}
                  </p>)}
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2 text-xs">
                {(evt.start_time || evt.end_time) && (<div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4 text-[var(--gold-dark)] shrink-0"/>
                    <span>{evt.start_time} {evt.end_time ? `- ${evt.end_time}` : ''}</span>
                  </div>)}

                {evt.venue_name && (<div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4 text-[var(--gold-dark)] shrink-0 mt-0.5"/>
                    <div>
                      <strong className="block text-[var(--text-primary)] font-semibold">{evt.venue_name}</strong>
                      {evt.venue_address && <span className="text-[11px] text-[var(--text-muted)]">{evt.venue_address}</span>}
                    </div>
                  </div>)}

                {evt.google_maps_link && (<a href={evt.google_maps_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold-dark)] dark:text-[var(--gold-primary)] hover:underline pt-2">
                    <span>View Map Location</span>
                    <ExternalLink className="w-3.5 h-3.5"/>
                  </a>)}
              </div>
            </LuxuryCard>);
        })}
      </div>
    </div>);
};
