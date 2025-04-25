'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/utils';
import { validateEmail, validatePassword } from '@/utils/validation';
import { signupSchema } from '@/schemas/authSchemas';

export async function loginAction(formData: { email: string; password: string }) {
    const { email, password } = formData;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    if (!validateEmail(email)) {
        return { error: 'Invalid email format' };
    }

    if (!validatePassword(password)) {
        return { error: 'Password is too weak' };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return { error: 'Invalid credentials' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { error: 'Invalid credentials' };
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                tokenVersion: user.tokenVersion,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        (await cookies()).set('auth-token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Optionally redirect to a dashboard or return success
        return { success: true };
    } catch (error) {
        console.error('[LOGIN_ERROR]', error);
        return { error: 'Internal server error' };
    }
}

export async function signupAction(formData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}) {
    const { email, password, confirmPassword, firstName, lastName } = formData;

    // Validate the data using the schema
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
        return { error: validation.error.errors[0].message };
    }

    // Additional custom checks (if needed)
    if (!validateEmail(email)) {
        return { error: 'Invalid email format' };
    }

    if (!validatePassword(password)) {
        return { error: 'Password is too weak' };
    }

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: 'User with this email already exists' };
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: "ADMIN"
            },
        });

        // Create a JWT token for the user
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                tokenVersion: user.tokenVersion,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        // Set the token in the cookies
        (await cookies()).set('auth-token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Optionally redirect to a dashboard or return success
        return { success: true };
    } catch (error) {
        console.error('[SIGNUP_ERROR]', error);
        return { error: 'Internal server error' };
    }
}
