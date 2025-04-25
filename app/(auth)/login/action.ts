'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/utils';
import { validateEmail, validatePassword } from '@/utils/validation';

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
