/**
 * supabaseApi.ts
 * All Supabase database operations — replaces dataStore.ts when Supabase is configured.
 */

import { supabase } from './supabase';
import type {
  Family, Profile, UserRoleEntry, Wedding,
  EventItem, GalleryPhoto, PhotoComment, Wish, VideoItem, UserRole
} from '../types';

// ─────────────────────────────────────────────
// FAMILIES
// ─────────────────────────────────────────────

export async function dbGetFamilyById(id: string): Promise<Family | null> {
  const { data } = await supabase.from('families').select('*').eq('id', id).single();
  return data ? mapFamily(data) : null;
}

export async function dbGetFamilyByCode(code: string): Promise<Family | null> {
  const { data } = await supabase
    .from('families')
    .select('*')
    .ilike('family_code', code)
    .single();
  return data ? mapFamily(data) : null;
}

export async function dbGetFamilyBySlugOrName(input: string): Promise<Family | null> {
  const slug = input.toLowerCase().replace(/\s+/g, '-');
  const { data } = await supabase
    .from('families')
    .select('*')
    .or(`slug.eq.${slug},name.ilike.${input}`)
    .limit(1)
    .single();
  return data ? mapFamily(data) : null;
}

export async function dbCreateFamily(f: Omit<Family, 'id' | 'created_at'>): Promise<Family> {
  const { data, error } = await supabase
    .from('families')
    .insert({ name: f.name, slug: f.slug, family_code: f.family_code })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapFamily(data);
}

export async function dbGetAllFamilies(): Promise<Family[]> {
  const { data } = await supabase.from('families').select('*').order('created_at', { ascending: false });
  return (data || []).map(mapFamily);
}

// ─────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────

export async function dbGetProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data ? mapProfile(data) : null;
}

export async function dbGetFamilyProfiles(familyId: string): Promise<Profile[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true });
  return (data || []).map(mapProfile);
}

export async function dbUpsertProfile(p: Partial<Profile> & { id: string }): Promise<void> {
  const { error } = await supabase.from('profiles').upsert({
    id: p.id,
    family_id: p.family_id,
    full_name: p.full_name,
    mobile_number: p.mobile_number,
    relation: p.relation,
    avatar_url: p.avatar_url,
    status: p.status,
    email: p.email,
  });
  if (error) throw new Error(error.message);
}

export async function dbUpdateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.full_name,
      mobile_number: updates.mobile_number,
      relation: updates.relation,
      avatar_url: updates.avatar_url,
      status: updates.status,
    })
    .eq('id', userId);
  if (error) throw new Error(error.message);
}

export async function dbUpdateMemberStatus(profileId: string, status: 'approved' | 'rejected'): Promise<void> {
  const { error } = await supabase.from('profiles').update({ status }).eq('id', profileId);
  if (error) throw new Error(error.message);
}

export async function dbDeleteProfile(profileId: string): Promise<void> {
  await supabase.from('user_roles').delete().eq('user_id', profileId);
  await supabase.from('profiles').delete().eq('id', profileId);
}

// ─────────────────────────────────────────────
// USER ROLES
// ─────────────────────────────────────────────

export async function dbGetUserRoles(userId: string): Promise<UserRoleEntry[]> {
  const { data } = await supabase.from('user_roles').select('*').eq('user_id', userId);
  return (data || []).map(mapRole);
}

export async function dbInsertRole(role: Omit<UserRoleEntry, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('user_roles').insert({
    user_id: role.user_id,
    family_id: role.family_id,
    role: role.role,
  });
  if (error && !error.message.includes('duplicate')) throw new Error(error.message);
}

export async function dbCheckSuperAdminExists(): Promise<boolean> {
  const { count } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'super_admin');
  return (count || 0) > 0;
}

// ─────────────────────────────────────────────
// WEDDING
// ─────────────────────────────────────────────

export async function dbGetWedding(familyId: string): Promise<Wedding | null> {
  const { data } = await supabase.from('weddings').select('*').eq('family_id', familyId).single();
  return data ? mapWedding(data) : null;
}

export async function dbUpsertWedding(w: Partial<Wedding> & { family_id: string }): Promise<void> {
  const { error } = await supabase.from('weddings').upsert({
    family_id: w.family_id,
    groom_name: w.groom_name,
    groom_father: w.groom_father,
    groom_mother: w.groom_mother,
    groom_bio: w.groom_bio,
    groom_image: w.groom_image,
    bride_name: w.bride_name,
    bride_father: w.bride_father,
    bride_mother: w.bride_mother,
    bride_bio: w.bride_bio,
    bride_image: w.bride_image,
    wedding_date: w.wedding_date,
    venue_name: w.venue_name,
    venue_address: w.venue_address,
    google_maps_link: w.google_maps_link,
    love_story: w.love_story,
    cover_image: w.cover_image,
  }, { onConflict: 'family_id' });
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────

export async function dbGetEvents(familyId: string): Promise<EventItem[]> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('family_id', familyId)
    .order('event_date', { ascending: true });
  return (data || []).map(mapEvent);
}

