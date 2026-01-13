import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type PhoneUser = {
  id: string;
  phone: string;
  displayName?: string | null;
};

type UserContextType = {
  user: PhoneUser | null;
  token: string | null;
  login: (u: PhoneUser, t: string) => void;
  logout: () => void;
};

const Ctx = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PhoneUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('phone_auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      } catch {}
    }
  }, []);

  const login = (u: PhoneUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('phone_auth', JSON.stringify({ user: u, token: t }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('phone_auth');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useUser = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
