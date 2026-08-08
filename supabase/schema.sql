-- ============================================================================
-- FAMILY WEDDING PORTAL - COMPLETE SUPABASE SCHEMA & SECURITY POLICIES
-- ============================================================================

-- Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLES DEFINITION
-- ----------------------------------------------------------------------------

-- Families Table
create table if not exists public.families (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    family_code text not null,
    created_at timestamptz default now()
);

-- User Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    family_id uuid references public.families(id) on delete cascade,
    full_name text not null,
    mobile_number text,
    relation text not null check (relation in ('Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Cousin', 'Friend', 'Other')),
    avatar_url text,
    status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz default now()
);

-- Roles Table (Separate from profiles to prevent circular RLS recursion)
create table if not exists public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    family_id uuid references public.families(id) on delete cascade,
    role text not null check (role in ('super_admin', 'family_admin', 'family_member')),
    created_at timestamptz default now(),
    unique(user_id, family_id, role)
);

-- Weddings Table (GROOM-FIRST ORDERING ENFORCED)
create table if not exists public.weddings (
    id uuid primary key default gen_random_uuid(),
    family_id uuid unique not null references public.families(id) on delete cascade,
    
    -- Groom details FIRST
    groom_name text default 'Groom',
    groom_father text,
    groom_mother text,
    groom_bio text,
    groom_image text,
    
    -- Bride details SECOND
    bride_name text default 'Bride',
    bride_father text,
    bride_mother text,
    bride_bio text,
    bride_image text,
    
    -- Event Details
    wedding_date timestamptz,
    venue_name text,
    venue_address text,
    google_maps_link text,
    love_story text,
    cover_image text,
    created_at timestamptz default now()
);

-- Events Schedule Table (Supports custom_type label for 'other')
create table if not exists public.events (
    id uuid primary key default gen_random_uuid(),
    family_id uuid not null references public.families(id) on delete cascade,
    event_type text not null check (event_type in ('haldi', 'mehendi', 'sangeet', 'wedding', 'reception', 'other')),
    custom_type text, -- Custom label for badge display (e.g. Tilak, Roka)
    title text not null,
    description text,
    event_date date not null,
    start_time text,
    end_time text,
    venue_name text,
    venue_address text,
    google_maps_link text,
    created_at timestamptz default now()
);

