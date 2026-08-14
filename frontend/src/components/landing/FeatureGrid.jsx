import React from 'react';
import { Heart, Calendar, Image as ImageIcon, MessageSquareHeart, Mail, MapPin } from 'lucide-react';
import { LuxuryCard } from '../common/LuxuryCard';
export const FeatureGrid = () => {
    const features = [
        {
            icon: Heart,
            title: 'Groom & Bride Showcase',
            description: 'Dedicated couple profiles, parents details, and romantic love story timeline with Groom details proudly presented first.',
            badge: 'Couple Story'
        },
        {
            icon: Calendar,
            title: 'Event Schedules & Custom Badges',
            description: 'Never miss a ritual! Organize Haldi, Mehendi, Sangeet, Wedding, Reception, or add custom events like Tilak & Roka with custom badges.',
            badge: 'Custom Rituals'
        },
        {
            icon: ImageIcon,
            title: 'Family Photo Gallery',
            description: 'Every approved family member can upload up to 10 favorite memories. Like, comment, and relive precious wedding moments in full screen.',
            badge: 'Max 10 per member'
        },
        {
            icon: MessageSquareHeart,
            title: 'Wishes Wall',
            description: 'A cozy wall filled with warm blessings, heartfelt wishes, and audio celebration from aunts, uncles, cousins, and lifelong friends.',
            badge: 'Blessings & Love'
        },
        {
            icon: Mail,
            title: 'Digital Invitation Card',
            description: 'A breathtaking luxury digital wedding card ready for family sharing with complete venue information and timings.',
            badge: 'Print & Share'
        },
        {
            icon: MapPin,
            title: 'Google Maps Navigation',
            description: 'Direct interactive map pin links so all relatives and guests arrive smoothly at every venue without confusion.',
            badge: 'Easy Navigation'
        }
    ];
    return (<section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
          Crafted with love for your whole family
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          Everything you need to keep every relative informed, connected, and emotionally engaged during the wedding festivities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => {
            const Icon = item.icon;
            return (<LuxuryCard key={idx} className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                    <Icon className="w-6 h-6"/>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[var(--border-gold)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] bg-[var(--bg-accent)]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </LuxuryCard>);
        })}
      </div>
    </section>);
};
