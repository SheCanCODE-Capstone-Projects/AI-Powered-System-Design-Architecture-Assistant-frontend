import { useState } from "react";

function ReviewFilters({ onFilterChange }) {

    const [severity, setSeverity] = useState("All");
    const [category, setCategory] = useState("All");

    const handleSeverityChange = (value) => {
        setSeverity(value);

        onFilterChange({
            severity: value,
            category: category
        });
    };

    const handleCategoryChange = (value) => {
        setCategory(value);

        onFilterChange({
            severity: severity,
            category: value
        });
    };

    return (
        <div className="review-filters">

            <div className="filter-group">
                <label htmlFor="severity-filter">
                    Filter by Severity
                </label>

                <select 
                id="severity-filter"
                value={severity}
                onChange={(e) => handleSeverityChange(e.target.value)}
                
                >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="category-filter">
                    Filter by Category
                </label>

                <select
                id="category-filter"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Security">Security</option>
                    <option value="Performance">Performance</option>
                    <option value="Scalability">Scalability</option>
                    <option value="Reliability">Reliability</option>

                </select>

            </div>

        </div>
    );
}

export default ReviewFilters;