import { ShieldAlert, Gauge, TrendingUp, Activity, AlertTriangle, CheckCircle } from "lucide-react";

function FindingCard({ finding }) {

    const severityColors = {
        Critical: "critical",
        High: "high",
        Medium: "medium",
        Low: "low",
    };

    const categoryIcons = {
        Security: ShieldAlert,
        Performance: Gauge,
        Scalability: TrendingUp,
        Reliability: Activity,

    };

    const CategoryIcon = 
    categoryIcons[finding.category] || AlertTriangle;

    return (
        <div className="finding-card">

            <div className="finding-header">

                <div className="finding-title">
                    <CategoryIcon size={22} />
                    
                    <h3>{finding.title}</h3>

                </div>

                <span className={`severity-badge ${severityColors[finding.severity] || "medium"}`}>

                    {finding.severity}

                </span>

            </div>

            <div className="finding-category">
                {finding.category}

            </div>
            <p className="affected-component">
                <strong>Affected component:</strong>{" "}
                {finding.affectedComponents?.join(", ") || "Not specified"}

            </p>

            <div className="finding-section">
                <h4>Explanation</h4>
                <p>{finding.explanation}</p>

            </div>

            <div className="finding-recommendation">
                <CheckCircle size={19} />

                <div>
                    <h4>Recommended Solution</h4>
                    <p>{finding.recommendation}</p>
                </div>

            </div>

        </div>
    );

}

export default FindingCard;