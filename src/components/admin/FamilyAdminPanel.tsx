import React, { useState } from 'react';
import { 
  UserCheck, 
  Heart, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  Save, 
  Sparkles,
  UploadCloud,
  Clock
} from 'lucide-react';


import type { Wedding, EventItem, Profile, Wish, GalleryPhoto, EventType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { readFileAsDataUrl } from '../../lib/utils';
import { LuxuryCard } from '../common/LuxuryCard';
import { CalendarPicker } from '../common/CalendarPicker';

const TIME_SLOTS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
  '12:00 AM (Midnight)', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
  'Till Late Night'
];




interface FamilyAdminPanelProps {
  wedding?: Wedding;
  members: Profile[];
  events: EventItem[];
  wishes: Wish[];
  photos: GalleryPhoto[];
  onUpdateWedding: (weddingData: Partial<Wedding>) => void;
  onAddEvent: (eventData: Omit<EventItem, 'id' | 'created_at'>) => void;
  onDeleteEvent: (eventId: string) => void;
  onApproveMember: (profileId: string) => void;
  onRejectMember: (profileId: string) => void;
  onDeleteWish: (wishId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onNavigate?: (tab: any) => void;
}

export const FamilyAdminPanel: React.FC<FamilyAdminPanelProps> = ({
  wedding,
  members,
  events,
  wishes,
  photos,
  onUpdateWedding,
  onAddEvent,
  onDeleteEvent,
  onApproveMember,
  onRejectMember,
  onDeleteWish,
  onDeletePhoto,
  onToast,
  onNavigate
}) => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'wedding' | 'events' | 'moderation'>('wedding');

  // WEDDING EDITOR STATE (GROOM FIELDS FIRST)
  const [groomName, setGroomName] = useState(wedding?.groom_name || 'Groom Name');
  const [groomFather, setGroomFather] = useState(wedding?.groom_father || '');
  const [groomMother, setGroomMother] = useState(wedding?.groom_mother || '');
  const [groomBio, setGroomBio] = useState(wedding?.groom_bio || '');
  const [groomImage, setGroomImage] = useState(wedding?.groom_image || '');

  // BRIDE FIELDS SECOND
  const [brideName, setBrideName] = useState(wedding?.bride_name || 'Bride Name');
  const [brideFather, setBrideFather] = useState(wedding?.bride_father || '');
  const [brideMother, setBrideMother] = useState(wedding?.bride_mother || '');
  const [brideBio, setBrideBio] = useState(wedding?.bride_bio || '');
  const [brideImage, setBrideImage] = useState(wedding?.bride_image || '');

  // GENERAL WEDDING FIELDS
  const [weddingDate, setWeddingDate] = useState(wedding?.wedding_date ? wedding.wedding_date.split('T')[0] : '');
  const [venueName, setVenueName] = useState(wedding?.venue_name || '');
  const [venueAddress, setVenueAddress] = useState(wedding?.venue_address || '');
  const [googleMapsLink, setGoogleMapsLink] = useState(wedding?.google_maps_link || '');
  const [loveStory, setLoveStory] = useState(wedding?.love_story || '');

  const [savingWedding, setSavingWedding] = useState(false);

