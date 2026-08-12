-- ========================================================
-- RoshZen Private LinkHub Supabase PostgreSQL Schema
-- Database: Supabase PostgreSQL
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Arun Roshan',
  username TEXT NOT NULL DEFAULT 'RoshZen ⚡',
  bio TEXT DEFAULT 'Developer • CSE Student • Builder • Tech Enthusiast',
  avatar_url TEXT DEFAULT 'https://github.com/roshzxn1003.png',
  verified BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'cyber-dark',
  primary_color TEXT DEFAULT '#ef4444',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LINKS TABLE
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'Globe',
  platform TEXT DEFAULT 'web',
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  color TEXT DEFAULT '#ef4444',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  event_type TEXT DEFAULT 'click',
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read for Active Links
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Public active links are viewable by everyone" 
  ON public.links FOR SELECT USING (is_active = true);

-- Authenticated Users Full Control (Admin)
CREATE POLICY "Authenticated admin full access on profiles" 
  ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated admin full access on links" 
  ON public.links FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public insert analytics" 
  ON public.analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated admin view analytics" 
  ON public.analytics FOR SELECT TO authenticated USING (true);

-- SEED INITIAL PROFILE & LINKS DATA
INSERT INTO public.profiles (name, username, bio, avatar_url, verified, theme, primary_color)
VALUES (
  'Arun Roshan',
  'RoshZen ⚡',
  'Developer • CSE Student • Builder • Tech Enthusiast',
  'https://github.com/roshzxn1003.png',
  true,
  'cyber-dark',
  '#ef4444'
) ON CONFLICT DO NOTHING;

INSERT INTO public.links (title, description, url, icon, platform, position, is_active, color)
VALUES 
  ('Portfolio Website', 'Explore my main personal portfolio & interactive projects', 'https://www.roshzen.in', 'Globe', 'web', 1, true, '#ef4444'),
  ('GitHub Repositories', 'Open source code, tools, and developer experiments', 'https://github.com/roshzxn1003', 'Github', 'github', 2, true, '#f8fafc'),
  ('LinkedIn Network', 'Connect with me professionally & read my updates', 'https://www.linkedin.com/in/arun-roshan-gj/', 'Linkedin', 'linkedin', 3, true, '#38bdf8'),
  ('YouTube Channel', 'Coding tutorials, tech walkthroughs & project demos', 'https://www.youtube.com/@roshzxn', 'Youtube', 'youtube', 4, true, '#f43f5e'),
  ('Instagram', 'Behind the scenes, dev setup, and daily tech life', 'https://instagram.com/rosh.zxn', 'Instagram', 'instagram', 5, true, '#ec4899'),
  ('Download Resume (PDF)', 'View my full academic background & technical experience', 'https://www.roshzen.in/AR-resume.pdf', 'FileText', 'document', 6, true, '#a855f7'),
  ('Direct Email', 'Get in touch for collaborations, projects & inquiries', 'mailto:arunroshan1003@gmail.com', 'Mail', 'email', 7, true, '#10b981')
ON CONFLICT DO NOTHING;
