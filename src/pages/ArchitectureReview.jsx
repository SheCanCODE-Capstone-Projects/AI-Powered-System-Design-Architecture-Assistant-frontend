
import { useState } from "react";

import ReviewSummary from "../components/review/ReviewSummary";
import ReviewFilters from "../components/review/ReviewFilters";
import FindingsList from "../components/review/FindingsList";
import ReviewHistory from "../components/review/ReviewHistory";

import "../components/review/review.css";

// Temporary sample report while the backend is pending
const demoReport = {
  healthScore: 76,

  findings: [
    {
      id: 1,
      title: "Unprotected API endpoints",
      severity: "Critical",
      category: "Security",
      affectedComponents: ["API Gateway", "User Service"],
      explanation:
        "Some API endpoints may be accessible without proper authentication. This could expose sensitive user information.",
      recommendation:
        "Implement authentication and authorization checks for all sensitive endpoints."
    },
    {
      id: 2,
      title: "Database query optimization",
      severity: "High",
      category: "Performance",
      affectedComponents: ["Database", "User Service"],
      explanation:
        "Frequent database queries may cause delays when multiple users access the system.",
      recommendation:
        "Optimize database queries and consider caching frequently accessed data."
    },
    {
      id: 3,
      title: "Limited horizontal scaling",
      severity: "Medium",
      category: "Scalability",
      affectedComponents: ["Application Server"],
      explanation:
        "The application server may struggle to handle increased traffic as the number of users grows.",
      recommendation:
        "Consider deploying multiple application instances behind a load balancer."
    },
    {
      id: 4,
      title: "Single point of failure",
      severity: "High",
      category: "Reliability",
      affectedComponents: ["Primary Database"],
      explanation:
        "The system depends on a single database instance. If it becomes unavailable, the application may stop working.",
      recommendation:
        "Consider database replication and a recovery strategy to improve availability."
    },
    {
      id: 5,
      title: "Missing rate limiting",
      severity: "Medium",
      category: "Security",
      affectedComponents: ["API Gateway"],
      explanation:
        "The API may be vulnerable to excessive requests, which could affect availability and security.",
      recommendation:
        "Introduce rate limiting to restrict the number of requests clients can make."
    },
    {
      id: 6,
      title: "No caching strategy",
      severity: "Low",
      category: "Performance",
      affectedComponents: ["Application Server"],
      explanation:
        "Repeated requests for the same information may increase unnecessary processing.",
      recommendation:
        "Consider caching appropriate data to reduce repeated processing."
    }
  ]
};

// Temporary sample review history
const demoHistory = [
  {
    id: 1,
    projectName: "ArchPilot Demo",
    date: "November 20, 2026",
    summary: "Previous sample architecture assessment.",
    healthScore: 82,
    report: {
      healthScore: 82,
      findings: demoReport.findings.slice(0, 3)
    }
  }
];

function ArchitectureReview() {
  const [filters, setFilters] = useState({
    severity: "All",
    category: "All"
  });

  const [report, setReport] = useState(demoReport);

  const filteredFindings = report.findings.filter((finding) => {
    const matchesSeverity =
      filters.severity === "All" ||
      finding.severity === filters.severity;

    const matchesCategory =
      filters.category === "All" ||
      finding.category === filters.category;

    return matchesSeverity && matchesCategory;
  });

  function handleViewReport(review) {
    if (review.report) {
      setReport(review.report);

      setFilters({
        severity: "All",
        category: "All"
      });
    }
  }

  return (
    <main className="architecture-review">

      {/* Page Header */}
      <header className="review-page-header">
        <div>
          <h1>Architecture Review</h1>

          <p>
            Review your system architecture and identify
            potential design risks and improvements.
          </p>
        </div>
      </header>

      {/* Temporary Demo Notice */}
      <div className="demo-notice">
        <strong>Demo Mode:</strong> This report uses sample data for interface testing. AI analysis and real
        review history will be connected to the backend later.
      </div>

      {/* Report Summary */}
      <ReviewSummary report={report} />

      {/* Findings and Filters */}
      <section className="review-content">

        <ReviewFilters onFilterChange={setFilters} />

        <FindingsList findings={filteredFindings} />

      </section>

      {/* Review History */}
      <ReviewHistory
        history={demoHistory}
        onViewReport={handleViewReport}
      />

    </main>
  );
}

export default ArchitectureReview;