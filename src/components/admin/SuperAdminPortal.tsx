import React, { useState } from 'react';
import { Crown, Plus, ArrowRight } from 'lucide-react';
import type { Family } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getStore, saveStore } from '../../lib/dataStore';
import { LuxuryCard } from '../common/LuxuryCard';
import { slugify } from '../../lib/utils';


interface SuperAdminPortalProps {
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({ onToast }) => {
  const { session, switchFamily, refreshSession } = useAuth();
  const store = getStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyPass, setNewFamilyPass] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const families = store.families;
  const totalProfiles = store.profiles.length;
  const totalPhotos = store.photos.length;
  const totalWishes = store.wishes.length;

  const handleCreateFamilyBySuper = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugify(newFamilyName);
    if (families.some(f => f.slug === slug)) {
      onToast(`Family "${newFamilyName}" already exists!`, 'error');
      return;
    }

    const familyId = `family-${Date.now()}`;
    const adminUserId = `user-${Date.now()}`;

    const newFam: Family = {
      id: familyId,
      name: newFamilyName.trim(),
      slug: slug,
      family_code: newFamilyPass,
      created_at: new Date().toISOString()
    };

    // Auto create wedding row for family
    const newWedding = {
      id: `wedding-${Date.now()}`,
      family_id: familyId,
      groom_name: `${newFamilyName.replace(/Family/i, '').trim()} Groom`,
      bride_name: `${newFamilyName.replace(/Family/i, '').trim()} Bride`,
      wedding_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      venue_name: 'Grand Royal Palace',
      venue_address: 'City Center Boulevard',
      created_at: new Date().toISOString()
    };

    store.families.push(newFam);
    store.weddings.push(newWedding);

    if (adminEmail.trim()) {
      store.authUsers.push({
        id: adminUserId,
        email: adminEmail.trim().toLowerCase(),
        passwordHash: adminPass || 'pass123'
      });
      store.profiles.push({
        id: adminUserId,
        family_id: familyId,
        full_name: adminName.trim() || 'Family Admin',
        relation: 'Other',
        status: 'approved',
        created_at: new Date().toISOString(),
        email: adminEmail.trim().toLowerCase()
      });
      store.userRoles.push({
        id: `role-${Date.now()}`,
        user_id: adminUserId,
        family_id: familyId,
        role: 'family_admin',
        created_at: new Date().toISOString()
      });
    }

    saveStore(store);
    refreshSession();
    onToast(`New Family Portal "${newFamilyName}" created by Super Admin!`, 'success');
    setShowCreateModal(false);
    setNewFamilyName('');
    setNewFamilyPass('');
    setAdminEmail('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10">
            System Control Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] mt-1 flex items-center gap-2">
            <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span>Super Admin Portal</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Global multi-family management and analytics
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium text-xs shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Family Portal</span>
        </button>
      </div>

      {/* Global Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LuxuryCard className="border-l-4 border-purple-500 text-center space-y-1">
          <span className="text-2xl font-serif font-bold text-[var(--text-primary)]">{families.length}</span>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Active Families</p>
        </LuxuryCard>

        <LuxuryCard className="border-l-4 border-amber-500 text-center space-y-1">
          <span className="text-2xl font-serif font-bold text-[var(--text-primary)]">{totalProfiles}</span>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Total Members</p>
        </LuxuryCard>

        <LuxuryCard className="border-l-4 border-emerald-500 text-center space-y-1">
          <span className="text-2xl font-serif font-bold text-[var(--text-primary)]">{totalPhotos}</span>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Uploaded Photos</p>
        </LuxuryCard>

        <LuxuryCard className="border-l-4 border-rose-500 text-center space-y-1">
          <span className="text-2xl font-serif font-bold text-[var(--text-primary)]">{totalWishes}</span>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Family Wishes</p>
        </LuxuryCard>
      </div>

      {/* Multi-Family List Management */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-[var(--text-primary)]">
          Registered Family Spaces ({families.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {families.map((fam) => {
            const familyMembers = store.profiles.filter(p => p.family_id === fam.id);
            const wedding = store.weddings.find(w => w.family_id === fam.id);
            const isCurrent = session?.current_family?.id === fam.id;

            return (
              <LuxuryCard key={fam.id} className={`space-y-4 border-2 ${isCurrent ? 'border-purple-500 bg-purple-500/5' : 'border-[var(--border-gold)]'}`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">ID: {fam.id}</span>
                    <h4 className="text-xl font-serif font-bold text-[var(--text-primary)]">{fam.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Passkey: <code className="bg-[var(--bg-accent)] px-1.5 py-0.5 rounded font-mono">{fam.family_code}</code></p>
                  </div>

                  {isCurrent ? (
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Active Portal
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        switchFamily(fam.id);
                        onToast(`Switched active portal view to "${fam.name}"`, 'info');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-purple-500/40 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <span>Switch View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)]">
                  <div>Couple: <strong className="text-[var(--text-primary)]">{wedding?.groom_name} & {wedding?.bride_name}</strong></div>
                  <div>Members: <strong className="text-[var(--text-primary)]">{familyMembers.length} Accounts</strong></div>
                </div>
              </LuxuryCard>
            );
          })}
        </div>
      </div>

      {/* CREATE NEW FAMILY MODAL BY SUPER ADMIN */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">Create Family Portal (Super Admin)</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateFamilyBySuper} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Family Name *</label>
                  <input
                    type="text"
                    required
                    value={newFamilyName}
                    onChange={e => setNewFamilyName(e.target.value)}
                    placeholder="e.g. Roy Family"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Shared Passkey *</label>
                  <input
                    type="text"
                    required
                    value={newFamilyPass}
                    onChange={e => setNewFamilyPass(e.target.value)}
                    placeholder="roy123"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">Optional Family Admin Credentials:</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    placeholder="Admin Full Name (e.g. Sneh Roy)"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    placeholder="Admin Email (sneh.roy@gmail.com)"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                  <input
                    type="password"
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    placeholder="Admin Password (pass123)"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium text-xs shadow hover:bg-purple-700 transition-all cursor-pointer mt-3"
              >
                Create Family Portal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
