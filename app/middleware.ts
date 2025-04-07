// /middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "nookies";

// Middleware for protected routes
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const cookies = parseCookies({ req });

    // Skip middleware for non-protected routes (e.g., public pages, login)
    if (pathname.startsWith("/api/login") || pathname.startsWith("/login")) {
        return NextResponse.next();
    }

    // Check if the token exists in the cookies
    const token = cookies["auth-token"];
    if (!token) {
        // Redirect to login page if no token is found
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token exists, proceed to the requested route
    return NextResponse.next();
}

// Apply middleware globally or for specific paths
export const config = {
    matcher: ['/dashboard', '/profile', '/orders'], // Add your protected route paths here
};
