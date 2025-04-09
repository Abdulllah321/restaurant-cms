// /pages/api/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies"; // For setting cookies
import bcrypt from "bcryptjs"; // Password encryption
import { PrismaClient } from "@prisma/client"; // ORM
import jwt from "jsonwebtoken"; // JWT token library
import { validateEmail, validatePassword } from "@/utils/validation"; // Custom validation functions

const prisma = new PrismaClient();

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: "Password is too weak" });
        }

        try {
            // Check user credentials in the database
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Compare the provided password with the hashed password in DB
            if (!user.password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }


            // Generate JWT token with expiration and user info (use your JWT secret from env variable)
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET!, // Use an environment variable for the JWT secret
                { expiresIn: '1d' } // Token expires in 1 day
            );

            // Set up session cookie (with httpOnly flag for security)
            setCookie({ res }, "auth-token", token, {
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
                httpOnly: true, // Prevents access to the cookie from JavaScript (helps mitigate XSS)
                secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
                sameSite: "Strict", // Restrict sending cookies cross-site
            });

            return res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
};

export default loginHandler;
