import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { fetchProfile } from '../lib/supabaseService'
import {
  getAllLinksAdmin,
  createLink,
  updateLink,
  deleteLink,
  updateProfile,
  getAnalyticsSummary,
} from '../lib/linkService'
import {
  fetchCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
} from '../lib/certificateService'
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../lib/projectService'
import {
  fetchSubmissions,
  markSubmissionRead,
  deleteSubmission,
  clearAllSubmissions,
} from '../lib/submissionService'
import LinkTreePublic from './LinkTreePublic'
import {
  Link as LinkIcon,
  User,
  BarChart3,
  Eye,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  X,
  ExternalLink,
  Loader2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Award,
  FolderGit2,
  Mail,
  Database,
  Search,
  Sparkles,
  Building2,
  Calendar,
  FileCheck,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react'

export default function AdminDashboard({ onLogout }) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('certificates') // default to new requested feature
  const [loading, setLoading] = useState(true)

  // Data states
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [certificates, setCertificates] = useState([])
  const [projects, setProjects] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [analytics, setAnalytics] = useState({ totalClicks: 0, recentClicks: [], linkCounts: {} })

  // Search & filter states
  const [certSearch, setCertSearch] = useState('')
  const [projectSearch, setProjectSearch] = useState('')
  const [inboxFilter, setInboxFilter] = useState('ALL')
  const [inboxSearch, setInboxSearch] = useState('')

  // Link Modal state
  const [editingLink, setEditingLink] = useState(null)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    description: '',
    url: '',
    iconName: 'Globe',
    platform: 'web',
    color: '#ef4444',
    is_active: true,
    position: 0,
  })

  // Certificate Modal state (adopting exact template)
  const [editingCert, setEditingCert] = useState(null)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [certFormData, setCertFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    about: '',
    skills: '',
    certificateImage: '',
    viewUrl: '',
    verifyUrl: '',
    is_active: true,
    featured: false,
    position: 0,
  })

  // Project Modal state
  const [editingProject, setEditingProject] = useState(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    idea: '',
    stack: '',
    features: '',
    github: '',
    live: '',
    is_active: true,
    position: 0,
  })

  // Profile state
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatarUrl: '',
    verified: true,
    theme: 'cyber-dark',
    primaryColor: '#ef4444',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('')

  // Status feedback toast
  const [toastMsg, setToastMsg] = useState('')
  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const [profData, linksData, certsData, projsData, inqData, analyticsData] =
        await Promise.all([
          fetchProfile(),
          getAllLinksAdmin(),
          fetchCertificates(),
          fetchProjects(),
          fetchSubmissions(),
          getAnalyticsSummary(),
        ])

      if (profData) {
        setProfile(profData)
        setProfileFormData({ ...profData })
      }
      if (linksData) setLinks(linksData)
      if (certsData) setCertificates(certsData)
      if (projsData) setProjects(projsData)
      if (inqData) setInquiries(inqData)
      if (analyticsData) setAnalytics(analyticsData)
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------------------------------------
  // CERTIFICATES HANDLERS (TEMPLATE-BASED)
  // -------------------------------------------------------------
  const handleOpenAddCert = () => {
    setEditingCert(null)
    setCertFormData({
      title: '',
      issuer: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      credentialId: '',
      about: '',
      skills: '',
      certificateImage: '',
      viewUrl: '',
      verifyUrl: '',
      is_active: true,
      featured: false,
      position: certificates.length + 1,
    })
    setIsCertModalOpen(true)
  }

  const handleOpenEditCert = (cert) => {
    setEditingCert(cert)
    setCertFormData({
      ...cert,
      skills: Array.isArray(cert.skills) ? cert.skills.join(', ') : cert.skills || '',
    })
    setIsCertModalOpen(true)
  }

  const handleSaveCert = async (e) => {
    e.preventDefault()
    try {
      const skillsArray = certFormData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        ...certFormData,
        skills: skillsArray,
      }

      if (editingCert) {
        await updateCertificate(editingCert.id, payload)
        showToast('Certificate updated successfully!')
      } else {
        await createCertificate(payload)
        showToast('New certificate created!')
      }
      setIsCertModalOpen(false)
      loadDashboardData()
    } catch (err) {
      alert('Error saving certificate: ' + err.message)
    }
  }

  const handleToggleCertActive = async (cert) => {
    try {
      await updateCertificate(cert.id, { is_active: !cert.is_active })
      loadDashboardData()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleDeleteCert = async (id) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    try {
      await deleteCertificate(id)
      showToast('Certificate removed.')
      loadDashboardData()
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  const handleMoveCertPosition = async (index, direction) => {
    const newCerts = [...certificates]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newCerts.length) return

    const temp = newCerts[index]
    newCerts[index] = newCerts[targetIndex]
    newCerts[targetIndex] = temp

    setCertificates(newCerts)
    await reorderCertificates(newCerts)
    loadDashboardData()
  }

  // -------------------------------------------------------------
  // PROJECTS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null)
    setProjectFormData({
      title: '',
      idea: '',
      stack: '',
      features: '',
      github: '',
      live: '',
      is_active: true,
      position: projects.length + 1,
    })
    setIsProjectModalOpen(true)
  }

  const handleOpenEditProject = (project) => {
    setEditingProject(project)
    setProjectFormData({
      ...project,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : project.stack || '',
      features: Array.isArray(project.features) ? project.features.join(', ') : project.features || '',
    })
    setIsProjectModalOpen(true)
  }

  const handleSaveProject = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...projectFormData,
        stack: projectFormData.stack.split(',').map((s) => s.trim()).filter(Boolean),
        features: projectFormData.features.split(',').map((f) => f.trim()).filter(Boolean),
      }

      if (editingProject) {
        await updateProject(editingProject.id, payload)
        showToast('Project updated successfully!')
      } else {
        await createProject(payload)
        showToast('New project created!')
      }
      setIsProjectModalOpen(false)
      loadDashboardData()
    } catch (err) {
      alert('Error saving project: ' + err.message)
    }
  }

  const handleToggleProjectActive = async (project) => {
    try {
      await updateProject(project.id, { is_active: !project.is_active })
      loadDashboardData()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProject(id)
      showToast('Project removed.')
      loadDashboardData()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleMoveProjectPosition = async (index, direction) => {
    const newProjs = [...projects]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newProjs.length) return

    const temp = newProjs[index]
    newProjs[index] = newProjs[targetIndex]
    newProjs[targetIndex] = temp

    setProjects(newProjs)
    await reorderProjects(newProjs)
    loadDashboardData()
  }

  // -------------------------------------------------------------
  // INQUIRIES INBOX HANDLERS
  // -------------------------------------------------------------
  const handleToggleRead = async (id, currentRead) => {
    await markSubmissionRead(id, !currentRead)
    loadDashboardData()
  }

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Delete this message inquiry?')) return
    await deleteSubmission(id)
    loadDashboardData()
  }

  const handleClearAllInquiries = async () => {
    if (!confirm('Clear all inquiries from inbox?')) return
    await clearAllSubmissions()
    loadDashboardData()
  }

  // -------------------------------------------------------------
  // LINKS HANDLERS (ORIGINAL + FIXES)
  // -------------------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingLink(null)
    setLinkFormData({
      title: '',
      description: '',
      url: '',
      iconName: 'Globe',
      platform: 'web',
      color: '#ef4444',
      is_active: true,
      position: links.length + 1,
    })
    setIsLinkModalOpen(true)
  }

  const handleOpenEditModal = (link) => {
    setEditingLink(link)
    setLinkFormData({ ...link })
    setIsLinkModalOpen(true)
  }

  const handleSaveLink = async (e) => {
    e.preventDefault()
    try {
      if (editingLink) {
        await updateLink(editingLink.id, linkFormData)
        showToast('Link updated!')
      } else {
        await createLink(linkFormData)
        showToast('New link added!')
      }
      setIsLinkModalOpen(false)
      loadDashboardData()
    } catch (err) {
      alert('Error saving link: ' + err.message)
    }
  }

  const handleToggleActive = async (link) => {
    try {
      await updateLink(link.id, { is_active: !link.is_active })
      loadDashboardData()
    } catch (err) {
      alert('Error updating status: ' + err.message)
    }
  }

  const handleDeleteLink = async (id) => {
    if (!confirm('Delete this link card?')) return
    try {
      await deleteLink(id)
      loadDashboardData()
    } catch (err) {
      alert('Error deleting link: ' + err.message)
    }
  }

  const handleMovePosition = async (index, direction) => {
    const newLinks = [...links]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newLinks.length) return

    const temp = newLinks[index]
    newLinks[index] = newLinks[targetIndex]
    newLinks[targetIndex] = temp

    setLinks(newLinks)
    try {
      await Promise.all(
        newLinks.map((l, i) => updateLink(l.id, { position: i + 1 }))
      )
    } catch {
      // fallback
    }
    loadDashboardData()
  }

  // -------------------------------------------------------------
  // PROFILE & BACKUP HANDLERS
  // -------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileSuccessMsg('')
    try {
      await updateProfile(profileFormData)
      setProfileSuccessMsg('Profile updated successfully!')
      setTimeout(() => setProfileSuccessMsg(''), 3000)
      loadDashboardData()
    } catch (err) {
      alert('Error updating profile: ' + err.message)
    } finally {
      setProfileSaving(false)
    }
  }

  const handleExportBackup = () => {
    const backupData = {
      profile,
      links,
      certificates,
      projects,
      inquiries,
      exportedAt: new Date().toISOString(),
      system: 'RoshZen Command Center CMS',
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roshzen-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup JSON exported!')
  }

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.certificates) {
          localStorage.setItem('roshzen_certificates', JSON.stringify(data.certificates))
        }
        if (data.projects) {
          localStorage.setItem('roshzen_projects', JSON.stringify(data.projects))
        }
        if (data.inquiries) {
          localStorage.setItem('roshzen_inquiries', JSON.stringify(data.inquiries))
        }
        showToast('Backup restored successfully!')
        loadDashboardData()
      } catch (err) {
        alert('Failed to parse backup JSON: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const handleResetToDefaults = () => {
    if (!confirm('Reset local certificates and projects to factory defaults?')) return
    localStorage.removeItem('roshzen_certificates')
    localStorage.removeItem('roshzen_projects')
    localStorage.removeItem('roshzen_inquiries')
    showToast('Reset to defaults.')
    loadDashboardData()
  }

  const handleLogout = async () => {
    await logout()
    onLogout?.()
  }

  const unreadInquiriesCount = inquiries.filter((i) => !i.isRead).length

  if (loading && !profile && certificates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 selection:bg-red-500 selection:text-white relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Status Notification Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-black/90 border border-red-500/40 text-xs font-mono text-white shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-red-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#050508]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-mono font-bold">
            ⚡
          </div>
          <div>
            <h1 className="text-base font-bold font-mono text-white flex items-center gap-2">
              RoshZen Command Center
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Admin CMS Active
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {user?.email || 'admin@roshzen.in'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/#certificates"
            className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-red-400" />
            <span>View Portfolio</span>
          </a>
          <a
            href="/#links"
            className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Link Hub</span>
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-400 hover:text-red-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'certificates'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'projects'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'links'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Links ({links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 relative ${
              activeTab === 'inbox'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries</span>
            {unreadInquiriesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-400 text-black text-[10px] font-bold">
                {unreadInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'backup'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup & Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 px-3.5 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'preview'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Hub</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 relative z-10">
        {/* ============================================================== */}
        {/* 1. CERTIFICATES TAB (TEMPLATE IMPLEMENTATION) */}
        {/* ============================================================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <span>🏆</span> Certificates & Accreditations Manager
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage verified credentials, specializations, skills tags, and preview links.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    placeholder="Filter certificates..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder:text-slate-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleOpenAddCert}
                  className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certificate</span>
                </button>
              </div>
            </div>

            {/* Certificates List */}
            <div className="space-y-4">
              {certificates
                .filter(
                  (c) =>
                    !certSearch ||
                    c.title.toLowerCase().includes(certSearch.toLowerCase()) ||
                    c.issuer.toLowerCase().includes(certSearch.toLowerCase()) ||
                    (c.skills &&
                      c.skills.some((s) => s.toLowerCase().includes(certSearch.toLowerCase())))
                )
                .map((cert, index) => (
                  <div
                    key={cert.id}
                    className={`p-5 rounded-3xl border backdrop-blur-xl transition flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                      cert.is_active
                        ? 'bg-white/[0.03] border-white/10 hover:border-red-500/30'
                        : 'bg-black/40 border-white/5 opacity-60'
                    }`}
                  >
                    {/* Left details adhering to the template */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => handleMoveCertPosition(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveCertPosition(index, 'down')}
                          disabled={index === certificates.length - 1}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Certificate Thumbnail Preview */}
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative flex items-center justify-center">
                        {cert.certificateImage ? (
                          <img
                            src={cert.certificateImage}
                            alt={cert.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🏆</span>
                        )}
                      </div>

                      {/* Content representation of the template */}
                      <div className="min-w-0 space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold font-mono text-white truncate">
                            🏆 {cert.title}
                          </span>
                          {cert.featured && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          {!cert.is_active && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Hidden
                            </span>
                          )}
                        </div>

                        {/* Metadata row */}
                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-red-400" />
                            <strong className="text-slate-300">Issued by:</strong> {cert.issuer}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-red-400" />
                            <strong className="text-slate-300">Date:</strong> {cert.date}
                          </span>
                          {cert.credentialId && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FileCheck className="w-3 h-3 text-red-400" />
                                <strong className="text-slate-300">ID:</strong> {cert.credentialId}
                              </span>
                            </>
                          )}
                        </div>

                        {/* About snippet */}
                        {cert.about && (
                          <p className="text-xs text-slate-400 font-mono line-clamp-1">
                            {cert.about}
                          </p>
                        )}

                        {/* Skills pills */}
                        {cert.skills && cert.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {cert.skills.slice(0, 5).map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300"
                              >
                                {s}
                              </span>
                            ))}
                            {cert.skills.length > 5 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                +{cert.skills.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {(cert.viewUrl || cert.certificateImage) && (
                        <a
                          href={cert.viewUrl || cert.certificateImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                          title="View Certificate Document in new tab"
                        >
                          <Eye className="w-4 h-4 text-red-400" />
                        </a>
                      )}

                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
                          title="Test Verification Link"
                        >
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                        </a>
                      )}

                      <button
                        onClick={() => handleToggleCertActive(cert)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs transition border cursor-pointer ${
                          cert.is_active
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {cert.is_active ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => handleOpenEditCert(cert)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                        title="Edit Certificate"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 cursor-pointer"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. DYNAMIC PROJECTS TAB */}
        {/* ============================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-red-500" /> Dynamic Portfolio Projects
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Add, modify, reorder, or toggle projects featured in the main portfolio.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder:text-slate-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleOpenAddProject}
                  className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {projects
                .filter(
                  (p) =>
                    !projectSearch ||
                    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                    p.idea.toLowerCase().includes(projectSearch.toLowerCase())
                )
                .map((proj, index) => (
                  <div
                    key={proj.id}
                    className={`p-5 rounded-2xl border backdrop-blur-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      proj.is_active
                        ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                        : 'bg-black/40 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => handleMoveProjectPosition(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveProjectPosition(index, 'down')}
                          disabled={index === projects.length - 1}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="min-w-0 space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm font-mono text-white truncate">
                            {proj.title}
                          </span>
                          {!proj.is_active && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Hidden
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 font-mono line-clamp-2">{proj.idea}</p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.stack?.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleToggleProjectActive(proj)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition border cursor-pointer ${
                          proj.is_active
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {proj.is_active ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. INQUIRIES / CONTACT INBOX TAB */}
        {/* ============================================================== */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-500" /> Contact Inquiries Inbox
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Messages and collaboration requests submitted through your portfolio contact form.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadDashboardData}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
                  title="Refresh Inquiries"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {inquiries.length > 0 && (
                  <button
                    onClick={handleClearAllInquiries}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-mono cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {['ALL', 'UNREAD', 'Portfolio website', 'React app ideas'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setInboxFilter(f)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition border cursor-pointer ${
                      inboxFilter === f
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder:text-slate-600 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Inquiries Messages */}
            <div className="space-y-3">
              {inquiries
                .filter((item) => {
                  if (inboxFilter === 'UNREAD') return !item.isRead
                  if (inboxFilter !== 'ALL') return item.projectType === inboxFilter
                  return true
                })
                .filter(
                  (item) =>
                    !inboxSearch ||
                    item.name.toLowerCase().includes(inboxSearch.toLowerCase()) ||
                    item.email.toLowerCase().includes(inboxSearch.toLowerCase()) ||
                    item.message.toLowerCase().includes(inboxSearch.toLowerCase())
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-3xl border backdrop-blur-xl space-y-3 transition ${
                      !msg.isRead
                        ? 'bg-red-950/15 border-red-500/30'
                        : 'bg-white/[0.02] border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        {!msg.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                        )}
                        <div>
                          <span className="font-bold text-sm text-white font-mono">{msg.name}</span>
                          <span className="text-xs text-slate-400 font-mono ml-2">
                            &lt;{msg.email}&gt;
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
                          {msg.projectType}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(msg.receivedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `Regarding your inquiry: ${msg.projectType}`
                        )}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(msg.id, msg.isRead)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                        >
                          {msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        </button>

                        <button
                          onClick={() => handleDeleteInquiry(msg.id)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {inquiries.length === 0 && (
                <div className="p-12 text-center rounded-3xl border border-white/10 bg-white/[0.01]">
                  <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-mono text-slate-400">No contact inquiries yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. DYNAMIC LINKS TAB (ORIGINAL + ENHANCED) */}
        {/* ============================================================== */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-mono text-white">Dynamic Link Cards</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Add, edit, reorder, or toggle visibility of active cards.
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Link Card</span>
              </button>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={link.id}
                  className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    link.is_active
                      ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      : 'bg-black/40 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMovePosition(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMovePosition(index, 'down')}
                        disabled={index === links.length - 1}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 font-bold text-xs"
                      style={{ color: link.color || '#ef4444' }}
                    >
                      {link.iconName?.substring(0, 2) || 'LK'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{link.title}</span>
                        {!link.is_active && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{link.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleActive(link)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition border cursor-pointer ${
                        link.is_active
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {link.is_active ? 'Active' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(link)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                      title="Edit Link"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 cursor-pointer"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. PROFILE & BRAND CUSTOMIZATION */}
        {/* ============================================================== */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold font-mono text-white">Profile & Brand Customization</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Customize profile picture, bio, displayed name, and system brand options.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form
              onSubmit={handleSaveProfile}
              className="space-y-4 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
            >
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                  Brand Username / Tagline
                </label>
                <input
                  type="text"
                  required
                  value={profileFormData.username}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                  Bio / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={profileFormData.avatarUrl}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, avatarUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full mt-6 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                {profileSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. ANALYTICS TAB */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold font-mono text-white">System Analytics & Engagement</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Track link clicks, active cards, and visitor stats.
                </p>
              </div>
              <button
                onClick={loadDashboardData}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
                title="Refresh Analytics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Total Link Clicks
                </span>
                <p className="text-4xl font-extrabold font-mono text-white mt-2">
                  {analytics.totalClicks}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Certifications
                </span>
                <p className="text-4xl font-extrabold font-mono text-red-400 mt-2">
                  {certificates.length}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Projects Live
                </span>
                <p className="text-4xl font-extrabold font-mono text-amber-400 mt-2">
                  {projects.filter((p) => p.is_active).length}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Inquiries
                </span>
                <p className="text-4xl font-extrabold font-mono text-emerald-400 mt-2">
                  {inquiries.length}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold font-mono text-white">Click Distribution per Link</h3>
              <div className="space-y-3">
                {links.map((link) => {
                  const count = analytics.linkCounts[link.id] || 0
                  const pct =
                    analytics.totalClicks > 0
                      ? ((count / analytics.totalClicks) * 100).toFixed(0)
                      : 0
                  return (
                    <div key={link.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{link.title}</span>
                        <span className="text-slate-400">
                          {count} clicks ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. BACKUP & DATABASE TOOLS TAB */}
        {/* ============================================================== */}
        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-red-500" /> Data Backup & System Tools
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Backup, restore, and maintain your links, certificates, projects, and messages.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6">
              {/* One-click Export */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div>
                  <h4 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-red-400" />
                    Export Complete JSON Backup
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Download all certificates, projects, links, and profile settings in a single JSON file.
                  </p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Export Backup
                </button>
              </div>

              {/* Import Restore */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div>
                  <h4 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    Restore from JSON File
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Upload a previously exported backup file to restore all content.
                  </p>
                </div>
                <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer inline-flex items-center gap-2">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Factory Reset */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                <div>
                  <h4 className="text-sm font-bold font-mono text-red-300 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-red-400" />
                    Reset to Default Seeds
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Restores initial default certificates, projects, and sample inquiries.
                  </p>
                </div>
                <button
                  onClick={handleResetToDefaults}
                  className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-mono font-bold cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. LIVE HUB PREVIEW TAB */}
        {/* ============================================================== */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-mono text-white">Live Link Hub Preview</h2>
              <span className="text-xs font-mono text-slate-400">Interactive Client View</span>
            </div>

            <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <LinkTreePublic />
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT CERTIFICATE (FAITHFUL TO USER TEMPLATE) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isCertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl p-6 rounded-3xl bg-[#0a0a0f] border border-white/15 shadow-2xl relative my-8"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>🏆</span>
                  <span>{editingCert ? 'Edit Certificate' : 'Add New Certificate'}</span>
                </h3>
                <button
                  onClick={() => setIsCertModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCert} className="space-y-4">
                {/* 🏆 Certificate Name */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    🏆 Certificate Name
                  </label>
                  <input
                    type="text"
                    required
                    value={certFormData.title}
                    onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                    placeholder="e.g. Meta Front-End Developer Specialization"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Issued by & Date & Credential ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      Issued by
                    </label>
                    <input
                      type="text"
                      required
                      value={certFormData.issuer}
                      onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                      placeholder="e.g. Meta / Coursera"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={certFormData.date}
                      onChange={(e) => setCertFormData({ ...certFormData, date: e.target.value })}
                      placeholder="e.g. August, 2024"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={certFormData.credentialId}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, credentialId: e.target.value })
                      }
                      placeholder="e.g. META-FED-88219"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* About the Certificate */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    About the Certificate (1–2 sentences)
                  </label>
                  <textarea
                    rows={2}
                    value={certFormData.about}
                    onChange={(e) => setCertFormData({ ...certFormData, about: e.target.value })}
                    placeholder="Describe what the certificate represents and what you learned or completed..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Skills Covered */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Skills Covered (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={certFormData.skills}
                    onChange={(e) => setCertFormData({ ...certFormData, skills: e.target.value })}
                    placeholder="e.g. React, JavaScript, HTML5, UI/UX Design, Git"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Certificate Image / PDF Preview URL */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Certificate Image / PDF Preview URL
                  </label>
                  <input
                    type="url"
                    value={certFormData.certificateImage}
                    onChange={(e) =>
                      setCertFormData({ ...certFormData, certificateImage: e.target.value })
                    }
                    placeholder="https://example.com/certificate-preview.png"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* View Certificate & Verify Credential URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      [View Certificate] Link
                    </label>
                    <input
                      type="url"
                      value={certFormData.viewUrl}
                      onChange={(e) => setCertFormData({ ...certFormData, viewUrl: e.target.value })}
                      placeholder="https://... (or image URL)"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      [Verify Credential] Link
                    </label>
                    <input
                      type="url"
                      value={certFormData.verifyUrl}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, verifyUrl: e.target.value })
                      }
                      placeholder="https://coursera.org/verify/..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkboxes: Active & Featured */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="cert_active_cb"
                      checked={certFormData.is_active}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, is_active: e.target.checked })
                      }
                      className="rounded border-white/10 text-red-600 focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor="cert_active_cb"
                      className="text-xs font-mono text-slate-300 cursor-pointer"
                    >
                      Active (Visible on Portfolio)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="cert_featured_cb"
                      checked={certFormData.featured}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, featured: e.target.checked })
                      }
                      className="rounded border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor="cert_featured_cb"
                      className="text-xs font-mono text-amber-300 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Featured Credential
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Save Certificate
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl p-6 rounded-3xl bg-[#0a0a0f] border border-white/15 shadow-2xl relative my-8"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-red-500" />
                  <span>{editingProject ? 'Edit Portfolio Project' : 'Add New Project'}</span>
                </h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={projectFormData.title}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, title: e.target.value })
                    }
                    placeholder="e.g. RoshZen LinkHub"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Project Idea / Summary
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projectFormData.idea}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, idea: e.target.value })
                    }
                    placeholder="Brief description of the build..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projectFormData.stack}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, stack: e.target.value })
                    }
                    placeholder="React, Tailwind CSS, Motion, Supabase"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Key Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projectFormData.features}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, features: e.target.value })
                    }
                    placeholder="Responsive sections, Cyberpunk red theme, Admin CMS"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={projectFormData.github}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, github: e.target.value })
                      }
                      placeholder="https://github.com/roshzxn1003/..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={projectFormData.live}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, live: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="proj_active_cb"
                    checked={projectFormData.is_active}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, is_active: e.target.checked })
                    }
                    className="rounded border-white/10 text-red-600 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="proj_active_cb"
                    className="text-xs font-mono text-slate-300 cursor-pointer"
                  >
                    Active (Show in portfolio Projects section)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Save Project
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT LINK */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isLinkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#0a0a0f] border border-white/15 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-mono text-white">
                  {editingLink ? 'Edit Link Card' : 'Add New Link Card'}
                </h3>
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLink} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={linkFormData.title}
                    onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                    placeholder="e.g. GitHub Repositories"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase">
                    Description
                  </label>
                  <input
                    type="text"
                    value={linkFormData.description}
                    onChange={(e) =>
                      setLinkFormData({ ...linkFormData, description: e.target.value })
                    }
                    placeholder="e.g. Open source code and projects"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase">URL</label>
                  <input
                    type="url"
                    required
                    value={linkFormData.url}
                    onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                    placeholder="https://github.com/roshzxn1003"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      value={linkFormData.iconName}
                      onChange={(e) =>
                        setLinkFormData({ ...linkFormData, iconName: e.target.value })
                      }
                      placeholder="Github, Globe, Mail..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={linkFormData.color}
                      onChange={(e) => setLinkFormData({ ...linkFormData, color: e.target.value })}
                      className="w-full h-9 p-1 rounded-xl bg-black/40 border border-white/10 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active_cb_root"
                    checked={linkFormData.is_active}
                    onChange={(e) =>
                      setLinkFormData({ ...linkFormData, is_active: e.target.checked })
                    }
                    className="rounded border-white/10 text-red-600 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="is_active_cb_root"
                    className="text-xs font-mono text-slate-300 cursor-pointer"
                  >
                    Active (visible on public link hub)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Save Link Card
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
