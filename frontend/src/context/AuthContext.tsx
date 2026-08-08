/**
 * AuthContext.tsx
 * 
 * Dual-mode authentication:
 *   - When VITE_SUPABASE_URL is configured → Supabase Auth + PostgreSQL
 *   - When not configured → LocalStorage (demo/offline mode)
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Family, Profile, UserSession } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { slugify, generateUniqueFamilyCode } from '../lib/utils';

// LocalStorage fallback imports
import { getStore, saveStore } from '../lib/dataStore';
import {
  dbGetProfile, dbGetFamilyById, dbGetUserRoles, dbUpsertProfile,
  dbInsertRole, dbCreateFamily, dbGetFamilyByCode, dbGetFamilyBySlugOrName,
  dbUpdateProfile, dbCheckSuperAdminExists,
} from '../lib/supabaseApi';

interface AuthContextType {
  session: UserSession | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithFamily: (familyName: string, familyPass?: string) => Promise<{ success: boolean; message?: string }>;
  joinFamily: (params: {
    familyName: string;
    familyPass?: string;
    fullName: string;
    email: string;
    password: string;
    relation: any;
    mobileNumber?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  createFamily: (params: {
    familyName: string;
    familyPass?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }) => Promise<{ success: boolean; message?: string }>;
  claimSuperAdmin: () => Promise<{ success: boolean; message?: string }>;
  checkSuperAdminExists: () => Promise<boolean> | boolean;
  switchFamily: (familyId: string) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ══════════════════════════════════════════════════════════════
// SUPABASE AUTH IMPLEMENTATION
// ══════════════════════════════════════════════════════════════

const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const buildSession = async (userId: string, email: string): Promise<UserSession | null> => {
    try {
      const [profile, roles] = await Promise.all([
        dbGetProfile(userId),
        dbGetUserRoles(userId),
      ]);
      if (!profile) return null;
      const family = profile.family_id ? await dbGetFamilyById(profile.family_id) : undefined;
      return {
        user_id: userId,
        email,
        profile,
        roles: roles.map(r => r.role),
        current_family: family || undefined,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (s?.user) {
        const sess = await buildSession(s.user.id, s.user.email || '');
        setSession(sess);
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (s?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        const sess = await buildSession(s.user.id, s.user.email || '');
        setSession(sess);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: pass });
    setLoading(false);
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const loginWithFamily = async (_familyCodeOrName: string) => {
    // With real auth, we need email+password. This feature just helps find the family.
    return { success: false, message: 'Please sign in with your email and password.' };
  };

  const joinFamily = async (params: {
    familyName: string; familyPass?: string; fullName: string;
    email: string; password: string; relation: any; mobileNumber?: string;
  }) => {
    setLoading(true);
    try {
      // Step 1: Find family by unique code or name
      const cleanInput = params.familyName.trim();
      let family = await dbGetFamilyByCode(cleanInput);
      if (!family) family = await dbGetFamilyBySlugOrName(cleanInput);
      if (!family) {
        setLoading(false);
        return { success: false, message: `Family matching code or name "${params.familyName}" not found.` };
      }

      // Step 2: Sign up with Supabase Auth (email confirmation disabled in project settings)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: params.fullName }
        }
      });

      if (signUpError) {
        setLoading(false);
        return { success: false, message: signUpError.message };
      }

      if (!authData.user) {
        setLoading(false);
        return { success: false, message: 'Sign up failed. Please try again.' };
      }

      const userId = authData.user.id;

      // Step 3: Create profile in DB
      await dbUpsertProfile({
        id: userId,
        family_id: family.id,
        full_name: params.fullName.trim(),
        mobile_number: params.mobileNumber,
        relation: params.relation,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.fullName)}`,
        status: 'pending', // Pending until Family Admin approves
        email: params.email.trim().toLowerCase(),
      });

      // Step 4: Assign role
      await dbInsertRole({
        user_id: userId,
        family_id: family.id,
        role: 'family_member',
      });

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, message: err.message || 'Failed to join family.' };
    }
  };

  const createFamily = async (params: {
    familyName: string; familyPass?: string;
    adminName: string; adminEmail: string; adminPassword: string;
  }) => {
    setLoading(true);
    try {
      const slug = slugify(params.familyName);

      // Check if family already exists
      const existing = await dbGetFamilyBySlugOrName(params.familyName);
      if (existing) {
        setLoading(false);
        return { success: false, message: `Family "${params.familyName}" already exists! Please choose another name or Join.` };
      }

      // Sign up admin with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: params.adminEmail.trim().toLowerCase(),
        password: params.adminPassword,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: params.adminName }
        }
      });

      if (signUpError) {
        setLoading(false);
        return { success: false, message: signUpError.message };
      }

      if (!authData.user) {
        setLoading(false);
        return { success: false, message: 'Account creation failed. Please try again.' };
      }

      const userId = authData.user.id;

      // Generate unique family code
      const uniqueCode = params.familyPass?.trim()
        ? params.familyPass.trim().toUpperCase()
        : generateUniqueFamilyCode(params.familyName);

      // Create family in DB
      const family = await dbCreateFamily({
        name: params.familyName.trim(),
        slug,
        family_code: uniqueCode,
      });

      // Create admin profile
      await dbUpsertProfile({
        id: userId,
        family_id: family.id,
        full_name: params.adminName.trim(),
        relation: 'Other',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.adminName)}`,
        status: 'approved',
        email: params.adminEmail.trim().toLowerCase(),
      });

      // Assign family_admin role
      await dbInsertRole({ user_id: userId, family_id: family.id, role: 'family_admin' });

      // Create default wedding record
      await supabase.from('weddings').insert({
        family_id: family.id,
        groom_name: `${params.familyName.replace(/Family/i, '').trim()} Groom`,
        bride_name: `${params.familyName.replace(/Family/i, '').trim()} Bride`,
        wedding_date: new Date(Date.now() + 30 * 86400000).toISOString(),
        venue_name: 'Grand Wedding Venue',
        venue_address: 'Main Boulevard, City',
        love_story: 'A beautiful journey of love and togetherness.',
      });

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, message: err.message || 'Failed to create family.' };
    }
  };

  const claimSuperAdmin = async () => {
    if (!session) return { success: false, message: 'You must be logged in.' };
    try {
      const hasSuper = await dbCheckSuperAdminExists();
      if (hasSuper) return { success: false, message: 'Super Admin already exists!' };
      await dbInsertRole({ user_id: session.user_id, family_id: undefined, role: 'super_admin' });
      const updated = await buildSession(session.user_id, session.email);
      setSession(updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const checkSuperAdminExists = async () => {
    return dbCheckSuperAdminExists();
  };

  const switchFamily = (familyId: string) => {
    // Super admin switches view — just update local session state
    dbGetFamilyById(familyId).then(family => {
      if (family && session) {
        setSession({ ...session, current_family: family });
      }
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!session?.user_id) return;
    // Prevent non-admin users from self-approving
    const safeUpdates = { ...updates };
    if (!session.roles.includes('family_admin') && !session.roles.includes('super_admin')) {
      delete safeUpdates.status;
    }
    await dbUpdateProfile(session.user_id, safeUpdates);
    const updated = await buildSession(session.user_id, session.email);
    setSession(updated);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const refreshSession = () => {
    if (session) buildSession(session.user_id, session.email).then(setSession);
  };

  return (
    <AuthContext.Provider value={{
      session, loading, loginWithEmail, loginWithFamily, joinFamily,
      createFamily, claimSuperAdmin, checkSuperAdminExists, switchFamily,
      updateProfile, logout, refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ══════════════════════════════════════════════════════════════
// LOCALSTORAGE AUTH IMPLEMENTATION (Offline / Demo Mode)
// ══════════════════════════════════════════════════════════════

const LocalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSessionFromStore = () => {
    const store = getStore();
    if (!store.currentUserId) { setSession(null); setLoading(false); return; }

    const authUser = store.authUsers.find(u => u.id === store.currentUserId);
    if (!authUser) { setSession(null); setLoading(false); return; }

    const profile = store.profiles.find(p => p.id === authUser.id);
    const userRolesEntries = store.userRoles.filter(r => r.user_id === authUser.id);
    const roles = userRolesEntries.map(r => r.role);
    let currentFamily: Family | undefined;
    if (profile?.family_id) {
      currentFamily = store.families.find(f => f.id === profile.family_id);
    }

    setSession({ user_id: authUser.id, email: authUser.email, profile, roles, current_family: currentFamily });
    setLoading(false);
  };

  useEffect(() => { loadSessionFromStore(); }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const store = getStore();
    const user = store.authUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === pass);
    if (!user) return { success: false, message: 'Invalid email or password' };
    store.currentUserId = user.id;
    saveStore(store);
    loadSessionFromStore();
    return { success: true };
  };

  const loginWithFamily = async (familyCodeOrName: string) => {
    const store = getStore();
    const cleanInput = familyCodeOrName.trim();
    const slug = slugify(cleanInput);
    const family = store.families.find(
      f => f.family_code.toUpperCase() === cleanInput.toUpperCase() ||
           f.slug === slug || f.name.toLowerCase() === cleanInput.toLowerCase()
    );
    if (!family) return { success: false, message: `No family found matching "${familyCodeOrName}".` };
    const familyProfile = store.profiles.find(p => p.family_id === family.id && p.status === 'approved');
    if (familyProfile) {
      store.currentUserId = familyProfile.id;
      saveStore(store);
      loadSessionFromStore();
      return { success: true };
    }
    return { success: false, message: 'No active approved users in this family yet.' };
  };

  const joinFamily = async (params: any) => {
    const store = getStore();
    const cleanInput = params.familyName.trim();
    const slug = slugify(cleanInput);
    const family = store.families.find(
      f => f.family_code.toUpperCase() === cleanInput.toUpperCase() ||
           f.slug === slug || f.name.toLowerCase() === cleanInput.toLowerCase()
    );
    if (!family) return { success: false, message: `Family matching "${params.familyName}" not found.` };
    if (store.authUsers.some(u => u.email.toLowerCase() === params.email.trim().toLowerCase())) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }
    const newUserId = `user-${Date.now()}`;
    store.authUsers.push({ id: newUserId, email: params.email.trim().toLowerCase(), passwordHash: params.password });
    store.profiles.push({
      id: newUserId, family_id: family.id, full_name: params.fullName.trim(),
      mobile_number: params.mobileNumber, relation: params.relation,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.fullName)}`,
      status: 'pending', created_at: new Date().toISOString(), email: params.email.trim().toLowerCase()
    });
    store.userRoles.push({ id: `role-${Date.now()}`, user_id: newUserId, family_id: family.id, role: 'family_member', created_at: new Date().toISOString() });
    store.currentUserId = newUserId;
    saveStore(store);
    loadSessionFromStore();
    return { success: true };
  };

  const createFamily = async (params: any) => {
    const store = getStore();
    const slug = slugify(params.familyName);
    if (store.families.some(f => f.slug === slug)) return { success: false, message: `Family "${params.familyName}" already exists!` };
    if (store.authUsers.some(u => u.email.toLowerCase() === params.adminEmail.trim().toLowerCase())) return { success: false, message: 'An account with this email already exists.' };
    const familyId = `family-${Date.now()}`;
    const userId = `user-${Date.now()}-admin`;
    const uniqueCode = params.familyPass?.trim() ? params.familyPass.trim().toUpperCase() : generateUniqueFamilyCode(params.familyName);
    store.families.push({ id: familyId, name: params.familyName.trim(), slug, family_code: uniqueCode, created_at: new Date().toISOString() });
    store.authUsers.push({ id: userId, email: params.adminEmail.trim().toLowerCase(), passwordHash: params.adminPassword });
    store.profiles.push({
      id: userId, family_id: familyId, full_name: params.adminName.trim(), relation: 'Other',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.adminName)}`,
      status: 'approved', created_at: new Date().toISOString(), email: params.adminEmail.trim().toLowerCase()
    });
    store.userRoles.push({ id: `role-${Date.now()}`, user_id: userId, family_id: familyId, role: 'family_admin', created_at: new Date().toISOString() });
    store.weddings.push({
      id: `wedding-${Date.now()}`, family_id: familyId,
      groom_name: `${params.familyName.replace(/Family/i, '').trim()} Groom`,
      bride_name: `${params.familyName.replace(/Family/i, '').trim()} Bride`,
      wedding_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      venue_name: 'Grand Wedding Venue', venue_address: 'Main Boulevard, City',
      love_story: 'A beautiful journey of love and togetherness.', created_at: new Date().toISOString()
    });
    store.currentUserId = userId;
    saveStore(store);
    loadSessionFromStore();
    return { success: true };
  };

  const claimSuperAdmin = async () => {
    const store = getStore();
    if (!session) return { success: false, message: 'You must be logged in.' };
    if (store.userRoles.some(r => r.role === 'super_admin')) return { success: false, message: 'Super Admin already exists!' };
    store.userRoles.push({ id: `role-sa-${Date.now()}`, user_id: session.user_id, family_id: null, role: 'super_admin', created_at: new Date().toISOString() });
    const pi = store.profiles.findIndex(p => p.id === session.user_id);
    if (pi >= 0) store.profiles[pi].status = 'approved';
    saveStore(store);
    loadSessionFromStore();
    return { success: true };
  };

  const checkSuperAdminExists = () => {
    const store = getStore();
    return store.userRoles.some(r => r.role === 'super_admin');
  };

  const switchFamily = (familyId: string) => {
    const store = getStore();
    if (!session?.roles.includes('super_admin')) return;
    const family = store.families.find(f => f.id === familyId);
    if (!family) return;
    if (session.profile) {
      const pi = store.profiles.findIndex(p => p.id === session.user_id);
      if (pi >= 0) store.profiles[pi].family_id = familyId;
    }
    saveStore(store);
    loadSessionFromStore();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!session?.user_id) return;
    // Prevent non-admin users from self-approving
    const safeUpdates = { ...updates };
    if (!session.roles.includes('family_admin') && !session.roles.includes('super_admin')) {
      delete safeUpdates.status;
    }
    const store = getStore();
    const pi = store.profiles.findIndex(p => p.id === session.user_id);
    if (pi >= 0) {
      store.profiles[pi] = { ...store.profiles[pi], ...safeUpdates };
      saveStore(store);
      loadSessionFromStore();
    }
  };

  const logout = () => {
    const store = getStore();
    store.currentUserId = null;
    saveStore(store);
    setSession(null);
  };

  const refreshSession = () => loadSessionFromStore();

  return (
    <AuthContext.Provider value={{
      session, loading, loginWithEmail, loginWithFamily, joinFamily,
      createFamily, claimSuperAdmin, checkSuperAdminExists, switchFamily,
      updateProfile, logout, refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ══════════════════════════════════════════════════════════════
// EXPORT: Auto-select provider based on configuration
// ══════════════════════════════════════════════════════════════

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isSupabaseConfigured) {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
  }
  return <LocalAuthProvider>{children}</LocalAuthProvider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
