import { createContext } from "react";
import { useState, type ReactNode } from "react";

import type { User } from "@models";
import type { AuthContextType, SignInData } from "./types";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();

  const signIn = ({ email }: SignInData) => {
    setUser({ id: "1", name: "Teste", email });
  };

  const signOut = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
