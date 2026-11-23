
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WorkspaceLayout from "./components/workspace/WorkspaceLayout";
import ArchitectureReview from "./pages/ArchitectureReview";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your ArchPilot workspace.</p>
    </div>
  );
}

function Projects() {
  return <h1>Projects</h1>;
}

function ArchitectureDesigner() {
  return <h1>Architecture Designer</h1>;
}

function Settings() {
  return <h1>Settings</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <WorkspaceLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/workspace" element={<ArchitectureDesigner />} />
          <Route path="/architecture-review" element={<ArchitectureReview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </WorkspaceLayout>
    </BrowserRouter>
  );
}

export default App;
