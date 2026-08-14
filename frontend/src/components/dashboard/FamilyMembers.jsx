import React from 'react';
import { Check, X, Phone, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LuxuryCard } from '../common/LuxuryCard';
export const FamilyMembers = ({ members, onApproveMember, onRejectMember }) => {
    const { session } = useAuth();
    const isFamilyAdmin = session?.roles.includes('family_admin') || session?.roles.includes('super_admin');
    const approvedMembers = members.filter(m => m.status === 'approved');
    const pendingMembers = members.filter(m => m.status === 'pending');
    return (<div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
          Family Directory
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">
          Family Members & Relatives
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Every relative joining in to celebrate this blessed wedding
        </p>
      </div>

      {/* Pending Approval Section for Family Admin */}
      {isFamilyAdmin && pendingMembers.length > 0 && (<LuxuryCard className="border-2 border-amber-500/40 bg-amber-500/5 space-y-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
            <UserCheck className="w-5 h-5"/>
            <span>Pending Member Approvals ({pendingMembers.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMembers.map((member) => (<div key={member.id} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-gold)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.full_name}`} alt={member.full_name} className="w-12 h-12 rounded-full border border-[var(--border-gold)] object-cover"/>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                      {member.full_name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Relation: <strong className="text-[var(--gold-dark)]">{member.relation}</strong>
                    </p>
                    {member.mobile_number && (<p className="text-[10px] text-[var(--text-muted)]">{member.mobile_number}</p>)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => onApproveMember && onApproveMember(member.id)} className="p-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer" title="Approve Member">
                    <Check className="w-4 h-4"/>
                    <span>Approve</span>
                  </button>
                  <button onClick={() => onRejectMember && onRejectMember(member.id)} className="p-2 rounded-xl border border-red-500/40 text-red-600 hover:bg-red-500/10 text-xs font-semibold transition-all cursor-pointer" title="Reject">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
              </div>))}
          </div>
        </LuxuryCard>)}

      {/* Approved Members List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {approvedMembers.map((member) => (<LuxuryCard key={member.id} className="text-center space-y-3 flex flex-col items-center justify-between">
            <div className="relative">
              <img src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.full_name}`} alt={member.full_name} className="w-20 h-20 rounded-full border-2 border-[var(--border-gold)] object-cover gold-shadow"/>
              <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 text-white text-[10px] border border-white" title="Approved Member">
                <Check className="w-3 h-3"/>
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
                {member.full_name}
              </h3>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                {member.relation}
              </span>
            </div>

            {member.mobile_number && (<p className="text-xs text-[var(--text-muted)] font-mono flex items-center justify-center gap-1 pt-2 border-t border-[var(--border-subtle)] w-full">
                <Phone className="w-3 h-3 text-[var(--gold-dark)]"/>
                <span>{member.mobile_number}</span>
              </p>)}
          </LuxuryCard>))}
      </div>
    </div>);
};
