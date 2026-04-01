import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AppUser } from "./api";

type AuthContextValue = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "updownx-user";

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [user, setUserState] = useState<AppUser | null>(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  });

  const setUser = (nextUser: AppUser | null) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(storageKey, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout: () => setUser(null),
    }),
    [user],
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
