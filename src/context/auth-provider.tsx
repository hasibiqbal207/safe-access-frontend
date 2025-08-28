"use client";

import useAuth from "@/hooks/use-auth";
import React, { createContext, useContext } from "react";

type UserType = {
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  is2FAEnabled: boolean;
};

type AuthContextType = {
  user?: UserType;
  error: any;
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
  
  // The profile API returns user data in data.data.user or directly in data.data
  const user = data?.data?.data?.user || data?.data?.data;
  console.log("Extracted user:", user);
  
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
