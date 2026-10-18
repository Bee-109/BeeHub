
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <main className="admin-dashboard">
      <header className="dashboard-header">
        <a href="/" className="dashboard-brand">
          <span>B</span>
          BEEHUB <small>ADMIN</small>
        </a>

        <button onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? 'Signing out...' : 'Sign out ↗'}
        </button>
      </header>

      <section className="dashboard-welcome">
        <p>THE HIVE / CONTROL ROOM</p>
        <h1>Welcome back, <span>Creator.</span></h1>
        <p>Manage the things you bring into the world.</p>
      </section>

      {error && <p role="alert" className="dashboard-error">{error}</p>}

      <section className="dashboard-cards">
        <article>
          <span>01 / PORTFOLIO</span>
          <h2>Projects</h2>
          <p>Your experiments, tools, and creations.</p>
          <span className="dashboard-status">CONTENT MANAGER — COMING NEXT</span>
        </article>

        <article>
          <span>02 / GAMES</span>
          <h2>Games</h2>
          <p>Your published games and works in progress.</p>
          <span className="dashboard-status">CONTENT MANAGER — COMING NEXT</span>
        </article>

        <article>
          <span>03 / ARTWORK</span>
          <h2>3D Gallery</h2>
          <p>Your Blender renders and visual experiments.</p>
          <span className="dashboard-status">CONTENT MANAGER — COMING NEXT</span>
        </article>
      </section>
    </main>
  )
}
