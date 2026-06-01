import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "../config/routes.config";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: React.ReactElement;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { token, isBootstrapping, bootstrap } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
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

  if (token) {
    // Already logged in, send them back to where they came from or dashboard
    const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
