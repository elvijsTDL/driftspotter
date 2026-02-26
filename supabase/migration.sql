-- ============================================================
-- DriftSpotter Database Schema
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  car text,
  car_year text,
  mods text,
  skill_level text check (skill_level in ('beginner','intermediate','advanced')),
  instagram text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Forum Categories
create table public.forum_categories (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  color text not null,
  sort_order int default 0,
  created_at timestamptz default now() not null
);

alter table public.forum_categories enable row level security;
create policy "Categories are viewable by everyone" on public.forum_categories for select using (true);

-- Seed categories
insert into public.forum_categories (id, name, description, icon, color, sort_order) values
  ('general', 'General Discussion', 'Chat about anything drift-related', 'message-circle', '#FF6B00', 0),
  ('reviews', 'Event Reviews & Reports', 'Share your event experiences and reviews', 'star', '#FFD700', 1),
  ('builds', 'Car Builds & Setup', 'Build threads, setup advice, and tech talk', 'wrench', '#00D4FF', 2),
  ('tires', 'Tire Talk', 'Tire recommendations, reviews, and sizing', 'circle', '#22C55E', 3),
  ('beginners', 'Beginners Corner', 'New to drifting? Start here. No question is too basic', 'graduation-cap', '#A855F7', 4),
  ('marketplace', 'Marketplace', 'Buy, sell, and trade parts, cars, and gear', 'shopping-bag', '#EF4444', 5);

