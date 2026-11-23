import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DashboardPage() {
  // Theme settings
  const [theme, setTheme] = useState(
    () => localStorage.getItem("archpilot-theme") || "dark",
  );

  // Project data
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem("archpilot-projects");
      return savedProjects ? JSON.parse(savedProjects) : [];
    } catch {
      return [];
    }
  });

  // Project form visibility
  const [showForm, setShowForm] = useState(false);

  // Form values
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scale: "Small - Startup / MVP",
  });

  const [error, setError] = useState("");

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("archpilot-theme", theme);
  }, [theme]);

  // Save projects
  useEffect(() => {
    localStorage.setItem("archpilot-projects", JSON.stringify(projects));
  }, [projects]);

  // Switch between light and dark themes
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // Create a project
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

    setProjects((previousProjects) => [newProject, ...previousProjects]);

    setFormData({
      name: "",
      description: "",
      scale: "Small - Startup / MVP",
    });

    setShowForm(false);
    setError("");
  };

  // Close project form
  const closeForm = () => {
    setShowForm(false);
    setError("");
  };

  // Count projects with functional requirements entered
  const completedRequirements = projects.filter((project) =>
    project.requirements?.functional?.trim(),
  ).length;

  return (
    <main className="dashboard-layout" data-theme={theme}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span className="logo-icon">A</span>
          <span>ArchPilot</span>
        </div>

        <div className="sidebar-section">
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

        <div className="sidebar-section">
          <p className="sidebar-label">DESIGN</p>

          <a href="#projects" className="sidebar-link">
            <span>⌘</span>
            Requirements
          </a>

          <Link
            to={
              projects.length > 0
                ? `/projects/${projects[0].id}/architecture`
                : "/dashboard"
            }
            className="sidebar-link"
          >
            <span>◇</span>
            Architecture Designer
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
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-breadcrumb">Workspace / Overview</p>

            <h1>System Design Workspace</h1>

            <p className="dashboard-subtitle">
              Design, organize and manage your software architectures.
            </p>
          </div>

          <div className="dashboard-header-actions">
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
              + Create Project
            </button>
          </div>
        </header>

        {/* Statistics */}
        <section className="dashboard-stats" id="overview">
          <article className="stat-card">
            <div className="stat-icon">▦</div>
            <p>Total Projects</p>
            <h2>{projects.length}</h2>
            <span>Your architecture projects</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon">◇</div>
            <p>Active Projects</p>
            <h2>{projects.length}</h2>
            <span>Projects in your workspace</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon">↻</div>
            <p>Requirements Started</p>
            <h2>{completedRequirements}</h2>
            <span>Projects with functional requirements</span>
          </article>
        </section>

        {/* Projects */}
        <section className="projects-section" id="projects">
          <div className="projects-heading">
            <div>
              <h2>Your Projects</h2>
              <p>Create and manage your software architecture projects.</p>
            </div>

            <button
              type="button"
              className="text-create-btn"
              onClick={() => setShowForm(true)}
            >
              + New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty-projects">
              <div className="empty-project-icon">⌘</div>

              <h3>Your workspace is ready</h3>

              <p>
                You haven't created any architecture projects yet. Start by
                creating your first project.
              </p>

              <button
                type="button"
                className="create-project-btn"
                onClick={() => setShowForm(true)}
              >
                + Create your first project
              </button>

              <span className="empty-note">
                Your architecture journey starts here.
              </span>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const hasRequirements = Boolean(
                  project.requirements?.functional?.trim(),
                );

                return (
                  <article className="project-card" key={project.id}>
                    <div className="project-card-top">
                      <div className="project-icon">◇</div>

                      <span className="project-status">Active</span>
                    </div>

                    <h3>{project.name}</h3>

                    <p>{project.description || "No description provided."}</p>

                    <div className="project-card-details">
                      <span>{project.scale}</span>
                      <span>Created {project.createdAt}</span>
                    </div>

                    <div className="project-requirement-status">
                      <span
                        className={
                          hasRequirements
                            ? "requirement-complete"
                            : "requirement-pending"
                        }
                      >
                        {hasRequirements
                          ? "✓ Requirements started"
                          : "○ Requirements not started"}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${project.id}/requirements`}
                      className="requirements-link"
                    >
                      {hasRequirements
                        ? "Edit Requirements →"
                        : "Define Requirements →"}
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      {/* Create Project Modal */}
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
