
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError('Invalid email or password.')
        return
      }

      navigate('/admin')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login-layout">

        <section className="admin-login-visual">
          <div className="visual-topline">
            <span>BEEHUB</span>
            <span>CREATOR ACCESS / 001</span>
          </div>

          <div className="bee-artwork">
            <div className="bee-orbit orbit-one" />
            <div className="bee-orbit orbit-two" />

            <div className="bee-emblem">
              <span>✳</span>
            </div>

            <p className="artwork-label">FIG. 001 — THE CREATOR</p>
          </div>

          <div className="visual-caption">
            <p className="visual-eyebrow">YOUR IDEAS. YOUR UNIVERSE.</p>
            <h2>
              Build something
              <br />
              <span>that matters.</span>
            </h2>
            <p className="visual-description">
              Every game, every experiment, every wild idea.
              One home for everything you create.
            </p>
          </div>

          <div className="visual-footer">
            <span>INDEPENDENT BY DESIGN</span>
            <span>HYD. / IN</span>
          </div>
        </section>

        <section className="admin-login-panel">
          <div className="login-panel-top">
            <a href="/" className="login-brand">
              <span className="brand-mark">B</span>
              BEEHUB
            </a>

            <span className="access-label">
              <span className="status-dot" />
              PRIVATE WORKSPACE
            </span>
          </div>

          <div className="login-content">
            <p className="admin-login-eyebrow">
              WELCOME BACK / CREATOR
            </p>

            <h1>
              Enter the
              <br />
              <span>Hive.</span>
            </h1>

            <p className="admin-login-description">
              Your corner of the universe is waiting.
            </p>

            <form onSubmit={handleLogin}>
              <label htmlFor="email">EMAIL ADDRESS</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />

              <div className="password-label-row">
                <label htmlFor="password">PASSWORD</label>
                <span>AUTHORIZED ACCESS ONLY</span>
              </div>

              <div className="password-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />

                
<button
  type="button"
  className="password-toggle"
  onClick={() => setShowPassword((visible) => !visible)}
  aria-label={showPassword ? 'Hide password' : 'Show password'}
  aria-pressed={showPassword}
  disabled={loading}
>
  {showPassword ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a15 15 0 01-3.1 3.9M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a10 10 0 004-.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
</button>

              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}>
                <span>{loading ? 'Signing in...' : 'Enter the Hive'}</span>
                <span aria-hidden="true">{loading ? '…' : '↗'}</span>
              </button>
            </form>

            <a className="admin-back-link" href="/">
              <span>←</span> Return to public portfolio
            </a>
          </div>

          <div className="login-panel-footer">
            <span>BUILT WITH PURPOSE.</span>
            <span>© BEEHUB</span>
          </div>
        </section>
      </div>
    </main>
  )
}
