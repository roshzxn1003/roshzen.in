-- ==============================================================================
-- ROSHZEN MASTER SUPABASE SETUP SCRIPT (FOR NEW SUPABASE PROJECT)
-- Copy and run this entire script in your new Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New query -> Paste & Click "Run"
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. LINKS TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. CERTIFICATES TABLE (TEMPLATE-COMPLIANT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_id TEXT,
  about TEXT,
  skills TEXT[] DEFAULT '{}',
  certificate_image TEXT,
  view_url TEXT,
  verify_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. DYNAMIC PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  idea TEXT NOT NULL,
  stack TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  github TEXT,
  live TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. CONTACT INQUIRIES & SUBMISSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ANALYTICS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  event_type TEXT DEFAULT 'click',
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated admin full access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public active links are viewable by everyone" ON public.links;
DROP POLICY IF EXISTS "Authenticated admin full access on links" ON public.links;
DROP POLICY IF EXISTS "Public can view active certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin full access on certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public can view active projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin full access on contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics;
DROP POLICY IF EXISTS "Authenticated admin view analytics" ON public.analytics;

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Public active links are viewable by everyone" 
  ON public.links FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active certificates" 
  ON public.certificates FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active projects" 
  ON public.projects FOR SELECT USING (is_active = true);

CREATE POLICY "Public can submit contact inquiries" 
  ON public.contact_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert analytics" 
  ON public.analytics FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Authenticated admin full access on profiles" 
  ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated admin full access on links" 
  ON public.links FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on certificates" 
  ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on projects" 
  ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on contact submissions" 
  ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated admin view analytics" 
  ON public.analytics FOR SELECT TO authenticated USING (true);

-- ------------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
-- Seed Profile
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

-- Seed Links
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

-- Seed Certificates
INSERT INTO public.certificates (title, issuer, issue_date, credential_id, about, skills, certificate_image, view_url, verify_url, position, is_active, featured)
VALUES 
  (
    'Meta Front-End Developer Specialization',
    'Meta / Coursera',
    'August, 2024',
    'META-FED-88219X',
    'Comprehensive 9-course professional program covering modern React engineering, component architecture, UI/UX design principles, responsive web layouts, and production code testing.',
    ARRAY['React', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'UI/UX Design', 'Version Control'],
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=90',
    'https://www.coursera.org/verify/professional-cert/meta-frontend-developer',
    1,
    true,
    true
  ),
  (
    'Python for Everybody Specialization',
    'University of Michigan',
    'May, 2024',
    'PY4E-91042-UMICH',
    'In-depth specialization focusing on Python programming basics, data structures, networked application interfaces (REST APIs), data scraping, and relational database basics.',
    ARRAY['Python', 'Data Structures', 'REST APIs', 'JSON Parsing', 'Database Basics (SQL)'],
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=90',
    'https://www.coursera.org/verify/specialization/python-for-everybody',
    2,
    true,
    true
  ),
  (
    'Responsive Web Design Certification',
    'freeCodeCamp',
    'December, 2023',
    'FCC-RWD-3011A',
    'Developer certification representing 300 hours of coursework in modern responsive design, accessibility standards (a11y), flexbox layouts, CSS grid systems, and adaptive typography.',
    ARRAY['Responsive Design', 'CSS Grid', 'Flexbox', 'Web Accessibility', 'Modern CSS3'],
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=90',
    'https://www.freecodecamp.org/certification/roshzxn/responsive-web-design',
    3,
    true,
    false
  )
ON CONFLICT DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (title, idea, stack, features, github, live, position, is_active)
VALUES
  (
    'RoshZen Portfolio',
    'My personal red-black cyber-tech portfolio website for presenting skills, projects, services, and learning progress as a developer.',
    ARRAY['React', 'Tailwind CSS', 'Motion'],
    ARRAY['Responsive sections', 'Premium red theme', 'Recruiter-friendly content'],
    'https://github.com/roshzxn1003/portfolio',
    'https://roshzen.in',
    1,
    true
  ),
  (
    'Love Vault',
    'A private couple memories app for saving moments, notes, dates, and emotional digital keepsakes — built with real auth and a clean mobile UI.',
    ARRAY['React', 'Supabase', 'Mobile UI'],
    ARRAY['Private vault concept', 'Memory timeline', 'Secure app structure'],
    'https://github.com/roshzxn1003/zen-love-vault',
    'https://zen-love-vault.lovable.app',
    2,
    true
  ),
  (
    'Zenith — Finance App',
    'A dual-space personal finance app for seamless single vs. shared family expense tracking, built with Flutter and real-time Supabase sync.',
    ARRAY['Flutter', 'Dart', 'Riverpod', 'Supabase'],
    ARRAY['Financial Space Switcher', 'Biometric Auth & Realtime Sync', 'Translucent Anti-Gravity UI'],
    '',
    '',
    3,
    true
  )
ON CONFLICT DO NOTHING;
