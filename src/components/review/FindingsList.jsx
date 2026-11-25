import FindingCard from "./FindingCard";

function FindingsList({ findings = [] }) {
    if (findings.length === 0) {
        return (
            <div className="empty-findings">
                <h3>No Architecture Findings</h3>
                <p>
                    No findings are available for the selected filters.
                </p>
            </div>
        );
    }

    return (
        <section className="finding-list-section">

            <div className="findings-heading">
                <div>
                <h2>Architecture Findings</h2>
                <p>
                    Detailed risks and recommended improvements
                </p>
            </div>

            <span className="findings-count">
                {findings.length} Findings
            </span>
            </div>

            <div className="findings-List">
                {findings.map((finding) => (
                    <FindingCard key={finding.id} finding={finding} />
                ))}

            </div>

        </section>
    );
}

export default FindingsList;