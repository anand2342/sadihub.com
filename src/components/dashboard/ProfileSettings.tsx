import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { RelationType } from '../../types';
import { readFileAsDataUrl } from '../../lib/utils';
import { LuxuryCard } from '../common/LuxuryCard';

interface ProfileSettingsProps {
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onNavigate?: (tab: any) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onToast, onNavigate }) => {
  const { session, updateProfile } = useAuth();
  const profile = session?.profile;

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [relation, setRelation] = useState<RelationType>(profile?.relation || 'Cousin');
  const [mobileNumber, setMobileNumber] = useState(profile?.mobile_number || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        relation,
        mobile_number: mobileNumber.trim(),
        avatar_url: avatarUrl.trim()
      });
      onToast('Profile updated successfully! Returning to Home Overview...', 'success');
      
      // Auto redirect after 500ms
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('home');
        }
      }, 500);
    } catch (err: any) {
      onToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          Account Settings
        </span>
        <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)]">
          My Member Profile
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Update your personal information and profile picture
        </p>
      </div>

      <LuxuryCard className="gold-shadow border-2 border-[var(--border-gold)]">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
            <img
              src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`}
              alt={fullName}
              className="w-24 h-24 rounded-full border-2 border-[var(--border-gold)] object-cover gold-shadow"
            />
            <label className="px-4 py-2 rounded-xl bg-gold-gradient text-white text-xs font-semibold shadow hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Profile Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await readFileAsDataUrl(file);
                    setAvatarUrl(url);
                    onToast('New profile picture selected!', 'info');
                  }
                }}
              />
            </label>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] border border-[var(--border-gold)]">
              Status: {profile?.status?.toUpperCase()}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Relation</label>
              <select
                value={relation}
                onChange={e => setRelation(e.target.value as RelationType)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
              >
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
              <input
                type="tel"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Account Email (Read-only)</label>
            <input
              type="email"
              disabled
              value={session?.email || ''}
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 text-xs text-[var(--text-muted)] cursor-not-allowed"
            />
          </div>


          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </LuxuryCard>
    </div>
  );
};
