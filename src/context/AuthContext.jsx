import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  getCurrentUser,
  refreshAccessToken,
  logout as logoutService,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function clearSession() {
    setUser(null);
    setAccessToken(null);
    delete api.defaults.headers.common.Authorization;
  }

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const tokenData = await refreshAccessToken();
        if (!tokenData?.accessToken) throw new Error("No access token");

        api.defaults.headers.common.Authorization = `Bearer ${tokenData.accessToken}`;

        const currentUser = await getCurrentUser();

        if (isMounted) {
          setAccessToken(tokenData.accessToken);
          setUser(currentUser);
        }
      } catch {
        delete api.defaults.headers.common.Authorization;
        if (isMounted) clearSession();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    const handleSessionExpired = () => clearSession();

    window.addEventListener("auth:session-expired", handleSessionExpired);
    initializeAuth();

    return () => {
      isMounted = false;
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  async function handleLogout() {
    try {
      await logoutService();
    } finally {
      clearSession();
    }
  }

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isLoading,
    setUser,
    setAccessToken,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
