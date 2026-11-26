import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, Activity } from "lucide-react";


function ReviewSummary({ report }) {
    const findings = report?.findings || [];

    const totalFindings = findings.length;

    const countBySeverity = (severity) =>
        findings.filter(
            (finding) => finding.severity === severity
        ).length;

        const summaryCards = [
            {
                title: "Total Findings",
                value: totalFindings,
                icon: Activity,
                color: "blue"
            },
            {
                title: "Critical",
                value: countBySeverity("Critical"),
                icon: ShieldAlert,
                color: "red"
            },
            {
                title: "High",
                value: countBySeverity("High"),
                icon: AlertTriangle,
                color: "orange"
            },
            {
                title: "Medium",
                value: countBySeverity("Medium"),
                icon: AlertCircle,
                color: "yellow"
            },
            {
                title: "Low",
                value: countBySeverity("Low"),
                icon: CheckCircle,
                color: "green"
            }
        ];

        return (
            <section className="review-summary">
                <div className="summary-header">
                    <div>
                        <h2>Architecture Overview</h2>
                        <p>Summary of identified architecture findings.</p>
                    </div>

                    <div className="health-score-card">
                        <span>Health Score</span>
                        <h3>{report?.healthScore ?? "--"}/100</h3>

                    </div>

                </div>

                <div className="summary-grid">
                    {summaryCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div className={`summary-card ${card.color}`}
                            key={card.title}>

                                <div className="summary-card-icon">
                                    <Icon size={22} />

                                </div>

                                <div>
                                    <p>{card.title}</p>
                                    <h3>{card.value}</h3>
                                </div>

                            </div>
                        );
                    })}

                </div>

            </section>
        );
}

export default ReviewSummary;

