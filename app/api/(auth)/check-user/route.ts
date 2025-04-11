// app/api/check-user/route.ts

import { NextResponse } from "next/server";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    // Get cookies from the request
    const cookies = parseCookies({ req });
    const token = cookies["auth-token"];

    // If no token exists, return unauthorized response
    if (!token) {
        return NextResponse.json(
            { isAuthenticated: false },
            { status: 401 } // Unauthorized
        );
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // If token is valid, return success
        return NextResponse.json(
            { isAuthenticated: true, user: decoded },
            { status: 200 }
        );
    } catch (error) {
        // If token is invalid or expired, return unauthorized response
        return NextResponse.json(
            { isAuthenticated: false },
            { status: 401 } // Unauthorized
        );
    }
}