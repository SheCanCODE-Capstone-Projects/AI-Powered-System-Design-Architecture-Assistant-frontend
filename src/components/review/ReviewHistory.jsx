import { Clock3, Eye } from "lucide-react";

function ReviewHistory({ history = [], onViewReport }) {
    if (history.length === 0) {
        return (
            <section className="review-history">
                <div className="history-header">
                    <h2>Review History</h2>
                    <p>Previous architecture assessments</p>
                </div>

                <div className="history-empty">
                    <Clock3 size={32} />
                    <p>No previous architecture reviews available.</p>

                </div>

            </section>
        );
    }

    return (
        <section className="review-history">
            <div className="history-header">
                <div>
                <h2>Review History</h2>
                <p>Previous architecture assessments</p>

            </div>


            <span className="history-count">
                {history.length} {history.length === 1 ? "Report" : "Reports"}
            </span>
            </div>

            <div className="history-list">
                {history.map((review) => (
                    <article className="history-item"
                    key={review.id}
                    >
                        <div className="history-info">
                            <h3>{review.projectName || "Architecture Review"}</h3>

                            <p className="history-date">
                                {review.date}
                            </p>

                            <p className="history-description">
                                {review.summary}
                            </p>
                        </div>

                        <div className="history-score">
                            <span>Score</span>
                            <strong>{review.healthScore}/100</strong>
                        </div>

                        <button
                        className="history-view-button"
                        onClick={() => onViewReport?.(review)}
                        disabled={!onViewReport}
                        title="View this report"
                        >
                            <Eye size={18} />
                            View
                        </button>
                    </article>
                ))}

            </div>

        </section>
    );
}

export default ReviewHistory;