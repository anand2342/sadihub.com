import React, { useState, useEffect } from 'react';
import { X, Heart, Key, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { RelationType } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'join' | 'create';
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  onToast
}) => {
  const { loginWithEmail, loginWithFamily, joinFamily, createFamily } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'join' | 'create'>(initialTab);
  const [loading, setLoading] = useState(false);

  // Password View Toggles
  const [showSignInPass, setShowSignInPass] = useState(false);
  const [showJoinPass, setShowJoinPass] = useState(false);
  const [showCreateAdminPass, setShowCreateAdminPass] = useState(false);

  // Form States
  const [signInMode, setSignInMode] = useState<'email' | 'family'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('shadihub_remember_me') === 'true';
  });

  // Pre-fill credentials if Remember Me was checked previously
  useEffect(() => {
    if (isOpen && localStorage.getItem('shadihub_remember_me') === 'true') {
      const savedEmail = localStorage.getItem('shadihub_remember_email');
      const savedPassword = localStorage.getItem('shadihub_remember_password');
      const savedFamily = localStorage.getItem('shadihub_remember_family');
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
      if (savedFamily) setFamilyName(savedFamily);
    }
  }, [isOpen]);

  // Join Family Form
  const [joinFullName, setJoinFullName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPass, setJoinPass] = useState('');
  const [joinRelation, setJoinRelation] = useState<RelationType>('Cousin');
  const [joinMobile, setJoinMobile] = useState('');

  // Create Family Form
  const [createFamilyName, setCreateFamilyName] = useState('');
  const [createFamilyPass, setCreateFamilyPass] = useState('');
  const [createAdminName, setCreateAdminName] = useState('');
  const [createAdminEmail, setCreateAdminEmail] = useState('');
  const [createAdminPass, setCreateAdminPass] = useState('');


  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (signInMode === 'email') {
        res = await loginWithEmail(email, password);
      } else {
        res = await loginWithFamily(familyName);
      }

      if (res.success) {
        if (rememberMe) {
          localStorage.setItem('shadihub_remember_me', 'true');
          if (email) localStorage.setItem('shadihub_remember_email', email);
          if (password) localStorage.setItem('shadihub_remember_password', password);
          if (familyName) localStorage.setItem('shadihub_remember_family', familyName);
        } else {
          localStorage.removeItem('shadihub_remember_me');
          localStorage.removeItem('shadihub_remember_email');
          localStorage.removeItem('shadihub_remember_password');
          localStorage.removeItem('shadihub_remember_family');
        }
        onToast('Signed in successfully! Welcome to your Family Wedding Portal.', 'success');
        onClose();
      } else {
        onToast(res.message || 'Sign in failed.', 'error');
      }
    } catch (err: any) {
      onToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await joinFamily({
        familyName,
        fullName: joinFullName,
        email: joinEmail,
        password: joinPass,
        relation: joinRelation,
        mobileNumber: joinMobile
      });


      if (res.success) {
        onToast('Account created! Your profile is pending approval by your Family Admin.', 'info');
        onClose();
      } else {
        onToast(res.message || 'Failed to join family.', 'error');
      }
    } catch (err: any) {
      onToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createFamily({
        familyName: createFamilyName,
        familyPass: createFamilyPass,
        adminName: createAdminName,
        adminEmail: createAdminEmail,
        adminPassword: createAdminPass
      });

      if (res.success) {
        onToast('Family Wedding Portal created! You are now the Family Admin.', 'success');
        onClose();
      } else {
        onToast(res.message || 'Failed to create family.', 'error');
      }
    } catch (err: any) {
      onToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--gold-light)] flex items-center justify-center mx-auto mb-3 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] gold-shadow">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
            Family Wedding Portal
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Where your family comes together
          </p>
        </div>

        {/* 3 Tabs Header */}
        <div className="flex border-b border-[var(--border-subtle)] mb-6">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium border-b-2 text-center transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'border-[var(--gold-primary)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium border-b-2 text-center transition-all cursor-pointer ${
              activeTab === 'join'
                ? 'border-[var(--gold-primary)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Join Family
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium border-b-2 text-center transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'border-[var(--gold-primary)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-bold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Create Family
          </button>
        </div>

        {/* TAB 1: SIGN IN */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} method="post" autoComplete="on" className="space-y-4">
            <div className="flex justify-center gap-4 mb-2">
              <button
                type="button"
                onClick={() => setSignInMode('email')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  signInMode === 'email'
                    ? 'bg-[var(--gold-light)] border-[var(--border-gold)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-bold'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                Personal Email
              </button>
              <button
                type="button"
                onClick={() => setSignInMode('family')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  signInMode === 'family'
                    ? 'bg-[var(--gold-light)] border-[var(--border-gold)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] font-bold'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                Family Name & Pass
              </button>
            </div>

            {signInMode === 'email' ? (
              <>
                <div>
                  <label htmlFor="signin-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      id="signin-email"
                      name="username"
                      autoComplete="username"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. rahul.kapoor@gmail.com"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="signin-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      id="signin-password"
                      name="password"
                      autoComplete="current-password"
                      type={showSignInPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPass(!showSignInPass)}
                      className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      title={showSignInPass ? 'Hide password' : 'View password'}
                    >
                      {showSignInPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="signin-family-code" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Unique Family Code or Family Name *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-[var(--gold-dark)]" />
                    <input
                      id="signin-family-code"
                      name="username"
                      autoComplete="username"
                      type="text"
                      required
                      value={familyName}
                      onChange={e => setFamilyName(e.target.value)}
                      placeholder="Enter Code (e.g. KAP-8492) or Family Name"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] font-mono font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    ✨ Simply type your Unique Family Code (e.g. KAP-8492) to open your family portal instantly!
                  </p>
                </div>
              </>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-[var(--text-secondary)] font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-gold)] text-[var(--gold-dark)] focus:ring-[var(--gold-primary)] accent-[var(--gold-dark)] cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => onToast('Please contact your Family Admin to reset your password.', 'info')}
                className="text-[var(--gold-dark)] dark:text-[var(--gold-primary)] hover:underline font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-gradient font-medium text-sm text-white shadow-md hover:opacity-95 transition-all mt-4 cursor-pointer"
            >
              {loading ? 'Opening Portal...' : 'Sign In to Portal'}
            </button>
          </form>
        )}

        {/* TAB 2: JOIN FAMILY */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoinFamily} method="post" autoComplete="on" className="space-y-3">
            <div className="p-3 rounded-xl bg-[var(--gold-light)] border border-[var(--border-gold)] text-xs text-[var(--gold-dark)] dark:text-[var(--gold-primary)] leading-snug">
              ✨ Enter the <strong>Unique Family Code</strong> (e.g. KAP-8492) shared by your Family Admin to join your family portal!
            </div>

            <div>
              <label htmlFor="join-family-code" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Unique Family Code (or Family Name) *
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4 h-4 text-[var(--gold-dark)]" />
                <input
                  id="join-family-code"
                  name="familyCode"
                  type="text"
                  required
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  placeholder="e.g. KAP-8492"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)] uppercase tracking-wider"
                />
              </div>
            </div>

            <div>
              <label htmlFor="join-fullname" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Full Name *</label>
              <input
                id="join-fullname"
                name="name"
                type="text"
                required
                value={joinFullName}
                onChange={e => setJoinFullName(e.target.value)}
                placeholder="e.g. Priya Kapoor"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="join-relation" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Relation</label>
                <select
                  id="join-relation"
                  name="relation"
                  value={joinRelation}
                  onChange={e => setJoinRelation(e.target.value as RelationType)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
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
                <label htmlFor="join-mobile" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Mobile Number</label>
                <input
                  id="join-mobile"
                  name="tel"
                  autoComplete="tel"
                  type="tel"
                  value={joinMobile}
                  onChange={e => setJoinMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="join-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Personal Email *</label>
              <input
                id="join-email"
                name="username"
                autoComplete="username"
                type="email"
                required
                value={joinEmail}
                onChange={e => setJoinEmail(e.target.value)}
                placeholder="priya@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
              />
            </div>

            <div>
              <label htmlFor="join-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Create Account Password *</label>
              <div className="relative">
                <input
                  id="join-password"
                  name="new-password"
                  autoComplete="new-password"
                  type={showJoinPass ? 'text' : 'password'}
                  required
                  value={joinPass}
                  onChange={e => setJoinPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowJoinPass(!showJoinPass)}
                  className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  title={showJoinPass ? 'Hide password' : 'View password'}
                >
                  {showJoinPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-gradient font-medium text-sm text-white shadow-md hover:opacity-95 transition-all mt-3 cursor-pointer"
            >
              {loading ? 'Joining Family...' : 'Join Family Portal'}
            </button>
          </form>
        )}

        {/* TAB 3: CREATE FAMILY (Self-serve Auto Admin) */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateFamily} method="post" autoComplete="on" className="space-y-3">
            <div className="p-3 rounded-xl bg-[var(--gold-light)] border border-[var(--border-gold)] text-xs text-[var(--gold-dark)] dark:text-[var(--gold-primary)] leading-snug">
              Self-serve family creation! When you register, a <strong>Unique Family Code</strong> (e.g. ROY-5491) will be auto-generated and displayed in your Admin Panel to share with your family members.
            </div>

            <div>
              <label htmlFor="create-family-name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Family Name *</label>
              <input
                id="create-family-name"
                name="familyName"
                type="text"
                required
                value={createFamilyName}
                onChange={e => setCreateFamilyName(e.target.value)}
                placeholder="e.g. Verma Family"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
              />
            </div>

            <div>
              <label htmlFor="create-family-pass" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Custom Passkey / Code (Optional)
              </label>
              <input
                id="create-family-pass"
                name="customPasskey"
                type="text"
                value={createFamilyPass}
                onChange={e => setCreateFamilyPass(e.target.value)}
                placeholder="Leave blank to auto-generate (e.g. VER-7892)"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)] uppercase font-mono"
              />
            </div>

            <div>
              <label htmlFor="create-admin-name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Family Admin Name *</label>
              <input
                id="create-admin-name"
                name="name"
                type="text"
                required
                value={createAdminName}
                onChange={e => setCreateAdminName(e.target.value)}
                placeholder="Your Full Name (e.g. Rajeev Kapoor)"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
              />
            </div>

            <div>
              <label htmlFor="create-admin-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Admin Email Address *</label>
              <input
                id="create-admin-email"
                name="username"
                autoComplete="username"
                type="email"
                required
                value={createAdminEmail}
                onChange={e => setCreateAdminEmail(e.target.value)}
                placeholder="admin@family.portal"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
              />
            </div>

            <div>
              <label htmlFor="create-admin-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Admin Account Password *</label>
              <div className="relative">
                <input
                  id="create-admin-password"
                  name="new-password"
                  autoComplete="new-password"
                  type={showCreateAdminPass ? 'text' : 'password'}
                  required
                  value={createAdminPass}
                  onChange={e => setCreateAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowCreateAdminPass(!showCreateAdminPass)}
                  className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  title={showCreateAdminPass ? 'Hide password' : 'View password'}
                >
                  {showCreateAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-gradient font-medium text-sm text-white shadow-md hover:opacity-95 transition-all mt-3 cursor-pointer"
            >
              {loading ? 'Creating Family Portal...' : 'Create Family & Get Unique Code'}
            </button>
          </form>
        )}


      </div>
    </div>
  );
};
