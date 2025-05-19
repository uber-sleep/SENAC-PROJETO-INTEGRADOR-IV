import { api } from "@services/api";

import type { User } from "@models";

import type { SignInData, SignUpData } from "./types";
import type { AxiosResponse } from "axios";

const authUrl = "/auth";
const signUpUrl = `${authUrl}/sign-up`;
const signInUrl = `${authUrl}/sign-in`;

export const signUpRequest = async (data: SignUpData): Promise<AxiosResponse<User>> =>
  api.post(signUpUrl, data);

export const signInRequest = async (
  data: SignInData
): Promise<AxiosResponse<{ token: string; user: User }>> =>
  api.post(signInUrl, data);
