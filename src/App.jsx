import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Project'
import Journey from './components/Journey'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ScrollIndicator from './components/ScrollIndicator'
import BackToTop from './components/BackToTop'
import Preloader from './components/Preloader'
import MouseSpotlight from './components/MouseSpotlight'

import { AuthProvider } from './private-links/context/AuthContext'
import LinkTreePublic from './private-links/components/LinkTreePublic'
import AdminDashboard from './private-links/components/AdminDashboard'
import Login from './private-links/components/Login'
import ProtectedRoute from './private-links/components/ProtectedRoute'
import { applyPortfolioTheme, getStoredTheme } from './utils/portfolioTheme'

import {
  designPrinciples,
  heroStats,
  journey,
  profileHighlights,
  projects,
  services,
  skillGroups,
  socialLinks,
  techBadges,
} from './data/portfolio'
import './App.css'

function PortfolioMainContent() {
  return (
    <>
      <Navbar />
      <Hero heroStats={heroStats} techBadges={techBadges} />
      <About highlights={profileHighlights} principles={designPrinciples} />
      <Skills skillGroups={skillGroups} />
      <Projects projects={projects} />
      <Journey journey={journey} />
      <Services services={services} />
      <Contact socialLinks={socialLinks} />
      <Footer socialLinks={socialLinks} />
    </>
  )
}

function App() {
  const [routeMode, setRouteMode] = useState('portfolio') // 'portfolio', 'links', 'admin', 'login'

  useEffect(() => {
    function handleRouteCheck() {
      const hash = window.location.hash
      const path = window.location.pathname

      if (hash === '#links' || path === '/links' || path === '/private-links') {
        setRouteMode('links')
      } else if (hash === '#admin' || path === '/admin' || path === '/private-links/admin') {
        setRouteMode('admin')
      } else if (hash === '#login' || path === '/login' || path === '/private-links/login') {
        setRouteMode('login')
      } else {
        setRouteMode('portfolio')
      }
    }

    applyPortfolioTheme(getStoredTheme())
    handleRouteCheck()
    window.addEventListener('hashchange', handleRouteCheck)
    window.addEventListener('popstate', handleRouteCheck)

    return () => {
      window.removeEventListener('hashchange', handleRouteCheck)
      window.removeEventListener('popstate', handleRouteCheck)
    }
  }, [])

  return (
    <AuthProvider>
      <main className="relative isolate min-h-screen overflow-hidden bg-[#050505] text-slate-100">
        {routeMode === 'portfolio' && <Preloader />}

        <div className="app-background" aria-hidden="true">
          <div className="site-backdrop" />
          <div className="tech-grid" />
          <div className="binary-field">
            <span>01001100 10110010 00110101 11001010</span>
            <span>10100101 01101001 11010011 00011100</span>
            <span>00111010 11100100 01010111 10010001</span>
            <span>11001001 00010111 10110100 01101010</span>
            <span>01110100 10011011 01001010 11100001</span>
            <span>10010110 01100101 00101110 11010100</span>
          </div>
          <div className="scanline" />
        </div>

        <CustomCursor />
        <ScrollIndicator />
        <BackToTop />
        <MouseSpotlight />

        {/* Secret / Private Routing Switch */}
        <div className="relative z-10">
          {routeMode === 'links' && <LinkTreePublic />}

          {routeMode === 'login' && (
            <Login onLoginSuccess={() => setRouteMode('admin')} />
          )}

          {routeMode === 'admin' && (
            <ProtectedRoute onRedirectToLogin={() => setRouteMode('login')}>
              <AdminDashboard onLogout={() => setRouteMode('links')} />
            </ProtectedRoute>
          )}

          {routeMode === 'portfolio' && <PortfolioMainContent />}
        </div>
      </main>
    </AuthProvider>
  )
}

export default App