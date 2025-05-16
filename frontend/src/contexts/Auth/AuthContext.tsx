import { createContext, useEffect } from "react";
import { useState, type ReactNode } from "react";
import { toast } from "react-toastify";

import type {
  AuthContextType,
  AuthData,
  SignInData,
} from "@contexts/Auth/types";
import type { User } from "@models";

import { authTokenStorage } from "@storage/authToken";
import { userStorage } from "@storage/user";

/* import { signInRequest } from "@contexts/Auth/services"; */
import { setAuthHeader } from "@services/api";

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
      /* const { data } = await signInRequest(signInData); */
      const responseData = {
        user: {
          id: "1",
          name: "Teste",
          email: signInData.email,
        },
        token: "token123123123",
      };
      const { user: responseUser, token: responseToken } = responseData;

      setAuthenticatedUser({ user: responseUser, token: responseToken });

      userStorage.setUser(responseUser);
      authTokenStorage.setToken(responseToken);

      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar o login.");
      console.error("Error when logging in: ", error);
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
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