export async function dbInsertEvent(e: Omit<EventItem, 'id' | 'created_at'>): Promise<EventItem> {
  const { data, error } = await supabase.from('events').insert({
    family_id: e.family_id,
    event_type: e.event_type,
    custom_type: e.custom_type,
    title: e.title,
    description: e.description,
    event_date: e.event_date,
    start_time: e.start_time,
    end_time: e.end_time,
    venue_name: e.venue_name,
    venue_address: e.venue_address,
    google_maps_link: e.google_maps_link,
  }).select().single();
  if (error) throw new Error(error.message);
  return mapEvent(data);
}

export async function dbDeleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────
// GALLERY PHOTOS
// ─────────────────────────────────────────────

export async function dbGetPhotos(familyId: string, userId: string): Promise<GalleryPhoto[]> {
  const [photosRes, likesRes, commentsRes] = await Promise.all([
    supabase
      .from('gallery_photos')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false }),
    supabase
      .from('photo_likes')
      .select('photo_id')
      .eq('user_id', userId),
    supabase
      .from('photo_comments')
      .select('*')
      .order('created_at', { ascending: true }),
  ]);

  const likedPhotoIds = new Set((likesRes.data || []).map((l: any) => l.photo_id));
  const commentsByPhotoId = new Map<string, PhotoComment[]>();
  (commentsRes.data || []).forEach((c: any) => {
    const list = commentsByPhotoId.get(c.photo_id) || [];
    list.push({
      id: c.id,
      photo_id: c.photo_id,
      user_id: c.user_id,
      comment: c.comment,
      user_name: c.user_name,
      created_at: c.created_at,
    });
    commentsByPhotoId.set(c.photo_id, list);
  });

  return (photosRes.data || []).map((p: any) => ({
    id: p.id,
    family_id: p.family_id,
    user_id: p.user_id,
    photo_url: p.photo_url,
    caption: p.caption || '',
    created_at: p.created_at,
    likes_count: p.likes_count || 0,
    user_has_liked: likedPhotoIds.has(p.id),
    user_full_name: p.user_full_name || 'Family Member',
    comments: commentsByPhotoId.get(p.id) || [],
  }));
}

export async function dbUploadPhotoFile(
  familyId: string,
  userId: string,
  file: File,
  caption: string,
  userFullName: string
): Promise<GalleryPhoto> {
  // Upload file to Supabase Storage
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${familyId}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from('gallery-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`);

  const { data: urlData } = supabase.storage
    .from('gallery-photos')
    .getPublicUrl(storageData.path);

  // Insert photo record into DB
  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({
      family_id: familyId,
      user_id: userId,
      photo_url: urlData.publicUrl,
      storage_path: storageData.path,
      caption,
      user_full_name: userFullName,
      likes_count: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    family_id: data.family_id,
    user_id: data.user_id,
    photo_url: data.photo_url,
    caption: data.caption || '',
    created_at: data.created_at,
    likes_count: 0,
    user_has_liked: false,
    user_full_name: data.user_full_name,
    comments: [],
  };
}

export async function dbCountUserPhotos(familyId: string, userId: string): Promise<number> {
  const { count } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .eq('user_id', userId);
  return count || 0;
}

export async function dbToggleLike(photoId: string, userId: string): Promise<number> {
  // Check if already liked
  const { data: existing } = await supabase
    .from('photo_likes')
    .select('id')
    .eq('photo_id', photoId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Unlike
    await supabase.from('photo_likes').delete().eq('photo_id', photoId).eq('user_id', userId);
    const { error } = await supabase.rpc('decrement_likes', { photo_id_param: photoId });
    if (error) {
      // Fallback: manual update
      const { data: photo } = await supabase.from('gallery_photos').select('likes_count').eq('id', photoId).single();
      const newCount = Math.max(0, (photo?.likes_count || 1) - 1);
      await supabase.from('gallery_photos').update({ likes_count: newCount }).eq('id', photoId);
      return newCount;
    }
  } else {
    // Like
    await supabase.from('photo_likes').insert({ photo_id: photoId, user_id: userId });
    const { data: photo } = await supabase.from('gallery_photos').select('likes_count').eq('id', photoId).single();
    const newCount = (photo?.likes_count || 0) + 1;
    await supabase.from('gallery_photos').update({ likes_count: newCount }).eq('id', photoId);
    return newCount;
  }

  const { data: updated } = await supabase.from('gallery_photos').select('likes_count').eq('id', photoId).single();
  return updated?.likes_count || 0;
}

export async function dbAddComment(photoId: string, userId: string, comment: string, userName: string): Promise<PhotoComment> {
  const { data, error } = await supabase
    .from('photo_comments')
    .insert({ photo_id: photoId, user_id: userId, comment, user_name: userName })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, photo_id: data.photo_id, user_id: data.user_id, comment: data.comment, user_name: data.user_name, created_at: data.created_at };
}

export async function dbDeletePhoto(photoId: string, storagePath?: string): Promise<void> {
  // Delete comments and likes first
  await supabase.from('photo_comments').delete().eq('photo_id', photoId);
  await supabase.from('photo_likes').delete().eq('photo_id', photoId);
  // Delete DB record
  await supabase.from('gallery_photos').delete().eq('id', photoId);
  // Delete from Storage
  if (storagePath) {
    await supabase.storage.from('gallery-photos').remove([storagePath]);
  }
}

// ─────────────────────────────────────────────
// WISHES
// ─────────────────────────────────────────────

export async function dbGetWishes(familyId: string): Promise<Wish[]> {
  const { data } = await supabase
    .from('wishes')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
  return (data || []).map((w: any) => ({
    id: w.id,
    family_id: w.family_id,
    user_id: w.user_id,
    sender_name: w.sender_name,
    relation: w.relation,
    message: w.message,
    is_approved: w.is_approved,
    created_at: w.created_at,
  }));
}

export async function dbInsertWish(w: Omit<Wish, 'id' | 'created_at'>): Promise<Wish> {
  const { data, error } = await supabase
    .from('wishes')
    .insert({ family_id: w.family_id, user_id: w.user_id, sender_name: w.sender_name, relation: w.relation, message: w.message, is_approved: w.is_approved })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, family_id: data.family_id, user_id: data.user_id, sender_name: data.sender_name, relation: data.relation, message: data.message, is_approved: data.is_approved, created_at: data.created_at };
}

