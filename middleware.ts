import { NextRequest, NextResponse } from "next/server";
import { getBranchCount } from "./actions/branch.action";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("auth-token")?.value;

    // Redirect logged-in users away from login or signup
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect unauthenticated users to login
    if (!token && !pathname.startsWith("/login") && !pathname.startsWith("/signup") && !pathname.startsWith("/branch/create")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check branch count if not on login, signup, or branches page
    if (!pathname.startsWith("/login") && !pathname.startsWith("/signup") && !pathname.startsWith("/branch/create")) {
        const branchCount = await getBranchCount();
        if (branchCount.success && branchCount.count === 0) {
            return NextResponse.redirect(new URL("/branch/create", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