-- 3. Forum Threads
create table public.forum_threads (
  id uuid default gen_random_uuid() primary key,
  category_id text references public.forum_categories(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  tag text not null default 'Discussion',
  pinned boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.forum_threads enable row level security;
create policy "Threads are viewable by everyone" on public.forum_threads for select using (true);
create policy "Authenticated users can create threads" on public.forum_threads for insert with check (auth.uid() = author_id);
create policy "Users can update own threads" on public.forum_threads for update using (auth.uid() = author_id);
create policy "Users can delete own threads" on public.forum_threads for delete using (auth.uid() = author_id);

create index idx_threads_category on public.forum_threads(category_id);
create index idx_threads_author on public.forum_threads(author_id);
create index idx_threads_created on public.forum_threads(created_at desc);

-- 4. Forum Replies
create table public.forum_replies (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references public.forum_threads(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  parent_reply_id uuid references public.forum_replies(id) on delete cascade,
  body text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.forum_replies enable row level security;
create policy "Replies are viewable by everyone" on public.forum_replies for select using (true);
create policy "Authenticated users can create replies" on public.forum_replies for insert with check (auth.uid() = author_id);
create policy "Users can update own replies" on public.forum_replies for update using (auth.uid() = author_id);
create policy "Users can delete own replies" on public.forum_replies for delete using (auth.uid() = author_id);

create index idx_replies_thread on public.forum_replies(thread_id);

-- 5. Likes (polymorphic: thread or reply)
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  thread_id uuid references public.forum_threads(id) on delete cascade,
  reply_id uuid references public.forum_replies(id) on delete cascade,
  created_at timestamptz default now() not null,
  constraint likes_target_check check (
    (thread_id is not null and reply_id is null) or
    (thread_id is null and reply_id is not null)
  ),
  constraint likes_unique_thread unique (user_id, thread_id),
  constraint likes_unique_reply unique (user_id, reply_id)
);

alter table public.likes enable row level security;
create policy "Likes are viewable by everyone" on public.likes for select using (true);
create policy "Authenticated users can like" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.likes for delete using (auth.uid() = user_id);

-- 6. Event Comments
create table public.event_comments (
  id uuid default gen_random_uuid() primary key,
  event_id text not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  parent_comment_id uuid references public.event_comments(id) on delete cascade,
  body text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.event_comments enable row level security;
create policy "Event comments are viewable by everyone" on public.event_comments for select using (true);
create policy "Authenticated users can comment" on public.event_comments for insert with check (auth.uid() = author_id);
create policy "Users can update own comments" on public.event_comments for update using (auth.uid() = author_id);
create policy "Users can delete own comments" on public.event_comments for delete using (auth.uid() = author_id);

create index idx_event_comments_event on public.event_comments(event_id);

-- 7. Event Comment Likes
create table public.event_comment_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  comment_id uuid references public.event_comments(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint event_comment_likes_unique unique (user_id, comment_id)
);

alter table public.event_comment_likes enable row level security;
create policy "Event comment likes are viewable by everyone" on public.event_comment_likes for select using (true);
create policy "Authenticated users can like comments" on public.event_comment_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike comments" on public.event_comment_likes for delete using (auth.uid() = user_id);

-- 8. Event RSVPs
create table public.event_rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('going', 'interested')),
  created_at timestamptz default now() not null,
  constraint event_rsvps_unique unique (user_id, event_id)
);

alter table public.event_rsvps enable row level security;
create policy "RSVPs are viewable by everyone" on public.event_rsvps for select using (true);
create policy "Authenticated users can RSVP" on public.event_rsvps for insert with check (auth.uid() = user_id);
create policy "Users can update own RSVP" on public.event_rsvps for update using (auth.uid() = user_id);
create policy "Users can delete own RSVP" on public.event_rsvps for delete using (auth.uid() = user_id);

-- 9. Notifications
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('reply','like','mention','event','system')),
  title text not null,
  body text not null,
  link text,
  read boolean default false,
  created_at timestamptz default now() not null
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (true);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

create index idx_notifications_user on public.notifications(user_id, read, created_at desc);

-- 10. Push Subscriptions
create table public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz default now() not null,
  constraint push_subscriptions_unique unique (user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;
create policy "Users can view own push subs" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy "Users can insert own push subs" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can delete own push subs" on public.push_subscriptions for delete using (auth.uid() = user_id);

-- 11. Email Preferences
create table public.email_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  reply_notifications boolean default true,
  like_notifications boolean default true,
  weekly_digest boolean default true,
  event_reminders boolean default true,
  created_at timestamptz default now() not null
);

alter table public.email_preferences enable row level security;
create policy "Users can view own email prefs" on public.email_preferences for select using (auth.uid() = user_id);
create policy "Users can update own email prefs" on public.email_preferences for update using (auth.uid() = user_id);
create policy "Users can insert own email prefs" on public.email_preferences for insert with check (auth.uid() = user_id);

-- Auto-create email prefs on profile creation
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.email_preferences (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- 12. Submitted Events
create table public.submitted_events (
  id uuid default gen_random_uuid() primary key,
  submitted_by uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  date date not null,
  end_date date,
  location text not null,
  category text not null,
  cage_required boolean default false,
  tire_size text default 'unlimited',
  skill_level text default 'all',
  participation text default 'both',
  description text default '',
  event_url text,
  organizer text not null,
  contact_email text not null,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now() not null
);

alter table public.submitted_events enable row level security;
create policy "Users can view own submitted events" on public.submitted_events for select using (auth.uid() = submitted_by);
create policy "Authenticated users can submit events" on public.submitted_events for insert with check (auth.uid() = submitted_by);

-- ============================================================
-- Notification Triggers
-- ============================================================

-- Notify thread author on new reply
create or replace function public.notify_thread_reply()
returns trigger as $$
declare
  thread_author_id uuid;
  thread_title text;
  reply_author_name text;
  parent_author_id uuid;
begin
  -- Get thread info
  select author_id, title into thread_author_id, thread_title
  from public.forum_threads where id = new.thread_id;

  -- Get reply author name
  select username into reply_author_name
  from public.profiles where id = new.author_id;

  -- Notify thread author (skip self)
  if thread_author_id != new.author_id then
    insert into public.notifications (user_id, type, title, body, link)
    values (
      thread_author_id,
      'reply',
      'New reply to your thread',
      reply_author_name || ' replied to "' || left(thread_title, 50) || '"',
      '/forum/' || new.thread_id
    );
  end if;

  -- If nested reply, also notify parent reply author
  if new.parent_reply_id is not null then
    select author_id into parent_author_id
    from public.forum_replies where id = new.parent_reply_id;

    if parent_author_id is distinct from new.author_id
       and parent_author_id is distinct from thread_author_id then
      insert into public.notifications (user_id, type, title, body, link)
      values (
        parent_author_id,
        'reply',
        'New reply to your comment',
        reply_author_name || ' replied to your comment in "' || left(thread_title, 50) || '"',
        '/forum/' || new.thread_id
      );
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_forum_reply_created
  after insert on public.forum_replies
  for each row execute function public.notify_thread_reply();

-- Notify on like
create or replace function public.notify_like()
returns trigger as $$
declare
  target_author_id uuid;
  liker_name text;
  target_title text;
  target_thread_id uuid;
begin
  select username into liker_name from public.profiles where id = new.user_id;

  if new.thread_id is not null then
    select author_id, title, id into target_author_id, target_title, target_thread_id
    from public.forum_threads where id = new.thread_id;

    if target_author_id != new.user_id then
      insert into public.notifications (user_id, type, title, body, link)
      values (
        target_author_id,
        'like',
        'Someone liked your thread',
        liker_name || ' liked "' || left(target_title, 50) || '"',
        '/forum/' || target_thread_id
      );
    end if;
  elsif new.reply_id is not null then
    select r.author_id, t.title, r.thread_id
    into target_author_id, target_title, target_thread_id
    from public.forum_replies r
    join public.forum_threads t on t.id = r.thread_id
    where r.id = new.reply_id;

    if target_author_id != new.user_id then
      insert into public.notifications (user_id, type, title, body, link)
      values (
        target_author_id,
        'like',
        'Someone liked your reply',
        liker_name || ' liked your reply in "' || left(target_title, 50) || '"',
        '/forum/' || target_thread_id
      );
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_like_created
  after insert on public.likes
  for each row execute function public.notify_like();

-- ============================================================
-- Enable Realtime
-- ============================================================
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.forum_threads;
alter publication supabase_realtime add table public.forum_replies;