export async function dbDeleteWish(wishId: string): Promise<void> {
  await supabase.from('wishes').delete().eq('id', wishId);
}

// ─────────────────────────────────────────────
// VIDEOS
// ─────────────────────────────────────────────

export async function dbGetVideos(familyId: string): Promise<VideoItem[]> {
  const { data } = await supabase.from('videos').select('*').eq('family_id', familyId).order('created_at', { ascending: false });
  return (data || []).map((v: any) => ({
    id: v.id, family_id: v.family_id, title: v.title, video_url: v.video_url, category: v.category, thumbnail_url: v.thumbnail_url, created_at: v.created_at,
  }));
}

export async function dbDeleteVideo(videoId: string): Promise<void> {
  await supabase.from('videos').delete().eq('id', videoId);
}

// ─────────────────────────────────────────────
// STORAGE — AVATAR UPLOAD
// ─────────────────────────────────────────────

export async function dbUploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/avatar.${ext}`;
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { cacheControl: '3600', upsert: true });
  if (error) throw new Error(error.message);
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ─────────────────────────────────────────────
// STORAGE — COUPLE IMAGE UPLOAD
// ─────────────────────────────────────────────

export async function dbUploadCoupleImage(familyId: string, role: 'groom' | 'bride', file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${familyId}/${role}.${ext}`;
  const { data, error } = await supabase.storage
    .from('couple-images')
    .upload(path, file, { cacheControl: '3600', upsert: true });
  if (error) throw new Error(error.message);
  const { data: urlData } = supabase.storage.from('couple-images').getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ─────────────────────────────────────────────
// DATA MAPPERS (DB row → app type)
// ─────────────────────────────────────────────

function mapFamily(d: any): Family {
  return { id: d.id, name: d.name, slug: d.slug, family_code: d.family_code, created_at: d.created_at };
}

function mapProfile(d: any): Profile {
  return {
    id: d.id, family_id: d.family_id, full_name: d.full_name,
    mobile_number: d.mobile_number, relation: d.relation,
    avatar_url: d.avatar_url, status: d.status, created_at: d.created_at, email: d.email,
  };
}

function mapRole(d: any): UserRoleEntry {
  return { id: d.id, user_id: d.user_id, family_id: d.family_id, role: d.role as UserRole, created_at: d.created_at };
}

function mapWedding(d: any): Wedding {
  return {
    id: d.id, family_id: d.family_id, groom_name: d.groom_name, groom_father: d.groom_father,
    groom_mother: d.groom_mother, groom_bio: d.groom_bio, groom_image: d.groom_image,
    bride_name: d.bride_name, bride_father: d.bride_father, bride_mother: d.bride_mother,
    bride_bio: d.bride_bio, bride_image: d.bride_image, wedding_date: d.wedding_date,
    venue_name: d.venue_name || '', venue_address: d.venue_address || '',
    google_maps_link: d.google_maps_link, love_story: d.love_story,
    cover_image: d.cover_image, created_at: d.created_at,
  };
}

function mapEvent(d: any): EventItem {
  return {
    id: d.id, family_id: d.family_id, event_type: d.event_type, custom_type: d.custom_type,
    title: d.title, description: d.description, event_date: d.event_date,
    start_time: d.start_time, end_time: d.end_time, venue_name: d.venue_name,
    venue_address: d.venue_address, google_maps_link: d.google_maps_link, created_at: d.created_at,
  };
}
