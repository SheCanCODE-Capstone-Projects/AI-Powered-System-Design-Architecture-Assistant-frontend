import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function getArchitectureData() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("archpilot-architectures") || "{}",
    );

    return Object.values(saved).reduce(
      (totals, architecture) => ({
        components:
          totals.components +
          (Array.isArray(architecture?.nodes) ? architecture.nodes.length : 0),
        connections:
          totals.connections +
          (Array.isArray(architecture?.edges) ? architecture.edges.length : 0),
      }),
      { components: 0, connections: 0 },
    );
  } catch {
    return { components: 0, connections: 0 };
  }
}

function DashboardPage() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("archpilot-theme") || "dark",
  );

  const [projects, setProjects] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("archpilot-projects") || "[]",
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [architecture, setArchitecture] = useState(getArchitectureData);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scale: "Small - Startup / MVP",
  });

  useEffect(() => {
    localStorage.setItem("archpilot-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("archpilot-projects", JSON.stringify(projects));
  }, [projects]);

  // Refresh architecture totals when the user returns to the dashboard.
  useEffect(() => {
    const refreshArchitecture = () => {
      setArchitecture(getArchitectureData());
    };

    window.addEventListener("focus", refreshArchitecture);
    window.addEventListener("storage", refreshArchitecture);

    return () => {
      window.removeEventListener("focus", refreshArchitecture);
      window.removeEventListener("storage", refreshArchitecture);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleCreateProject = (event) => {
    event.preventDefault();

    const projectName = formData.name.trim();

    if (!projectName) {
      setError("Please enter a project name.");
      return;
    }

    const newProject = {
      id: crypto.randomUUID(),
      name: projectName,
      description: formData.description.trim(),
      scale: formData.scale,
      createdAt: new Date().toLocaleDateString(),
      requirements: {
        functional: "",
        expectedTraffic: "1,000 - 10,000 users",
        latency: "Under 500 ms",
        availability: "99.9%",
        scalability: "Horizontal scaling",
        security: "",
        other: "",
      },
      updatedAt: new Date().toISOString(),
    };

    setProjects((previous) => [newProject, ...previous]);

    setFormData({
      name: "",
      description: "",
      scale: "Small - Startup / MVP",
    });

    setShowForm(false);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setError("");
  };

  const completedRequirements = projects.filter((project) =>
    project.requirements?.functional?.trim(),
  ).length;

  const progress =
    projects.length > 0
      ? Math.round((completedRequirements / projects.length) * 100)
      : 0;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter(
      (project) =>
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query),
    );
  }, [projects, search]);

  return (
    <main className="dashboard-layout reference-dashboard" data-theme={theme}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar reference-sidebar">
        <Link to="/dashboard" className="dashboard-logo">
          <span className="logo-icon">A</span>
          <span>ArchPilot</span>
        </Link>

        <div className="reference-sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <a href="#overview" className="sidebar-link active">
            <span>▦</span>
            Dashboard
          </a>

          <a href="#projects" className="sidebar-link">
            <span>◫</span>
            My Projects
          </a>
        </div>

        <div className="reference-sidebar-section">
          <p className="sidebar-label">DESIGN</p>

          <Link
            to={
              projects.length
                ? `/projects/${projects[0].id}/requirements`
                : "/dashboard"
            }
            className="sidebar-link"
          >
            <span>⌘</span>
            Requirements
          </Link>

          <Link
            to={
              projects.length
                ? `/projects/${projects[0].id}/architecture`
                : "/dashboard"
            }
            className="sidebar-link"
          >
            <span>◇</span>
            Architecture
          </Link>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">U</div>
            <div>
              <strong>Workspace User</strong>
              <span>Personal workspace</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main dashboard */}
      <section className="dashboard-main reference-main">
        {/* Top navigation */}
        <header className="reference-topbar">
          <div className="reference-page-title">
            <p className="dashboard-breadcrumb">WORKSPACE / OVERVIEW</p>
            <h1>Dashboard</h1>
          </div>

          <div className="reference-topbar-actions">
            <label className="reference-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search your projects..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search projects"
              />
            </label>

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            <button
              type="button"
              className="create-project-btn"
              onClick={() => setShowForm(true)}
            >
              + New Project
            </button>
          </div>
        </header>

        <div className="reference-welcome">
          <div>
            <h2>Your system design workspace</h2>
            <p>
              Organize projects, define requirements, and design architectures
              in one place.
            </p>
          </div>
          <span className="reference-welcome-mark">✦</span>
        </div>

        {/* Upper panels */}
        <section className="reference-top-panels" id="overview">
          {/* Project overview */}
          <article className="reference-panel reference-project-overview">
            <div className="reference-panel-heading">
              <div>
                <span className="reference-panel-icon">▦</span>
                <div>
                  <h3>Project Overview</h3>
                  <p>Your workspace at a glance</p>
                </div>
              </div>
              <span className="reference-period">ALL TIME</span>
            </div>

            <div className="reference-main-number">
              {projects.length}
              <span>total projects</span>
            </div>

            <div className="reference-metrics">
              <div>
                <strong>{completedRequirements}</strong>
                <span>Requirements started</span>
              </div>
              <div>
                <strong>{projects.length - completedRequirements}</strong>
                <span>Not started</span>
              </div>
            </div>

            <div className="reference-progress">
              <div className="reference-progress-heading">
                <span>Requirements progress</span>
                <strong>{progress}%</strong>
              </div>
              <div className="workspace-progress-track">
                <div
                  className="workspace-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </article>

          {/* Architecture overview */}
          <article className="reference-panel reference-architecture-overview">
            <div className="reference-panel-heading">
              <div>
                <span className="reference-panel-icon">◇</span>
                <div>
                  <h3>Architecture Overview</h3>
                  <p>Your saved architecture designs</p>
                </div>
              </div>
              <span className="reference-period">ALL PROJECTS</span>
            </div>

            <div className="reference-architecture-numbers">
              <div>
                <span>Components</span>
                <strong>{architecture.components}</strong>
              </div>
              <div>
                <span>Connections</span>
                <strong>{architecture.connections}</strong>
              </div>
            </div>

            <div className="reference-architecture-visual">
              <div className="reference-architecture-node">
                <span>▣</span>
                <small>Frontend</small>
              </div>
              <div className="reference-architecture-line" />
              <div className="reference-architecture-node">
                <span>◇</span>
                <small>Backend</small>
              </div>
              <div className="reference-architecture-line" />
              <div className="reference-architecture-node">
                <span>▤</span>
                <small>Database</small>
              </div>
            </div>

            <p className="reference-architecture-note">
              A simplified illustration of a typical system architecture. Your
              actual designs are saved in each project.
            </p>
          </article>
        </section>

        {/* Lower panels */}
        <section className="reference-bottom-panels">
          {/* Recent projects */}
          <article
            className="reference-panel reference-recent-projects"
            id="projects"
          >
            <div className="reference-panel-heading">
              <div>
                <span className="reference-panel-icon">◫</span>
                <div>
                  <h3>Recent Projects</h3>
                  <p>Continue where you left off</p>
                </div>
              </div>

              <button
                type="button"
                className="reference-small-action"
                onClick={() => setShowForm(true)}
              >
                + New
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="reference-no-projects">
                <span>⌘</span>
                <h3>{search ? "No matching projects" : "No projects yet"}</h3>
                <p>
                  {search
                    ? "Try another search term."
                    : "Create your first project to get started."}
                </p>
                {!search && (
                  <button
                    type="button"
                    className="create-project-btn"
                    onClick={() => setShowForm(true)}
                  >
                    Create Project
                  </button>
                )}
              </div>
            ) : (
              <div className="reference-project-list">
                {filteredProjects.slice(0, 5).map((project) => {
                  const hasRequirements = Boolean(
                    project.requirements?.functional?.trim(),
                  );

                  return (
                    <div className="reference-project-row" key={project.id}>
                      <div className="reference-project-symbol">◇</div>

                      <div className="reference-project-details">
                        <strong>{project.name}</strong>
                        <span>
                          {project.scale} · Created {project.createdAt}
                        </span>
                      </div>

                      <span
                        className={
                          hasRequirements
                            ? "requirement-complete"
                            : "requirement-pending"
                        }
                      >
                        {hasRequirements ? "Started" : "Pending"}
                      </span>

                      <Link
                        to={`/projects/${project.id}/requirements`}
                        className="reference-open-link"
                        aria-label={`Open ${project.name}`}
                      >
                        →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* Insights */}
          <article className="reference-panel reference-insights">
            <div className="reference-panel-heading">
              <div>
                <span className="reference-panel-icon">✦</span>
                <div>
                  <h3>Workspace Insights</h3>
                  <p>Your design progress</p>
                </div>
              </div>
            </div>

            <div className="reference-insight-item">
              <span className="reference-insight-dot" />
              <span>Projects created</span>
              <strong>{projects.length}</strong>
            </div>

            <div className="reference-insight-item">
              <span className="reference-insight-dot" />
              <span>Architecture components</span>
              <strong>{architecture.components}</strong>
            </div>

            <div className="reference-insight-item">
              <span className="reference-insight-dot" />
              <span>Architecture connections</span>
              <strong>{architecture.connections}</strong>
            </div>

            <div className="reference-insight-item">
              <span className="reference-insight-dot" />
              <span>Requirements started</span>
              <strong>{completedRequirements}</strong>
            </div>

            <div className="reference-insight-tip">
              <span>✦</span>
              <div>
                <strong>Design tip</strong>
                <p>
                  Define your system requirements first. They help guide your
                  architecture decisions.
                </p>
              </div>
            </div>

            {projects.length > 0 && (
              <Link
                to={`/projects/${projects[0].id}/architecture`}
                className="reference-insight-button"
              >
                Open Architecture Designer <span>→</span>
              </Link>
            )}
          </article>
        </section>
      </section>

      {/* Create project modal */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p>NEW WORKSPACE PROJECT</p>
                <h2 id="modal-title">Create a project</h2>
                <span>Set up the basic information for your architecture.</span>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeForm}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="project-name">Project name</label>
                <input
                  id="project-name"
                  name="name"
                  type="text"
                  placeholder="e.g. E-commerce Platform"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={80}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  name="description"
                  placeholder="Describe what you want to build..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-scale">Target scale / context</label>
                <select
                  id="project-scale"
                  name="scale"
                  value={formData.scale}
                  onChange={handleChange}
                >
                  <option>Small - Startup / MVP</option>
                  <option>Medium - Growing Business</option>
                  <option>Large - Enterprise</option>
                  <option>Global - High Traffic</option>
                </select>
              </div>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="create-project-btn">
                  Create Project
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default DashboardPage;
