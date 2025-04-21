"use client";

import { getUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getUserQueryFn,
    staleTime: Infinity,
  });
  return query;
};

export default useAuth;
