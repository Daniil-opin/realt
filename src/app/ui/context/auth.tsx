"use client";

import { getUserData, UserReadExtended } from "@/app/seed/route";
import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserReadExtended | null;
  isAdmin: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserReadExtended | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const router = useRouter();

  const login = async (token: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem("token", token);
      const data: UserReadExtended = await getUserData(token);
      setIsAuthenticated(true);
      setUser(data);
      setIsAdmin(data.role.id === 1);
      if (data.role.id === 1) {
        router.push("/admin/estates");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data: UserReadExtended = await getUserData(token);
          setIsAuthenticated(true);
          setUser(data);
          setIsAdmin(data.role.id === 1);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
          localStorage.removeItem("token");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
