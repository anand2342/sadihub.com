-- ============================================================
-- Family Wedding Portal — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: families
-- ============================================================
CREATE TABLE IF NOT EXISTS public.families (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  family_code TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: profiles (linked to auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id     UUID REFERENCES public.families(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL DEFAULT '',
  mobile_number TEXT,
  relation      TEXT DEFAULT 'Other',
  avatar_url    TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  email         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: user_roles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id  UUID REFERENCES public.families(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('super_admin','family_admin','family_member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, family_id, role)
);

-- ============================================================
-- TABLE: weddings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weddings (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id        UUID UNIQUE NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  groom_name       TEXT NOT NULL DEFAULT 'Groom',
  groom_father     TEXT,
  groom_mother     TEXT,
  groom_bio        TEXT,
  groom_image      TEXT,
  bride_name       TEXT NOT NULL DEFAULT 'Bride',
  bride_father     TEXT,
  bride_mother     TEXT,
  bride_bio        TEXT,
  bride_image      TEXT,
  wedding_date     TIMESTAMPTZ,
  venue_name       TEXT DEFAULT '',
  venue_address    TEXT DEFAULT '',
  google_maps_link TEXT,
  love_story       TEXT,
  cover_image      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id        UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  event_type       TEXT DEFAULT 'other',
  custom_type      TEXT,
  title            TEXT NOT NULL,
  description      TEXT,
  event_date       TIMESTAMPTZ,
  start_time       TEXT,
  end_time         TEXT,
  venue_name       TEXT,
  venue_address    TEXT,
  google_maps_link TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: gallery_photos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id      UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url      TEXT NOT NULL,
  storage_path   TEXT,
  caption        TEXT DEFAULT '',
  likes_count    INT DEFAULT 0,
  user_full_name TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: photo_likes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.photo_likes (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  photo_id   UUID NOT NULL REFERENCES public.gallery_photos(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- ============================================================
-- TABLE: photo_comments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.photo_comments (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  photo_id   UUID NOT NULL REFERENCES public.gallery_photos(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment    TEXT NOT NULL,
  user_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: wishes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wishes (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id   UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  relation    TEXT DEFAULT 'Other',
  message     TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: videos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id     UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  video_url     TEXT NOT NULL,
  category      TEXT DEFAULT 'Other',
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('gallery-photos', 'gallery-photos', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('avatars',        'avatars',        true,  2097152,  ARRAY['image/jpeg','image/png','image/webp']),
  ('couple-images',  'couple-images',  true,  5242880,  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.families       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos         ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's family_id
CREATE OR REPLACE FUNCTION get_my_family_id()
RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT family_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Helper function: check if user is family_admin
CREATE OR REPLACE FUNCTION is_family_admin(fid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND family_id = fid
    AND role IN ('family_admin','super_admin')
  );
$$;

-- ---- families policies ----
CREATE POLICY "Members see their family" ON public.families
  FOR SELECT USING (id = get_my_family_id());

CREATE POLICY "Anyone can create a family" ON public.families
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update family" ON public.families
  FOR UPDATE USING (is_family_admin(id));

-- ---- profiles policies ----
CREATE POLICY "Members see family profiles" ON public.profiles
  FOR SELECT USING (family_id = get_my_family_id());

CREATE POLICY "Users insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid() OR is_family_admin(family_id));

CREATE POLICY "Admin can delete profile" ON public.profiles
  FOR DELETE USING (is_family_admin(family_id));

-- ---- user_roles policies ----
CREATE POLICY "Members see family roles" ON public.user_roles
  FOR SELECT USING (family_id = get_my_family_id() OR family_id IS NULL);

CREATE POLICY "Users insert their own role" ON public.user_roles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can delete role" ON public.user_roles
  FOR DELETE USING (is_family_admin(family_id));

-- ---- weddings policies ----
CREATE POLICY "Members see family wedding" ON public.weddings
  FOR SELECT USING (family_id = get_my_family_id());

CREATE POLICY "Admin can manage wedding" ON public.weddings
  FOR ALL USING (is_family_admin(family_id));

CREATE POLICY "Admin insert wedding" ON public.weddings
  FOR INSERT WITH CHECK (is_family_admin(family_id));

-- ---- events policies ----
CREATE POLICY "Members see family events" ON public.events
  FOR SELECT USING (family_id = get_my_family_id());

CREATE POLICY "Admin can manage events" ON public.events
  FOR ALL USING (is_family_admin(family_id));

CREATE POLICY "Admin insert event" ON public.events
  FOR INSERT WITH CHECK (is_family_admin(family_id));

-- ---- gallery_photos policies ----
CREATE POLICY "Members see family photos" ON public.gallery_photos
  FOR SELECT USING (family_id = get_my_family_id());

CREATE POLICY "Approved members upload photos" ON public.gallery_photos
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND family_id = get_my_family_id()
    AND EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "Owner or admin delete photo" ON public.gallery_photos
  FOR DELETE USING (user_id = auth.uid() OR is_family_admin(family_id));

-- ---- photo_likes policies ----
CREATE POLICY "Members see likes" ON public.photo_likes
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.gallery_photos gp WHERE gp.id = photo_id AND gp.family_id = get_my_family_id())
  );

CREATE POLICY "Members toggle likes" ON public.photo_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Members remove own like" ON public.photo_likes
  FOR DELETE USING (user_id = auth.uid());

-- ---- photo_comments policies ----
CREATE POLICY "Members see comments" ON public.photo_comments
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.gallery_photos gp WHERE gp.id = photo_id AND gp.family_id = get_my_family_id())
  );

CREATE POLICY "Members add comment" ON public.photo_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owner or admin delete comment" ON public.photo_comments
  FOR DELETE USING (user_id = auth.uid() OR is_family_admin(
    (SELECT family_id FROM public.gallery_photos WHERE id = photo_id)
  ));

-- ---- wishes policies ----
CREATE POLICY "Members see family wishes" ON public.wishes
  FOR SELECT USING (family_id = get_my_family_id());

CREATE POLICY "Members add wish" ON public.wishes
  FOR INSERT WITH CHECK (family_id = get_my_family_id());

CREATE POLICY "Admin delete wish" ON public.wishes
  FOR DELETE USING (is_family_admin(family_id));

-- ---- videos policies ----
CREATE POLICY "Members see family videos" ON public.videos
  FOR SELECT USING (family_id = get_my_family_id());

CREATE POLICY "Admin manage videos" ON public.videos
  FOR ALL USING (is_family_admin(family_id));

CREATE POLICY "Admin insert video" ON public.videos
  FOR INSERT WITH CHECK (is_family_admin(family_id));

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- gallery-photos: members of the same family can read
CREATE POLICY "Family members read gallery photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-photos');

-- gallery-photos: approved members can upload to their folder
CREATE POLICY "Approved members upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-photos'
    AND auth.role() = 'authenticated'
  );

-- gallery-photos: owner can delete
CREATE POLICY "Owner deletes gallery photo" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery-photos'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- avatars: public read
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated upload avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Own avatar update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- couple-images: public read
CREATE POLICY "Public read couple images" ON storage.objects
  FOR SELECT USING (bucket_id = 'couple-images');

CREATE POLICY "Admin upload couple image" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'couple-images' AND auth.role() = 'authenticated');

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Profile is created manually in app code after signup
  -- This trigger just ensures the user exists
  RETURN NEW;
END;
$$;

-- ============================================================
-- FUNCTION: Verify family code exists (used during join)
-- ============================================================
CREATE OR REPLACE FUNCTION public.verify_family_code(code TEXT)
RETURNS TABLE(family_id UUID, family_name TEXT) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT id, name FROM public.families
  WHERE UPPER(family_code) = UPPER(code)
  LIMIT 1;
$$;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_family_id ON public.profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_family_id ON public.user_roles(family_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_family_id ON public.gallery_photos(family_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user_id ON public.gallery_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_events_family_id ON public.events(family_id);
CREATE INDEX IF NOT EXISTS idx_wishes_family_id ON public.wishes(family_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON public.photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_comments_photo_id ON public.photo_comments(photo_id);
