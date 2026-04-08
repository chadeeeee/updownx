import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AppUser } from "./api";

type AuthContextValue = {
  user: AppUser | null;
  token: string | null;
  setUser: (user: AppUser | null, token?: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "updownx-user";
const tokenStorageKey = "updownx-token";

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(tokenStorageKey));
  const [user, setUserState] = useState<AppUser | null>(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  });

  const setUser = (nextUser: AppUser | null, nextToken?: string | null) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(storageKey, JSON.stringify(nextUser));
      if (nextToken !== undefined) {
        setTokenState(nextToken);
        if (nextToken) {
          localStorage.setItem(tokenStorageKey, nextToken);
        } else {
          localStorage.removeItem(tokenStorageKey);
        }
      }
    } else {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(tokenStorageKey);
      setTokenState(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      setUser,
      logout: () => setUser(null),
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};
