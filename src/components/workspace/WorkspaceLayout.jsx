
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./workspace.css";

function WorkspaceLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="workspace-layout">

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      )}

      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <Sidebar onNavigate={closeSidebar} />
      </div>

      <div className="workspace-main">
        <Navbar onMenuClick={toggleSidebar} />

        <main className="workspace-content">
          {children}
        </main>
      </div>

    </div>
  );
}

export default WorkspaceLayout;

