import React from 'react';
import { type LucideIcon, Heart } from 'lucide-react';
import { LuxuryCard } from './LuxuryCard';


interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Heart,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <LuxuryCard hoverLift={false} className="text-center py-12 px-6 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-[var(--gold-light)] flex items-center justify-center mb-4 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] gold-shadow">
        <Icon className="w-8 h-8 animate-pulse" />
      </div>
      <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto text-sm leading-relaxed mb-6 font-sans">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-gold-gradient font-medium text-sm shadow-md hover:opacity-95 transition-all transform hover:scale-105 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </LuxuryCard>
  );
};
