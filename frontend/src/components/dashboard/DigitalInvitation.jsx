import React from 'react';
import { Heart, Calendar, Printer, Share2, Sparkles, Clock, MapPin } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { EmptyState } from '../common/EmptyState';
export const DigitalInvitation = ({ wedding, events = [], onToast }) => {
    if (!wedding) {
        return (<EmptyState title="Invitation Card Not Ready" description="Your Family Admin will publish the royal invitation card shortly."/>);
    }
    const handlePrint = () => {
        window.print();
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${wedding.groom_name} & ${wedding.bride_name} Wedding Invitation`,
                text: `You are cordially invited to the wedding of ${wedding.groom_name} & ${wedding.bride_name}!`,
                url: window.location.href,
            }).catch(() => { });
        }
        else {
            navigator.clipboard.writeText(window.location.href);
            onToast('Invitation portal link copied to clipboard!', 'success');
        }
    };
    return (<div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Share / Print Controls */}
      <div className="flex items-center justify-end gap-3 print:hidden">
        <button onClick={handleShare} className="px-4 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] font-medium text-xs hover:bg-[var(--bg-accent)] transition-all flex items-center gap-1.5 cursor-pointer">
          <Share2 className="w-4 h-4 text-[var(--gold-dark)]"/>
          <span>Share Invitation</span>
        </button>

        <button onClick={handlePrint} className="px-5 py-2 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer">
          <Printer className="w-4 h-4"/>
          <span>Print Card</span>
        </button>
      </div>

      {/* Royal Digital Invitation Card (GROOM-FIRST DISPLAY) */}
      <div className="printable-invitation-card relative rounded-3xl border-4 border-[var(--border-gold)] p-8 sm:p-14 bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] gold-shadow text-center space-y-8 print:bg-white print:border-[#B8860B] print:p-5 print:shadow-none print:space-y-3 print:rounded-2xl">
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[var(--border-gold)] print:border-[#B8860B] print:top-3 print:left-3 print:w-8 print:h-8"/>
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[var(--border-gold)] print:border-[#B8860B] print:top-3 print:right-3 print:w-8 print:h-8"/>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[var(--border-gold)] print:border-[#B8860B] print:bottom-3 print:left-3 print:w-8 print:h-8"/>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[var(--border-gold)] print:border-[#B8860B] print:bottom-3 print:right-3 print:w-8 print:h-8"/>

        <div className="w-14 h-14 rounded-full bg-[var(--gold-light)] border border-[var(--border-gold)] flex items-center justify-center mx-auto text-[var(--gold-dark)] dark:text-[var(--gold-primary)] gold-shadow print:bg-[#FFF8E7] print:border-[#B8860B] print:text-[#B8860B] print:shadow-none print:w-10 print:h-10">
          <Heart className="w-7 h-7 fill-current animate-pulse print:animate-none print:w-5 print:h-5"/>
        </div>

        <div className="space-y-2 print:space-y-1">
          <p className="text-xs font-serif italic tracking-widest text-[var(--gold-dark)] dark:text-[var(--gold-primary)] uppercase print:text-[#996515] print:font-bold print:text-[10px]">
            Shree Ganeshay Namah
          </p>
          <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--text-muted)] print:text-[#333333] print:text-[11px]">
            Together with their families, cordially invite you to celebrate the wedding of
          </h3>
        </div>

        {/* COUPLE PHOTOS & NAMES (GROOM-FIRST DISPLAY) */}
        <div className="py-2 space-y-5 print:py-1 print:space-y-2">
          {/* Photos Row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 my-2 print:my-1 print:gap-4">
            {/* Groom Photo — Soft Vignette Blend Frame */}
            <div className="relative p-1 rounded-full border border-dashed border-[var(--border-gold)] print:border-[#B8860B]">
              <div className="w-24 h-24 sm:w-32 sm:h-32 print:w-20 print:h-20 rounded-full overflow-hidden border-2 border-[var(--border-gold)] print:border-[#B8860B] bg-white/40 print:bg-white flex items-center justify-center">
                <img src={wedding.groom_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'} alt={wedding.groom_name} className="w-full h-full object-cover portrait-vignette-blend"/>
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--gold-light)] border border-[var(--border-gold)] text-[10px] sm:text-xs font-bold text-[var(--gold-dark)] print:bg-[#FFF8E7] print:text-[#8B5A2B] print:border-[#B8860B] print:text-[9px] print:px-2 print:py-0 whitespace-nowrap shadow-sm">
                Groom
              </span>
            </div>

            {/* Heart Connector */}
            <div className="flex flex-col items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)] print:text-[#B8860B]">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current animate-pulse print:animate-none print:w-4 print:h-4"/>
              <span className="font-serif italic text-xs sm:text-sm font-bold text-[var(--gold-dark)] print:text-[#8B5A2B] mt-1 print:text-[10px]">weds</span>
            </div>

            {/* Bride Photo — Soft Vignette Blend Frame */}
            <div className="relative p-1 rounded-full border border-dashed border-[var(--border-gold)] print:border-[#B8860B]">
              <div className="w-24 h-24 sm:w-32 sm:h-32 print:w-20 print:h-20 rounded-full overflow-hidden border-2 border-[var(--border-gold)] print:border-[#B8860B] bg-white/40 print:bg-white flex items-center justify-center">
                <img src={wedding.bride_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} alt={wedding.bride_name} className="w-full h-full object-cover portrait-vignette-blend"/>
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--gold-light)] border border-[var(--border-gold)] text-[10px] sm:text-xs font-bold text-[var(--gold-dark)] print:bg-[#FFF8E7] print:text-[#8B5A2B] print:border-[#B8860B] print:text-[9px] print:px-2 print:py-0 whitespace-nowrap shadow-sm">
                Bride
              </span>
            </div>
          </div>

          {/* Names */}
          <div className="space-y-2 pt-2 print:space-y-1 print:pt-1">
            <h1 className="text-3xl sm:text-5xl md:text-6xl print:text-3xl font-serif font-bold text-gold-gradient tracking-tight print:text-[#8B5A2B] print:[background:none] print:[-webkit-text-fill-color:#8B5A2B]">
              {wedding.groom_name}
            </h1>

            <div className="flex items-center justify-center gap-4 text-[var(--gold-dark)] font-serif text-lg sm:text-xl print:text-[#8B5A2B] print:text-base">
              <span className="h-[1px] w-12 bg-[var(--border-gold)] print:bg-[#B8860B] print:w-8"/>
              <span className="font-bold">weds</span>
              <span className="h-[1px] w-12 bg-[var(--border-gold)] print:bg-[#B8860B] print:w-8"/>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl print:text-3xl font-serif font-bold text-gold-gradient tracking-tight print:text-[#8B5A2B] print:[background:none] print:[-webkit-text-fill-color:#8B5A2B]">
              {wedding.bride_name}
            </h1>
          </div>
        </div>

        {/* Parents Names (Groom Parents First) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto py-4 border-y border-[var(--border-gold)] text-xs text-[var(--text-secondary)] font-sans print:border-[#B8860B] print:text-[#222222] print:py-2 print:gap-2 print:text-[11px]">
          <div>
            <p className="font-serif font-bold text-sm text-[var(--text-primary)] print:text-[#8B5A2B] print:text-xs">Groom’s Family</p>
            {wedding.groom_father && <p className="print:text-[#222222]">Son of {wedding.groom_father}</p>}
            {wedding.groom_mother && <p className="print:text-[#222222]">& {wedding.groom_mother}</p>}
          </div>

          <div>
            <p className="font-serif font-bold text-sm text-[var(--text-primary)] print:text-[#8B5A2B] print:text-xs">Bride’s Family</p>
            {wedding.bride_father && <p className="print:text-[#222222]">Daughter of {wedding.bride_father}</p>}
            {wedding.bride_mother && <p className="print:text-[#222222]">& {wedding.bride_mother}</p>}
          </div>
        </div>

        {/* Date & Venue Info */}
        <div className="space-y-3 font-sans print:space-y-1.5">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)] text-sm font-bold text-[var(--text-primary)] print:bg-[#FFF8E7] print:border-[#B8860B] print:text-[#1A1A1A] print:px-4 print:py-1 print:text-xs">
            <Calendar className="w-4 h-4 text-[var(--gold-dark)] print:text-[#B8860B] print:w-3.5 print:h-3.5"/>
            <span>{formatDate(wedding.wedding_date)}</span>
          </div>

          <div>
            <h4 className="font-serif font-bold text-xl text-[var(--text-primary)] print:text-[#1A1A1A] print:text-lg">
              {wedding.venue_name || 'The Royal Palace'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mt-1 print:text-[#333333] print:text-[10px] print:mt-0">
              {wedding.venue_address || 'Grand Trunk Road, Sector 62, Gurgaon'}
            </p>
          </div>
        </div>

        {/* WEDDING EVENTS PROGRAM SECTION */}
        {events && events.length > 0 && (<div className="py-5 space-y-4 border-t border-[var(--border-gold)] print:border-[#B8860B] print:py-2 print:space-y-2">
            <div className="space-y-1 print:space-y-0.5">
              <p className="text-[10px] sm:text-xs font-serif italic tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] print:text-[#996515] font-bold flex items-center justify-center gap-1.5 print:text-[9px]">
                <Sparkles className="w-3.5 h-3.5 print:w-3 print:h-3"/>
                <span>Program & Rituals</span>
                <Sparkles className="w-3.5 h-3.5 print:w-3 print:h-3"/>
              </p>
              <h4 className="font-serif font-bold text-xl sm:text-2xl text-[var(--text-primary)] print:text-[#8B5A2B] print:text-base">
                Wedding Ceremonies & Events
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left print:gap-2">
              {events.map((evt) => {
                const displayType = evt.event_type === 'other' && evt.custom_type ? evt.custom_type : evt.event_type;
                return (<div key={evt.id} className="p-3.5 rounded-2xl bg-[var(--bg-accent)]/60 border border-[var(--border-gold)] print:bg-[#FFFDF8] print:border-[#B8860B] space-y-1.5 shadow-sm print:shadow-none flex flex-col justify-between print:p-2 print:rounded-xl">
                    <div className="space-y-1 print:space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)] print:bg-[#FFF8E7] print:text-[#8B5A2B] border border-[var(--border-gold)] print:border-[#B8860B] print:text-[8px] print:px-1.5">
                          {displayType}
                        </span>
                        {evt.start_time && (<span className="text-[10px] font-mono text-[var(--text-muted)] print:text-[#4A4A4A] print:text-[9px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[var(--gold-dark)] print:w-2.5 print:h-2.5"/>
                            {evt.start_time}{evt.end_time ? ` - ${evt.end_time}` : ''}
                          </span>)}
                      </div>

                      <h5 className="font-serif font-bold text-sm text-[var(--text-primary)] print:text-[#1A1A1A] print:text-xs line-clamp-1">
                        {evt.title}
                      </h5>

                      {evt.description && (<p className="text-[11px] text-[var(--text-secondary)] print:text-[#333333] print:text-[9px] line-clamp-1 italic font-serif leading-snug">
                          "{evt.description}"
                        </p>)}
                    </div>

                    <div className="pt-2 border-t border-[var(--border-subtle)] print:border-amber-200 text-[11px] text-[var(--text-secondary)] print:text-[#222222] print:text-[9px] print:pt-1 space-y-0.5 font-sans">
                      <div className="flex items-center gap-1 font-semibold text-[var(--gold-dark)] print:text-[#8B5A2B]">
                        <Calendar className="w-3 h-3 shrink-0 print:w-2.5 print:h-2.5"/>
                        <span>{formatDate(evt.event_date)}</span>
                      </div>
                      {evt.venue_name && (<p className="font-medium line-clamp-1 text-[var(--text-primary)] print:text-[#1A1A1A] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[var(--gold-dark)] shrink-0 print:w-2.5 print:h-2.5"/>
                          <span>{evt.venue_name}</span>
                        </p>)}
                    </div>
                  </div>);
            })}
            </div>
          </div>)}

        <div className="pt-4 text-xs font-serif italic text-[var(--gold-dark)] dark:text-[var(--gold-primary)] print:text-[#8B5A2B] print:font-bold print:pt-2 print:text-[11px]">
          "Bless us with your presence and warm wishes"
        </div>
      </div>
    </div>);
};
