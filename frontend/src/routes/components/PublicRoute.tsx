import { Navigate, Outlet } from "react-router";

type Props = {
  isAuthenticated: boolean;
};

export const PublicRoute = ({ isAuthenticated }: Props) =>
  isAuthenticated ? <Navigate to="/products/create" replace /> : <Outlet />;
