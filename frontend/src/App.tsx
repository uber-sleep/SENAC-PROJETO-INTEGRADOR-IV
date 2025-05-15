import { AuthContextProvider } from "@contexts/Auth/AuthContext";
import { Router } from "@routes";
import { BrowserRouter } from "react-router";

export const App = () => (
  <BrowserRouter>
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  </BrowserRouter>
);
