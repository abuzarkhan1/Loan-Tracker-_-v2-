import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "../config/routes.config";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isBootstrapping, bootstrap } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // If not bootstrapped, trigger bootstrap
    if (isBootstrapping) {
      void bootstrap();
    }
  }, [isBootstrapping, bootstrap]);

  if (isBootstrapping) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-appBg text-appPrimary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-sm font-medium text-appMuted">Loading Loan Tracker...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    // Redirect to login but keep state to return to
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
