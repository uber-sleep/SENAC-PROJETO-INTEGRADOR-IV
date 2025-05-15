import { useAuth } from "@contexts/Auth";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return <Navigate to="/products/create" replace />;
  }

  return <Outlet />;
};
