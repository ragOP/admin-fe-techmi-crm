import { autoLogout, getToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log(isAuthenticated);
  useEffect(() => {
    autoLogout(() => {
      setIsAuthenticated(false);
      toast.error("Session expired! Logging out...");
    });

    setIsAuthenticated(!!getToken());
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
