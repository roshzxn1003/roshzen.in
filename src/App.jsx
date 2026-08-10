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

function App() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050505] text-slate-100">
      <Preloader />
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
      <div className="relative z-10">
        <Navbar />
        <Hero heroStats={heroStats} techBadges={techBadges} />
        <About highlights={profileHighlights} principles={designPrinciples} />
        <Skills skillGroups={skillGroups} />
        <Projects projects={projects} />
        <Journey journey={journey} />
        <Services services={services} />
        <Contact socialLinks={socialLinks} />
        <Footer socialLinks={socialLinks} />
      </div>
    </main>
  )
}

export default App