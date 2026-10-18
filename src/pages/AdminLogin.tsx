
import "./AdminLogin.css";

export default function AdminLogin() {
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

            <form>
              <label htmlFor="email">EMAIL ADDRESS</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="username"
                required
              />

              <div className="password-label-row">
                <label htmlFor="password">PASSWORD</label>
                <span>AUTHORIZED ACCESS ONLY</span>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button type="submit">
                <span>Enter the Hive</span>
                <span aria-hidden="true">↗</span>
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
  );
}
