import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const scalabilityByScale = {
  "Small - Startup / MVP": {
    recommended: "Vertical scaling",
    explanation:
      "Start with a simple architecture and scale the server resources as your application grows. This keeps the initial infrastructure manageable.",
  },
  "Medium - Growing Business": {
    recommended: "Horizontal scaling",
    explanation:
      "Prepare to add more application instances as the number of users increases. This helps your system handle growing demand.",
  },
  "Large - Enterprise": {
    recommended: "Horizontal scaling with load balancing and caching",
    explanation:
      "Use multiple application instances, load balancing and caching to support high traffic and improve performance.",
  },
  "Global - High Traffic": {
    recommended: "Distributed scaling with geographic distribution",
    explanation:
      "Plan for distributed services, geographic traffic distribution, load balancing and caching to serve users across regions.",
  },
};

const defaultRequirements = {
  functional: "",
  expectedTraffic: "1,000 - 10,000 users",
  latency: "Under 500 ms",
  availability: "99.9%",
  scalability: "",
  security: "",
  other: "",
};

const scalabilityOptions = [
  "Vertical scaling",
  "Horizontal scaling",
  "Horizontal scaling with load balancing and caching",
  "Distributed scaling with geographic distribution",
  "Not yet decided",
];

function RequirementsPage() {
  const { projectId } = useParams();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("archpilot-theme") || "dark",
  );

  const [project, setProject] = useState(null);
  const [requirements, setRequirements] = useState(defaultRequirements);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Get the recommendation for the selected project's scale.
  const scalabilityRecommendation =
    scalabilityByScale[project?.scale] ||
    scalabilityByScale["Small - Startup / MVP"];

  // Load the selected project.
  useEffect(() => {
    try {
      const savedProjects = JSON.parse(
        localStorage.getItem("archpilot-projects") || "[]",
      );

      const selectedProject = savedProjects.find(
        (item) => item.id === projectId,
      );

      if (!selectedProject) {
        setProject(null);
        return;
      }

      setProject(selectedProject);

      const existingRequirements = {
        ...defaultRequirements,
        ...(selectedProject.requirements || {}),
      };

      // Replace the old generic default with a scale-based recommendation.
      // Preserve any other strategy the user has already selected.
      if (
        !existingRequirements.scalability ||
        existingRequirements.scalability === "Horizontal scaling"
      ) {
        existingRequirements.scalability =
          scalabilityByScale[selectedProject.scale]?.recommended ||
          scalabilityByScale["Small - Startup / MVP"].recommended;
      }

      setRequirements(existingRequirements);
      setSaved(false);
      setError("");
    } catch (loadError) {
      console.error("Unable to load project:", loadError);
      setError("Unable to load this project's requirements.");
    }
  }, [projectId]);

  // Save theme preference.
  useEffect(() => {
    localStorage.setItem("archpilot-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  // Update form fields.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setRequirements((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  // Calculate completion using the seven requirement fields.
  const completionItems = [
    requirements.functional,
    requirements.expectedTraffic,
    requirements.latency,
    requirements.availability,
    requirements.scalability,
    requirements.security,
    requirements.other,
  ];

  const completedCount = completionItems.filter((value) =>
    String(value || "").trim(),
  ).length;

  const completionPercentage = Math.round(
    (completedCount / completionItems.length) * 100,
  );

  // Save requirements to the selected project.
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
      setError("");
    } catch (saveError) {
      console.error("Unable to save requirements:", saveError);
      setSaved(false);
      setError("Unable to save requirements. Please try again.");
    }
  };

  const functionalCount = useMemo(
    () =>
      requirements.functional.split("\n").filter((line) => line.trim()).length,
    [requirements.functional],
  );

  return (
    <main className="dashboard-layout requirements-redesign" data-theme={theme}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-logo">
          <span className="logo-icon">A</span>
          <span>ArchPilot</span>
        </Link>

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
          >
            <span>⌘</span>
            Requirements
          </Link>

          <Link
            to={`/projects/${projectId}/architecture`}
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

      {/* Main content */}
      <section className="dashboard-main requirements-main">
        {/* Header */}
        <header className="requirements-redesign-header">
          <div>
            <p className="dashboard-breadcrumb">
              Workspace / Projects / Requirements
            </p>

            <h1>Project Requirements</h1>

            <p className="dashboard-subtitle">
              Define what your system should do and how well it should perform.
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
          <div className="requirements-redesign-content">
            {/* Project summary */}
            <section className="requirements-project-banner">
              <div className="requirements-project-heading">
                <span className="requirements-project-icon">◇</span>

                <div>
                  <span className="requirements-small-label">
                    CURRENT PROJECT
                  </span>

                  <h2>{project.name}</h2>

                  <p>
                    {project.description || "No project description provided."}
                  </p>
                </div>
              </div>

              <div className="requirements-project-scale">
                <span>PROJECT SCALE</span>
                <strong>{project.scale}</strong>
              </div>
            </section>

            {/* Progress */}
            <section className="requirements-progress-card">
              <div className="requirements-progress-top">
                <div>
                  <span className="requirements-small-label">
                    REQUIREMENTS CHECKLIST
                  </span>
                  <h2>Define your system requirements</h2>
                  <p>
                    Complete the sections below before moving to architecture
                    design.
                  </p>
                </div>

                <div className="requirements-progress-number">
                  <strong>{completionPercentage}%</strong>
                  <span>Completed</span>
                </div>
              </div>

              <div
                className="requirements-progress-track"
                role="progressbar"
                aria-label="Requirements completion"
                aria-valuenow={completionPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="requirements-progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="requirements-progress-footer">
                <span>
                  {completedCount} of {completionItems.length} fields completed
                </span>
                <span>{completionPercentage}%</span>
              </div>
            </section>

            <form
              className="requirements-redesign-form"
              onSubmit={handleSubmit}
            >
              {/* Functional requirements */}
              <section className="requirements-redesign-section">
                <div className="requirements-redesign-heading">
                  <span className="requirements-redesign-number">01</span>

                  <div>
                    <h2>Functional Requirements</h2>
                    <p>
                      Describe the features and actions your system must
                      support.
                    </p>
                  </div>
                </div>

                <div className="requirements-redesign-field">
                  <div className="requirements-label-row">
                    <label htmlFor="functional">
                      What should your system do?
                      <span className="field-required"> *</span>
                    </label>

                    <span className="requirements-count">
                      {functionalCount} requirements
                    </span>
                  </div>

                  <textarea
                    id="functional"
                    name="functional"
                    rows={7}
                    value={requirements.functional}
                    onChange={handleChange}
                    placeholder={
                      "Enter one requirement per line:\n\nUsers can create accounts and log in.\nUsers can search for products.\nUsers can make payments."
                    }
                    required
                  />

                  <small>
                    Write each functional requirement on a separate line.
                  </small>
                </div>
              </section>

              {/* Performance */}
              <section className="requirements-redesign-section">
                <div className="requirements-redesign-heading">
                  <span className="requirements-redesign-number">02</span>

                  <div>
                    <h2>Performance Requirements</h2>
                    <p>
                      Define the traffic and response time your system should
                      support.
                    </p>
                  </div>
                </div>

                <div className="requirements-redesign-grid">
                  <div className="requirements-redesign-field">
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

                  <div className="requirements-redesign-field">
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

                  <div className="requirements-redesign-field">
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
                </div>
              </section>

              {/* Scalability */}
              <section className="requirements-redesign-section">
                <div className="requirements-redesign-heading">
                  <span className="requirements-redesign-number">03</span>

                  <div>
                    <h2>Scalability Strategy</h2>
                    <p>
                      Choose how your system should handle increasing numbers of
                      users and requests.
                    </p>
                  </div>
                </div>

                <div className="requirements-scalability-card">
                  <div className="requirements-scalability-top">
                    <span className="requirements-scalability-icon">↗</span>

                    <div>
                      <span className="requirements-small-label">
                        RECOMMENDED FOR YOUR PROJECT
                      </span>
                      <h3>{scalabilityRecommendation.recommended}</h3>
                    </div>
                  </div>

                  <p>{scalabilityRecommendation.explanation}</p>

                  <div className="requirements-scalability-field requirements-redesign-field">
                    <label htmlFor="scalability">
                      Your scalability strategy
                    </label>

                    <select
                      id="scalability"
                      name="scalability"
                      value={requirements.scalability}
                      onChange={handleChange}
                    >
                      {!scalabilityOptions.includes(
                        requirements.scalability,
                      ) && (
                        <option value={requirements.scalability}>
                          {requirements.scalability}
                        </option>
                      )}

                      {[
                        scalabilityRecommendation.recommended,
                        ...scalabilityOptions.filter(
                          (option) =>
                            option !== scalabilityRecommendation.recommended,
                        ),
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                          {option === scalabilityRecommendation.recommended
                            ? " (Recommended)"
                            : ""}
                        </option>
                      ))}
                    </select>

                    <small>
                      This recommendation is based on the target scale selected
                      when you created the project. You can override it at any
                      time.
                    </small>
                  </div>
                </div>
              </section>

              {/* Security and additional requirements */}
              <section className="requirements-redesign-section">
                <div className="requirements-redesign-heading">
                  <span className="requirements-redesign-number">04</span>

                  <div>
                    <h2>Security and Additional Constraints</h2>
                    <p>
                      Describe security expectations and any other important
                      system limitations.
                    </p>
                  </div>
                </div>

                <div className="requirements-redesign-field">
                  <label htmlFor="security">Security Expectations</label>

                  <textarea
                    id="security"
                    name="security"
                    rows={4}
                    value={requirements.security}
                    onChange={handleChange}
                    placeholder="For example: user authentication, role-based access, encrypted communication..."
                  />

                  <small>
                    Describe the security measures your system needs.
                  </small>
                </div>

                <div className="requirements-redesign-field">
                  <label htmlFor="other">Other Constraints</label>

                  <textarea
                    id="other"
                    name="other"
                    rows={4}
                    value={requirements.other}
                    onChange={handleChange}
                    placeholder="Add any technical, business, budget or regulatory constraints..."
                  />

                  <small>
                    Include any additional requirements that may influence your
                    architecture.
                  </small>
                </div>
              </section>

              {/* Save and continue */}
              <div className="requirements-redesign-actions">
                <div>
                  {saved ? (
                    <p className="requirements-success" role="status">
                      ✓ Requirements saved successfully.
                    </p>
                  ) : error ? (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  ) : (
                    <p className="requirements-save-hint">
                      Remember to save your changes before continuing.
                    </p>
                  )}
                </div>

                <div className="requirements-redesign-buttons">
                  <button type="submit" className="requirements-save-btn">
                    Save Requirements →
                  </button>

                  <Link
                    to={`/projects/${projectId}/architecture`}
                    className="requirements-architecture-btn"
                  >
                    Architecture Workspace →
                  </Link>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default RequirementsPage;
