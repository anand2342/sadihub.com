import React, { useState } from 'react';
import { MessageSquareHeart, Sparkles, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { LuxuryCard } from '../common/LuxuryCard';
import { EmptyState } from '../common/EmptyState';
export const WishesWall = ({ wishes, onAddWish, onDeleteWish, onToast }) => {
    const { session } = useAuth();
    const isFamilyAdmin = session?.roles.includes('family_admin') || session?.roles.includes('super_admin');
    const [senderName, setSenderName] = useState(session?.profile?.full_name || '');
    const [relation, setRelation] = useState(session?.profile?.relation || 'Cousin');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!senderName.trim() || !message.trim())
            return;
        setSubmitting(true);
        try {
            onAddWish({
                sender_name: senderName.trim(),
                relation,
                message: message.trim()
            });
            // Confetti Celebration Trigger!
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
            onToast('Your wish has been posted to the Wishes Wall! ✨', 'success');
            setMessage('');
        }
        catch (err) {
            onToast('Failed to post wish.', 'error');
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          Blessings & Love
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
          Family Wishes Wall
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Leave your heartfelt blessings for the Groom & Bride
        </p>
      </div>

      {/* Write Wish Input Card */}
      <LuxuryCard className="max-w-2xl mx-auto gold-shadow border-2 border-[var(--border-gold)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <MessageSquareHeart className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)]"/>
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Send Your Wedding Blessings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Name</label>
              <input type="text" required value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="e.g. Vikram Kapoor" className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Relation</label>
              <select value={relation} onChange={e => setRelation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Blessing Message</label>
            <textarea required rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="May your marriage be blessed with endless happiness, health, and laughter..." className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"/>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Sparkles className="w-4 h-4"/>
            <span>{submitting ? 'Posting...' : 'Post Blessing to Wall'}</span>
          </button>
        </form>
      </LuxuryCard>

      {/* Wishes Display Cards */}
      {wishes.length === 0 ? (<EmptyState icon={MessageSquareHeart} title="No Wishes Posted Yet" description="Be the first family member to write a blessing on the wall!"/>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {wishes.map((w) => (<LuxuryCard key={w.id} className="relative flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] dark:text-[var(--gold-primary)] text-xs font-bold font-serif">
                      {w.sender_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                        {w.sender_name}
                      </h4>
                      <span className="text-[10px] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-semibold">
                        {w.relation}
                      </span>
                    </div>
                  </div>

                  {isFamilyAdmin && onDeleteWish && (<button onClick={() => {
                        onDeleteWish(w.id);
                        onToast('Wish removed by admin moderation.', 'info');
                    }} className="text-red-500/60 hover:text-red-500 p-1 rounded-lg cursor-pointer" title="Moderate / Delete wish">
                      <Trash2 className="w-4 h-4"/>
                    </button>)}
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic leading-relaxed font-sans p-3 rounded-xl bg-[var(--bg-accent)] border border-[var(--border-subtle)]">
                  "{w.message}"
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] text-right">
                Blessing received
              </div>
            </LuxuryCard>))}
        </div>)}
    </div>);
};
