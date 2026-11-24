import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import EntryPage from "./pages/EntryPage";
import DashboardPage from "./pages/DashboardPage";
import RequirementsPage from "./pages/RequirementsPage";
import ArchitecturePage from "./pages/ArchitecturePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/projects/:projectId/requirements"
          element={<RequirementsPage />}
        />

        <Route
          path="/projects/:projectId/architecture"
          element={<ArchitecturePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
