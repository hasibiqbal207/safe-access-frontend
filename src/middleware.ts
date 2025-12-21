import { NextRequest, NextResponse } from "next/server";

// Define protected routes (require authentication)
const protectedRoutes = ["/home", "/sessions", "/mfa", "/account"];

// Define public routes (accessible without authentication)
const publicRoutes = [
  "/",
  "/signup",
  "/confirm-account",
  "/forgot-password",
  "/reset-password",
  "/verify-mfa",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("Middleware running for path:", path);

  const isProtectedRoute = protectedRoutes.some(route =>
    path === route || path.startsWith(`${route}/`)
  );

  const isPublicRoute = publicRoutes.some(route =>
    path === route || path.startsWith(`${route}/`)
  );

  const accessToken = req.cookies.get("accessToken")?.value

  if (isProtectedRoute && !accessToken) {
    console.log("Redirecting to login: Protected route without token");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    console.log("Redirecting to home: Public route with token");
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
}
