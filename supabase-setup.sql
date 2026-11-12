-- Run this in Supabase SQL Editor.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.enquiries (
  id bigint generated always as identity primary key,
  name text not null,
  contact text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  image_url text not null,
  storage_path text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
alter table public.enquiries enable row level security;
alter table public.gallery_items enable row level security;
create policy "Public can send enquiries" on public.enquiries for insert to anon, authenticated with check (true);
create policy "Admins can read enquiries" on public.enquiries for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Public can read published gallery" on public.gallery_items for select to anon, authenticated using (published=true);
create policy "Admins can read all gallery" on public.gallery_items for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins can add gallery" on public.gallery_items for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins can update gallery" on public.gallery_items for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins can delete gallery" on public.gallery_items for delete to authenticated using (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create or replace function public.is_idera_admin()
returns boolean language sql security definer set search_path=public
as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()); $$;
revoke all on function public.is_idera_admin() from public;
grant execute on function public.is_idera_admin() to authenticated;
-- Storage bucket for public display of published photos. Upload/change/delete remain admin-only.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('idera-gallery','idera-gallery',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Admins can upload IDERA gallery images" on storage.objects for insert to authenticated
with check (bucket_id='idera-gallery' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins can update IDERA gallery images" on storage.objects for update to authenticated
using (bucket_id='idera-gallery' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins can delete IDERA gallery images" on storage.objects for delete to authenticated
using (bucket_id='idera-gallery' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
