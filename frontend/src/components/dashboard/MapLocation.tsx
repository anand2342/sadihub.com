import React from 'react';
import { MapPin, ExternalLink, Navigation, Compass } from 'lucide-react';
import type { Wedding } from '../../types';
import { LuxuryCard } from '../common/LuxuryCard';
import { EmptyState } from '../common/EmptyState';


interface MapLocationProps {
  wedding?: Wedding;
}

export const MapLocation: React.FC<MapLocationProps> = ({ wedding }) => {
  if (!wedding) {
    return (
      <EmptyState
        icon={MapPin}
        title="Location Details Pending"
        description="Your Family Admin will provide venue addresses and interactive map links soon."
      />
    );
  }

  const mapLink = wedding.google_maps_link || `https://maps.google.com/?q=${encodeURIComponent(wedding.venue_name + ' ' + wedding.venue_address)}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          Venue & Directions
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
          Google Maps Location
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Find your way easily to all wedding festivities
        </p>
      </div>

      <LuxuryCard className="space-y-6 border-2 border-[var(--border-gold)] gold-shadow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)] shrink-0 gold-shadow">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
              Primary Venue
            </span>
            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
              {wedding.venue_name || 'The Royal Palace Convention Resort'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {wedding.venue_address || 'Grand Trunk Road, Sector 62, Gurgaon, Delhi NCR'}
            </p>
          </div>
        </div>

        {/* Map Action Box */}
        <div className="p-6 rounded-2xl bg-[var(--bg-accent)] border border-[var(--border-gold)] text-center space-y-4">
          <Compass className="w-10 h-10 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] mx-auto animate-spin-slow" />
          <div>
            <h4 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Open Live Directions in Google Maps
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Tap below to navigate directly using GPS on your phone or vehicle.
            </p>
          </div>

          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all cursor-pointer gold-shadow"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Open Google Maps Directions</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </LuxuryCard>
    </div>
  );
};