-- Photo Gallery Table
create table if not exists public.gallery_photos (
    id uuid primary key default gen_random_uuid(),
    family_id uuid not null references public.families(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    photo_url text not null,
    caption text,
    created_at timestamptz default now()
);

-- Photo Likes
create table if not exists public.photo_likes (
    id uuid primary key default gen_random_uuid(),
    photo_id uuid not null references public.gallery_photos(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    unique(photo_id, user_id)
);

-- Photo Comments
create table if not exists public.photo_comments (
    id uuid primary key default gen_random_uuid(),
    photo_id uuid not null references public.gallery_photos(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    comment text not null,
    created_at timestamptz default now()
);

-- Wishes Wall Table
create table if not exists public.wishes (
    id uuid primary key default gen_random_uuid(),
    family_id uuid not null references public.families(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    sender_name text not null,
    relation text not null,
    message text not null,
    is_approved boolean default true,
    created_at timestamptz default now()
);

-- Videos Table
create table if not exists public.videos (
    id uuid primary key default gen_random_uuid(),
    family_id uuid not null references public.families(id) on delete cascade,
    title text not null,
    video_url text not null,
    category text default 'general',
    thumbnail_url text,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 2. SECURITY DEFINER FUNCTIONS & RPCS
-- ----------------------------------------------------------------------------

-- Check if user has role without triggering RLS recursion
create or replace function public.has_role(_user_id uuid, _role text, _family_id uuid default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Super admins bypass family check
    if exists (
        select 1 from user_roles
        where user_id = _user_id and role = 'super_admin'
    ) then
        return true;
    end if;

    if _family_id is null then
        return exists (
            select 1 from user_roles
            where user_id = _user_id and role = _role
        );
    else
        return exists (
            select 1 from user_roles
            where user_id = _user_id and role = _role and (family_id = _family_id or family_id is null)
        );
    end if;
end;
$$;

-- Check if super admin exists
create or replace function public.super_admin_exists()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    return exists (
        select 1 from user_roles where role = 'super_admin'
    );
end;
$$;

-- Claim super admin if none exists
create or replace function public.claim_super_admin_if_none()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    current_uid uuid := auth.uid();
begin
    if current_uid is null then
        raise exception 'Must be authenticated to claim super admin';
    end if;

    if exists (select 1 from user_roles where role = 'super_admin') then
        return false;
    end if;

    insert into user_roles (user_id, family_id, role)
    values (current_uid, null, 'super_admin');

    -- Auto approve profile if exists
    update profiles
    set status = 'approved'
    where id = current_uid;

    return true;
end;
$$;

-- Get User Family ID Helper
create or replace function public.get_user_family_id(_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    f_id uuid;
begin
    select family_id into f_id from profiles where id = _user_id;
    return f_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. TRIGGERS & CONSTRAINTS
-- ----------------------------------------------------------------------------

-- Enforce Max 10 Photos per Approved Member
create or replace function public.check_gallery_10_photo_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    photo_count integer;
begin
    select count(*) into photo_count
    from gallery_photos
    where user_id = NEW.user_id and family_id = NEW.family_id;

    if photo_count >= 10 then
        raise exception 'Upload limit reached. Members are allowed a maximum of 10 photos.';
    end if;

    return NEW;
end;
$$;

drop trigger if exists trigger_enforce_photo_limit on public.gallery_photos;
create trigger trigger_enforce_photo_limit
before insert on public.gallery_photos
for each row
execute function public.check_gallery_10_photo_limit();

-- Auto Create Default Wedding Entry when Family is Created
create or replace function public.auto_create_wedding_for_family()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.weddings (family_id, groom_name, bride_name, wedding_date)
    values (NEW.id, 'Groom Name', 'Bride Name', (now() + interval '30 days'))
    on conflict (family_id) do nothing;
    return NEW;
end;
$$;

drop trigger if exists trigger_auto_create_wedding on public.families;
create trigger trigger_auto_create_wedding
after insert on public.families
for each row
execute function public.auto_create_wedding_for_family();

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

alter table public.families enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.weddings enable row level security;
alter table public.events enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.photo_likes enable row level security;
alter table public.photo_comments enable row level security;
alter table public.wishes enable row level security;
alter table public.videos enable row level security;

-- Families RLS
create policy "Public read families for auth" on public.families for select using (true);
create policy "Super admin manage families" on public.families for all using (has_role(auth.uid(), 'super_admin'));

-- Profiles RLS
create policy "Users can view family profiles" on public.profiles for select
using (
    auth.uid() = id or 
    family_id = get_user_family_id(auth.uid()) or 
    has_role(auth.uid(), 'super_admin')
);

create policy "Users can insert own profile" on public.profiles for insert
with check (auth.uid() = id);

create policy "Users update own profile or Family Admin manages family profiles" on public.profiles for update
using (
    auth.uid() = id or 
    has_role(auth.uid(), 'family_admin', family_id) or 
    has_role(auth.uid(), 'super_admin')
);

-- User Roles RLS
create policy "Read user roles" on public.user_roles for select
using (
    auth.uid() = user_id or 
    has_role(auth.uid(), 'super_admin') or 
    has_role(auth.uid(), 'family_admin', family_id)
);

create policy "Super admin manage roles" on public.user_roles for all
using (has_role(auth.uid(), 'super_admin'));

-- Weddings RLS
create policy "Read family wedding" on public.weddings for select
using (family_id = get_user_family_id(auth.uid()) or has_role(auth.uid(), 'super_admin'));

create policy "Admin edit family wedding" on public.weddings for update
using (has_role(auth.uid(), 'family_admin', family_id) or has_role(auth.uid(), 'super_admin'));

-- Events RLS
create policy "Read family events" on public.events for select
using (family_id = get_user_family_id(auth.uid()) or has_role(auth.uid(), 'super_admin'));

create policy "Admin manage family events" on public.events for all
using (has_role(auth.uid(), 'family_admin', family_id) or has_role(auth.uid(), 'super_admin'));

-- Gallery Photos RLS
create policy "Read family gallery" on public.gallery_photos for select
using (family_id = get_user_family_id(auth.uid()) or has_role(auth.uid(), 'super_admin'));

create policy "Approved member insert gallery photo" on public.gallery_photos for insert
with check (
    family_id = get_user_family_id(auth.uid()) and
    auth.uid() = user_id and
    exists (select 1 from profiles where id = auth.uid() and status = 'approved')
);

create policy "Owner or Family Admin delete gallery photo" on public.gallery_photos for delete
using (
    auth.uid() = user_id or 
    has_role(auth.uid(), 'family_admin', family_id) or 
    has_role(auth.uid(), 'super_admin')
);

-- Photo Likes RLS
create policy "Read photo likes" on public.photo_likes for select using (true);
create policy "Insert photo likes" on public.photo_likes for insert with check (auth.uid() = user_id);
create policy "Delete own photo like" on public.photo_likes for delete using (auth.uid() = user_id);

-- Photo Comments RLS
create policy "Read photo comments" on public.photo_comments for select using (true);
create policy "Insert photo comments" on public.photo_comments for insert with check (auth.uid() = user_id);
create policy "Delete own or admin photo comments" on public.photo_comments for delete
using (auth.uid() = user_id or has_role(auth.uid(), 'family_admin') or has_role(auth.uid(), 'super_admin'));

-- Wishes RLS
create policy "Read family wishes" on public.wishes for select
using (family_id = get_user_family_id(auth.uid()) or has_role(auth.uid(), 'super_admin'));

create policy "Insert wish" on public.wishes for insert
with check (family_id = get_user_family_id(auth.uid()));

create policy "Admin manage wishes" on public.wishes for update
using (has_role(auth.uid(), 'family_admin', family_id) or has_role(auth.uid(), 'super_admin'));

create policy "Admin delete wishes" on public.wishes for delete
using (has_role(auth.uid(), 'family_admin', family_id) or has_role(auth.uid(), 'super_admin'));

-- Videos RLS
create policy "Read family videos" on public.videos for select
using (family_id = get_user_family_id(auth.uid()) or has_role(auth.uid(), 'super_admin'));

create policy "Admin manage videos" on public.videos for all
using (has_role(auth.uid(), 'family_admin', family_id) or has_role(auth.uid(), 'super_admin'));

-- ----------------------------------------------------------------------------
-- 5. GRANTS & PERMISSIONS
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant select on public.families to anon;
