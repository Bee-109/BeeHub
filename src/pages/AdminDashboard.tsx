
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './AdminDashboard.css'
import ProjectManager from './ProjectManager'
import FeaturedSlots from './FeaturedSlots'

type Section = 'stats' | 'games' | 'projects'

const sections = [
  { id: 'stats' as const, number: '01', label: 'Stats', description: 'Portfolio numbers', icon: '↗' },
  { id: 'games' as const, number: '02', label: 'Featured Games', description: 'Your games', icon: '◇' },
  { id: 'projects' as const, number: '03', label: 'Other Projects', description: 'Everything else', icon: '▦' },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('stats')
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState('')

const [stats, setStats] = useState({
  total_games: 0,
  in_development: 0,
  total_visits: 0,
  peak_ccu: 0,
  years_experience: 0,
})

const [loadingStats, setLoadingStats] = useState(true)
const [savingStats, setSavingStats] = useState(false)
const [statsMessage, setStatsMessage] = useState('')
    
useEffect(() => {
  async function loadStats() {
    setLoadingStats(true)
    setStatsMessage('')

    const { data, error: loadError } = await supabase
      .from('portfolio_stats')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (loadError) {
      setStatsMessage('Could not load stats. Please try again.')
    } else if (data) {
      setStats({
        total_games: data.total_games,
        in_development: data.in_development,
        total_visits: data.total_visits,
        peak_ccu: data.peak_ccu,
        years_experience: Number(data.years_experience),
      })
    }

    setLoadingStats(false)
  }

  loadStats()
}, [])



async function handleSaveStats(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault()
  setSavingStats(true)
  setStatsMessage('')

  try {
    const { data, error: updateError } = await supabase
      .from('portfolio_stats')
      .update({
        ...stats,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select('id, total_games')

    if (updateError) {
      console.error('Stats update error:', updateError)
      setStatsMessage(`Save failed: ${updateError.message}`)
      return
    }

    if (!data || data.length === 0) {
      setStatsMessage(
        'No row updated. Check the admin RLS policy and row ID.'
      )
      return
    }

    console.log('Stats successfully updated:', data)
    setStatsMessage('Stats saved successfully.')
  } catch (error) {
    console.error('Unexpected stats save error:', error)
    setStatsMessage('Something went wrong. Please try again.')
  } finally {
    setSavingStats(false)
  }
}





  async function handleSignOut() {
    setSigningOut(true)
    setError('')

    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      setError('Could not sign out. Please try again.')
      setSigningOut(false)
      return
    }

    window.location.href = '/admin/login'
  }

  const active = sections.find(section => section.id === activeSection)!

  return (
    <main className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <a href="/" className="dashboard-brand">
          <span className="dashboard-brand-mark">B</span>
          <span>BEEHUB<small>ADMIN WORKSPACE</small></span>
        </a>

        <div className="dashboard-nav-label">WORKSPACE</div>

        <nav className="dashboard-nav" aria-label="Admin sections">
          {sections.map(section => (
            <button
              key={section.id}
              type="button"
              className={`dashboard-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              <span className="dashboard-nav-number">{section.number}</span>
              <span className="dashboard-nav-copy">
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </span>
              <span className="dashboard-nav-arrow">{section.icon}</span>
            </button>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <span className="dashboard-online-dot" />
          <span>HIVE SYSTEM ONLINE</span>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-breadcrumb">
            THE HIVE <span>/</span> {active.label.toUpperCase()}
          </div>
          <div className="dashboard-header-actions">
            <a href="/" className="dashboard-view-site">View portfolio ↗</a>
            <button
              type="button"
              className="dashboard-signout"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out...' : 'Sign out ↗'}
            </button>
          </div>
        </header>

        <div className="dashboard-workspace">
          <div className="dashboard-page-heading">
            <p className="dashboard-eyebrow">{active.number} / CONTROL ROOM</p>
            <h1>
              {activeSection === 'stats' && <>Your numbers<span>.</span></>}
              {activeSection === 'games' && <>Featured games<span>.</span></>}
              {activeSection === 'projects' && <>Other projects<span>.</span></>}
            </h1>
            <p>
              {activeSection === 'stats' && 'The numbers that tell your creator story.'}
              {activeSection === 'games' && 'Manage the games you bring into the world.'}
              {activeSection === 'projects' && 'Keep your experiments and creations in one place.'}
            </p>
          </div>

          {error && <p role="alert" className="dashboard-error">{error}</p>}

          
{activeSection === 'stats' && (
  <form className="stats-editor" onSubmit={handleSaveStats}>
    <div className="stats-editor-heading">
      <div>
        <h2>Portfolio statistics</h2>
        <p>Update the numbers displayed on your public portfolio.</p>
      </div>
      <span className="stats-editor-count">05 FIELDS</span>
    </div>

    {loadingStats ? (
      <p className="stats-feedback">Loading your stats...</p>
    ) : (
      <>
        <div className="stats-fields">
          <label className="stats-field">
            <span>Total Games</span>
            <input
              type="number"
              min="0"
              step="1"
              value={stats.total_games}
              onChange={event =>
                setStats({ ...stats, total_games: Number(event.target.value) })
              }
              required
            />
          </label>

          <label className="stats-field">
            <span>In Development</span>
            <input
              type="number"
              min="0"
              step="1"
              value={stats.in_development}
              onChange={event =>
                setStats({ ...stats, in_development: Number(event.target.value) })
              }
              required
            />
          </label>

          <label className="stats-field">
            <span>Total Visits</span>
            <input
              type="number"
              min="0"
              step="1"
              value={stats.total_visits}
              onChange={event =>
                setStats({ ...stats, total_visits: Number(event.target.value) })
              }
              required
            />
          </label>

          <label className="stats-field">
            <span>Peak CCU</span>
            <input
              type="number"
              min="0"
              step="1"
              value={stats.peak_ccu}
              onChange={event =>
                setStats({ ...stats, peak_ccu: Number(event.target.value) })
              }
              required
            />
          </label>

          <label className="stats-field">
            <span>Years of Experience</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={stats.years_experience}
              onChange={event =>
                setStats({
                  ...stats,
                  years_experience: Number(event.target.value),
                })
              }
              required
            />
          </label>
        </div>

        <div className="stats-editor-footer">
          <div>
            {statsMessage && (
              <p
                className={`stats-feedback ${
                  statsMessage.includes('successfully') ? 'success' : ''
                }`}
                role="status"
              >
                {statsMessage}
              </p>
            )}
          </div>

          <button
            className="stats-save-button"
            type="submit"
            disabled={savingStats}
          >
            {savingStats ? 'Saving...' : 'Save changes ↗'}
          </button>
        </div>
      </>
    )}
  </form>
)}


            {/* {activeSection === 'games' && (
                <div className="dashboard-placeholder">
                <span className="dashboard-placeholder-icon">◇</span>
                <h2>Featured games</h2>
                <p>Add games, upload images, set their status, and choose which ones appear on your homepage.</p>
                <span className="dashboard-status">GAME MANAGER COMING NEXT</span>
                </div>
            )} */}

                {activeSection === 'games' && <ProjectManager />}
                {activeSection === 'games' && <FeaturedSlots />}


          {/* {activeSection === 'projects' && (
            <div className="dashboard-placeholder">
              <span className="dashboard-placeholder-icon">▦</span>
              <h2>Other projects</h2>
              <p>Manage your other creations and select which projects appear on your homepage.</p>
              <span className="dashboard-status">PROJECT MANAGER COMING NEXT</span>
            </div>
          )} */}

            {activeSection === 'projects' && <ProjectManager />}


        </div>

        <footer className="dashboard-main-footer">
          <span>BEEHUB / BUILT WITH PURPOSE</span>
          <span>YOUR UNIVERSE, YOUR RULES.</span>
        </footer>
      </section>
    </main>
  )
}
