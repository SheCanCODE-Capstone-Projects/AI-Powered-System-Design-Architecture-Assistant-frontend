
import {
  LayoutDashboard,
  FolderKanban,
  Workflow,
  ShieldCheck,
  Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ onNavigate }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban
    },
    {
      name: "Architecture Designer",
      path: "/workspace",
      icon: Workflow
    },
    {
      name: "Architecture Review",
      path: "/architecture-review",
      icon: ShieldCheck
    }
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">A</div>
        <h2>ArchPilot</h2>
      </div>

      <div className="sidebar-menu">
        <p className="sidebar-label">MAIN MENU</p>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                to={item.path}
                key={item.name}
                onClick={onNavigate}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className="sidebar-link"
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;
