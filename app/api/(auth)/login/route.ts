// app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "nookies"; // May not work directly here (see note below)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword } from "@/utils/validation";
import prisma from "@/lib/utils";

// Named export for the POST HTTP method
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (!validatePassword(password)) {
        return NextResponse.json({ message: "Password is too weak" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                tokenVersion: user.tokenVersion // <-- include it
            },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );


        const response = NextResponse.json({ message: "Login successful" });

        // Set cookie (manually using response headers)
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
