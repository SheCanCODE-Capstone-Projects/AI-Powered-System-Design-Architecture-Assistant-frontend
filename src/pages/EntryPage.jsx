import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function WelcomePage() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("archpilot-theme") || "light",
  );

  useEffect(() => {
    localStorage.setItem("archpilot-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <main className="welcome-page" data-theme={theme}>
      <nav className="welcome-nav">
        <Link to="/" className="welcome-brand">
          <span className="welcome-logo">A</span>
          <span>ArchPilot</span>
        </Link>

        <div className="welcome-nav-actions">
          <span className="welcome-nav-label">SYSTEM DESIGN STUDIO</span>

          <button
            type="button"
            className="welcome-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
        </div>
      </nav>

      <section className="welcome-hero">
        <div className="welcome-content">
          <span className="welcome-eyebrow">
            <span className="welcome-eyebrow-dot"></span>
            THINK. DESIGN. BUILD.
          </span>

          <h1>
            Turn your ideas into
            <span> powerful architectures.</span>
          </h1>

          <p className="welcome-description">
            Design, organize, and visualize your system architecture in one
            workspace. Start with your requirements and build a system that
            makes sense.
          </p>

          <div className="welcome-actions">
            <Link to="/dashboard" className="welcome-start-btn">
              Get Started
              <span aria-hidden="true">→</span>
            </Link>

            <span className="welcome-action-note">
              Your next great system starts here.
            </span>
          </div>

          <div className="welcome-features">
            <div>
              <span className="welcome-feature-icon">⌘</span>
              <span>Design systems</span>
            </div>
            <div>
              <span className="welcome-feature-icon">◇</span>
              <span>Connect components</span>
            </div>
            <div>
              <span className="welcome-feature-icon">✓</span>
              <span>Plan with clarity</span>
            </div>
          </div>
        </div>

        <div
          className="welcome-visual"
          aria-label="Illustration of connected software architecture components"
        >
          <div className="visual-glow"></div>

          <div className="visual-orbit orbit-one"></div>
          <div className="visual-orbit orbit-two"></div>

          <div className="architecture-preview">
            <div className="preview-topbar">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>ARCHITECTURE OVERVIEW</span>
              <span className="preview-status">● LIVE</span>
            </div>

            <div className="preview-canvas">
              <svg
                className="preview-connections"
                viewBox="0 0 500 350"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M250 85 L250 135 L120 135 L120 190" />
                <path d="M250 135 L380 135 L380 190" />
                <path d="M120 245 L120 285 L250 285 L250 305" />
                <path d="M380 245 L380 285 L250 285" />
                <circle cx="250" cy="135" r="4" />
                <circle cx="250" cy="285" r="4" />
              </svg>

              <div className="preview-node preview-client">
                <span className="preview-node-icon">⌘</span>
                <div>
                  <strong>Web Client</strong>
                  <small>Frontend</small>
                </div>
              </div>

              <div className="preview-node preview-api">
                <span className="preview-node-icon">↔</span>
                <div>
                  <strong>API Gateway</strong>
                  <small>Backend service</small>
                </div>
              </div>

              <div className="preview-node preview-database">
                <span className="preview-node-icon">▤</span>
                <div>
                  <strong>Database</strong>
                  <small>Data storage</small>
                </div>
              </div>

              <div className="preview-node preview-external">
                <span className="preview-node-icon">◇</span>
                <div>
                  <strong>External API</strong>
                  <small>Integration</small>
                </div>
              </div>

              <div className="preview-center-label">SYSTEM FLOW</div>
            </div>

            <div className="preview-footer">
              <span>
                <i></i> 4 Components
              </span>
              <span>Architecture preview</span>
            </div>
          </div>

          <div className="floating-chip chip-top">
            <span>✦</span> Smart design
          </div>

          <div className="floating-chip chip-bottom">
            <span>✓</span> Built with clarity
          </div>
        </div>
      </section>

      <footer className="welcome-footer">
        <span>© {new Date().getFullYear()} ArchPilot</span>
        <span>Designed to make system thinking clearer.</span>
      </footer>
    </main>
  );
}

export default WelcomePage;
