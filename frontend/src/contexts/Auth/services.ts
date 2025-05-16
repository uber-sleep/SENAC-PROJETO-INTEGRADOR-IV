import { api } from "@services/api";
import type { SignInData } from "./types";
import type { User } from "@models";

export const signInRequest = async (data: SignInData): Promise<User> =>
  api.post("/login", data);

export const signUpRequest = async (): Promise<User> => api.post("/signUp", {});
