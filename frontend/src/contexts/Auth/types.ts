import type { User } from "../../models/User";

export type AuthData = {
  user?: User;
  token?: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user?: User;
  signIn: (signInData: SignInData) => Promise<void>;
  signOut: VoidFunction;
};
