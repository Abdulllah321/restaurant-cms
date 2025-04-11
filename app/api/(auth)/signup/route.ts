import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Password hashing
import { validateEmail, validatePassword } from "@/utils/validation"; // Custom validation functions
import prisma from "@/lib/utils";

export async function POST(req: NextRequest) {
    const { email, password, firstName, lastName } = await req.json();

    // Validate email and password
    if (!email || !password || !firstName || !lastName) {
        return NextResponse.json(
            { message: "Email, password, first name, and last name are required" },
            { status: 400 }
        );
    }

    if (!validateEmail(email)) {
        return NextResponse.json(
            { message: "Invalid email format" },
            { status: 400 }
        );
    }

    if (!validatePassword(password)) {
        return NextResponse.json(
            { message: "Password is too weak" },
            { status: 400 }
        );
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds of hashing

        // Create new user with all required fields
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: "ADMIN"
            },
        });

        return NextResponse.json(
            { message: "User created successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
