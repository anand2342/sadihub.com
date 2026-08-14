import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/dashboard/Header';
import { Sidebar } from './components/dashboard/Sidebar';
import { HomeOverview } from './components/dashboard/HomeOverview';
import { CoupleDetails } from './components/dashboard/CoupleDetails';
import { EventSchedule } from './components/dashboard/EventSchedule';
import { FamilyMembers } from './components/dashboard/FamilyMembers';
import { Gallery } from './components/dashboard/Gallery';
import { WishesWall } from './components/dashboard/WishesWall';
import { VideoGallery } from './components/dashboard/VideoGallery';
import { DigitalInvitation } from './components/dashboard/DigitalInvitation';
import { MapLocation } from './components/dashboard/MapLocation';
import { ProfileSettings } from './components/dashboard/ProfileSettings';
import { FamilyAdminPanel } from './components/admin/FamilyAdminPanel';
import { SuperAdminPortal } from './components/admin/SuperAdminPortal';
import { LandingHero } from './components/landing/LandingHero';
import { FeatureGrid } from './components/landing/FeatureGrid';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { BootstrapSuperAdmin } from './components/auth/BootstrapSuperAdmin';
import { ToastContainer } from './components/common/Toast';
import { isSupabaseConfigured } from './lib/supabase';
import { getStore, saveStore } from './lib/dataStore';
import { dbGetWedding, dbUpsertWedding, dbGetEvents, dbInsertEvent, dbDeleteEvent, dbGetFamilyProfiles, dbUpdateMemberStatus, dbDeleteProfile, dbGetPhotos, dbUploadPhotoFile, dbCountUserPhotos, dbToggleLike, dbAddComment, dbDeletePhoto, dbGetWishes, dbInsertWish, dbDeleteWish, dbGetVideos, dbDeleteVideo, } from './lib/supabaseApi';
const MainAppContent = () => {
    const { session, loading } = useAuth();
    // Navigation
    const [activeTab, setActiveTab] = useState('home');
    const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
    // Modal states
    const [showAuthModal, setShowAuthModal] = useState(true);
    const [authInitialTab, setAuthInitialTab] = useState('signin');
    const [showBootstrap, setShowBootstrap] = useState(false);
    // Toast
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message }]);
    };
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    const currentFamilyId = session?.current_family?.id;
    const currentFamilyIdResolved = currentFamilyId || 'family-kapoor';
    const userId = session?.user_id || 'user-anon';
    // ── Supabase data state ──────────────────────────────────────
    const [wedding, setWedding] = useState(undefined);
    const [events, setEvents] = useState([]);
    const [members, setMembers] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [wishes, setWishes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    // ── LocalStorage data state (offline/demo mode) ────────────
    const [storeState, setStoreState] = useState(getStore());
    const refreshLocalData = useCallback(() => setStoreState(getStore()), []);
    // ── Fetch all family data from Supabase ─────────────────────
    const fetchSupabaseData = useCallback(async () => {
        if (!currentFamilyId)
            return;
        setDataLoading(true);
        try {
            const [w, ev, mem, ph, wi, vid] = await Promise.all([
                dbGetWedding(currentFamilyId),
                dbGetEvents(currentFamilyId),
                dbGetFamilyProfiles(currentFamilyId),
                dbGetPhotos(currentFamilyId, userId),
                dbGetWishes(currentFamilyId),
                dbGetVideos(currentFamilyId),
            ]);
            if (w)
                setWedding(w);
            setEvents(ev);
            setMembers(mem);
            setPhotos(ph);
            setWishes(wi);
            setVideos(vid);
        }
        catch (err) {
            console.error('Error fetching data:', err);
        }
        finally {
            setDataLoading(false);
        }
    }, [currentFamilyId, userId]);
    useEffect(() => {
        if (isSupabaseConfigured && session) {
            fetchSupabaseData();
        }
        else {
            refreshLocalData();
        }
    }, [currentFamilyId, session?.user_id]);
    // Reset navigation tab to 'home' whenever user session changes (login/switch member)
    useEffect(() => {
        setActiveTab('home');
    }, [session?.user_id]);
    // ── Derived data for LocalStorage mode ─────────────────────
    const localWedding = storeState.weddings.find(w => w.family_id === currentFamilyIdResolved);
    const localEvents = storeState.events.filter(e => e.family_id === currentFamilyIdResolved);
    const localMembers = storeState.profiles.filter(p => p.family_id === currentFamilyIdResolved);
    const localPhotos = storeState.photos.filter(p => p.family_id === currentFamilyIdResolved);
    const localWishes = storeState.wishes.filter(w => w.family_id === currentFamilyIdResolved);
    const localVideos = storeState.videos.filter(v => v.family_id === currentFamilyIdResolved);
    // Final resolved data
    const resolvedWedding = isSupabaseConfigured ? wedding : localWedding;
    const resolvedEvents = isSupabaseConfigured ? events : localEvents;
    const resolvedMembers = isSupabaseConfigured ? members : localMembers;
    const resolvedPhotos = isSupabaseConfigured ? photos : localPhotos;
    const resolvedWishes = isSupabaseConfigured ? wishes : localWishes;
    const resolvedVideos = isSupabaseConfigured ? videos : localVideos;
    if (loading || (isSupabaseConfigured && dataLoading && !resolvedWedding && session)) {
        return (<div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-primary)] border-t-transparent animate-spin mx-auto"/>
          <p className="font-serif font-bold text-lg">Loading Family Wedding Portal...</p>
        </div>
      </div>);
    }
    // ═══════════════════════════════════════════════════════════
    // DATA HANDLERS — Supabase mode
    // ═══════════════════════════════════════════════════════════
    const handleUpdateWedding = async (updated) => {
        if (isSupabaseConfigured && currentFamilyId) {
            await dbUpsertWedding({ family_id: currentFamilyId, ...updated });
            const fresh = await dbGetWedding(currentFamilyId);
            if (fresh)
                setWedding(fresh);
            return;
        }
        // LocalStorage fallback
        const store = getStore();
        const idx = store.weddings.findIndex(w => w.family_id === currentFamilyIdResolved);
        if (idx >= 0) {
            store.weddings[idx] = { ...store.weddings[idx], ...updated };
        }
        else {
            store.weddings.push({
                id: `wedding-${Date.now()}`, family_id: currentFamilyIdResolved,
                groom_name: updated.groom_name || 'Groom', bride_name: updated.bride_name || 'Bride',
                wedding_date: updated.wedding_date || new Date().toISOString(),
                venue_name: updated.venue_name || '', venue_address: updated.venue_address || '',
                created_at: new Date().toISOString(), ...updated
            });
        }
        saveStore(store);
        refreshLocalData();
    };
    const handleAddEvent = async (eventData) => {
        if (isSupabaseConfigured) {
            const newEvt = await dbInsertEvent(eventData);
            setEvents(prev => [...prev, newEvt]);
            return;
        }
        const store = getStore();
        store.events.push({ id: `evt-${Date.now()}`, created_at: new Date().toISOString(), ...eventData });
        saveStore(store);
        refreshLocalData();
    };
    const handleDeleteEvent = async (eventId) => {
        if (isSupabaseConfigured) {
            await dbDeleteEvent(eventId);
            setEvents(prev => prev.filter(e => e.id !== eventId));
            return;
        }
        const store = getStore();
        store.events = store.events.filter(e => e.id !== eventId);
        saveStore(store);
        refreshLocalData();
    };
    const handleApproveMember = async (profileId) => {
        if (isSupabaseConfigured) {
            await dbUpdateMemberStatus(profileId, 'approved');
            setMembers(prev => prev.map(m => m.id === profileId ? { ...m, status: 'approved' } : m));
            return;
        }
        const store = getStore();
        const idx = store.profiles.findIndex(p => p.id === profileId);
        if (idx >= 0) {
            store.profiles[idx].status = 'approved';
            saveStore(store);
            refreshLocalData();
        }
    };
    const handleRejectMember = async (profileId) => {
        if (isSupabaseConfigured) {
            await dbDeleteProfile(profileId);
            setMembers(prev => prev.filter(m => m.id !== profileId));
            return;
        }
        const store = getStore();
        store.profiles = store.profiles.filter(p => p.id !== profileId);
        store.userRoles = store.userRoles.filter(r => r.user_id !== profileId);
        saveStore(store);
        refreshLocalData();
    };
    // ── PHOTO HANDLERS ───────────────────────────────────────────
    // Supabase mode: receives actual File objects
    const handleBatchUploadFiles = async (items) => {
        if (!items.length)
            return { uploaded: 0, skipped: 0 };
        const familyId = currentFamilyId;
        const userName = session?.profile?.full_name || 'Family Member';
        const MAX_PHOTOS = 10;
        const existingCount = await dbCountUserPhotos(familyId, userId);
        const availableSlots = Math.max(0, MAX_PHOTOS - existingCount);
        const toUpload = items.slice(0, availableSlots);
        const skipped = items.length - toUpload.length;
        let uploaded = 0;
        const newPhotos = [];
        for (const item of toUpload) {
            try {
                const photo = await dbUploadPhotoFile(familyId, userId, item.file, item.caption, userName);
                newPhotos.push(photo);
                uploaded++;
            }
            catch (err) {
                console.error('Photo upload error:', err);
            }
        }
        if (newPhotos.length > 0) {
            setPhotos(prev => [...newPhotos, ...prev]);
        }
        return { uploaded, skipped };
    };
    // LocalStorage mode: receives {url, caption} (old batch approach)
    const handleBatchUploadPhotos = (items) => {
        if (!items || items.length === 0)
            return { uploaded: 0, skipped: 0 };
        const store = getStore();
        let existingCount = store.photos.filter(p => p.family_id === currentFamilyIdResolved && p.user_id === userId).length;
        const MAX_PHOTOS = 10;
        let uploaded = 0, skipped = 0;
        items.forEach((item, i) => {
            if (existingCount >= MAX_PHOTOS) {
                skipped++;
                return;
            }
            store.photos.unshift({
                id: `photo-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
                family_id: currentFamilyIdResolved,
                user_id: userId,
                photo_url: item.url,
                caption: item.caption,
                created_at: new Date(Date.now() + i).toISOString(),
                likes_count: 0,
                user_has_liked: false,
                user_full_name: session?.profile?.full_name || 'Family Member',
                comments: []
            });
            existingCount++;
            uploaded++;
        });
        if (uploaded > 0) {
            saveStore(store);
            refreshLocalData();
        }
        return { uploaded, skipped };
    };
    const handleToggleLike = async (photoId) => {
        if (isSupabaseConfigured) {
            const newCount = await dbToggleLike(photoId, userId);
            setPhotos(prev => prev.map(p => p.id === photoId
                ? { ...p, likes_count: newCount, user_has_liked: !p.user_has_liked }
                : p));
            return;
        }
        const store = getStore();
        const idx = store.photos.findIndex(p => p.id === photoId);
        if (idx >= 0) {
            const p = store.photos[idx];
            if (p.user_has_liked) {
                p.user_has_liked = false;
                p.likes_count = Math.max(0, (p.likes_count || 1) - 1);
            }
            else {
                p.user_has_liked = true;
                p.likes_count = (p.likes_count || 0) + 1;
            }
            saveStore(store);
            refreshLocalData();
        }
    };
    const handleAddComment = async (photoId, comment) => {
        if (isSupabaseConfigured) {
            const newComment = await dbAddComment(photoId, userId, comment, session?.profile?.full_name || 'Member');
            setPhotos(prev => prev.map(p => p.id === photoId
                ? { ...p, comments: [...(p.comments || []), newComment] }
                : p));
            return;
        }
        const store = getStore();
        const idx = store.photos.findIndex(p => p.id === photoId);
        if (idx >= 0) {
            if (!store.photos[idx].comments)
                store.photos[idx].comments = [];
            store.photos[idx].comments.push({
                id: `c-${Date.now()}`, photo_id: photoId, user_id: userId,
                comment, created_at: new Date().toISOString(), user_name: session?.profile?.full_name || 'Member'
            });
            saveStore(store);
            refreshLocalData();
        }
    };
    const handleDeletePhoto = async (photoId) => {
        if (isSupabaseConfigured) {
            const photo = photos.find(p => p.id === photoId);
            await dbDeletePhoto(photoId, photo?.storage_path);
            setPhotos(prev => prev.filter(p => p.id !== photoId));
            return;
        }
        const store = getStore();
        store.photos = store.photos.filter(p => p.id !== photoId);
        saveStore(store);
        refreshLocalData();
    };
    const handleAddWish = async (wishData) => {
        if (isSupabaseConfigured && currentFamilyId) {
            const wish = await dbInsertWish({
                family_id: currentFamilyId, user_id: userId,
                sender_name: wishData.sender_name, relation: wishData.relation,
                message: wishData.message, is_approved: true
            });
            setWishes(prev => [wish, ...prev]);
            return;
        }
        const store = getStore();
        const newWish = {
            id: `wish-${Date.now()}`, family_id: currentFamilyIdResolved,
            user_id: userId, sender_name: wishData.sender_name,
            relation: wishData.relation, message: wishData.message,
            is_approved: true, created_at: new Date().toISOString()
        };
        store.wishes.unshift(newWish);
        saveStore(store);
        refreshLocalData();
    };
    const handleDeleteWish = async (wishId) => {
        if (isSupabaseConfigured) {
            await dbDeleteWish(wishId);
            setWishes(prev => prev.filter(w => w.id !== wishId));
            return;
        }
        const store = getStore();
        store.wishes = store.wishes.filter(w => w.id !== wishId);
        saveStore(store);
        refreshLocalData();
    };
    const handleDeleteVideo = async (videoId) => {
        if (isSupabaseConfigured) {
            await dbDeleteVideo(videoId);
            setVideos(prev => prev.filter(v => v.id !== videoId));
            return;
        }
        const store = getStore();
        store.videos = store.videos.filter(v => v.id !== videoId);
        saveStore(store);
        refreshLocalData();
    };
    const handleOpenAuthTab = (tab) => {
        setAuthInitialTab(tab);
        setShowAuthModal(true);
    };
    // ═══════════════════════════════════════════════════════════
    // ROUTES
    // ═══════════════════════════════════════════════════════════
    // ROUTE 1: Bootstrap super admin
    if (showBootstrap) {
        return (<div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
        <BootstrapSuperAdmin onBack={() => setShowBootstrap(false)} onToast={addToast}/>
        <ToastContainer toasts={toasts} onClose={removeToast}/>
      </div>);
    }
    // ROUTE 2: Unauthenticated
    if (!session) {
        return (<div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors flex flex-col justify-between">
        <Header onOpenMobileMenu={() => handleOpenAuthTab('signin')} onOpenAuth={() => handleOpenAuthTab('signin')}/>
        <main>
          <LandingHero onOpenAuth={handleOpenAuthTab} onOpenBootstrap={() => setShowBootstrap(true)}/>
          <FeatureGrid />
        </main>
        <footer className="py-8 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)] font-serif print:hidden">
          <p>© {new Date().getFullYear()} Family Wedding Portal. Crafted with love & elegance.</p>
        </footer>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authInitialTab} onToast={addToast}/>
        <ToastContainer toasts={toasts} onClose={removeToast}/>
      </div>);
    }
    // ROUTE 3: Pending approval
    if (session.profile && session.profile.status === 'pending') {
        return (<div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
        <ProfileSetupModal onToast={addToast}/>
        <ToastContainer toasts={toasts} onClose={removeToast}/>
      </div>);
    }
    // ROUTE 4: Full dashboard
    return (<div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors flex flex-col">
      <Header wedding={resolvedWedding} onOpenMobileMenu={() => setIsOpenMobileSidebar(prev => !prev)} onOpenAuth={() => handleOpenAuthTab('signin')}/>
      <div className="flex-1 flex w-full px-2 sm:px-4 lg:px-6 2xl:px-8">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpenMobile={isOpenMobileSidebar} onCloseMobile={() => setIsOpenMobileSidebar(false)}/>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'home' && <HomeOverview wedding={resolvedWedding} events={resolvedEvents} onNavigate={setActiveTab}/>}
          {activeTab === 'couple' && <CoupleDetails wedding={resolvedWedding}/>}
          {activeTab === 'events' && <EventSchedule events={resolvedEvents}/>}
          {activeTab === 'members' && (<FamilyMembers members={resolvedMembers} onApproveMember={handleApproveMember} onRejectMember={handleRejectMember}/>)}
          {activeTab === 'gallery' && (<Gallery photos={resolvedPhotos} onBatchUploadPhotos={handleBatchUploadPhotos} onBatchUploadFiles={isSupabaseConfigured ? handleBatchUploadFiles : undefined} onToggleLike={handleToggleLike} onAddComment={handleAddComment} onDeletePhoto={handleDeletePhoto} onToast={addToast}/>)}
          {activeTab === 'wishes' && (<WishesWall wishes={resolvedWishes} onAddWish={handleAddWish} onDeleteWish={handleDeleteWish} onToast={addToast}/>)}
          {activeTab === 'videos' && (<VideoGallery videos={resolvedVideos} onDeleteVideo={handleDeleteVideo} onToast={addToast}/>)}
          {activeTab === 'invitation' && <DigitalInvitation wedding={resolvedWedding} events={resolvedEvents} onToast={addToast}/>}
          {activeTab === 'location' && <MapLocation wedding={resolvedWedding}/>}
          {activeTab === 'profile' && <ProfileSettings onToast={addToast} onNavigate={setActiveTab}/>}
          {activeTab === 'family-admin' && (<FamilyAdminPanel wedding={resolvedWedding} members={resolvedMembers} events={resolvedEvents} wishes={resolvedWishes} photos={resolvedPhotos} onUpdateWedding={handleUpdateWedding} onAddEvent={handleAddEvent} onDeleteEvent={handleDeleteEvent} onApproveMember={handleApproveMember} onRejectMember={handleRejectMember} onDeleteWish={handleDeleteWish} onDeletePhoto={handleDeletePhoto} onToast={addToast} onNavigate={setActiveTab}/>)}
          {activeTab === 'super-admin' && <SuperAdminPortal onToast={addToast}/>}
        </main>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast}/>
    </div>);
};
function App() {
    return (<ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>);
}
export default App;
