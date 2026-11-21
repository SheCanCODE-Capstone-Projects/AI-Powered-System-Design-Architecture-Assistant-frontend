import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import RequirementsPage from "./pages/RequirementsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/projects/:projectId/requirements"
          element={<RequirementsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
