import { Outlet } from "react-router";
import { Header } from "./components/Header";

export const DefaultLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);
