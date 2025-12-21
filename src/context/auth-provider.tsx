"use client";

import useAuth from "@/hooks/use-auth";
import React, { createContext, useContext, useMemo } from "react";

type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  name: string; // Computed field
  email: string;
  emailVerified: boolean;
  isEmailVerified: boolean; // Normalized field
  is2FAEnabled: boolean;
  role: string;
  requirePasswordChange: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  passwordHistory: any[];
};

type AuthContextType = {
  user?: UserType;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();
  console.log("Auth data:", data);

  // Transform user data to match our interface
  const user = useMemo(() => {
    const rawUser = data?.data?.data?.user || data?.data?.data;

    if (!rawUser) return undefined;

    // Transform the data to include computed fields
    return {
      ...rawUser,
      name: `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim(),
      isEmailVerified: rawUser.emailVerified ?? false,
    } as UserType;
  }, [data]);

  console.log("Extracted and transformed user:", user);

  return (
    <AuthContext.Provider
      value={{ user, error, isLoading, isFetching, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const conext = useContext(AuthContext);
  if (!conext) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return conext;
};
