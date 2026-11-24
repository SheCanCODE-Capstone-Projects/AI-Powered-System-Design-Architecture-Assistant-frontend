import { Link } from "react-router-dom";

function WorkspaceHeader({
  projectName,
  projectId,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
}) {
  return (
    <header className="workspace-header">
      <div className="workspace-header-left">
        <Link to="/dashboard" className="workspace-back-link">
          ← Dashboard
        </Link>

        <div className="workspace-title">
          <span className="workspace-eyebrow">SYSTEM DESIGN WORKSPACE</span>

          <h1>{projectName || "Untitled Project"}</h1>

          <p>Design and manage your system architecture</p>
        </div>
      </div>

      <div className="workspace-header-right">
        <span className="workspace-save-status">
          {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
        </span>

        <button
          type="button"
          className="workspace-save-button"
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? "Saving..." : "Save Architecture"}
        </button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
