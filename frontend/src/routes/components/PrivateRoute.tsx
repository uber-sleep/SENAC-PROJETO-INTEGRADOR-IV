import { Navigate, Outlet } from "react-router";

type Props = {
  isAuthenticated: boolean;
};

export const PrivateRoute = ({ isAuthenticated }: Props) =>
  isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
