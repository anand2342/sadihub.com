import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ArrowLeft, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LuxuryCard } from '../common/LuxuryCard';
export const BootstrapSuperAdmin = ({ onBack, onToast }) => {
    const { session, claimSuperAdmin, checkSuperAdminExists } = useAuth();
    const [loading, setLoading] = useState(false);
    const exists = checkSuperAdminExists();
    const handleClaim = async () => {
        setLoading(true);
        try {
            const res = await claimSuperAdmin();
            if (res.success) {
                onToast('Congratulations! Super Admin privilege granted to your account.', 'success');
                onBack();
            }
            else {
                onToast(res.message || 'Could not claim Super Admin.', 'error');
            }
        }
        catch (err) {
            onToast(err.message || 'An error occurred.', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-[80vh] flex items-center justify-center p-4">
      <LuxuryCard className="max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[var(--gold-light)] flex items-center justify-center mx-auto text-[var(--gold-dark)] dark:text-[var(--gold-primary)] gold-shadow">
          <Crown className="w-8 h-8"/>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
            System Bootstrap RPC
          </span>
          <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)] mt-2">
            First-Time Setup: Super Admin
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            This endpoint uses <code className="bg-[var(--bg-accent)] px-1.5 py-0.5 rounded text-[var(--gold-dark)] font-mono">claim_super_admin_if_none()</code> RPC to assign master administrator permissions.
          </p>
        </div>

        {exists ? (<div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs sm:text-sm flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5"/>
            <div>
              <p className="font-bold">Super Admin Already Claimed</p>
              <p className="mt-1">
                A Super Admin account already exists in the system. Further claims are restricted by Security Definer RPC policies.
              </p>
            </div>
          </div>) : !session ? (<div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs sm:text-sm text-left">
            Please log in or create an account first to claim Super Admin access.
          </div>) : (<div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm text-left space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600"/>
              <span>Ready to Claim</span>
            </div>
            <p>
              Logged in as <strong className="font-semibold">{session.email}</strong>. Click below to register this user as the initial Super Admin.
            </p>
          </div>)}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <button onClick={onBack} className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium text-xs hover:bg-[var(--bg-accent)] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-4 h-4"/>
            Return to Home
          </button>

          {!exists && session && (<button onClick={handleClaim} disabled={loading} className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <Crown className="w-4 h-4"/>
              {loading ? 'Executing RPC...' : 'Claim Super Admin Access'}
            </button>)}
        </div>
      </LuxuryCard>
    </div>);
};
