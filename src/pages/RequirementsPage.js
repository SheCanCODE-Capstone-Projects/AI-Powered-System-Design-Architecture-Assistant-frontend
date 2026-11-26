import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function RequirementsPage() {
  const { projectId } = useParams();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("archpilot-theme") || "dark",
  );

  const [project, setProject] = useState(null);
  const [saved, setSaved] = useState(false);

  const [requirements, setRequirements] = useState({
    functional: "",
    expectedTraffic: "1,000 - 10,000 users",
    latency: "Under 500 ms",
    availability: "99.9%",
    scalability: "Horizontal scaling",
    security: "",
    other: "",
  });

  // Keep the selected theme synchronized with localStorage.
  useEffect(() => {
    localStorage.setItem("archpilot-theme", theme);
  }, [theme]);

  // Load project and its requirements.
  useEffect(() => {
    try {
      const savedProjects = JSON.parse(
        localStorage.getItem("archpilot-projects") || "[]",
      );

      const selectedProject = savedProjects.find(
        (item) => item.id === projectId,
      );

      if (selectedProject) {
        setProject(selectedProject);

        if (selectedProject.requirements) {
          setRequirements((previous) => ({
            ...previous,
            ...selectedProject.requirements,
          }));
        }
      }
    } catch (error) {
      console.error("Unable to load project:", error);
    }
  }, [projectId]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRequirements((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const savedProjects = JSON.parse(
        localStorage.getItem("archpilot-projects") || "[]",
      );

      const updatedProjects = savedProjects.map((item) =>
        item.id === projectId
          ? {
              ...item,
              requirements,
              updatedAt: new Date().toISOString(),
            }
          : item,
      );

      localStorage.setItem(
        "archpilot-projects",
        JSON.stringify(updatedProjects),
      );

      setProject((previous) => ({
        ...previous,
        requirements,
      }));

      setSaved(true);
    } catch (error) {
      console.error("Unable to save requirements:", error);
      setSaved(false);
    }
  };

  return (
    <main className="dashboard-layout" data-theme={theme}>
      {/* SIDEBAR - SAME AS DASHBOARD */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span className="logo-icon">A</span>
          <span>ArchPilot</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <Link to="/dashboard" className="sidebar-link">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/dashboard#projects" className="sidebar-link">
            <span>◫</span>
            My Projects
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">DESIGN</p>

          <Link
            to={`/projects/${projectId}/requirements`}
            className="sidebar-link active"
            aria-current="page"
          >
            <span>⌘</span>
            Requirements
          </Link>

          <div className="sidebar-link disabled-link">
            <span>◇</span>
            Architecture Designer
            <small>Coming soon</small>
          </div>
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

      {/* MAIN CONTENT */}
      <section className="dashboard-main requirements-main">
        {/* HEADER - SAME ALIGNMENT AS DASHBOARD */}
        <header className="dashboard-header requirements-topbar">
          <div>
            <p className="dashboard-breadcrumb">
              Workspace / Projects / Requirements
            </p>

            <h1>Project Requirements</h1>

            <p className="dashboard-subtitle">
              Define the functional and technical needs of your system.
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
          </div>
        </header>

        {!project ? (
          <div className="requirements-not-found">
            <div className="requirements-not-found-icon">!</div>

            <h2>Project not found</h2>

            <p>
              This project may have been deleted or does not exist. Return to
              your dashboard to select another project.
            </p>

            <Link to="/dashboard" className="create-project-btn">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="requirements-content">
            {/* PROJECT INFORMATION */}
            <section className="requirements-project-info">
              <div>
                <span className="project-info-label">CURRENT PROJECT</span>

                <h2>{project.name}</h2>

                <p>
                  {project.description || "No project description provided."}
                </p>
              </div>

              {project.scale && (
                <span className="project-scale-tag">{project.scale}</span>
              )}
            </section>

            {/* REQUIREMENTS FORM */}
            <form className="requirements-form" onSubmit={handleSubmit}>
              {/* FUNCTIONAL REQUIREMENTS */}
              <section className="requirements-section">
                <div className="requirements-section-heading">
                  <span className="requirements-number">01</span>

                  <div>
                    <h2>Functional Requirements</h2>
                    <p>
                      Describe the features and actions your system must
                      support.
                    </p>
                  </div>
                </div>

                <div className="requirement-field">
                  <label htmlFor="functional">
                    What should your system do?
                    <span className="field-required"> *</span>
                  </label>

                  <textarea
                    id="functional"
                    name="functional"
                    rows="6"
                    value={requirements.functional}
                    onChange={handleChange}
                    placeholder={
                      "Enter one requirement per line, for example:\nUsers can create accounts and log in.\nUsers can search for products.\nUsers can make payments."
                    }
                    required
                  />

                  <small>
                    Write each functional requirement on a separate line.
                  </small>
                </div>
              </section>

              {/* NON-FUNCTIONAL REQUIREMENTS */}
              <section className="requirements-section">
                <div className="requirements-section-heading">
                  <span className="requirements-number">02</span>

                  <div>
                    <h2>Non-Functional Requirements</h2>
                    <p>
                      Define how well your system should perform and operate.
                    </p>
                  </div>
                </div>

                <div className="requirements-fields-grid">
                  <div className="requirement-field">
                    <label htmlFor="expectedTraffic">Expected Traffic</label>

                    <select
                      id="expectedTraffic"
                      name="expectedTraffic"
                      value={requirements.expectedTraffic}
                      onChange={handleChange}
                    >
                      <option>Under 1,000 users</option>
                      <option>1,000 - 10,000 users</option>
                      <option>10,000 - 100,000 users</option>
                      <option>100,000 - 1 million users</option>
                      <option>More than 1 million users</option>
                    </select>

                    <small>
                      Estimated number of users your system should support.
                    </small>
                  </div>

                  <div className="requirement-field">
                    <label htmlFor="latency">Latency Constraint</label>

                    <select
                      id="latency"
                      name="latency"
                      value={requirements.latency}
                      onChange={handleChange}
                    >
                      <option>Under 100 ms</option>
                      <option>Under 200 ms</option>
                      <option>Under 500 ms</option>
                      <option>Under 1 second</option>
                      <option>Under 3 seconds</option>
                    </select>

                    <small>Maximum acceptable response time.</small>
                  </div>

                  <div className="requirement-field">
                    <label htmlFor="availability">Availability Goal</label>

                    <select
                      id="availability"
                      name="availability"
                      value={requirements.availability}
                      onChange={handleChange}
                    >
                      <option>99%</option>
                      <option>99.9%</option>
                      <option>99.99%</option>
                      <option>99.999%</option>
                    </select>

                    <small>Target system uptime.</small>
                  </div>

                  <div className="requirement-field">
                    <label htmlFor="scalability">Scalability Strategy</label>

                    <select
                      id="scalability"
                      name="scalability"
                      value={requirements.scalability}
                      onChange={handleChange}
                    >
                      <option>Vertical scaling</option>
                      <option>Horizontal scaling</option>
                      <option>Both vertical and horizontal</option>
                      <option>Not yet decided</option>
                    </select>

                    <small>
                      How your system should handle increasing demand.
                    </small>
                  </div>
                </div>

                <div className="requirement-field">
                  <label htmlFor="security">Security Expectations</label>

                  <textarea
                    id="security"
                    name="security"
                    rows="4"
                    value={requirements.security}
                    onChange={handleChange}
                    placeholder="For example: user authentication, role-based access, encrypted communication..."
                  />

                  <small>
                    Describe the security measures your system needs.
                  </small>
                </div>

                <div className="requirement-field">
                  <label htmlFor="other">Other Constraints</label>

                  <textarea
                    id="other"
                    name="other"
                    rows="4"
                    value={requirements.other}
                    onChange={handleChange}
                    placeholder="Add any other technical, business, budget or regulatory constraints..."
                  />

                  <small>
                    Include any additional requirements that may influence your
                    architecture.
                  </small>
                </div>
              </section>

              {/* SAVE ACTIONS */}
              <div className="requirements-actions">
                <div className="requirements-save-info">
                  {saved ? (
                    <p className="requirements-success" role="status">
                      ✓ Requirements saved successfully.
                    </p>
                  ) : (
                    <p className="requirements-save-hint">
                      Make sure your requirements are accurate before
                      continuing.
                    </p>
                  )}
                </div>

                <button type="submit" className="requirements-save-btn">
                  Save Requirements <span>→</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default RequirementsPage;
