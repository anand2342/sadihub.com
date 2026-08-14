import React from 'react';
import { Menu, Moon, Sun, Heart, Crown, Shield, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getGreeting } from '../../lib/utils';
export const Header = ({ wedding, onOpenMobileMenu, onOpenAuth }) => {
    const { session, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const greeting = getGreeting();
    const firstName = session?.profile?.full_name?.split(' ')[0] || 'Family Member';
    const familyName = session?.current_family?.name || 'Wedding Portal';
    // Groom-first ordering title
    const coupleTitle = wedding
        ? `${wedding.groom_name} & ${wedding.bride_name}`
        : familyName;
    const isSuperAdmin = session?.roles.includes('super_admin');
    const isFamilyAdmin = session?.roles.includes('family_admin');
    return (<header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-gold)] transition-colors print:hidden">
      {/* Royal Shahi Vivah Decorative Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-300 via-yellow-400 via-rose-600 to-amber-600"/>
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Button & Brand Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={onOpenMobileMenu} className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-accent)] border border-[var(--border-gold)] cursor-pointer gold-shadow" aria-label="Toggle menu" title="Toggle Sidebar Menu (Open / Hide)">
            <Menu className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]"/>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--gold-light)] border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)] gold-shadow shrink-0">
              <Heart className="w-5 h-5 fill-current"/>
            </div>
            <div>
              {/* GROOM FIRST ORDERING ALWAYS IN HEADER */}
              <h1 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] leading-tight flex items-center gap-2">
                <span>{coupleTitle}</span>
                <span className="hidden sm:inline text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] border border-[var(--border-gold)]">
                  Wedding
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-sans flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]"/>
                <span>A little corner made just for your family</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Greeting, Theme Toggle & Auth State */}
        <div className="flex items-center gap-2 sm:gap-4">
          {session && (<div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {greeting}, {firstName}!
              </span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-end gap-1">
                {isSuperAdmin && (<span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5">
                    <Crown className="w-3 h-3"/> Super Admin
                  </span>)}
                {!isSuperAdmin && isFamilyAdmin && (<span className="text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-bold flex items-center gap-0.5">
                    <Shield className="w-3 h-3"/> Family Admin
                  </span>)}
                {!isSuperAdmin && !isFamilyAdmin && (<span>{session.profile?.relation || 'Family Member'}</span>)}
              </span>
            </div>)}

          {/* 3-Mode Royal Theme Switcher */}
          <button onClick={toggleTheme} className="px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)] transition-all cursor-pointer gold-shadow flex items-center gap-1.5 text-xs font-semibold" title="Click to change portal theme (Shahi Shaadi Vibe / Classic Ivory / Dark)">
            {theme === 'royal-wedding' && (<>
                <Crown className="w-4 h-4 text-amber-400 fill-current animate-pulse"/>
                <span className="hidden sm:inline text-amber-300 font-serif">Shahi Shaadi</span>
              </>)}
            {theme === 'light' && (<>
                <Sun className="w-4 h-4 text-amber-500"/>
                <span className="hidden sm:inline text-[var(--gold-dark)]">Classic Ivory</span>
              </>)}
            {theme === 'dark' && (<>
                <Moon className="w-4 h-4 text-amber-300"/>
                <span className="hidden sm:inline text-amber-300">Midnight Dark</span>
              </>)}
          </button>

          {/* Auth Action */}
          {session ? (<button onClick={logout} className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer" title="Sign Out">
              <LogOut className="w-4 h-4"/>
              <span className="hidden sm:inline">Logout</span>
            </button>) : (<button onClick={onOpenAuth} className="px-5 py-2.5 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all cursor-pointer">
              Sign In
            </button>)}
        </div>
      </div>
    </header>);
};
