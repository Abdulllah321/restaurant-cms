// /pages/api/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies"; // For setting cookies
import bcrypt from "bcryptjs"; // Assuming password encryption, adapt based on your DB
import { PrismaClient } from "@prisma/client"; // Assuming Prisma as your ORM

const prisma = new PrismaClient();

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            // Check user credentials in the database
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Compare the provided password with the hashed password in DB
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Set up session cookie (for example, a JWT token)
            const token = "generated-jwt-token"; // Generate JWT or use session token
            setCookie({ res }, "auth-token", token, {
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
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
