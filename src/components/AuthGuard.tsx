import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { isAuthenticated } from "@/utils/auth";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    // If authentication is required but user is not authenticated, redirect to login
    if (requireAuth && !authenticated) {
      navigate({
        to: "/login",
        search: {
          returnTo: location.pathname,
        },
      });
    }

    // If user is authenticated but on a public-only route (like login/signup), redirect to home
    if (!requireAuth && authenticated && (location.pathname === "/login" || location.pathname === "/signup")) {
      navigate({ to: "/" });
    }
  }, [requireAuth, authenticated, navigate, location.pathname]);

  // If requireAuth is true and user is not authenticated, don't render children
  if (requireAuth && !authenticated) {
    return null;
  }

  // If requireAuth is false (public route) and user is authenticated, don't render login/signup pages
  if (!requireAuth && authenticated && (location.pathname === "/login" || location.pathname === "/signup")) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;