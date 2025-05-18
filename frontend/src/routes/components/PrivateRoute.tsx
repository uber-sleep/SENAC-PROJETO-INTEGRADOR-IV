import { useAuth } from "@contexts/Auth";
import { Navigate, Outlet } from "react-router";

export const PrivateRoute = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/sign-in" replace />;
};
