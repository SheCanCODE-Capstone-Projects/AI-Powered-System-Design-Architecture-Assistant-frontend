import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait until authentication has been checked
  if (isLoading) {
    return (
      <div className="auth-loading">
        <p>Checking your authentication...</p>
      </div>
    );
  }

  // Redirect unauthenticated users to the entry page
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Allow authenticated users to access protected pages
  return <Outlet />;
}

export default ProtectedRoute;
