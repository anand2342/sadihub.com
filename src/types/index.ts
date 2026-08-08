export type RelationType = 
  | 'Father' 
  | 'Mother' 
  | 'Brother' 
  | 'Sister' 
  | 'Uncle' 
  | 'Aunt' 
  | 'Cousin' 
  | 'Friend' 
  | 'Other';

export type ProfileStatus = 'pending' | 'approved' | 'rejected';

export type UserRole = 'super_admin' | 'family_admin' | 'family_member';

export interface Family {
  id: string;
  name: string;
  slug: string;
  family_code: string;
  created_at: string;
}

export interface Profile {
  id: string;
  family_id: string;
  full_name: string;
  mobile_number?: string;
  relation: RelationType;
  avatar_url?: string;
  status: ProfileStatus;
  created_at: string;
  email?: string;
}

export interface UserRoleEntry {
  id: string;
  user_id: string;
  family_id?: string | null;
  role: UserRole;
  created_at: string;
}

export interface Wedding {
  id: string;
  family_id: string;
  
  // Groom fields FIRST
  groom_name: string;
  groom_father?: string;
  groom_mother?: string;
  groom_bio?: string;
  groom_image?: string;
  
  // Bride fields SECOND
  bride_name: string;
  bride_father?: string;
  bride_mother?: string;
  bride_bio?: string;
  bride_image?: string;
  
  // General Wedding Info
  wedding_date: string;
  venue_name: string;
  venue_address: string;
  google_maps_link?: string;
  love_story?: string;
  cover_image?: string;
  created_at: string;
}

export type EventType = 'haldi' | 'mehendi' | 'sangeet' | 'wedding' | 'reception' | 'other';

export interface EventItem {
  id: string;
  family_id: string;
  event_type: EventType;
  custom_type?: string; // e.g. "Tilak", "Roka"
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  google_maps_link?: string;
  created_at: string;
}

export interface PhotoComment {
  id: string;
  photo_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user_name?: string;
}

export interface GalleryPhoto {
  id: string;
  family_id: string;
  user_id: string;
  photo_url: string;
  caption?: string;
  created_at: string;
  likes_count?: number;
  user_has_liked?: boolean;
  comments?: PhotoComment[];
  user_full_name?: string;
}

export interface Wish {
  id: string;
  family_id: string;
  user_id?: string;
  sender_name: string;
  relation: RelationType;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export interface VideoItem {
  id: string;
  family_id: string;
  title: string;
  video_url: string;
  category: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface UserSession {
  user_id: string;
  email: string;
  profile?: Profile;
  roles: UserRole[];
  current_family?: Family;
}
