import type { User } from "../../models/User";

export type SignInData = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user?: User;
  signIn: (signInData: SignInData) => void;
  signOut: VoidFunction;
};