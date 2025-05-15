import { Navigate, Route, Routes } from "react-router";

import { PrivateRoute } from "./components/PrivateRoute";
import { DefaultLayout } from "./layouts/Default";
import { CreateProduct } from "../pages/Product/Create";
import { PublicRoute } from "./components/PublicRoute";
import { SignIn, SignUp } from "../pages/Auth";
import { useAuth } from "@contexts/Auth";

export const Router = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Routes>
      {isAuthenticated ? (
        <Route element={<PrivateRoute />}>
          <Route element={<DefaultLayout />}>
            <Route path={"products/create"} element={<CreateProduct />} />
          </Route>
        </Route>
      ) : (
        <Route element={<PublicRoute />}>
          <Route path={"sign-in"} element={<SignIn />} />
          <Route path={"sign-up"} element={<SignUp />} />
        </Route>
      )}

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/products/create" : "/sign-in"}
            replace
          />
        }
      />
    </Routes>
  );
};
