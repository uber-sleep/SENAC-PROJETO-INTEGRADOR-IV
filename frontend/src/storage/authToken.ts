import { STORAGE_KEYS } from "./keys";

export const authTokenStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};
