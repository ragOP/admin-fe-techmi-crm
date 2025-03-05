import { autoLogout, isTokenValid, removeToken } from "@/utils/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (isTokenValid()) {
        setIsAuthenticated(true);
        autoLogout(() => {
          setIsAuthenticated(false);
          toast.error("Session expired! Logging out...");
        });
      } else {
        setIsAuthenticated(false);
        removeToken();
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
