import type { User } from "@models";
import { STORAGE_KEYS } from "./keys";

export const userStorage = {
  getUser: (): User | null => {
    const storageUserData = localStorage.getItem(STORAGE_KEYS.USER);
    return storageUserData ? JSON.parse(storageUserData) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};
