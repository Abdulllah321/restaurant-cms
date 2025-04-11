// app/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "nookies";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const cookies = parseCookies({ req });
    const token = cookies["auth-token"];
    console.log("middleware !!")
    // If token exists and user is trying to access login or signup, redirect to dashboard
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
        return NextResponse.redirect(new URL("/", req.url)); // or your desired protected route
    }

    // If no token and accessing protected routes (anything other than login/signup), redirect to login
    if (!token && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/(.*)",  // Applies middleware to all routes
};
