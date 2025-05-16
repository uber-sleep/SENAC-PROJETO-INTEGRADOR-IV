import { BrowserRouter } from "react-router";
import { Slide, ToastContainer } from "react-toastify";

import { AuthContextProvider } from "@contexts/Auth/AuthContext";
import { Router } from "@routes";

export const App = () => (
  <>
    <BrowserRouter>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
    </BrowserRouter>

    <ToastContainer
      autoClose={3000}
      hideProgressBar
      closeOnClick
      draggable
      transition={Slide}
    />
  </>
);
