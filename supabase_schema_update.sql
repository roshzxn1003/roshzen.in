-- ========================================================
-- RoshZen Admin & Portfolio Expansion Schema
-- Database: Supabase PostgreSQL
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CERTIFICATES TABLE (Following Template Structure)
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

-- 2. DYNAMIC PROJECTS TABLE
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

-- 3. CONTACT INQUIRIES TABLE
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

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view active certificates"
  ON public.certificates FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active projects"
  ON public.projects FOR SELECT USING (is_active = true);

CREATE POLICY "Public can submit contact inquiries"
  ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Admin full access on certificates"
  ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on projects"
  ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on contact submissions"
  ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- INITIAL CERTIFICATES SEED
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
