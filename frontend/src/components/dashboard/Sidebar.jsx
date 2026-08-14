import React from 'react';
import { Home, Heart, Calendar, Users, Image as ImageIcon, MessageSquareHeart, Video, Mail, MapPin, User, Shield, Crown, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
export const Sidebar = ({ activeTab, setActiveTab, isOpenMobile, onCloseMobile }) => {
    const { session } = useAuth();
    const isSuperAdmin = session?.roles.includes('super_admin');
    const isFamilyAdmin = session?.roles.includes('family_admin');
    const navItems = [
        { id: 'home', label: 'Home Overview', icon: Home },
        { id: 'couple', label: 'Groom & Bride', icon: Heart, badge: 'Love Story' },
        { id: 'events', label: 'Event Schedule', icon: Calendar, badge: 'Rituals' },
        { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, badge: 'Max 10' },
        { id: 'wishes', label: 'Wishes Wall', icon: MessageSquareHeart },
        { id: 'videos', label: 'Wedding Videos', icon: Video },
        { id: 'invitation', label: 'Digital Invitation', icon: Mail },
        { id: 'members', label: 'Family Members', icon: Users },
        { id: 'location', label: 'Venue Location', icon: MapPin },
        { id: 'profile', label: 'My Profile', icon: User },
    ];
    const handleSelectTab = (tab) => {
        setActiveTab(tab);
        // Auto-close drawer on mobile devices only when tapping a menu item
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            onCloseMobile();
        }
    };
    return (<>
      {/* Backdrop Overlay (Mobile Only) */}
      {isOpenMobile && (<div onClick={onCloseMobile} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-fade-in"/>)}

      {/* Sidebar Navigation Drawer */}
      <aside className={cn('fixed md:sticky top-0 md:top-20 left-0 z-50 md:z-30 h-screen md:h-[calc(100vh-5rem)] bg-[var(--bg-surface)] flex flex-col justify-between transition-all duration-300 ease-in-out overflow-y-auto print:hidden shrink-0', isOpenMobile
            ? 'w-72 p-4 border-r border-[var(--border-gold)] translate-x-0 opacity-100'
            : 'w-0 p-0 border-none -translate-x-full opacity-0 pointer-events-none overflow-hidden')}>
        <div className="space-y-6">
          {/* Drawer Header with Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] fill-current"/>
              <span className="font-serif font-bold text-lg text-[var(--text-primary)]">
                {session?.current_family?.name || 'Wedding Portal'}
              </span>
            </div>
            <button onClick={onCloseMobile} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)] transition-colors cursor-pointer" title="Hide Sidebar">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Main Navigation Group */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Family Navigation
            </p>
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (<button key={item.id} onClick={() => handleSelectTab(item.id)} className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer group', isActive
                    ? 'bg-gold-gradient text-white shadow-md font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)]')}>
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-[var(--gold-dark)] dark:text-[var(--gold-primary)]')}/>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (<span className={cn('text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border', isActive
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-[var(--bg-accent)] border-[var(--border-gold)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)]')}>
                      {item.badge}
                    </span>)}
                </button>);
        })}
          </nav>

          {/* Administrative Sections */}
          {(isFamilyAdmin || isSuperAdmin) && (<div className="pt-4 border-t border-[var(--border-subtle)] space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Administration
              </p>

              {(isFamilyAdmin || isSuperAdmin) && (<button onClick={() => handleSelectTab('family-admin')} className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer group', activeTab === 'family-admin'
                    ? 'bg-gold-gradient text-white shadow-md font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)]')}>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]"/>
                    <span>Family Admin Panel</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400">
                    Admin
                  </span>
                </button>)}

              {isSuperAdmin && (<button onClick={() => handleSelectTab('super-admin')} className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer group', activeTab === 'super-admin'
                    ? 'bg-purple-600 text-white shadow-md font-semibold'
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-500/10')}>
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400"/>
                    <span>Super Admin Portal</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border bg-purple-500/20 border-purple-500/40 text-purple-600 dark:text-purple-300">
                    Master
                  </span>
                </button>)}
            </div>)}
        </div>

        {/* Footer info in sidebar */}
        <div className="pt-4 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] text-center">
          <p className="font-serif text-xs font-semibold text-[var(--text-primary)]">
            {session?.current_family?.name || 'Family Portal'}
          </p>
          <p className="mt-0.5">Private Family Wedding Space</p>
        </div>
      </aside>
    </>);
};
