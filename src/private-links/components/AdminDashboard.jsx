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
} from 'lucide-react'

export default function AdminDashboard({ onLogout }) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('links')
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [analytics, setAnalytics] = useState({ totalClicks: 0, recentClicks: [], linkCounts: {} })
  const [loading, setLoading] = useState(true)

  const [editingLink, setEditingLink] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const [profData, linksData, analyticsData] = await Promise.all([
        fetchProfile(),
        getAllLinksAdmin(),
        getAnalyticsSummary(),
      ])

      if (profData) {
        setProfile(profData)
        setProfileFormData({ ...profData })
      }
      if (linksData) setLinks(linksData)
      if (analyticsData) setAnalytics(analyticsData)
    } catch {
      // Fallback
    } fontally: {
      setLoading(false)
    }
  }

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
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (link) => {
    setEditingLink(link)
    setLinkFormData({ ...link })
    setIsModalOpen(true)
  }

  const handleSaveLink = async (e) => {
    e.preventDefault()
    try {
      if (editingLink) {
        await updateLink(editingLink.id, linkFormData)
      } else {
        await createLink(linkFormData)
      }
      setIsModalOpen(false)
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
      loadDashboardData()
    }
  }

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

  const handleLogout = async () => {
    await logout()
    onLogout?.()
  }

  if (loading && !profile) {
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

      <header className="sticky top-0 z-40 bg-[#050508]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-mono font-bold">
            ⚡
          </div>
          <div>
            <h1 className="text-base font-bold font-mono text-white flex items-center gap-2">
              RoshZen Command Center
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Live Admin Session
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {user?.email || 'admin@roshzen.in'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/#links"
            className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Link Hub</span>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'links'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Links ({links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 relative z-10">
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
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMovePosition(index, 'down')}
                        disabled={index === links.length - 1}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400"
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
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition border ${
                        link.is_active
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {link.is_active ? 'Active' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(link)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                      title="Edit Link"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
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

            <form onSubmit={handleSaveProfile} className="space-y-4 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
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
                  onChange={(e) => setProfileFormData({ ...profileFormData, username: e.target.value })}
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
                  onChange={(e) => setProfileFormData({ ...profileFormData, avatarUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full mt-6 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold font-mono text-white">System Analytics & Engagement</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Track link clicks and visitor interaction stats.
                </p>
              </div>
              <button
                onClick={loadDashboardData}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                title="Refresh Analytics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Link Clicks</span>
                <p className="text-4xl font-extrabold font-mono text-white mt-2">{analytics.totalClicks}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Link Cards</span>
                <p className="text-4xl font-extrabold font-mono text-red-500 mt-2">
                  {links.filter((l) => l.is_active).length}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">System Status</span>
                <p className="text-base font-extrabold font-mono text-emerald-400 mt-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Route Mode Active
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold font-mono text-white">Click Distribution per Link</h3>
              <div className="space-y-3">
                {links.map((link) => {
                  const count = analytics.linkCounts[link.id] || 0
                  const pct = analytics.totalClicks > 0 ? ((count / analytics.totalClicks) * 100).toFixed(0) : 0
                  return (
                    <div key={link.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{link.title}</span>
                        <span className="text-slate-400">{count} clicks ({pct}%)</span>
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

      <AnimatePresence>
        {isModalOpen && (
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
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLink} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase">Title</label>
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
                  <label className="block text-[11px] font-mono text-slate-300 uppercase">Description</label>
                  <input
                    type="text"
                    value={linkFormData.description}
                    onChange={(e) => setLinkFormData({ ...linkFormData, description: e.target.value })}
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
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase">Icon Name</label>
                    <input
                      type="text"
                      value={linkFormData.iconName}
                      onChange={(e) => setLinkFormData({ ...linkFormData, iconName: e.target.value })}
                      placeholder="Github, Globe, Mail..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase">Accent Color</label>
                    <input
                      type="color"
                      value={linkFormData.color}
                      onChange={(e) => setLinkFormData({ ...linkFormData, color: e.target.color })}
                      className="w-full h-9 p-1 rounded-xl bg-black/40 border border-white/10 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active_cb_root"
                    checked={linkFormData.is_active}
                    onChange={(e) => setLinkFormData({ ...linkFormData, is_active: e.target.checked })}
                    className="rounded border-white/10 text-red-600 focus:ring-0"
                  />
                  <label htmlFor="is_active_cb_root" className="text-xs font-mono text-slate-300">
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
