
import { Bell, UserCircle, Menu } from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="workspace-navbar">

      <div className="navbar-left">
        <button
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2>Welcome to ArchPilot</h2>
          <p>System Design & Architecture Workspace</p>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={21} />
        </button>

        <div className="navbar-user">
          <UserCircle size={30} />
          <span>My Account</span>
        </div>
      </div>

    </header>
  );
}

export default Navbar;
