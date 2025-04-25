import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get the cookie manually from the headers
    const token = req.cookies.get("auth-token")?.value;

    console.log("middleware running!");

    // If token exists and user is trying to access login or signup, redirect to dashboard
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // If no token and accessing protected routes (anything other than login/signup), redirect to login
    if (!token && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
