const LOCAL_STORAGE_KEY = 'family_wedding_portal_store_v1';
// Initial Sample Data (Luxury Kapoor & Sharma Families)
const INITIAL_STORE = {
    authUsers: [
        { id: 'user-super-admin', email: 'admin@weddingportal.com', passwordHash: 'admin123' },
        { id: 'user-kapoor-admin', email: 'rahul.kapoor@family.portal', passwordHash: 'kapoor123' },
        { id: 'user-kapoor-sister', email: 'priya.kapoor@gmail.com', passwordHash: 'priya123' },
        { id: 'user-kapoor-uncle', email: 'vikram.kapoor@gmail.com', passwordHash: 'vikram123' },
        { id: 'user-sharma-admin', email: 'amit.sharma@family.portal', passwordHash: 'sharma123' },
    ],
    families: [
        {
            id: 'family-kapoor',
            name: 'Kapoor Family',
            slug: 'kapoor-family',
            family_code: 'KAP-8492',
            created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
        {
            id: 'family-sharma',
            name: 'Sharma Family',
            slug: 'sharma-family',
            family_code: 'SHA-3105',
            created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        }
    ],
    profiles: [
        {
            id: 'user-super-admin',
            family_id: 'family-kapoor',
            full_name: 'Super Administrator',
            mobile_number: '+91 98765 00000',
            relation: 'Other',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            status: 'approved',
            created_at: new Date().toISOString(),
            email: 'admin@weddingportal.com'
        },
        {
            id: 'user-kapoor-admin',
            family_id: 'family-kapoor',
            full_name: 'Rahul Kapoor (Groom)',
            mobile_number: '+91 98765 43210',
            relation: 'Brother',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            status: 'approved',
            created_at: new Date().toISOString(),
            email: 'rahul.kapoor@family.portal'
        },
        {
            id: 'user-kapoor-sister',
            family_id: 'family-kapoor',
            full_name: 'Priya Kapoor',
            mobile_number: '+91 98123 45678',
            relation: 'Sister',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            status: 'approved',
            created_at: new Date().toISOString(),
            email: 'priya.kapoor@gmail.com'
        },
        {
            id: 'user-kapoor-uncle',
            family_id: 'family-kapoor',
            full_name: 'Vikram Kapoor',
            mobile_number: '+91 98222 33344',
            relation: 'Uncle',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            status: 'approved', // Auto-approved!
            created_at: new Date().toISOString(),
            email: 'vikram.kapoor@gmail.com'
        },
        {
            id: 'user-sharma-admin',
            family_id: 'family-sharma',
            full_name: 'Amit Sharma',
            mobile_number: '+91 99999 88888',
            relation: 'Brother',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            status: 'approved',
            created_at: new Date().toISOString(),
            email: 'amit.sharma@family.portal'
        }
    ],
    userRoles: [
        { id: 'r1', user_id: 'user-super-admin', family_id: null, role: 'super_admin', created_at: new Date().toISOString() },
        { id: 'r2', user_id: 'user-kapoor-admin', family_id: 'family-kapoor', role: 'family_admin', created_at: new Date().toISOString() },
        { id: 'r3', user_id: 'user-kapoor-sister', family_id: 'family-kapoor', role: 'family_member', created_at: new Date().toISOString() },
        { id: 'r4', user_id: 'user-kapoor-uncle', family_id: 'family-kapoor', role: 'family_member', created_at: new Date().toISOString() },
        { id: 'r5', user_id: 'user-sharma-admin', family_id: 'family-sharma', role: 'family_admin', created_at: new Date().toISOString() }
    ],
    weddings: [
        {
            id: 'wedding-kapoor',
            family_id: 'family-kapoor',
            // GROOM FIRST ORDERING ALWAYS
            groom_name: 'Rahul Kapoor',
            groom_father: 'Shri Rajeev Kapoor',
            groom_mother: 'Smt. Sunita Kapoor',
            groom_bio: 'A passionate architect with a heart full of love for family, travel, and grand celebrations.',
            groom_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
            bride_name: 'Ananya Verma',
            bride_father: 'Shri Mahendra Verma',
            bride_mother: 'Smt. Rekha Verma',
            bride_bio: 'A classical dancer and creative designer who lights up every room with her radiant smile.',
            bride_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            wedding_date: new Date(Date.now() + 45 * 86400000).toISOString(), // 45 days from today
            venue_name: 'The Royal Palace & Convention Resort',
            venue_address: 'Grand Trunk Road, Sector 62, Gurgaon, Delhi NCR',
            google_maps_link: 'https://maps.google.com/?q=The+Royal+Palace+Gurgaon',
            love_story: 'Rahul & Ananya first met during a college festival in Delhi 6 years ago. What started as a casual conversation over masala chai turned into late-night phone calls, spontaneous road trips, and a bond blessed by both families. Today, we celebrate their lifelong togetherness!',
            cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
            created_at: new Date().toISOString()
        },
        {
            id: 'wedding-sharma',
            family_id: 'family-sharma',
            groom_name: 'Aarav Sharma',
            groom_father: 'Shri Rakesh Sharma',
            groom_mother: 'Smt. Anita Sharma',
            groom_bio: 'Software engineer and enthusiast for heritage Indian music.',
            groom_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
            bride_name: 'Diya Patel',
            bride_father: 'Shri Suresh Patel',
            bride_mother: 'Smt. Geeta Patel',
            bride_bio: 'Pediatrician and avid lover of poetry.',
            bride_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            wedding_date: new Date(Date.now() + 60 * 86400000).toISOString(),
            venue_name: 'Udaipur Lake Palace Grounds',
            venue_address: 'Pichola, Udaipur, Rajasthan',
            google_maps_link: 'https://maps.google.com/?q=Udaipur+Lake+Palace',
            love_story: 'Two souls brought together by childhood family friendships in Jaipur.',
            cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
            created_at: new Date().toISOString()
        }
    ],
    events: [
        {
            id: 'evt-1',
            family_id: 'family-kapoor',
            event_type: 'other',
            custom_type: 'Tilak & Sagan',
            title: 'Auspicious Tilak Ceremony',
            description: 'Traditional welcoming ceremony of the Groom by the Bride’s family with gifts and blessings.',
            event_date: new Date(Date.now() + 43 * 86400000).toISOString().split('T')[0],
            start_time: '11:00 AM',
            end_time: '02:00 PM',
            venue_name: 'Kapoor Heritage Villa Hall',
            venue_address: 'Civil Lines, Delhi',
            google_maps_link: 'https://maps.google.com',
            created_at: new Date().toISOString()
        },
        {
            id: 'evt-2',
            family_id: 'family-kapoor',
            event_type: 'haldi',
            title: 'Rang De Haldi',
            description: 'Yellow hues, joyful laughter, and auspicious turmeric pastes for Groom & Bride.',
            event_date: new Date(Date.now() + 44 * 86400000).toISOString().split('T')[0],
            start_time: '10:00 AM',
            end_time: '01:00 PM',
            venue_name: 'Poolside Gardens, The Royal Palace',
            venue_address: 'Sector 62, Gurgaon',
            google_maps_link: 'https://maps.google.com',
            created_at: new Date().toISOString()
        },
        {
            id: 'evt-3',
            family_id: 'family-kapoor',
            event_type: 'mehendi',
            title: 'Intricate Mehendi & Beats',
            description: 'Intricate henna designs, dholak beats, traditional folk songs, and high tea.',
            event_date: new Date(Date.now() + 44 * 86400000).toISOString().split('T')[0],
            start_time: '04:00 PM',
            end_time: '08:00 PM',
            venue_name: 'Courtyard Lawn',
            venue_address: 'The Royal Palace, Gurgaon',
            google_maps_link: 'https://maps.google.com',
            created_at: new Date().toISOString()
        },
        {
            id: 'evt-4',
            family_id: 'family-kapoor',
            event_type: 'sangeet',
            title: 'Grand Sangeet Night',
            description: 'Family dance performances, DJ night, and celebratory dinner.',
            event_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
            start_time: '07:00 PM',
            end_time: '11:59 PM',
            venue_name: 'Crystal Ballroom',
            venue_address: 'The Royal Palace, Gurgaon',
            google_maps_link: 'https://maps.google.com',
            created_at: new Date().toISOString()
        },
        {
            id: 'evt-5',
            family_id: 'family-kapoor',
            event_type: 'wedding',
            title: 'The Sacred Pheras & Wedding',
            description: 'Royal Baraat arrival followed by Jaimala and Vedic Pheras under the floral Mandap.',
            event_date: new Date(Date.now() + 46 * 86400000).toISOString().split('T')[0],
            start_time: '07:30 PM',
            end_time: '01:00 AM',
            venue_name: 'Royal Mandap Pavilion',
            venue_address: 'The Royal Palace, Gurgaon',
            google_maps_link: 'https://maps.google.com',
            created_at: new Date().toISOString()
        },
        {
            id: 'evt-6',
            family_id: 'family-kapoor',
            event_type: 'reception',
            title: 'Grand Reception Dinner',
            description: 'Evening gala to celebrate the newlyweds with family and friends.',
            event_date: new Date(Date.now() + 47 * 86400000).toISOString().split('T')[0],
            start_time: '08:00 PM',
            end_time: '11:30 PM',
            venue_name: 'Imperial Gardens',
            venue_address: 'The Royal Palace, Gurgaon',
            google_maps_link: 'https://maps.google.com',
            created_at: new Date().toISOString()
        }
    ],
    photos: [
        {
            id: 'photo-1',
            family_id: 'family-kapoor',
            user_id: 'user-kapoor-admin',
            photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
            caption: 'Pre-wedding photoshoot at Neemrana Fort Palace! 👑',
            created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
            likes_count: 12,
            user_has_liked: true,
            user_full_name: 'Rahul Kapoor (Groom)',
            comments: [
                { id: 'c1', photo_id: 'photo-1', user_id: 'user-kapoor-sister', comment: 'You two look absolutely stunning together! ❤️', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), user_name: 'Priya Kapoor' }
            ]
        },
        {
            id: 'photo-2',
            family_id: 'family-kapoor',
            user_id: 'user-kapoor-sister',
            photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
            caption: 'Testing floral arrangements for the Sangeet stage! 🌸',
            created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
            likes_count: 8,
            user_has_liked: false,
            user_full_name: 'Priya Kapoor',
            comments: []
        },
        {
            id: 'photo-3',
            family_id: 'family-kapoor',
            user_id: 'user-kapoor-admin',
            photo_url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=80',
            caption: 'Selecting traditional sherwanis with Dad! 🎩',
            created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
            likes_count: 15,
            user_has_liked: true,
            user_full_name: 'Rahul Kapoor (Groom)',
            comments: []
        }
    ],
    wishes: [
        {
            id: 'wish-1',
            family_id: 'family-kapoor',
            user_id: 'user-kapoor-sister',
            sender_name: 'Priya Kapoor',
            relation: 'Sister',
            message: 'Dearest Rahul Bhaiya and Ananya Bhabhi! May your marriage be filled with endless laughter, boundless adventures, and deep love. So excited for the wedding celebrations! 🎉✨',
            is_approved: true,
            created_at: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
            id: 'wish-2',
            family_id: 'family-kapoor',
            user_id: 'user-kapoor-uncle',
            sender_name: 'Vikram Kapoor',
            relation: 'Uncle',
            message: 'Warmest blessings to the lovely couple from all of us in Mumbai. Looking forward to dancing at the Sangeet night! 🕺💃',
            is_approved: true,
            created_at: new Date(Date.now() - 1 * 86400000).toISOString()
        }
    ],
    videos: [
        {
            id: 'vid-1',
            family_id: 'family-kapoor',
            title: 'Rahul & Ananya - Pre-Wedding Teaser | Royal Rajasthan',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample video embed
            category: 'Pre-Wedding',
            thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            created_at: new Date().toISOString()
        }
    ],
    currentUserId: 'user-kapoor-admin'
};
export function getStore() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STORE));
            return INITIAL_STORE;
        }
        return JSON.parse(raw);
    }
    catch (e) {
        console.error('Error loading store from localStorage:', e);
        return INITIAL_STORE;
    }
}
export function saveStore(store) {
    const attemptSave = (data) => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            return true;
        }
        catch {
            return false;
        }
    };
    // First attempt — save everything
    if (attemptSave(store))
        return;
    console.warn('LocalStorage quota exceeded — stripping old photos to make room...');
    // Strip photos progressively (base64 photos are very large)
    const photoCopy = [...(store.photos || [])];
    for (let keep = Math.floor(photoCopy.length / 2); keep >= 0; keep--) {
        const stripped = { ...store, photos: photoCopy.slice(0, keep) };
        if (attemptSave(stripped)) {
            console.warn(`Saved with ${keep} photos (removed ${photoCopy.length - keep} to free space).`);
            return;
        }
    }
    // Last resort — save with NO photos at all
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...store, photos: [] }));
        console.warn('Saved with photos cleared. Please use Supabase for photo storage.');
    }
    catch (e) {
        console.error('Critical: Cannot save to localStorage even without photos.', e);
    }
}
export function resetStoreToDefault() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STORE));
    return INITIAL_STORE;
}