  // ADD EVENT STATE
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventType, setEventType] = useState<EventType>('haldi');
  const [customType, setCustomType] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventMapLink, setEventMapLink] = useState('');

  const handleSaveWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWedding(true);
    try {
      await onUpdateWedding({
        groom_name: groomName.trim(),
        groom_father: groomFather.trim(),
        groom_mother: groomMother.trim(),
        groom_bio: groomBio.trim(),
        groom_image: groomImage.trim(),
        
        bride_name: brideName.trim(),
        bride_father: brideFather.trim(),
        bride_mother: brideMother.trim(),
        bride_bio: brideBio.trim(),
        bride_image: brideImage.trim(),
        
        wedding_date: weddingDate ? new Date(weddingDate).toISOString() : new Date().toISOString(),
        venue_name: venueName.trim(),
        venue_address: venueAddress.trim(),
        google_maps_link: googleMapsLink.trim(),
        love_story: loveStory.trim()
      });

      onToast('Wedding details saved! Refreshing updated couple page...', 'success');
      
      // Auto close/redirect to updated couple page after 500ms
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('couple');
        }
      }, 500);
    } catch (err: any) {
      onToast('Failed to save wedding details.', 'error');
    } finally {
      setSavingWedding(false);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;

    if (eventType === 'other' && !customType.trim()) {
      onToast('Please enter a custom type label for "Other" event!', 'error');
      return;
    }

    try {
      onAddEvent({
        family_id: session?.current_family?.id || '',
        event_type: eventType,
        custom_type: eventType === 'other' ? customType.trim() : undefined,
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        event_date: eventDate,
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        venue_name: eventVenue.trim(),
        venue_address: eventAddress.trim(),
        google_maps_link: eventMapLink.trim()
      });

      onToast('New wedding event added! Closing form and switching to Event Schedule...', 'success');
      setShowAddEventModal(false);
      setEventTitle('');
      setEventDescription('');
      setCustomType('');

      // Auto redirect to Event Schedule tab after 500ms
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('events');
        }
      }, 500);
    } catch (err: any) {
      onToast('Failed to add event.', 'error');
    }
  };

  const pendingMembers = members.filter(m => m.status === 'pending');
  const approvedMembers = members.filter(m => m.status === 'approved');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10">
            Family Control Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] mt-1">
            Family Admin Panel
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Managing {session?.current_family?.name || 'Your Family Wedding Portal'}
          </p>
        </div>

        {/* Quick Analytics Summary */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center font-sans">
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-accent)] border border-[var(--border-gold)]">
            <span className="text-base font-bold text-[var(--gold-dark)]">{approvedMembers.length}</span>
            <span className="block text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Members</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-accent)] border border-[var(--border-gold)]">
            <span className="text-base font-bold text-[var(--gold-dark)]">{photos.length}</span>
            <span className="block text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Photos</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-accent)] border border-[var(--border-gold)]">
            <span className="text-base font-bold text-[var(--gold-dark)]">{wishes.length}</span>
            <span className="block text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Wishes</span>
          </div>
        </div>
      </div>

      {/* UNIQUE FAMILY CODE DISPLAY & SHARE BANNER */}
      <LuxuryCard className="border-2 border-[var(--border-gold)] gold-shadow bg-gradient-to-r from-[var(--gold-light)]/40 via-[var(--bg-accent)] to-[var(--gold-light)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
            <Sparkles className="w-4 h-4" />
            <span>Unique Family Member Code</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Share this code with your family relatives so they can easily open & join your private wedding portal!
          </p>
          <div className="pt-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-gold-gradient tracking-wider px-4 py-1 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-gold)] inline-block gold-shadow">
              {session?.current_family?.family_code || 'KAP-8492'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => {
              const code = session?.current_family?.family_code || 'KAP-8492';
              navigator.clipboard.writeText(code);
              onToast(`Unique Code "${code}" copied to clipboard!`, 'success');
            }}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gold-gradient text-white font-semibold text-xs shadow hover:opacity-95 transition-all cursor-pointer"
          >
            Copy Unique Code
          </button>

          <button
            onClick={() => {
              const code = session?.current_family?.family_code || 'KAP-8492';
              const name = session?.current_family?.name || 'Kapoor Family';
              const text = `👑 You're invited to join the ${name} Wedding Portal! Open http://localhost:5173/ and enter Unique Code: ${code} to join our private family space!`;
              navigator.clipboard.writeText(text);
              onToast('Full invitation text with Unique Code copied!', 'info');
            }}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold text-xs hover:bg-[var(--bg-accent)] transition-all cursor-pointer"
          >
            Copy Full Invitation
          </button>
        </div>
      </LuxuryCard>


      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('wedding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'wedding'
              ? 'bg-gold-gradient text-white shadow'
              : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
          }`}
        >
          Edit Wedding Details (Groom First)
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'members'
              ? 'bg-gold-gradient text-white shadow'
              : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
          }`}
        >
          Manage Members ({members.length})
          {pendingMembers.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold">
              {pendingMembers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'events'
              ? 'bg-gold-gradient text-white shadow'
              : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
          }`}
        >
          Manage Events ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-gold-gradient text-white shadow'
              : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
          }`}
        >
          Content Moderation
        </button>
      </div>

      {/* TAB 1: EDIT WEDDING DETAILS (GROOM FIELDS FIRST REQUIREMENT) */}
      {activeTab === 'wedding' && (
        <form onSubmit={handleSaveWedding} className="space-y-8">
          {/* GROOM SECTION FIRST */}
          <LuxuryCard className="space-y-4 border-2 border-[var(--border-gold)] gold-shadow">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Heart className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] fill-current" />
              <h3 className="font-serif font-bold text-xl text-[var(--text-primary)]">
                1. Groom Details (First Priority)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Groom Name *</label>
                <input
                  type="text"
                  required
                  value={groomName}
                  onChange={e => setGroomName(e.target.value)}
                  placeholder="e.g. Rahul Kapoor"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Groom Photo *</label>
                <div className="flex flex-col gap-2">
                  {groomImage && (
                    <img src={groomImage} alt="Groom Preview" className="w-20 h-20 rounded-xl object-cover border-2 border-[var(--border-gold)]" />
                  )}
                  <label className="px-4 py-2.5 rounded-xl bg-gold-gradient text-white font-semibold text-xs cursor-pointer hover:opacity-90 flex items-center justify-center gap-2 shrink-0 gold-shadow">
                    <UploadCloud className="w-4 h-4" />
                    <span>{groomImage ? 'Change Groom Photo File' : 'Upload Groom Photo File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await readFileAsDataUrl(file);
                          setGroomImage(url);
                          onToast('Groom photo file selected!', 'info');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Groom Father Name</label>
                <input
                  type="text"
                  value={groomFather}
                  onChange={e => setGroomFather(e.target.value)}
                  placeholder="Shri Rajeev Kapoor"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Groom Mother Name</label>
                <input
                  type="text"
                  value={groomMother}
                  onChange={e => setGroomMother(e.target.value)}
                  placeholder="Smt. Sunita Kapoor"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Groom Biography / Details</label>
              <textarea
                rows={2}
                value={groomBio}
                onChange={e => setGroomBio(e.target.value)}
                placeholder="A short note about the Groom..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </LuxuryCard>

          {/* BRIDE SECTION SECOND */}
          <LuxuryCard className="space-y-4 border-2 border-[var(--border-gold)] gold-shadow">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Heart className="w-5 h-5 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] fill-current" />
              <h3 className="font-serif font-bold text-xl text-[var(--text-primary)]">
                2. Bride Details (Second Priority)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Bride Name *</label>
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={e => setBrideName(e.target.value)}
                  placeholder="e.g. Ananya Verma"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Bride Photo *</label>
                <div className="flex flex-col gap-2">
                  {brideImage && (
                    <img src={brideImage} alt="Bride Preview" className="w-20 h-20 rounded-xl object-cover border-2 border-[var(--border-gold)]" />
                  )}
                  <label className="px-4 py-2.5 rounded-xl bg-gold-gradient text-white font-semibold text-xs cursor-pointer hover:opacity-90 flex items-center justify-center gap-2 shrink-0 gold-shadow">
                    <UploadCloud className="w-4 h-4" />
                    <span>{brideImage ? 'Change Bride Photo File' : 'Upload Bride Photo File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await readFileAsDataUrl(file);
                          setBrideImage(url);
                          onToast('Bride photo file selected!', 'info');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>



              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Bride Father Name</label>
                <input
                  type="text"
                  value={brideFather}
                  onChange={e => setBrideFather(e.target.value)}
                  placeholder="Shri Mahendra Verma"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Bride Mother Name</label>
                <input
                  type="text"
                  value={brideMother}
                  onChange={e => setBrideMother(e.target.value)}
                  placeholder="Smt. Rekha Verma"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Bride Biography / Details</label>
              <textarea
                rows={2}
                value={brideBio}
                onChange={e => setBrideBio(e.target.value)}
                placeholder="A short note about the Bride..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </LuxuryCard>

          {/* GENERAL WEDDING DETAILS */}
          <LuxuryCard className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
              3. Date, Venue & Love Story
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <CalendarPicker
                  label="Main Wedding Date *"
                  value={weddingDate}
                  onChange={dateStr => setWeddingDate(dateStr)}
                />
              </div>


              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Venue Name</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  placeholder="e.g. The Royal Palace"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Venue Address</label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                  placeholder="Sector 62, Gurgaon, Delhi NCR"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Google Maps Pin Link</label>
                <input
                  type="url"
                  value={googleMapsLink}
                  onChange={e => setGoogleMapsLink(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Love Story Timeline Story</label>
              <textarea
                rows={4}
                value={loveStory}
                onChange={e => setLoveStory(e.target.value)}
                placeholder="How the Groom & Bride met and built their story..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingWedding}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-white font-medium text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer gold-shadow"
            >
              <Save className="w-5 h-5" />
              <span>{savingWedding ? 'Saving Changes...' : 'Save All Wedding Details'}</span>
            </button>
          </LuxuryCard>
        </form>
      )}

      {/* TAB 2: MANAGE MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Pending Approval Queue */}
          {pendingMembers.length > 0 && (
            <LuxuryCard className="border-2 border-amber-500/40 bg-amber-500/5 space-y-4">
              <h3 className="font-serif font-bold text-lg text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <span>Pending Approvals ({pendingMembers.length})</span>
              </h3>

              <div className="space-y-3">
                {pendingMembers.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-gold)] flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{p.full_name}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Relation: <strong>{p.relation}</strong> | Email: {p.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onApproveMember(p.id);
                          onToast(`Approved ${p.full_name}!`, 'success');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          onRejectMember(p.id);
                          onToast(`Rejected request for ${p.full_name}`, 'info');
                        }}
                        className="px-3 py-2 rounded-xl border border-red-500/40 text-red-600 text-xs font-semibold hover:bg-red-500/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </LuxuryCard>
          )}

          {/* Approved Members List */}
          <LuxuryCard className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Approved Family Members ({approvedMembers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {approvedMembers.map(m => (
                <div key={m.id} className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] flex items-center gap-3">
                  <img
                    src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.full_name}`}
                    alt={m.full_name}
                    className="w-10 h-10 rounded-full border border-[var(--border-gold)]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">{m.full_name}</h4>
                    <span className="text-[10px] text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">{m.relation}</span>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </div>
      )}

      {/* TAB 3: MANAGE EVENTS (WITH CUSTOM TYPE SUPPORT) */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-xl text-[var(--text-primary)]">
              Scheduled Events ({events.length})
            </h3>
            <button
              onClick={() => {
                setEventType('haldi');
                setCustomType('');
                setEventTitle('');
                setEventDescription('');
                setEventDate(new Date().toISOString().split('T')[0]);
                setStartTime('11:00 AM');
                setEndTime('02:00 PM');
                setEventVenue('');
                setEventAddress('');
                setEventMapLink('');
                setShowAddEventModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Event</span>
            </button>
          </div>

          <div className="space-y-3">
            {events.map(evt => (
              <LuxuryCard key={evt.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                    {evt.event_type === 'other' && evt.custom_type ? evt.custom_type : evt.event_type.toUpperCase()}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[var(--text-primary)] mt-1">{evt.title}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{evt.event_date} | {evt.venue_name}</p>
                </div>

                <button
                  onClick={() => {
                    onDeleteEvent(evt.id);
                    onToast('Event removed.', 'info');
                  }}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </LuxuryCard>
            ))}
          </div>

          {/* ADD EVENT MODAL (CUSTOM TYPE BADGE INPUT) */}
          {showAddEventModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
              <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">Add Wedding Event</h3>
                  <button onClick={() => setShowAddEventModal(false)} className="text-[var(--text-muted)] cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Event Type</label>
                    <select
                      value={eventType}
                      onChange={e => setEventType(e.target.value as EventType)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="haldi">Haldi</option>
                      <option value="mehendi">Mehendi</option>
                      <option value="sangeet">Sangeet</option>
                      <option value="wedding">Wedding</option>
                      <option value="reception">Reception</option>
                      <option value="other">Other / Custom Ritual</option>
                    </select>
                  </div>

                  {/* CUSTOM TYPE INPUT SHOWN WHEN "OTHER" IS SELECTED */}
                  {eventType === 'other' && (
                    <div className="p-3 rounded-xl bg-[var(--gold-light)] border border-[var(--border-gold)] space-y-1">
                      <label className="block text-xs font-bold text-[var(--gold-dark)] dark:text-[var(--gold-primary)]">
                        Custom Type Badge Label * (e.g. Tilak, Roka, Engagement)
                      </label>
                      <input
                        type="text"
                        required
                        value={customType}
                        onChange={e => setCustomType(e.target.value)}
                        placeholder="e.g. Tilak & Sagan"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                      <p className="text-[10px] text-[var(--text-muted)]">This custom label will display as the badge on the event schedule.</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={eventTitle}
                      onChange={e => setEventTitle(e.target.value)}
                      placeholder="e.g. Auspicious Sagan Ceremony"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <CalendarPicker
                      label="Event Date *"
                      value={eventDate}
                      onChange={dateStr => setEventDate(dateStr)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                          Start Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--gold-dark)] pointer-events-none" />
                          <select
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)] font-medium cursor-pointer"
                          >
                            <option value="">Select Start Time</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                          End Time (Optional)
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--gold-dark)] pointer-events-none" />
                          <select
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)] font-medium cursor-pointer"
                          >
                            <option value="">Select End Time</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={eventVenue}
                      onChange={e => setEventVenue(e.target.value)}
                      placeholder="Grand Ballroom"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Venue Address</label>
                    <input
                      type="text"
                      value={eventAddress}
                      onChange={e => setEventAddress(e.target.value)}
                      placeholder="Sector 62, Gurgaon"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Google Maps Link</label>
                    <input
                      type="url"
                      value={eventMapLink}
                      onChange={e => setEventMapLink(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>


                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow hover:opacity-95 transition-all cursor-pointer mt-3"
                  >
                    Save Event to Schedule
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTENT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <LuxuryCard className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Gallery Photo Moderation ({photos.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map(p => (
                <div key={p.id} className="relative rounded-xl overflow-hidden border border-[var(--border-gold)] group">
                  <img src={p.photo_url} alt="Photo" className="w-full h-24 object-cover" />
                  <button
                    onClick={() => {
                      onDeletePhoto(p.id);
                      onToast('Photo removed by moderation.', 'info');
                    }}
                    className="absolute top-1 right-1 p-1.5 rounded-lg bg-black/70 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </LuxuryCard>

          <LuxuryCard className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Wishes Wall Moderation ({wishes.length})
            </h3>
            <div className="space-y-2">
              {wishes.map(w => (
                <div key={w.id} className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] flex items-center justify-between text-xs">
                  <div>
                    <strong>{w.sender_name} ({w.relation}):</strong> "{w.message}"
                  </div>
                  <button
                    onClick={() => {
                      onDeleteWish(w.id);
                      onToast('Wish deleted.', 'info');
                    }}
                    className="text-red-500 hover:text-red-600 cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </div>
      )}
    </div>
  );
};
