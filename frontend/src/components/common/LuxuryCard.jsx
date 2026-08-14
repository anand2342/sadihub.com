import React from 'react';
import { cn } from '../../lib/utils';
export const LuxuryCard = ({ children, className, glow = false, hoverLift = true, ...props }) => {
    return (<div className={cn('relative bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-gold)] shadow-sm transition-all duration-300', hoverLift && 'card-hover-lift', glow && 'gold-shadow', className)} {...props}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--gold-primary)]/10 to-transparent rounded-tr-2xl pointer-events-none"/>
      {children}
    </div>);
};
