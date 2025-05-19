import { createContext, useEffect } from "react";
import { useState, type ReactNode } from "react";

import { toast } from "react-toastify";

import type {
  AuthContextType,
  AuthData,
  SignInData,
  SignUpData,
} from "@contexts/Auth/types";
import type { User } from "@models";

import { authTokenStorage } from "@storage/authToken";
import { userStorage } from "@storage/user";

/* import { signInRequest } from "@contexts/Auth/services"; */
import { setAuthHeader } from "@services/api";
import { signInRequest, signUpRequest } from "./services";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();

  const setAuthenticatedUser = ({ user, token }: AuthData) => {
    setUser(user);
    setAuthHeader(token);
  };

  const signIn = async (signInData: SignInData) => {
    try {
      const { data } = await signInRequest(signInData);
      const { user: responseUser, token: responseToken } = data;

      setAuthenticatedUser({ user: responseUser, token: responseToken });

      userStorage.setUser(responseUser);
      authTokenStorage.setToken(responseToken);
      //eslint-disable-next-line
    } catch (error) {
      toast.error("Erro ao realizar o login.");
    }
  };

  const signUp = async (signUpData: SignUpData) => {
    try {
      const { email, password } = signUpData;

      await signUpRequest(signUpData);

      await signIn({ email, password });
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = () => {
    setAuthenticatedUser({ user: undefined, token: undefined });

    userStorage.removeUser();
    authTokenStorage.removeToken();
  };

  const loadUser = () => {
    try {
      const storedUser = userStorage.getUser();
      const storedToken = authTokenStorage.getToken();

      if (storedUser && storedToken) {
        setAuthenticatedUser({ user: storedUser, token: storedToken });
      }
    } catch (error) {
      console.error("Error loading user from localStorage: ", error);
      signOut();
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
