"use client";

import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Client-side authentication guard
 * Redirects to login if user data is not available after loading
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading, error } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        // Only check after initial loading is complete
        if (!isLoading) {
            // Check if we have tokens in localStorage
            const hasAccessToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
            const hasRefreshToken = typeof window !== 'undefined' && localStorage.getItem('refreshToken');

            // If no user data and no tokens, redirect to login
            if (!user && !hasAccessToken && !hasRefreshToken) {
                console.log('AuthGuard: No user data or tokens found, redirecting to login');
                router.replace('/');
                return;
            }

            // If there's an error fetching user data, check if it's an auth error
            if (error) {
                console.error('AuthGuard: Error fetching user:', error);
                // Clear invalid tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                router.replace('/');
            }
        }
    }, [user, isLoading, error, router]);

    // Show loading state or children
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
