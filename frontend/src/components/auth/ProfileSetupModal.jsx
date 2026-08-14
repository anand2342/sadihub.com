import React, { useState, useEffect, useCallback } from 'react';
import { Clock, LogOut, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export const ProfileSetupModal = ({ onToast }) => {
    const { session, updateProfile, refreshSession, logout } = useAuth();
    const profile = session?.profile;
    const familyName = session?.current_family?.name || 'Your Family';
    const [relation, setRelation] = useState(profile?.relation || 'Cousin');
    const [mobileNumber, setMobileNumber] = useState(profile?.mobile_number || '');
    const [saving, setSaving] = useState(false);
    const [checking, setChecking] = useState(false);
    // Auto-check approval status every 15 seconds
    const checkApprovalStatus = useCallback(async () => {
        setChecking(true);
        try {
            refreshSession();
            // Give it a moment to update
            await new Promise(r => setTimeout(r, 500));
        }
        finally {
            setChecking(false);
        }
    }, [refreshSession]);
    useEffect(() => {
        const interval = setInterval(() => {
            checkApprovalStatus();
        }, 15000);
        return () => clearInterval(interval);
    }, [checkApprovalStatus]);
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile({
                relation,
                mobile_number: mobileNumber
            });
            onToast('Profile details updated! Still awaiting Family Admin approval.', 'info');
        }
        catch (err) {
            onToast(err.message || 'Failed to update details.', 'error');
        }
        finally {
            setSaving(false);
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Animated waiting icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full bg-[var(--gold-light)] animate-ping opacity-20"/>
          <div className="relative w-20 h-20 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)] gold-shadow">
            <Clock className="w-9 h-9 animate-pulse"/>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10">
            ⏳ Awaiting Admin Approval
          </span>
          <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] mt-3">
            Welcome to {familyName} Wedding!
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Your request to join the family has been submitted. Your <strong>Family Admin</strong> will review and approve your membership. You'll get access to the full portal once approved.
          </p>
        </div>

        {/* Security note */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-accent)] border border-[var(--border-subtle)] text-left">
          <Shield className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] shrink-0 mt-0.5"/>
          <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Why approval?</strong> To keep your family's wedding portal private and secure, every new member must be verified by the Family Admin before gaining access.
          </div>
        </div>

        {/* Current Member Details — editable while waiting */}
        <form onSubmit={handleUpdate} className="text-left space-y-3 pt-2 border-t border-[var(--border-subtle)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Your Profile Details</p>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Name</label>
            <input type="text" disabled value={profile?.full_name || ''} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 text-xs text-[var(--text-muted)] cursor-not-allowed"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Relation</label>
              <select value={relation} onChange={e => setRelation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]">
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Cousin">Cousin</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Mobile Number</label>
              <input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+91 98765 43210" className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"/>
            </div>
          </div>

          <div className="space-y-2">
            <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-accent)] text-[var(--text-primary)] font-medium text-xs hover:bg-[var(--gold-light)] transition-all cursor-pointer">
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>

            {/* Check approval status button */}
            <button type="button" onClick={() => {
            checkApprovalStatus();
            onToast('Checking approval status...', 'info');
        }} disabled={checking} className="w-full py-3 rounded-xl bg-gold-gradient text-white font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer gold-shadow flex items-center justify-center gap-2">
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`}/>
              {checking ? 'Checking Status...' : 'Check Approval Status'}
            </button>

            <p className="text-[10px] text-center text-[var(--text-muted)] flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3"/>
              Auto-checking every 15 seconds
            </p>
          </div>
        </form>

        <div className="pt-4 flex items-center justify-between border-t border-[var(--border-subtle)] text-xs">
          <span className="text-[var(--text-muted)]">Signed in as {session?.email}</span>
          <button onClick={logout} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium cursor-pointer">
            <LogOut className="w-3.5 h-3.5"/>
            Sign Out
          </button>
        </div>

      </div>
    </div>);
};
