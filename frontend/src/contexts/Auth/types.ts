import type { User } from "../../models/User";

export type AuthData = {
  user?: User;
  token?: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  name: string;
  cpf_cnpj: string;
  certificate_id?: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  role: "producer" | "consumer";
};

export type AuthContextType = {
  user?: User;
  signUp: (signUpData: SignUpData) => Promise<void>;
  signIn: (signInData: SignInData) => Promise<void>;
  signOut: VoidFunction;
};
